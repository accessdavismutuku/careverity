import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const uiSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");
const uploadRouteSource = await readFile(new URL("../app/api/client-documents/upload/route.ts", import.meta.url), "utf8");
const signedUrlRouteSource = await readFile(new URL("../app/api/client-documents/[documentId]/signed-url/route.ts", import.meta.url), "utf8");
const backendSecuritySource = await readFile(new URL("../lib/careverity-backend-security.ts", import.meta.url), "utf8");
const productionBackendSource = await readFile(new URL("../lib/careverity-production-backend.ts", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const stagingCheckSource = await readFile(new URL("../scripts/careverity-staging-readiness.mjs", import.meta.url), "utf8");

function expectText(source, text) {
  assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

test("client documents tab exposes a working upload surface", () => {
  [
    "Upload Document",
    "Document upload is in demo/scaffold mode. Private storage and database persistence must be configured before uploading live client documents.",
    "Drag and drop a document here, or click to choose a file",
    "type=\"file\"",
    "accept={clientDocumentAccept}",
    "Document category",
    "Document title",
    "Description / notes",
    "Restricted document",
    "Visible in mobile app",
    "Upload progress",
    "Uploaded Documents",
    "No documents uploaded yet. Use Upload Document to add client documents.",
    "View",
    "Download",
    "Replace",
    "Archive",
    "Delete",
    "Audit"
  ].forEach((text) => expectText(uiSource, text));
});

test("client document upload supports requested categories, file types and size limit", () => {
  [
    "Care Plan",
    "Risk Assessment",
    "MAR / Medication",
    "Controlled Medication",
    "Hospital Discharge",
    "Local Authority Referral",
    "Social Services Assessment",
    "GP Letter",
    "District Nurse Note",
    "OT Report",
    "Mental Health Team Letter",
    "Safeguarding",
    "Complaint",
    "Compliment",
    "Body Chart / Skin Evidence",
    "Consent / Agreement",
    "Other",
    ".pdf",
    ".doc",
    ".docx",
    ".jpg",
    ".jpeg",
    ".png",
    ".xls",
    ".xlsx",
    "clientDocumentMaxUploadMb = 25"
  ].forEach((text) => expectText(uiSource + productionBackendSource, text));
});

test("client document production endpoint enforces auth, RBAC, tenant, service-user and storage guards", () => {
  [
    "roleHasPermission(context.userRole, \"client_documents:upload\")",
    "validateTenantBoundary(context, companyId)",
    "validateServiceUserTenant",
    "service_users",
    "clientDocumentAllowedExtensions",
    "maxClientDocumentUploadMb",
    "File type not allowed. Allowed file types: PDF, Word, image and Excel files only.",
    "Document storage is not configured. Please connect private storage before uploading live documents.",
    "STORAGE_NOT_CONFIGURED",
    "getClientDocumentsStorageBucket",
    "ensureClientDocumentsPrivateBucket",
    "supabase.storage.from(storageBucket).upload",
    "buildClientDocumentStoragePath(companyId, serviceUserId, documentId, safeFileName)",
    "archiveClientDocumentForReplacement",
    "replacementReason",
    "versionNumber: replacement?.nextVersionNumber ?? 1",
    "createClientDocumentMetadata",
    "createClientDocumentAuditEvent",
    "recordTamperResistantAuditLog",
    "public: false"
  ].forEach((text) => expectText(uploadRouteSource + productionBackendSource, text));
});

test("client document signed-read endpoint enforces tenant, role, restricted and mobile access", () => {
  [
    "GET(request: NextRequest",
    "client_documents",
    "createSignedUrl(document.storage_path",
    "x-careverity-assigned-service-users",
    "x-careverity-inspection-scope",
    "userCanReadClientDocument",
    "client_documents:read",
    "client_documents:read_restricted",
    "DOCUMENT_ACCESS_DENIED",
    "TENANT_MISMATCH",
    "STORAGE_NOT_CONFIGURED",
    "createClientDocumentAuditEvent",
    "recordTamperResistantAuditLog",
    "Client document ${action} signed URL created."
  ].forEach((text) => expectText(signedUrlRouteSource + productionBackendSource, text));
});

test("client document permissions are role-scoped and inspector/mobile access is limited", () => {
  [
    "/client-documents/upload",
    "/client-documents/:documentId/signed-url",
    "client document uploaded",
    "client document signed URL requested",
    "client_documents:upload",
    "client_documents:replace",
    "client_documents:archive",
    "client_documents:delete",
    "client_documents:read_mobile_visible",
    "client_documents:read_inspection_scope",
    "client_documents:read_restricted",
    "Registered Manager",
    "Company Admin",
    "Care Coordinator",
    "Supervisor",
    "Compliance Manager",
    "Inspector Read Only"
  ].forEach((text) => expectText(backendSecuritySource, text));
});

test("client document database model is tenant-scoped, private-storage ready and audited", () => {
  [
    "create table if not exists public.client_documents",
    "document_id uuid not null unique",
    "company_id uuid not null",
    "provider_id uuid",
    "location_id uuid",
    "service_user_id uuid not null references public.service_users(id)",
    "document_category text not null",
    "document_title text not null",
    "document_description text",
    "original_file_name text not null",
    "safe_file_name text not null",
    "stored_file_name text",
    "file_type text not null",
    "mime_type text not null",
    "file_size_bytes bigint not null",
    "storage_bucket text not null",
    "storage_path text not null",
    "version integer not null default 1",
    "version_number integer not null default 1",
    "replaced_document_id uuid references public.client_documents(id)",
    "restricted boolean not null default false",
    "mobile_visible boolean not null default false",
    "uploaded_by uuid",
    "uploaded_by_user_id uuid",
    "uploaded_at timestamptz not null default now()",
    "create table if not exists public.client_document_audit_events",
    "protect_client_document_audit_events",
    "client-documents",
    "careverity_client_documents_storage_select",
    "careverity_client_documents_storage_insert",
    "careverity_client_documents_storage_update",
    "idx_client_documents_tenant",
    "idx_client_document_audit_tenant",
    "alter table public.client_documents enable row level security",
    "alter table public.client_document_audit_events enable row level security"
  ].forEach((text) => expectText(schemaSource, text));
});

test("client document private storage path follows the required tenant folder format", () => {
  expectText(
    productionBackendSource,
    "companies/${companyId}/service-users/${serviceUserId}/documents/${documentId}/${safeFileName}"
  );
});

test("staging readiness checks client document table and private storage bucket", () => {
  [
    "[\"clientDocuments\", \"client_documents\"]",
    "[\"clientDocumentAuditEvents\", \"client_document_audit_events\"]",
    "clientDocumentsBucket",
    "expectedName: \"client-documents\"",
    "clientDocumentsBucket?.ok === false"
  ].forEach((text) => expectText(stagingCheckSource, text));
});
