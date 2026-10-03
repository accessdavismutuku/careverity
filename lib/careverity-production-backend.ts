import crypto from "node:crypto";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { NextRequest } from "next/server";
import { isKnownCareVerityRole, type CareVerityProductionRole } from "./careverity-backend-security";

export type CareVerityProductionTenantScope = {
  companyId: string;
  providerId?: string;
  locationId?: string;
};

export type CareVerityProductionUserContext = {
  userId: string;
  role: CareVerityProductionRole;
  email?: string;
  mfaVerified: boolean;
  tenant: CareVerityProductionTenantScope;
};

export type CareVerityVerifiedRequestContext = {
  authenticated: boolean;
  companyId: string;
  providerId?: string;
  locationId?: string;
  userId: string;
  userRole: CareVerityProductionRole;
  isSuperAdmin: boolean;
  authSource: "verified-supabase-session";
  mfaVerified: boolean;
  email?: string;
};

export type CareVerityAuditWriteInput = {
  tenant: CareVerityProductionTenantScope;
  userId: string;
  userRole: string;
  action: string;
  module: string;
  recordType: string;
  recordId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string;
  ipAddress?: string;
  device?: string;
};

export type CareVerityPrivateFileCategory =
  | "care-plans"
  | "risk-assessments"
  | "hr-documents"
  | "dbs-right-to-work"
  | "incident-evidence"
  | "body-chart-evidence"
  | "inspection-evidence"
  | "ai-drafts"
  | "mar"
  | "controlled-drugs";

export const productionMfaRequiredRoles = new Set<string>([
  "Super Admin",
  "System Owner",
  "Company Admin",
  "Provider Admin",
  "Registered Manager"
]);

export const privateFileCategories: CareVerityPrivateFileCategory[] = [
  "care-plans",
  "risk-assessments",
  "hr-documents",
  "dbs-right-to-work",
  "incident-evidence",
  "body-chart-evidence",
  "inspection-evidence",
  "ai-drafts",
  "mar",
  "controlled-drugs"
];

export const productionLiveReadinessAreas = [
  "database persistence",
  "authentication",
  "MFA",
  "role-based access",
  "tenant isolation",
  "audit trail",
  "file storage",
  "backup/restore",
  "rate limiting",
  "vulnerability scan",
  "staging UAT",
  "security test"
] as const;

const privateBucketName = process.env.FILE_STORAGE_BUCKET || "provider-documents";

export const stagingRequiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "JWT_SECRET",
  "APP_ENV",
  "ENABLE_PRODUCTION_BACKEND"
] as const;

export const careverityApiPersistenceTargets = [
  { method: "POST", path: "/companies", table: "providers" },
  { method: "GET", path: "/staff", table: "staff" },
  { method: "POST", path: "/staff", table: "staff" },
  { method: "GET", path: "/service-users", table: "service_users" },
  { method: "POST", path: "/service-users", table: "service_users" },
  { method: "POST", path: "/client-documents/upload", table: "client_documents" },
  { method: "GET", path: "/care-plans", table: "care_plans" },
  { method: "POST", path: "/care-plans", table: "care_plans" },
  { method: "GET", path: "/risk-assessments", table: "risk_assessments" },
  { method: "POST", path: "/risk-assessments", table: "risk_assessments" },
  { method: "GET", path: "/visits", table: "shifts" },
  { method: "POST", path: "/visits", table: "shifts" },
  { method: "POST", path: "/visits/emergency", table: "emergency_calls" },
  { method: "GET", path: "/medication", table: "medication_records" },
  { method: "POST", path: "/medication", table: "medication_records" },
  { method: "POST", path: "/mar/record-given", table: "mar_records" },
  { method: "POST", path: "/mar/record-refused", table: "medication_refusals" },
  { method: "POST", path: "/mar/record-missed", table: "missed_medication_records" },
  { method: "POST", path: "/controlled-medication/administer", table: "controlled_medication_records" },
  { method: "POST", path: "/controlled-medication/stock-check", table: "controlled_drug_stock_balance" },
  { method: "GET", path: "/incidents", table: "incidents" },
  { method: "POST", path: "/incidents", table: "incidents" },
  { method: "POST", path: "/ai/care-plan/generate-lqcs-draft", table: "ai_care_plan_drafts" },
  { method: "GET", path: "/audit-logs", table: "audit_logs" },
  { method: "GET", path: "/backup-restore/status", table: "backup_restore_tests" }
] as const;

export class CareVerityProductionBackendError extends Error {
  status: number;

