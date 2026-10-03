import type { NextRequest } from "next/server";

export type CareVerityProductionRole =
  | "System Owner"
  | "Super Admin"
  | "Company Admin"
  | "Registered Manager"
  | "Nominated Individual"
  | "Care Coordinator"
  | "Supervisor"
  | "Care Worker"
  | "HR Manager"
  | "Compliance Manager"
  | "Medication Lead"
  | "Inspector Read Only"
  | "Auditor Read Only";

export type CareVerityApiDefinition = {
  method: "GET" | "POST" | "PATCH" | "DELETE";
  path: string;
  module: string;
  permission: string;
  requiresTenant: boolean;
  auditAction?: string;
  productionStatus?: "Ready scaffold" | "Requires database adapter" | "Requires auth provider" | "Requires file storage";
};

export type CareVerityRequestContext = {
  authenticated: boolean;
  companyId: string;
  providerId?: string;
  locationId?: string;
  userId: string;
  userRole: CareVerityProductionRole;
  isSuperAdmin: boolean;
  authSource: "authorization-header" | "verified-supabase-session" | "demo-header" | "missing";
};

export type CareVerityAuditEnvelope = {
  auditId: string;
  companyId: string;
  userId: string;
  userRole: string;
  actionType: string;
  recordType: string;
  recordId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  notes?: string;
};

export const careverityProductionRoles: CareVerityProductionRole[] = [
  "System Owner",
  "Super Admin",
  "Company Admin",
  "Registered Manager",
  "Nominated Individual",
  "Care Coordinator",
  "Supervisor",
  "Care Worker",
  "HR Manager",
  "Compliance Manager",
  "Medication Lead",
  "Inspector Read Only",
  "Auditor Read Only"
];

export const careverityRolePermissions: Record<CareVerityProductionRole, string[]> = {
  "System Owner": ["*"],
  "Super Admin": ["*"],
  "Company Admin": [
    "companies:manage",
    "staff:manage",
    "service_users:manage",
    "care_plans:manage",
    "risk_assessments:manage",
    "visits:manage",
    "medication:read",
    "incidents:manage",
    "quality:read",
    "client_documents:read",
    "client_documents:read_restricted",
    "client_documents:upload",
    "client_documents:replace",
    "client_documents:archive",
    "client_documents:delete",
    "files:manage",
    "audit:read",
    "notifications:manage"
  ],
  "Registered Manager": [
    "staff:read",
    "service_users:manage",
    "care_plans:approve",
    "care_plans:manage",
    "risk_assessments:approve",
    "risk_assessments:manage",
    "visits:manage",
    "medication:manage",
    "controlled_medication:manage",
    "incidents:manager_review",
    "quality:manage",
    "inspection:approve",
    "ai:approve",
    "client_documents:read",
    "client_documents:read_restricted",
    "client_documents:upload",
    "client_documents:replace",
    "client_documents:archive",
    "client_documents:delete",
    "files:manage",
    "audit:read"
  ],
  "Nominated Individual": ["companies:read", "quality:read", "audit:read", "inspection:approve", "reports:read"],
  "Care Coordinator": [
    "staff:read",
    "service_users:manage",
    "care_plans:draft",
    "risk_assessments:draft",
    "visits:manage",
    "incidents:manage",
    "quality:read",
    "client_documents:read",
    "client_documents:read_restricted",
    "client_documents:upload",
    "notifications:manage",
    "messages:manage",
    "tasks:manage"
  ],
  Supervisor: [
    "staff:read",
    "service_users:read",
    "care_plans:read",
    "risk_assessments:read",
    "visits:manage",
    "incidents:manage",
    "quality:read",
    "client_documents:read",
    "client_documents:read_restricted",
    "client_documents:upload"
  ],
  "Care Worker": [
    "visits:read_assigned",
    "visits:clock",
    "visit_notes:create",
    "visit_tasks:complete",
    "care_plans:read_assigned_approved",
    "medication:record_authorised",
    "incidents:create",
    "client_documents:read_mobile_visible"
  ],
  "HR Manager": ["staff:manage", "hr:manage", "staff_support:manage", "staff_recognition:manage", "ai_hr:approve", "files:manage", "audit:read"],
  "Compliance Manager": ["quality:manage", "incidents:manage", "cqc_evidence:manage", "audit:read", "files:read", "client_documents:read", "client_documents:read_restricted", "client_documents:upload", "client_documents:replace", "client_documents:archive"],
  "Medication Lead": ["medication:manage", "controlled_medication:manage", "mar:manage", "audit:read"],
  "Inspector Read Only": ["inspection:read_approved", "cqc_evidence:read_approved", "client_documents:read_inspection_scope"],
  "Auditor Read Only": ["audit:read", "quality:read", "cqc_evidence:read_approved"]
};

