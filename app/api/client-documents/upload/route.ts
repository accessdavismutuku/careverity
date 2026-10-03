import { NextResponse, type NextRequest } from "next/server";
import {
  createAuditEnvelope,
  getRequestContext,
  roleHasPermission,
  validateTenantBoundary
} from "@/lib/careverity-backend-security";
import {
  archiveClientDocumentForReplacement,
  buildClientDocumentStoragePath,
  clientDocumentAllowedExtensions,
  clientDocumentStorageNotConfiguredErrorCode,
  clientDocumentUploadStorageNotConfiguredMessage,
  createClientDocumentAuditEvent,
  createClientDocumentMetadata,
  ensureClientDocumentsPrivateBucket,
  getClientNetworkContext,
  getClientDocumentsStorageBucket,
  getProductionServiceClient,
  recordTamperResistantAuditLog
} from "@/lib/careverity-production-backend";

export const runtime = "nodejs";

const maxClientDocumentUploadMb = Number(process.env.CLIENT_DOCUMENT_MAX_UPLOAD_MB ?? 25);

function stringFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function booleanFormValue(value: FormDataEntryValue | null) {
  return value === "true" || value === "on" || value === "yes" || value === "1";
}

function clientDocumentExtension(fileName: string) {
  const dotIndex = fileName.lastIndexOf(".");
  return dotIndex >= 0 ? fileName.slice(dotIndex).toLowerCase() : "";
}

function safeClientDocumentFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-");
}

async function validateServiceUserTenant(supabase: NonNullable<ReturnType<typeof getProductionServiceClient>>, serviceUserId: string, companyId: string) {
  const { data, error } = await supabase
    .from("service_users")
    .select("id, company_id, provider_id, archived_at")
    .eq("id", serviceUserId)
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) throw error;
  if (!data || data.archived_at) {
    return {
      ok: false as const,
      status: 404,
      error: "Service user record was not found inside the authenticated company tenant."
    };
  }

  return { ok: true as const, serviceUser: data };
}