  constructor(message: string, status = 503) {
    super(message);
    this.name = "CareVerityProductionBackendError";
    this.status = status;
  }
}

function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
}

function getServiceRoleKey() {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

export function isProductionBackendEnabled() {
  if (process.env.ENABLE_PRODUCTION_BACKEND === "false") return false;
  return (
    process.env.ENABLE_PRODUCTION_BACKEND === "true" ||
    process.env.NEXT_PUBLIC_DEMO_MODE === "false" ||
    process.env.APP_ENV === "staging" ||
    process.env.APP_ENV === "production" ||
    process.env.CAREVERITY_DEPLOYMENT_ENVIRONMENT === "staging" ||
    process.env.CAREVERITY_DEPLOYMENT_ENVIRONMENT === "production"
  );
}

export function getMissingStagingEnv() {
  return stagingRequiredEnv.filter((key) => !process.env[key]);
}

export function isProductionDatabaseConfigured() {
  return Boolean(getSupabaseUrl() && getServiceRoleKey());
}

export function getProductionServiceClient(): SupabaseClient | null {
  if (!isProductionDatabaseConfigured()) return null;
  return createClient(getSupabaseUrl(), getServiceRoleKey(), {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function getSupabaseUserClient(accessToken: string): SupabaseClient | null {
  if (!getSupabaseUrl() || !getSupabaseAnonKey()) return null;
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });
}

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization") ?? "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] ?? "";
}

function resolveMfaFromSupabaseUser(user: { app_metadata?: Record<string, unknown>; user_metadata?: Record<string, unknown> }) {
  return (
    user.app_metadata?.mfa_verified === true ||
    user.app_metadata?.aal === "aal2" ||
    user.user_metadata?.mfa_verified === true ||
    user.user_metadata?.aal === "aal2"
  );
}

export async function getVerifiedProductionRequestContext(request: NextRequest): Promise<CareVerityVerifiedRequestContext | null> {
  if (!isProductionBackendEnabled()) return null;

  const accessToken = getBearerToken(request);
  if (!accessToken) {
    throw new CareVerityProductionBackendError("Production backend requires a verified bearer session.", 401);
  }

  const userClient = getSupabaseUserClient(accessToken);
  const serviceClient = getProductionServiceClient();
  if (!userClient || !serviceClient) {
    throw new CareVerityProductionBackendError("Supabase Auth and service role credentials are required before staging authentication can run.", 503);
  }

  const { data: authData, error: authError } = await userClient.auth.getUser(accessToken);
  if (authError || !authData.user) {
    throw new CareVerityProductionBackendError("Invalid or expired Supabase session.", 401);
  }

  const { data: profile, error: profileError } = await serviceClient
    .from("users")
    .select("id, company_id, provider_id, location_id, user_role, email, mfa_enabled, account_status, locked_until, archived_at")
    .eq("id", authData.user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (!profile) {
    throw new CareVerityProductionBackendError("Verified auth session has no CareVerity user profile.", 403);
  }
  if (profile.archived_at || profile.account_status === "Inactive" || profile.account_status === "Suspended") {
    throw new CareVerityProductionBackendError("CareVerity user account is inactive or suspended.", 403);
  }
  if (profile.locked_until && new Date(profile.locked_until).getTime() > Date.now()) {
    throw new CareVerityProductionBackendError("CareVerity user account is temporarily locked.", 423);
  }
  if (!profile.company_id) {
    throw new CareVerityProductionBackendError("CareVerity user profile is missing companyId tenant scope.", 403);
  }

  const rawRole = profile.user_role || authData.user.app_metadata?.role || "Care Coordinator";
  const role = typeof rawRole === "string" && isKnownCareVerityRole(rawRole) ? rawRole : "Care Coordinator";

  return {
    authenticated: true,
    companyId: profile.company_id,
    providerId: profile.provider_id ?? undefined,
    locationId: profile.location_id ?? undefined,
    userId: profile.id,
    userRole: role,
    isSuperAdmin: role === "Super Admin" || role === "System Owner",
    authSource: "verified-supabase-session",
    mfaVerified: Boolean(profile.mfa_enabled || resolveMfaFromSupabaseUser(authData.user)),
    email: profile.email ?? authData.user.email ?? undefined
  };
}

export function assertProductionTenantScope(scope: Partial<CareVerityProductionTenantScope>, action = "access production records") {
  if (!scope.companyId) {
    throw new CareVerityProductionBackendError(`companyId is required to ${action}.`, 400);
  }
}

function toSnakeCasePayload(input: Record<string, unknown>) {
  return Object.fromEntries(
    Object.entries(input)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [
        key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
        value
      ])
  );
}

