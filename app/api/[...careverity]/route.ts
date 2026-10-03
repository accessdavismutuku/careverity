import { NextResponse, type NextRequest } from "next/server";
import {
  createAuditEnvelope,
  findCareVerityApiDefinition,
  getProductionBackendReadiness,
  getRequestContext,
  roleHasPermission,
  validateTenantBoundary
} from "@/lib/careverity-backend-security";
import {
  CareVerityProductionBackendError,
  evaluateFixedWindowRateLimit,
  evaluateMfaRequirement,
  getBackupRestoreStatus,
  getClientNetworkContext,
  getVerifiedProductionRequestContext,
  isProductionBackendEnabled,
  isProductionDatabaseConfigured,
  recordTamperResistantAuditLog,
  runProductionPersistenceForApi
} from "@/lib/careverity-production-backend";
import { createBackendNotConfiguredError, getCareVerityRuntimeMode } from "@/lib/careverity-runtime-mode";

type CareVerityCatchAllContext = {
  params: Promise<{ careverity: string[] }>;
};

const unauthenticatedAllowedPaths = new Set(["/auth/login", "/auth/password-reset", "/auth/mfa/verify"]);

async function readJsonBody(request: NextRequest) {
  if (request.method === "GET" || request.method === "DELETE") return {};
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("multipart/form-data")) {
    return { fileUploadPlaceholder: true };
  }

  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function handleCareVerityApi(request: NextRequest) {
  const definition = findCareVerityApiDefinition(request.method, request.nextUrl.pathname);
  const readiness = getProductionBackendReadiness();
  const runtimeMode = getCareVerityRuntimeMode();
  const headerContext = getRequestContext(request);
  const body = await readJsonBody(request);
  const network = getClientNetworkContext(request);
  const maxRequests = Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120);
  const requestCount = Number(request.headers.get("x-careverity-rate-count") ?? 1);
  const rateLimit = evaluateFixedWindowRateLimit(requestCount, maxRequests);

  if (!definition) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "UNKNOWN_CAREVERITY_API_ROUTE",
        error: "Unknown CareVerity API route.",
        path: request.nextUrl.pathname,
        method: request.method,
        safeMessage: "This endpoint has not been registered in the production backend route registry."
      },
      { status: 404 }
    );
  }

  const apiPath = request.nextUrl.pathname.replace(/^\/api/, "") || "/";
  const isAuthBootstrapRoute = unauthenticatedAllowedPaths.has(apiPath);
  let context = headerContext;

  if (runtimeMode.productionBackendEnabled && !runtimeMode.backendConfigured && !isAuthBootstrapRoute) {
    const audit = createAuditEnvelope(request, headerContext, "backend setup missing", definition.module, false, runtimeMode.missingConfig.join(", "));
    return NextResponse.json(
      {
        ...createBackendNotConfiguredError(runtimeMode),
        safeMessage: "Backend is not configured. CareVerity production backend requires Supabase/Postgres environment variables before live data can be used.",
        status: "backend_not_configured",
        audit
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }

  if (isProductionBackendEnabled() && !isAuthBootstrapRoute) {
    try {
      const verifiedContext = await getVerifiedProductionRequestContext(request);
      if (verifiedContext) context = verifiedContext;
    } catch (error) {
      const status = error instanceof CareVerityProductionBackendError ? error.status : 401;
      const audit = createAuditEnvelope(request, headerContext, "verified authentication failed", definition.module, false, error instanceof Error ? error.message : "Unknown auth error");
      return NextResponse.json(
        {
          ok: false,
          errorCode: "VERIFIED_AUTHENTICATION_FAILED",
          error: "Verified authentication failed.",
          safeMessage: error instanceof Error ? error.message : "CareVerity staging authentication failed.",
          productionBackendEnabled: true,
          audit
        },
        { status, headers: { "Cache-Control": "no-store" } }
      );
    }
  }

  const mfa = evaluateMfaRequirement(
    context.userRole,
    "mfaVerified" in context ? Boolean(context.mfaVerified) : request.headers.get("x-careverity-mfa-verified") === "true"
  );

  if (!rateLimit.allowed) {
    const audit = createAuditEnvelope(request, context, "rate limit denied", definition.module, false, definition.path);
    return NextResponse.json(
      {
        ok: false,
        errorCode: "RATE_LIMIT_EXCEEDED",
        error: "Rate limit exceeded.",
        safeMessage: "Too many requests. Please wait before trying again.",
        rateLimit,
        audit
      },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfterSeconds), "Cache-Control": "no-store" } }
    );
  }

  if (!context.authenticated && !isAuthBootstrapRoute) {
    const audit = createAuditEnvelope(request, context, "unauthenticated API request denied", definition.module, false, definition.path);
    return NextResponse.json(
      {
        ok: false,
        errorCode: "AUTHENTICATION_REQUIRED",
        error: "Authentication required.",
        safeMessage: "Sign in with a valid CareVerity session before using this endpoint.",
        audit
      },
      { status: 401 }
    );
  }

  if (!isAuthBootstrapRoute && !roleHasPermission(context.userRole, definition.permission)) {
    const audit = createAuditEnvelope(request, context, "role permission denied", definition.module, false, definition.permission);
    return NextResponse.json(
      {
        ok: false,
        errorCode: "ROLE_NOT_PERMITTED",
        error: "Role not permitted.",
        safeMessage: "Your role is not authorised for this action.",
        requiredPermission: definition.permission,
        userRole: context.userRole,
        audit
      },
      { status: 403 }
    );
  }

  if (!isAuthBootstrapRoute && mfa.required && !mfa.passed) {
    const audit = createAuditEnvelope(request, context, "MFA required", definition.module, false, definition.permission);
    return NextResponse.json(
      {
        ok: false,
        errorCode: "MFA_REQUIRED",
        error: "MFA required.",
        safeMessage: "Multi-factor authentication is required for this role before production access is allowed.",
        mfa,
        audit
      },
      { status: 403, headers: { "Cache-Control": "no-store" } }
    );
  }

  const tenantCheck = definition.requiresTenant ? validateTenantBoundary(context, (body as Record<string, unknown>).companyId) : { ok: true as const };
  if (!tenantCheck.ok) {
    const audit = createAuditEnvelope(request, context, "tenant boundary denied", definition.module, false, tenantCheck.error);
    return NextResponse.json(
      {
        ok: false,
        errorCode: "TENANT_MISMATCH",
        error: tenantCheck.error,
        safeMessage: "Company data cannot be accessed outside the authenticated company context.",
        audit
      },
      { status: tenantCheck.status }
    );
  }

  const audit = createAuditEnvelope(
    request,
    context,
    definition.auditAction ?? `${definition.method} ${definition.path}`,
    definition.module,
    true,
    readiness.hardStops.length ? "Production backend scaffold only; hard stops remain." : "Production backend guard passed."
  );
  const persistentAudit =
    definition.requiresTenant && context.companyId
      ? await recordTamperResistantAuditLog({
          tenant: {
            companyId: context.companyId,
            providerId: context.providerId,
            locationId: context.locationId
          },
          userId: context.userId || "unknown-user",
          userRole: context.userRole,
          action: definition.auditAction ?? `${definition.method} ${definition.path}`,
          module: definition.module,
          recordType: definition.module,
          recordId: typeof (body as Record<string, unknown>).id === "string" ? ((body as Record<string, unknown>).id as string) : undefined,
          oldValue: null,
          newValue: request.method === "GET" ? null : body,
          reason: readiness.hardStops.length ? "Production backend hard stops remain." : "Production backend guard passed.",
          ipAddress: network.ipAddress,
          device: network.userAgent
        })
      : null;
  const backupRestoreStatus =
    apiPath === "/backup-restore/status" && context.companyId
      ? await getBackupRestoreStatus({
          companyId: context.companyId,
          providerId: context.providerId,
          locationId: context.locationId
        })
      : null;
  const databaseResult =
    isProductionBackendEnabled() && isProductionDatabaseConfigured() && definition.requiresTenant && context.companyId
      ? await runProductionPersistenceForApi(request.method, request.nextUrl.pathname, {
          companyId: context.companyId,
          providerId: context.providerId,
          locationId: context.locationId
        }, body as Record<string, unknown>)
      : null;

  return NextResponse.json(
    {
      ok: true,
      route: definition.path,
      method: definition.method,
      module: definition.module,
      permission: definition.permission,
      tenant: {
        companyId: context.companyId || null,
        providerId: context.providerId ?? null,
        locationId: context.locationId ?? null
      },
      user: {
        userId: context.userId || null,
        role: context.userRole,
        authSource: context.authSource
      },
      productionStatus: definition.productionStatus ?? "Requires database adapter",
      databasePersistence: readiness.databaseStatus,
      databaseResult,
      authControls: {
        mfa,
        sessionTimeoutMinutes: Number(process.env.SESSION_TIMEOUT_MINUTES ?? 30),
        accountLockoutAttempts: Number(process.env.FAILED_LOGIN_LOCKOUT_ATTEMPTS ?? 5),
        passwordResetTokenTtlMinutes: Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES ?? 30)
      },
      rateLimit,
      backupRestoreStatus,
      productionReady: readiness.hardStops.length === 0,
      hardStops: readiness.hardStops,
      data: request.method === "GET" ? [] : { accepted: true, draftOnly: definition.module.includes("AI"), fileStoragePublic: false },
      audit,
      persistentAudit
    },
    {
      status: readiness.hardStops.length ? 202 : 200,
      headers: {
        "Cache-Control": "no-store",
        "X-CareVerity-Tenant": context.companyId || "missing",
        "X-CareVerity-Module": definition.module
      }
    }
  );
}

export async function GET(request: NextRequest, context: CareVerityCatchAllContext) {
  await context.params;
  return handleCareVerityApi(request);
}

export async function POST(request: NextRequest, context: CareVerityCatchAllContext) {
  await context.params;
  return handleCareVerityApi(request);
}

export async function PATCH(request: NextRequest, context: CareVerityCatchAllContext) {
  await context.params;
  return handleCareVerityApi(request);
}

export async function DELETE(request: NextRequest, context: CareVerityCatchAllContext) {
  await context.params;
  return handleCareVerityApi(request);
}
