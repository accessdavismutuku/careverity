import { NextResponse, type NextRequest } from "next/server";
import {
  createAuditEnvelope,
  getRequestContext,
  roleHasPermission,
  validateTenantBoundary
} from "@/lib/careverity-backend-security";
import {
  clientDocumentStorageNotConfiguredErrorCode,
  clientDocumentUploadStorageNotConfiguredMessage,
  createClientDocumentAuditEvent,
  getClientNetworkContext,
  getProductionServiceClient,
  recordTamperResistantAuditLog,
  userCanReadClientDocument,
  type CareVerityClientDocumentRow
} from "@/lib/careverity-production-backend";

export const runtime = "nodejs";

type ClientDocumentSignedUrlContext = {
  params: Promise<{ documentId: string }>;
};

function requestedAction(request: NextRequest) {
  const action = request.nextUrl.searchParams.get("action")?.trim().toLowerCase();
  return action === "download" ? "download" : "view";
}

async function findClientDocument(documentId: string) {
  const supabase = getProductionServiceClient();
  if (!supabase) return { supabase: null, document: null, error: null };

  const { data, error } = await supabase
    .from("client_documents")
    .select("*")
    .or(`id.eq.${documentId},document_id.eq.${documentId}`)
    .maybeSingle();

  return { supabase, document: data as CareVerityClientDocumentRow | null, error };
}

export async function GET(request: NextRequest, context: ClientDocumentSignedUrlContext) {
  const { documentId } = await context.params;
  const requestContext = getRequestContext(request);
  const network = getClientNetworkContext(request);
  const action = requestedAction(request);

  if (!requestContext.authenticated) {
    const audit = createAuditEnvelope(request, requestContext, "client document signed URL denied", "Client Documents", false, "Authentication required", documentId);
    return NextResponse.json({ ok: false, errorCode: "AUTHENTICATION_REQUIRED", error: "Authentication required.", safeMessage: "Sign in before viewing client documents.", audit }, { status: 401 });
  }

  const { supabase, document, error } = await findClientDocument(documentId);
  if (!supabase) {
    const audit = createAuditEnvelope(request, requestContext, "client document signed URL blocked", "Client Documents", false, "Private storage not configured", documentId);
    return NextResponse.json(
      {
        ok: false,
        errorCode: clientDocumentStorageNotConfiguredErrorCode,
        error: "Document storage unavailable.",
        safeMessage: clientDocumentUploadStorageNotConfiguredMessage,
        storageConfigured: false,
        audit
      },
      { status: 503, headers: { "Cache-Control": "no-store" } }
    );
  }
  if (error) {
    const audit = createAuditEnvelope(request, requestContext, "client document lookup failed", "Client Documents", false, error.message, documentId);
    return NextResponse.json({ ok: false, errorCode: "DOCUMENT_LOOKUP_FAILED", error: "Document lookup failed.", safeMessage: error.message, audit }, { status: 502 });
  }
  if (!document || document.status !== "Active") {
    const audit = createAuditEnvelope(request, requestContext, "client document not found", "Client Documents", false, "Document missing or archived", documentId);
    return NextResponse.json({ ok: false, errorCode: "DOCUMENT_NOT_FOUND", error: "Document not found.", safeMessage: "The requested document is not active or does not exist.", audit }, { status: 404 });
  }

  const tenantCheck = validateTenantBoundary(requestContext, document.company_id);
  if (!tenantCheck.ok) {
    const audit = createAuditEnvelope(request, requestContext, "client document tenant boundary denied", "Client Documents", false, tenantCheck.error, documentId);
    return NextResponse.json({ ok: false, errorCode: "TENANT_MISMATCH", error: tenantCheck.error, safeMessage: "Company documents cannot be accessed outside the authenticated company context.", audit }, { status: tenantCheck.status });
  }

  const accessCheck = userCanReadClientDocument({
    userRole: requestContext.userRole,
    serviceUserId: document.service_user_id,
    restricted: Boolean(document.restricted),
    mobileVisible: Boolean(document.mobile_visible),
    assignedServiceUsersHeader: request.headers.get("x-careverity-assigned-service-users"),
    inspectionScopeHeader: request.headers.get("x-careverity-inspection-scope"),
    hasReadPermission: roleHasPermission(requestContext.userRole, "client_documents:read"),
    hasRestrictedPermission: roleHasPermission(requestContext.userRole, "client_documents:read_restricted")
  });

  if (!accessCheck.ok) {
    const audit = createAuditEnvelope(request, requestContext, "client document access denied", "Client Documents", false, accessCheck.reason, documentId);
    return NextResponse.json({ ok: false, errorCode: "DOCUMENT_ACCESS_DENIED", error: "Document access denied.", safeMessage: accessCheck.reason, audit }, { status: accessCheck.status });
  }

  const signedUrlTtlSeconds = Number(process.env.CLIENT_DOCUMENT_SIGNED_URL_TTL_SECONDS ?? 300);
  const { data: signedUrlData, error: signedUrlError } = await supabase.storage
    .from(document.storage_bucket)
    .createSignedUrl(document.storage_path, signedUrlTtlSeconds, {
      download: action === "download" ? document.original_file_name : undefined
    });

  if (signedUrlError) {
    const audit = createAuditEnvelope(request, requestContext, "client document signed URL failed", "Client Documents", false, signedUrlError.message, documentId);
    return NextResponse.json({ ok: false, errorCode: "SIGNED_URL_FAILED", error: "Signed URL failed.", safeMessage: signedUrlError.message, audit }, { status: 502 });
  }

  const scope = {
    companyId: document.company_id,
    providerId: document.provider_id ?? undefined,
    locationId: document.location_id ?? undefined
  };

  const documentAudit = await createClientDocumentAuditEvent({
    scope,
    serviceUserId: document.service_user_id,
    clientDocumentId: document.id,
    action,
    userId: requestContext.userId || "unknown-user",
    userRole: requestContext.userRole,
    oldValue: null,
    newValue: { documentId: document.id, action, signedUrlTtlSeconds },
    reason: `Client document ${action} signed URL created.`,
    ipAddress: network.ipAddress,
    device: network.userAgent
  });

  const persistentAudit = await recordTamperResistantAuditLog({
    tenant: scope,
    userId: requestContext.userId || "unknown-user",
    userRole: requestContext.userRole,
    action: `client document ${action}`,
    module: "Client Documents",
    recordType: "ClientDocument",
    recordId: document.id,
    oldValue: null,
    newValue: { documentId: document.id, action, signedUrlTtlSeconds },
    reason: accessCheck.reason,
    ipAddress: network.ipAddress,
    device: network.userAgent
  });

  return NextResponse.json(
    {
      ok: true,
      documentId: document.id,
      action,
      expiresInSeconds: signedUrlTtlSeconds,
      signedUrl: signedUrlData.signedUrl,
      audit: persistentAudit,
      documentAudit
    },
    { status: 200, headers: { "Cache-Control": "no-store", "X-CareVerity-Tenant": document.company_id } }
  );
}