function applyTenantFilters<T>(query: T, scope: CareVerityProductionTenantScope): T {
  let next = query;
  const maybeEq = next as T & { eq: (column: string, value: string) => T };
  next = maybeEq.eq("company_id", scope.companyId);
  if (scope.providerId) next = (next as T & { eq: (column: string, value: string) => T }).eq("provider_id", scope.providerId);
  if (scope.locationId) next = (next as T & { eq: (column: string, value: string) => T }).eq("location_id", scope.locationId);
  return next;
}

export async function listProductionRecords(table: string, scope: CareVerityProductionTenantScope, columns = "*") {
  assertProductionTenantScope(scope, `list ${table}`);
  const supabase = getProductionServiceClient();
  if (!supabase) {
    throw new CareVerityProductionBackendError("Production database is not configured. Set Supabase URL and service role key before live care records are used.");
  }

  const query = applyTenantFilters(supabase.from(table).select(columns), scope);
  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function insertProductionRecord(table: string, scope: CareVerityProductionTenantScope, payload: Record<string, unknown>) {
  assertProductionTenantScope(scope, `insert ${table}`);
  const supabase = getProductionServiceClient();
  if (!supabase) {
    throw new CareVerityProductionBackendError("Production database is not configured. Set Supabase URL and service role key before live care records are used.");
  }

  const record = toSnakeCasePayload({
    ...payload,
    companyId: scope.companyId,
    providerId: scope.providerId,
    locationId: scope.locationId
  });
  const { data, error } = await supabase.from(table).insert(record).select().single();
  if (error) throw error;
  return data;
}

export function resolveCareVerityApiPersistenceTarget(method: string, pathname: string) {
  const apiPath = pathname.replace(/^\/api/, "") || "/";
  return careverityApiPersistenceTargets.find((target) => target.method === method && target.path === apiPath) ?? null;
}

export async function runProductionPersistenceForApi(method: string, pathname: string, scope: CareVerityProductionTenantScope, payload: Record<string, unknown>) {
  const target = resolveCareVerityApiPersistenceTarget(method, pathname);
  if (!target) {
    return {
      persisted: false,
      productionBlocked: !isProductionDatabaseConfigured(),
      reason: "No persistence target is registered for this API route yet."
    };
  }

  if (method === "GET") {
    return {
      persisted: true,
      table: target.table,
      rows: await listProductionRecords(target.table, scope)
    };
  }

  if (method === "POST") {
    return {
      persisted: true,
      table: target.table,
      record: await insertProductionRecord(target.table, scope, payload)
    };
  }

  return {
    persisted: false,
    table: target.table,
    reason: "PATCH/DELETE database adapters require route-specific update/archive rules before staging UAT."
  };
}

export function createAuditHash(input: Record<string, unknown>) {
  return crypto.createHash("sha256").update(JSON.stringify(input)).digest("hex");
}

export async function recordTamperResistantAuditLog(input: CareVerityAuditWriteInput) {
  assertProductionTenantScope(input.tenant, "write audit log");
  const auditTime = new Date().toISOString();
  const baseAuditRecord = {
    audit_id: `AUD-${crypto.randomUUID()}`,
    company_id: input.tenant.companyId,
    provider_id: input.tenant.providerId,
    location_id: input.tenant.locationId,
    user_id: input.userId,
    user_role: input.userRole,
    action: input.action,
    module: input.module,
    record_type: input.recordType,
    record_id: input.recordId,
    old_value: input.oldValue ?? null,
    new_value: input.newValue ?? null,
    reason: input.reason,
    ip_address: input.ipAddress ?? "ip-address-placeholder",
    device: input.device ?? "device-placeholder",
    locked_at: auditTime,
    integrity_status: "Append-only hash-chain pending database commit"
  };

  const supabase = getProductionServiceClient();
  if (!supabase) {
    return {
      persisted: false,
      productionBlocked: true,
      reason: "Production database is not configured; audit hash preview created only.",
      audit: {
        ...baseAuditRecord,
        previous_event_hash: "database-required",
        event_hash: createAuditHash({ ...baseAuditRecord, previous_event_hash: "database-required" })
      }
    };
  }

  const latestQuery = applyTenantFilters(
    supabase
      .from("audit_logs")
      .select("event_hash")
      .order("created_at", { ascending: false })
      .limit(1),
    input.tenant
  );
  const { data: latest, error: latestError } = await latestQuery;
  if (latestError) throw latestError;

  const previousEventHash = latest?.[0]?.event_hash ?? "genesis";
  const auditRecord = {
    ...baseAuditRecord,
    previous_event_hash: previousEventHash,
    event_hash: createAuditHash({ ...baseAuditRecord, previous_event_hash: previousEventHash }),
    integrity_status: "Append-only"
  };

  const { data, error } = await supabase.from("audit_logs").insert(auditRecord).select().single();
  if (error) throw error;
  return { persisted: true, productionBlocked: false, audit: data };
}

export function evaluateMfaRequirement(role: string, mfaVerified: boolean) {
  const required = productionMfaRequiredRoles.has(role);
  return {
    required,
    passed: !required || mfaVerified,
    reason: required && !mfaVerified ? "MFA is required for admin, super-admin and registered-manager roles." : "MFA requirement satisfied or not required for this role."
  };
}

export function hashPasswordForSelfHostedAuth(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return {
    algorithm: "node-crypto-scrypt-managed-fallback",
    salt,
    hash
  };
}

export function verifyPasswordForSelfHostedAuth(password: string, salt: string, expectedHash: string) {
  const actual = crypto.scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHash, "hex");
  return expected.length === actual.length && crypto.timingSafeEqual(actual, expected);
}