export async function POST(request: NextRequest) {
  const context = getRequestContext(request);
  const network = getClientNetworkContext(request);

  if (!context.authenticated) {
    const audit = createAuditEnvelope(request, context, "client document upload denied", "Client Documents", false, "Authentication required");
    return NextResponse.json({ error: "Authentication required.", safeMessage: "Sign in before uploading client documents.", audit }, { status: 401 });
  }

  if (!roleHasPermission(context.userRole, "client_documents:upload")) {
    const audit = createAuditEnvelope(request, context, "client document upload denied", "Client Documents", false, "Role permission denied");
    return NextResponse.json(
      {
        error: "Role not permitted.",
        safeMessage: "Your role is not authorised to upload client documents.",
        requiredPermission: "client_documents:upload",
        audit
      },
      { status: 403 }
    );
  }

  const formData = await request.formData();
  const companyId = stringFormValue(formData.get("companyId")) || context.companyId;
  const providerId = stringFormValue(formData.get("providerId")) || context.providerId;
  const locationId = stringFormValue(formData.get("locationId")) || context.locationId;
  const serviceUserId = stringFormValue(formData.get("serviceUserId"));
  const documentCategory = stringFormValue(formData.get("documentCategory"));
  const documentTitle = stringFormValue(formData.get("documentTitle"));
  const documentDescription = stringFormValue(formData.get("documentDescription"));
  const restricted = booleanFormValue(formData.get("restricted"));
  const mobileVisible = booleanFormValue(formData.get("mobileVisible"));
  const replacedDocumentId = stringFormValue(formData.get("replacedDocumentId")) || undefined;
  const replacementReason = stringFormValue(formData.get("replacementReason"));
  const filePart = formData.get("file");

  const tenantCheck = validateTenantBoundary(context, companyId);
  if (!tenantCheck.ok) {
    const audit = createAuditEnvelope(request, context, "client document tenant boundary denied", "Client Documents", false, tenantCheck.error);
    return NextResponse.json({ error: tenantCheck.error, safeMessage: "Company documents cannot be uploaded outside the authenticated company context.", audit }, { status: tenantCheck.status });
  }

  if (!companyId) {
    return NextResponse.json({ error: "companyId is required.", safeMessage: "Select a company/provider before uploading a client document." }, { status: 400 });
  }
  if (!serviceUserId) {
    return NextResponse.json({ error: "serviceUserId is required.", safeMessage: "Select a valid service user before uploading a client document." }, { status: 400 });
  }
  if (!documentCategory) {
    return NextResponse.json({ error: "documentCategory is required.", safeMessage: "Choose a document category before uploading." }, { status: 400 });
  }
  if (!documentTitle) {
    return NextResponse.json({ error: "documentTitle is required.", safeMessage: "Enter a document title before uploading." }, { status: 400 });
  }
  if (!(filePart instanceof File)) {
    return NextResponse.json({ error: "file is required.", safeMessage: "Choose a file before uploading a client document." }, { status: 400 });
  }

  const extension = clientDocumentExtension(filePart.name);
  if (!clientDocumentAllowedExtensions.includes(extension as (typeof clientDocumentAllowedExtensions)[number])) {
    return NextResponse.json(
      {
        error: "Unsupported file type.",
        safeMessage: "File type not allowed. Allowed file types: PDF, Word, image and Excel files only.",
        allowedFileTypes: clientDocumentAllowedExtensions
      },
      { status: 415 }
    );
  }

  if (filePart.size > maxClientDocumentUploadMb * 1024 * 1024) {
    return NextResponse.json(
      {
        error: "File too large.",
        safeMessage: `File is too large. Maximum upload size is ${maxClientDocumentUploadMb} MB.`,
        maxUploadMb: maxClientDocumentUploadMb
      },
      { status: 413 }
    );
  }

  if (replacedDocumentId && !replacementReason) {
    return NextResponse.json(
      {
        ok: false,
        errorCode: "REPLACEMENT_REASON_REQUIRED",
        error: "Replacement reason required.",
        safeMessage: "Enter a reason before replacing a client document."
      },
      { status: 400 }
    );
  }

  const storageBucket = getClientDocumentsStorageBucket();
  const supabase = getProductionServiceClient();
  if (!supabase || !storageBucket) {
    const audit = createAuditEnvelope(request, context, "client document upload blocked", "Client Documents", false, "Private storage not configured");
    return NextResponse.json(
      {
        ok: false,
        errorCode: clientDocumentStorageNotConfiguredErrorCode,
        error: "Document storage unavailable.",
        safeMessage: clientDocumentUploadStorageNotConfiguredMessage,
        storageConfigured: false,
        audit
      },
      { status: 503 }
    );
  }

  const serviceUserCheck = await validateServiceUserTenant(supabase, serviceUserId, companyId);
  if (!serviceUserCheck.ok) {
    const audit = createAuditEnvelope(request, context, "client document service user validation failed", "Client Documents", false, serviceUserCheck.error);
    return NextResponse.json({ error: serviceUserCheck.error, safeMessage: "The service user must belong to the authenticated company.", audit }, { status: serviceUserCheck.status });
  }

  const documentId = crypto.randomUUID();
  const safeFileName = safeClientDocumentFileName(filePart.name);
  const storagePath = buildClientDocumentStoragePath(companyId, serviceUserId, documentId, safeFileName);
  const fileBuffer = Buffer.from(await filePart.arrayBuffer());

  await ensureClientDocumentsPrivateBucket();

  const { error: uploadError } = await supabase.storage.from(storageBucket).upload(storagePath, fileBuffer, {
    contentType: filePart.type || "application/octet-stream",
    upsert: false
  });

  if (uploadError) {
    const audit = createAuditEnvelope(request, context, "client document storage upload failed", "Client Documents", false, uploadError.message);
    return NextResponse.json({ error: "Document upload failed.", safeMessage: uploadError.message, audit }, { status: 502 });
  }

  const replacement = replacedDocumentId
    ? await archiveClientDocumentForReplacement({
        scope: { companyId, providerId, locationId },
        replacedDocumentId,
        replacementReason,
        userId: context.userId || "unknown-user"
      })
    : null;

  const documentRecord = await createClientDocumentMetadata({
    scope: { companyId, providerId, locationId },
    serviceUserId,
    documentId,
    documentCategory,
    documentTitle,
    documentDescription,
    originalFileName: filePart.name,
    safeFileName,
    fileType: extension.replace(".", "").toUpperCase(),
    mimeType: filePart.type || "application/octet-stream",
    fileSizeBytes: filePart.size,
    storagePath,
    storageBucket,
    version: replacement?.nextVersionNumber ?? 1,
    replacedDocumentId,
    restricted,
    mobileVisible,
    uploadedBy: context.userId || "unknown-user",
    uploadedByName: request.headers.get("x-careverity-user-name") ?? context.userId,
    uploadedByRole: context.userRole,
    status: "Active"
  });

  const documentAudit = await createClientDocumentAuditEvent({
    scope: { companyId, providerId, locationId },
    serviceUserId,
    clientDocumentId: documentId,
    action: replacedDocumentId ? "replace" : "upload",
    userId: context.userId || "unknown-user",
    userRole: context.userRole,
    oldValue: replacement?.priorDocument ?? null,
    newValue: {
      documentId,
      documentCategory,
      documentTitle,
      restricted,
      mobileVisible,
      storagePath,
      versionNumber: replacement?.nextVersionNumber ?? 1
    },
    reason: replacementReason || "New client document uploaded.",
    ipAddress: network.ipAddress,
    device: network.userAgent
  });

  const persistentAudit = await recordTamperResistantAuditLog({
    tenant: { companyId, providerId, locationId },
    userId: context.userId || "unknown-user",
    userRole: context.userRole,
    action: "client document uploaded",
    module: "Client Documents",
    recordType: "ClientDocument",
    recordId: documentId,
    oldValue: null,
    newValue: {
      serviceUserId,
      documentCategory,
      documentTitle,
      restricted,
      mobileVisible,
      storagePath,
      storageBucket,
      public: false
    },
    reason: replacedDocumentId ? replacementReason : "New client document uploaded.",
    ipAddress: network.ipAddress,
    device: network.userAgent
  });

  return NextResponse.json(
    {
      ok: true,
      document: documentRecord,
      storage: {
        bucket: storageBucket,
        path: storagePath,
        public: false
      },
      audit: persistentAudit,
      documentAudit
    },
    { status: 201, headers: { "Cache-Control": "no-store", "X-CareVerity-Tenant": companyId } }
  );
}