export const careverityApiDefinitions: CareVerityApiDefinition[] = [
  { method: "POST", path: "/auth/login", module: "Auth", permission: "auth:login", requiresTenant: false, auditAction: "login", productionStatus: "Requires auth provider" },
  { method: "POST", path: "/auth/logout", module: "Auth", permission: "auth:logout", requiresTenant: false, auditAction: "logout", productionStatus: "Requires auth provider" },
  { method: "POST", path: "/auth/password-reset", module: "Auth", permission: "auth:password_reset", requiresTenant: false, auditAction: "password reset requested", productionStatus: "Requires auth provider" },
  { method: "POST", path: "/auth/mfa/verify", module: "Auth", permission: "auth:mfa_verify", requiresTenant: false, auditAction: "mfa verified", productionStatus: "Requires auth provider" },
  { method: "GET", path: "/companies/current", module: "Companies", permission: "companies:read", requiresTenant: true },
  { method: "POST", path: "/companies", module: "Companies", permission: "companies:manage", requiresTenant: true, auditAction: "company created" },
  { method: "PATCH", path: "/companies/:id", module: "Companies", permission: "companies:manage", requiresTenant: true, auditAction: "company updated" },
  { method: "GET", path: "/staff", module: "Staff", permission: "staff:read", requiresTenant: true },
  { method: "POST", path: "/staff", module: "Staff", permission: "staff:manage", requiresTenant: true, auditAction: "staff created" },
  { method: "GET", path: "/staff/:id", module: "Staff", permission: "staff:read", requiresTenant: true, auditAction: "staff viewed" },
  { method: "PATCH", path: "/staff/:id", module: "Staff", permission: "staff:manage", requiresTenant: true, auditAction: "staff updated" },
  { method: "GET", path: "/service-users", module: "Service Users", permission: "service_users:read", requiresTenant: true, auditAction: "service user list viewed" },
  { method: "POST", path: "/service-users", module: "Service Users", permission: "service_users:manage", requiresTenant: true, auditAction: "service user created" },
  { method: "GET", path: "/service-users/:id", module: "Service Users", permission: "service_users:read", requiresTenant: true, auditAction: "service user viewed" },
  { method: "PATCH", path: "/service-users/:id", module: "Service Users", permission: "service_users:manage", requiresTenant: true, auditAction: "service user updated" },
  { method: "POST", path: "/client-documents/upload", module: "Client Documents", permission: "client_documents:upload", requiresTenant: true, auditAction: "client document uploaded", productionStatus: "Requires file storage" },
  { method: "GET", path: "/client-documents/:documentId/signed-url", module: "Client Documents", permission: "client_documents:read", requiresTenant: true, auditAction: "client document signed URL requested", productionStatus: "Requires file storage" },
  { method: "GET", path: "/care-plans", module: "Care Plans", permission: "care_plans:read", requiresTenant: true },
  { method: "POST", path: "/care-plans", module: "Care Plans", permission: "care_plans:draft", requiresTenant: true, auditAction: "care plan drafted" },
  { method: "GET", path: "/care-plans/:id", module: "Care Plans", permission: "care_plans:read", requiresTenant: true, auditAction: "care plan viewed" },
  { method: "PATCH", path: "/care-plans/:id", module: "Care Plans", permission: "care_plans:manage", requiresTenant: true, auditAction: "care plan updated" },
  { method: "POST", path: "/care-plans/:id/approve", module: "Care Plans", permission: "care_plans:approve", requiresTenant: true, auditAction: "care plan approved" },
  { method: "POST", path: "/care-plans/:id/publish", module: "Care Plans", permission: "care_plans:approve", requiresTenant: true, auditAction: "care plan published" },
  { method: "POST", path: "/ai/care-plan/generate-lqcs-draft", module: "AI Care Planning", permission: "care_plans:draft", requiresTenant: true, auditAction: "AI care plan draft generated" },
  { method: "POST", path: "/ai/care-plan/review-checker", module: "AI Care Planning", permission: "care_plans:draft", requiresTenant: true, auditAction: "AI care plan review checker run" },
  { method: "POST", path: "/ai/care-plan/generate-risk-assessments", module: "AI Care Planning", permission: "risk_assessments:draft", requiresTenant: true, auditAction: "AI risk assessment draft generated" },
  { method: "POST", path: "/ai/care-plan/suggest-update-from-event", module: "AI Care Planning", permission: "care_plans:draft", requiresTenant: true, auditAction: "AI event update suggestion generated" },
  { method: "GET", path: "/risk-assessments", module: "Risk Assessments", permission: "risk_assessments:read", requiresTenant: true },
  { method: "POST", path: "/risk-assessments", module: "Risk Assessments", permission: "risk_assessments:draft", requiresTenant: true, auditAction: "risk assessment created" },
  { method: "PATCH", path: "/risk-assessments/:id", module: "Risk Assessments", permission: "risk_assessments:manage", requiresTenant: true, auditAction: "risk assessment updated" },
  { method: "POST", path: "/risk-assessments/:id/approve", module: "Risk Assessments", permission: "risk_assessments:approve", requiresTenant: true, auditAction: "risk assessment approved" },
  { method: "GET", path: "/visits", module: "Visits", permission: "visits:manage", requiresTenant: true },
  { method: "POST", path: "/visits", module: "Visits", permission: "visits:manage", requiresTenant: true, auditAction: "visit created" },
  { method: "POST", path: "/visits/recurring", module: "Visits", permission: "visits:manage", requiresTenant: true, auditAction: "recurring visits created" },
  { method: "POST", path: "/visits/emergency", module: "Visits", permission: "visits:manage", requiresTenant: true, auditAction: "emergency call created" },
  { method: "POST", path: "/visits/:id/clock-in", module: "Visits", permission: "visits:clock", requiresTenant: true, auditAction: "visit clock-in recorded" },
  { method: "POST", path: "/visits/:id/clock-out", module: "Visits", permission: "visits:clock", requiresTenant: true, auditAction: "visit clock-out recorded" },
  { method: "POST", path: "/visits/:id/notes", module: "Visits", permission: "visit_notes:create", requiresTenant: true, auditAction: "visit note recorded" },
  { method: "GET", path: "/medication", module: "Medication", permission: "medication:read", requiresTenant: true },
  { method: "POST", path: "/medication", module: "Medication", permission: "medication:manage", requiresTenant: true, auditAction: "medication record created" },
  { method: "POST", path: "/mar/record-given", module: "MAR", permission: "medication:record_authorised", requiresTenant: true, auditAction: "MAR given recorded" },
  { method: "POST", path: "/mar/record-refused", module: "MAR", permission: "medication:record_authorised", requiresTenant: true, auditAction: "MAR refused recorded" },
  { method: "POST", path: "/mar/record-missed", module: "MAR", permission: "medication:record_authorised", requiresTenant: true, auditAction: "MAR missed recorded" },
  { method: "POST", path: "/controlled-medication/administer", module: "Controlled Medication", permission: "controlled_medication:manage", requiresTenant: true, auditAction: "controlled medication administered" },
  { method: "POST", path: "/controlled-medication/stock-check", module: "Controlled Medication", permission: "controlled_medication:manage", requiresTenant: true, auditAction: "controlled medication stock check recorded" },
  { method: "GET", path: "/incidents", module: "Incidents", permission: "incidents:manage", requiresTenant: true },
  { method: "POST", path: "/incidents", module: "Incidents", permission: "incidents:create", requiresTenant: true, auditAction: "incident created" },
  { method: "PATCH", path: "/incidents/:id", module: "Incidents", permission: "incidents:manage", requiresTenant: true, auditAction: "incident updated" },
  { method: "POST", path: "/incidents/:id/manager-review", module: "Incidents", permission: "incidents:manager_review", requiresTenant: true, auditAction: "incident manager review recorded" },
  { method: "GET", path: "/kpi/dashboard", module: "Quality", permission: "quality:read", requiresTenant: true },
  { method: "GET", path: "/lessons-learned", module: "Quality", permission: "quality:read", requiresTenant: true },
  { method: "POST", path: "/lessons-learned", module: "Quality", permission: "quality:manage", requiresTenant: true, auditAction: "lesson learned created" },
  { method: "GET", path: "/cqc-evidence", module: "Quality", permission: "cqc_evidence:read_approved", requiresTenant: true },
  { method: "POST", path: "/cqc-evidence/generate-pack", module: "Quality", permission: "cqc_evidence:manage", requiresTenant: true, auditAction: "CQC evidence pack generated" },
  { method: "GET", path: "/hr/dashboard", module: "HR", permission: "hr:manage", requiresTenant: true },
  { method: "POST", path: "/hr/communication-draft", module: "HR", permission: "hr:manage", requiresTenant: true, auditAction: "HR communication draft generated" },
  { method: "POST", path: "/ai/hr/draft", module: "HR AI", permission: "ai_hr:approve", requiresTenant: true, auditAction: "HR AI draft generated" },
  { method: "GET", path: "/hr/staff-support-indicators", module: "HR", permission: "staff_support:manage", requiresTenant: true },
  { method: "POST", path: "/hr/staff-recognition/nominate", module: "HR", permission: "staff_recognition:manage", requiresTenant: true, auditAction: "staff recognition nomination created" },
  { method: "POST", path: "/inspection/request-access", module: "Inspection", permission: "inspection:request", requiresTenant: true, auditAction: "inspection access requested" },
  { method: "POST", path: "/inspection/requests/:id/approve", module: "Inspection", permission: "inspection:approve", requiresTenant: true, auditAction: "inspection access approved" },
  { method: "POST", path: "/inspection/verify-code", module: "Inspection", permission: "inspection:read_approved", requiresTenant: true, auditAction: "inspection code verified" },
  { method: "GET", path: "/inspection/evidence/dashboard", module: "Inspection", permission: "inspection:read_approved", requiresTenant: true },
  { method: "GET", path: "/inspection/activity-log", module: "Inspection", permission: "inspection:read_approved", requiresTenant: true },
  { method: "POST", path: "/files/upload", module: "Files", permission: "files:manage", requiresTenant: true, auditAction: "file uploaded", productionStatus: "Requires file storage" },
  { method: "GET", path: "/files/:id", module: "Files", permission: "files:read", requiresTenant: true, auditAction: "file viewed", productionStatus: "Requires file storage" },
  { method: "DELETE", path: "/files/:id", module: "Files", permission: "files:manage", requiresTenant: true, auditAction: "file deleted", productionStatus: "Requires file storage" },
  { method: "GET", path: "/audit-logs", module: "Audit", permission: "audit:read", requiresTenant: true, auditAction: "audit logs viewed" },
  { method: "GET", path: "/backup-restore/status", module: "Backup and Restore", permission: "companies:manage", requiresTenant: true, auditAction: "backup status viewed" },
  { method: "POST", path: "/backup-restore/run-test", module: "Backup and Restore", permission: "companies:manage", requiresTenant: true, auditAction: "backup restore test requested" }
];