export function createPasswordResetTokenDigest(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function evaluateFixedWindowRateLimit(requestCount: number, maxRequests: number) {
  return {
    allowed: requestCount <= maxRequests,
    requestCount,
    maxRequests,
    retryAfterSeconds: requestCount <= maxRequests ? 0 : Number(process.env.RATE_LIMIT_WINDOW_SECONDS ?? 60)
  };
}

export function getClientNetworkContext(request: NextRequest) {
  return {
    ipAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "ip-address-placeholder",
    userAgent: request.headers.get("user-agent") ?? "user-agent-placeholder"
  };
}

export function buildPrivateStoragePath(scope: CareVerityProductionTenantScope, category: CareVerityPrivateFileCategory, fileName: string) {
  assertProductionTenantScope(scope, "create private storage path");
  if (!privateFileCategories.includes(category)) {
    throw new CareVerityProductionBackendError("Unsupported private file category.", 400);
  }
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  const providerPart = scope.providerId ? `${scope.providerId}/` : "";
  return `${scope.companyId}/${providerPart}${category}/${safeFileName}`;
}

export async function createPrivateFileUploadRequest(scope: CareVerityProductionTenantScope, category: CareVerityPrivateFileCategory, fileName: string) {
  const objectPath = buildPrivateStoragePath(scope, category, fileName);
  const supabase = getProductionServiceClient();
  if (!supabase) {
    return {
      persisted: false,
      productionBlocked: true,
      bucket: privateBucketName,
      objectPath,
      public: false,
      reason: "Supabase private storage is not configured."
    };
  }

  const { data, error } = await supabase.storage.from(privateBucketName).createSignedUploadUrl(objectPath);
  if (error) throw error;
  return {
    persisted: true,
    productionBlocked: false,
    bucket: privateBucketName,
    objectPath,
    public: false,
    signedUpload: data
  };
}

export const clientDocumentAllowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png", ".xls", ".xlsx"] as const;
export const clientDocumentUploadStorageNotConfiguredMessage = "Document storage is not configured. Please connect private storage before uploading live documents.";
export const clientDocumentStorageNotConfiguredErrorCode = "STORAGE_NOT_CONFIGURED";

export type CareVerityClientDocumentRow = {
  id: string;
  document_id?: string;
  company_id: string;
  provider_id?: string | null;
  location_id?: string | null;
  service_user_id: string;
  document_category: string;
  document_title: string;
  document_description?: string | null;
  original_file_name: string;
  stored_file_name?: string | null;
  safe_file_name?: string | null;
  storage_bucket: string;
  storage_path: string;
  mime_type: string;
  file_size_bytes: number;
  restricted: boolean;
  mobile_visible: boolean;
  version_number: number;
  replaced_document_id?: string | null;
  status: "Active" | "Archived" | "Deleted" | string;
  uploaded_by?: string | null;
  uploaded_by_name?: string | null;
  uploaded_by_role?: string | null;
  created_at?: string;
  updated_at?: string;
};

export type CareVerityClientDocumentMetadataInput = {
  scope: CareVerityProductionTenantScope;
  serviceUserId: string;
  documentId: string;
  documentCategory: string;
  documentTitle: string;
  documentDescription?: string;
  originalFileName: string;
  safeFileName: string;
  fileType: string;
  mimeType: string;
  fileSizeBytes: number;
  storagePath: string;
  storageBucket: string;
  version?: number;
  replacedDocumentId?: string;
  restricted: boolean;
  mobileVisible: boolean;
  uploadedBy: string;
  uploadedByName?: string;
  uploadedByRole: string;
  status?: string;
};

export function buildClientDocumentStoragePath(companyId: string, serviceUserId: string, documentId: string, fileName: string) {
  assertProductionTenantScope({ companyId }, "create client document storage path");
  if (!serviceUserId) {
    throw new CareVerityProductionBackendError("serviceUserId is required to create a client document storage path.", 400);
  }
  if (!documentId) {
    throw new CareVerityProductionBackendError("documentId is required to create a client document storage path.", 400);
  }
  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
  return `companies/${companyId}/service-users/${serviceUserId}/documents/${documentId}/${safeFileName}`;
}

export function getClientDocumentsStorageBucket() {
  return process.env.CLIENT_DOCUMENTS_STORAGE_BUCKET || process.env.SUPABASE_CLIENT_DOCUMENTS_BUCKET || process.env.FILE_STORAGE_BUCKET || "client-documents";
}

export function isClientDocumentsStorageConfigured() {
  return Boolean(getProductionServiceClient() && getClientDocumentsStorageBucket());
}

export async function ensureClientDocumentsPrivateBucket() {
  const supabase = getProductionServiceClient();
  const bucket = getClientDocumentsStorageBucket();
  if (!supabase || !bucket) {
    throw new CareVerityProductionBackendError(clientDocumentUploadStorageNotConfiguredMessage, 503);
  }

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) throw listError;
  const exists = buckets?.some((item) => item.name === bucket);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(bucket, {
      public: false,
      fileSizeLimit: Number(process.env.CLIENT_DOCUMENT_MAX_UPLOAD_MB ?? 25) * 1024 * 1024,
      allowedMimeTypes: [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      ]
    });
    if (createError) throw createError;
  }

  return { bucket, public: false };
}

export function userCanReadClientDocument(input: {
  userRole: string;
  serviceUserId: string;
  restricted: boolean;
  mobileVisible: boolean;
  assignedServiceUsersHeader?: string | null;
  inspectionScopeHeader?: string | null;
  hasReadPermission: boolean;
  hasRestrictedPermission: boolean;
}) {
  if (input.userRole === "System Owner" || input.userRole === "Super Admin") {
    return { ok: true as const, reason: "System owner/super admin access permitted." };
  }

  if (input.userRole === "Care Worker") {
    const assignedServiceUsers = (input.assignedServiceUsersHeader ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);
    if (!input.mobileVisible) return { ok: false as const, status: 403, reason: "Document is not visible in the mobile app." };
    if (input.restricted) return { ok: false as const, status: 403, reason: "Restricted documents are not available to care workers unless separately authorised." };
    if (!assignedServiceUsers.includes(input.serviceUserId)) {
      return { ok: false as const, status: 403, reason: "Care worker is not assigned to this service user." };
    }
    return { ok: true as const, reason: "Assigned mobile-visible document access permitted." };
  }

  if (input.userRole === "Inspector Read Only") {
    const scope = (input.inspectionScopeHeader ?? "").split(",").map((value) => value.trim());
    if (!scope.includes(input.serviceUserId) && !scope.includes("client-documents")) {
      return { ok: false as const, status: 403, reason: "Document is not included in approved inspection access scope." };
    }
    return { ok: true as const, reason: "Approved inspection-scope read access permitted." };
  }

  if (!input.hasReadPermission) return { ok: false as const, status: 403, reason: "Role is not authorised to read client documents." };
  if (input.restricted && !input.hasRestrictedPermission) return { ok: false as const, status: 403, reason: "Role is not authorised to read restricted client documents." };
  return { ok: true as const, reason: "Role-based document read permitted." };
}