export const productionBackendRequiredEnv = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "AUTH_SECRET",
  "JWT_SECRET",
  "APP_ENV",
  "ENABLE_PRODUCTION_BACKEND",
  "OPENAI_API_KEY",
  "FILE_STORAGE_BUCKET",
  "BACKUP_STORAGE",
  "ENCRYPTION_KEY"
] as const;

export function getProductionBackendReadiness() {
  const missingEnv = productionBackendRequiredEnv.filter((key) => !process.env[key]);
  const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";
  const hardStops = [
    demoMode ? "NEXT_PUBLIC_DEMO_MODE is not false; production cannot use demo/localStorage workflows." : "",
    ...missingEnv.map((key) => `${key} is not configured.`)
  ].filter(Boolean);

  return {
    appStatus: hardStops.length ? "blocked" : "ready-for-controlled-staging",
    databaseStatus: process.env.DATABASE_URL ? "configured" : "missing DATABASE_URL",
    environment: process.env.CAREVERITY_DEPLOYMENT_ENVIRONMENT ?? process.env.NEXT_PUBLIC_ENVIRONMENT_NAME ?? "local-demo",
    version: process.env.npm_package_version ?? "0.1.0",
    hardStops,
    timestamp: new Date().toISOString()
  };
}

export function isKnownCareVerityRole(role: string): role is CareVerityProductionRole {
  return careverityProductionRoles.includes(role as CareVerityProductionRole);
}