export async function archiveClientDocumentForReplacement(input: {
  scope: CareVerityProductionTenantScope;
  replacedDocumentId: string;
  replacementReason: string;
  userId: string;
}) {
  const supabase = getProductionServiceClient();
  if (!supabase) {
    throw new CareVerityProductionBackendError("Production database is not configured. Client document replacement requires database metadata persistence.");
  }

  const { data, error } = await supabase
    .from("client_documents")
    .select("id, document_id, company_id, provider_id, location_id, service_user_id, version_number, status")
    .eq("company_id", input.scope.companyId)
    .or(`id.eq.${input.replacedDocumentId},document_id.eq.${input.replacedDocumentId}`)
    .maybeSingle();

  if (error) throw error;
  if (!data) {
    throw new CareVerityProductionBackendError("Document to replace was not found inside the authenticated company tenant.", 404);
  }

  const priorDocument = data as CareVerityClientDocumentRow;
  const archivedAt = new Date().toISOString();
  const { error: updateError } = await supabase
    .from("client_documents")
    .update({
      status: "Archived",
      archive_reason: input.replacementReason,
      archived_by: input.userId,
      archived_at: archivedAt,
      updated_by: input.userId,
      updated_at: archivedAt
    })
    .eq("company_id", input.scope.companyId)
    .eq("id", priorDocument.id);

  if (updateError) throw updateError;

  return {
    priorDocument,
    nextVersionNumber: Number(priorDocument.version_number || 1) + 1
  };
}

export async function createClientDocumentMetadata(input: CareVerityClientDocumentMetadataInput) {
  const record = await insertProductionRecord("client_documents", input.scope, {
    id: input.documentId,
    documentId: input.documentId,
    serviceUserId: input.serviceUserId,
    documentCategory: input.documentCategory,
    documentTitle: input.documentTitle,
    documentDescription: input.documentDescription ?? "",
    originalFileName: input.originalFileName,
    safeFileName: input.safeFileName,
    storedFileName: input.safeFileName,
    fileType: input.fileType,
    mimeType: input.mimeType,
    fileSizeBytes: input.fileSizeBytes,
    storagePath: input.storagePath,
    storageBucket: input.storageBucket,
    version: input.version ?? 1,
    versionNumber: input.version ?? 1,
    replacedDocumentId: input.replacedDocumentId,
    restricted: input.restricted,
    mobileVisible: input.mobileVisible,
    uploadedBy: input.uploadedBy,
    uploadedByUserId: input.uploadedBy,
    uploadedByName: input.uploadedByName,
    uploadedByRole: input.uploadedByRole,
    uploadedAt: new Date().toISOString(),
    status: input.status ?? "Active",
    createdBy: input.uploadedBy,
    updatedBy: input.uploadedBy
  });

  return record;
}

export async function createClientDocumentAuditEvent(input: {
  scope: CareVerityProductionTenantScope;
  serviceUserId: string;
  clientDocumentId: string;
  action: string;
  userId: string;
  userRole: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string;
  ipAddress?: string;
  device?: string;
}) {
  const record = await insertProductionRecord("client_document_audit_events", input.scope, {
    serviceUserId: input.serviceUserId,
    clientDocumentId: input.clientDocumentId,
    action: input.action,
    userId: input.userId,
    userRole: input.userRole,
    oldValue: input.oldValue ?? null,
    newValue: input.newValue ?? null,
    reason: input.reason,
    ipAddress: input.ipAddress ?? "ip-address-placeholder",
    device: input.device ?? "device-placeholder"
  });
  return record;
}

export async function getBackupRestoreStatus(scope: CareVerityProductionTenantScope) {
  assertProductionTenantScope(scope, "read backup restore status");
  const supabase = getProductionServiceClient();
  if (!supabase) {
    return {
      configured: false,
      lastBackup: null,
      lastRestoreTest: null,
      retentionStatus: "Blocked until BACKUP_STORAGE and Supabase service role are configured.",
      encryptedDailyBackupsRequired: true
    };
  }

  const { data, error } = await applyTenantFilters(
    supabase
      .from("backup_restore_tests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1),
    scope
  );
  if (error) throw error;
  return {
    configured: true,
    lastBackup: null,
    lastRestoreTest: data?.[0] ?? null,
    retentionStatus: data?.[0]?.test_result === "Pass" ? "Restore test evidence recorded." : "Restore test not yet passed.",
    encryptedDailyBackupsRequired: true
  };
}

export function getLiveReadinessDecision(evidence: Record<string, "Pass" | "Partial" | "Blocked" | "Not tested">) {
  const blockers = productionLiveReadinessAreas.filter((area) => evidence[area] !== "Pass");
  return {
    readyForLiveCareRecords: blockers.length === 0,
    blockers,
    decision:
      blockers.length === 0
        ? "Ready for controlled live-readiness sign-off, subject to governance approval."
        : "Not ready for live care records. Resolve or risk-assess all blockers before go-live."
  };
}