export function roleHasPermission(role: CareVerityProductionRole, permission: string) {
  const permissions = careverityRolePermissions[role] ?? [];
  if (permissions.includes("*") || permissions.includes(permission)) return true;

  const [permissionDomain, permissionAction] = permission.split(":");
  if (permissionAction === "read" && permissions.includes(`${permissionDomain}:manage`)) return true;
  if (permissionAction === "read_approved" && permissions.includes(`${permissionDomain}:manage`)) return true;
  if (permissionAction === "create" && permissions.includes(`${permissionDomain}:manage`)) return true;
  if (permissionAction === "draft" && permissions.includes(`${permissionDomain}:manage`)) return true;

  return false;
}

export function normaliseApiPath(pathname: string) {
  return pathname.replace(/^\/api/, "") || "/";
}

function matchRoutePattern(pattern: string, actual: string) {
  const patternParts = pattern.split("/").filter(Boolean);
  const actualParts = actual.split("/").filter(Boolean);
  if (patternParts.length !== actualParts.length) return false;

  return patternParts.every((part, index) => part.startsWith(":") || part === actualParts[index]);
}

export function findCareVerityApiDefinition(method: string, pathname: string) {
  const apiPath = normaliseApiPath(pathname);
  return careverityApiDefinitions.find((definition) => definition.method === method && matchRoutePattern(definition.path, apiPath));
}

export function getRequestContext(request: NextRequest): CareVerityRequestContext {
  const rawRole = request.headers.get("x-careverity-user-role") ?? "Care Coordinator";
  const userRole = isKnownCareVerityRole(rawRole) ? rawRole : "Care Coordinator";
  const authorization = request.headers.get("authorization");
  const demoAuthenticated = request.headers.get("x-careverity-demo-authenticated") === "true";
  const authenticated = Boolean(authorization || demoAuthenticated);

  return {
    authenticated,
    companyId: request.headers.get("x-careverity-company-id") ?? "",
    providerId: request.headers.get("x-careverity-provider-id") ?? undefined,
    locationId: request.headers.get("x-careverity-location-id") ?? undefined,
    userId: request.headers.get("x-careverity-user-id") ?? "",
    userRole,
    isSuperAdmin: userRole === "Super Admin" || userRole === "System Owner",
    authSource: authorization ? "authorization-header" : demoAuthenticated ? "demo-header" : "missing"
  };
}

export function validateTenantBoundary(context: CareVerityRequestContext, requestedCompanyId?: unknown) {
  if (context.isSuperAdmin) return { ok: true as const };
  if (!context.companyId) return { ok: false as const, status: 400, error: "Missing tenant context. companyId is required." };
  if (typeof requestedCompanyId === "string" && requestedCompanyId && requestedCompanyId !== context.companyId) {
    return {
      ok: false as const,
      status: 403,
      error: "Tenant boundary violation. The request companyId does not match the authenticated company context."
    };
  }
  return { ok: true as const };
}

export function createAuditEnvelope(
  request: NextRequest,
  context: CareVerityRequestContext,
  actionType: string,
  recordType: string,
  success: boolean,
  notes?: string,
  recordId?: string
): CareVerityAuditEnvelope {
  return {
    auditId: `AUD-${Date.now()}`,
    companyId: context.companyId || "system",
    userId: context.userId || "unknown-user",
    userRole: context.userRole,
    actionType,
    recordType,
    recordId,
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "ip-address-placeholder",
    userAgent: request.headers.get("user-agent") ?? "user-agent-placeholder",
    timestamp: new Date().toISOString(),
    success,
    notes
  };
}
