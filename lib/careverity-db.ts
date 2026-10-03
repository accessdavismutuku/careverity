"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type CareVerityDbMode = "demo" | "database";

export type CareVerityProviderInput = {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  companyName: string;
  tradingName?: string;
  cqcProviderId?: string;
  cqcLocationId?: string;
  registeredManagerName?: string;
  registeredManagerEmail?: string;
  migrationStatus?: string;
  companyStatus?: string;
};

export type CareVerityStaffInput = Record<string, unknown> & {
  id?: string;
  companyId?: string;
  providerId?: string;
  locationId?: string;
  staffReference?: string;
  firstName?: string;
  surname?: string;
};

export type CareVerityServiceUserInput = Record<string, unknown> & {
  id?: string;
  companyId?: string;
  providerId?: string;
  locationId?: string;
  serviceUserReference?: string;
  firstName?: string;
  surname?: string;
};

export type CareVerityCallPackageInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
};

export type CareVerityShiftInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
};

export type CareVerityJournalInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
};

export type CareVerityAuditInput = {
  companyId?: string;
  providerId?: string;
  userId?: string;
  userRole?: string;
  action: string;
  module: string;
  recordType: string;
  recordId?: string;
  oldValue?: unknown;
  newValue?: unknown;
  reason?: string;
};

export type CareVerityImportBatchInput = {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  importType: "staff" | "service-users" | string;
  fileName: string;
  status?: string;
  totalRecords?: number;
  successfulRecords?: number;
  failedRecords?: number;
  duplicateRecords?: number;
};

export type CareVerityCompanySubscriptionInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  subscriptionPlan: string;
  subscriptionStatus?: string;
};

export type CareVerityCompanyFeatureFlagInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  featureKey: string;
  enabled: boolean;
};

export type CareVerityAiUsageEventInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  userId?: string;
  module: string;
  action: string;
  aiProvider?: string;
  aiModel?: string;
  inputTokens?: number;
  outputTokens?: number;
  estimatedCostGbp?: number;
  purpose?: string;
};

export type CareVerityPerformanceEventInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  environmentName: string;
  routePath: string;
  module: string;
  metricName: string;
  durationMs?: number;
  statusCode?: number;
  success?: boolean;
};

export type CareVerityStaffSupportIndicatorInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  staffId: string;
  ragStatus: "Green" | "Amber" | "Red" | string;
};

export type CareVerityStaffSupportActionInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  staffId: string;
  sourceIndicatorId?: string;
  actionType: string;
};

export type CareVerityKpiSnapshotInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  snapshotId?: string;
  periodStart: string;
  periodEnd: string;
  overallRag: string;
};

export type CareVerityKpiMetricInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  snapshotId: string;
  metricName: string;
  ragStatus: string;
};

export type CareVerityKpiActionInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  snapshotId: string;
  actionRequired: string;
  assignedToUserId?: string;
  assignedToName?: string;
};

export type CareVerityKpiInsightInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  snapshotId: string;
  insightType: string;
  approvalRequired?: boolean;
};

export type CareVerityCoordinatorActionTrackingInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  coordinatorId: string;
  sourceType: string;
  sourceRecordId: string;
  dueAt: string;
  status: string;
};

export type CareVerityLqcsAssessmentSourceInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  serviceUserId?: string;
  sourceType: string;
  sourceReference: string;
  reliabilityStatus: string;
};

export type CareVerityLqcsCarePlanDraftInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  serviceUserId?: string;
  draftReference: string;
  status?: string;
};

export type CareVerityLqcsReviewCheckerIssueInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  serviceUserId?: string;
  draftId?: string;
  sectionName: string;
  issue: string;
  status?: string;
};

export type CareVerityLqcsProfessionalReferralDraftInput = Record<string, unknown> & {
  companyId?: string;
  providerId?: string;
  locationId?: string;
  serviceUserId?: string;
  draftId?: string;
  referralType: string;
  approvalStatus?: string;
};

const demoProviderStorageKey = "careverity-company-onboarding-companies";
const demoStaffStorageKey = "careverity-demo-staff";
const demoServiceUserStorageKey = "careverity-demo-clients";
const demoCallPackageStorageKey = "careverity-demo-call-packages";
const demoLiveEcmStorageKey = "careverity-demo-live-ecm-records";
const demoJournalStorageKey = "careverity-demo-journal";
const demoAuditStorageKey = "careverity-company-onboarding-audit";
const demoImportBatchStorageKey = "careverity-company-onboarding-import-batches";
const demoSubscriptionStorageKey = "careverity-demo-company-subscriptions";
const demoFeatureFlagStorageKey = "careverity-demo-company-feature-flags";
const demoAiUsageStorageKey = "careverity-demo-ai-usage-events";
const demoPerformanceStorageKey = "careverity-demo-performance-events";
const demoStaffSupportIndicatorStorageKey = "careverity-demo-staff-support-indicators";
const demoStaffSupportActionStorageKey = "careverity-demo-staff-support-actions";
const demoStaffSupportAiDraftStorageKey = "careverity-demo-staff-support-ai-drafts";
const demoKpiSnapshotStorageKey = "careverity-demo-kpi-snapshots";
const demoKpiMetricStorageKey = "careverity-demo-kpi-metrics";
const demoKpiActionStorageKey = "careverity-demo-kpi-actions";
const demoKpiInsightStorageKey = "careverity-demo-kpi-insights";
const demoCoordinatorActionTrackingStorageKey = "careverity-demo-coordinator-action-tracking";
const demoLqcsAssessmentSourceStorageKey = "careverity-demo-lqcs-assessment-sources";
const demoLqcsCarePlanDraftStorageKey = "careverity-demo-lqcs-care-plan-drafts";
const demoLqcsReviewCheckerIssueStorageKey = "careverity-demo-lqcs-review-checker-issues";
const demoLqcsProfessionalReferralDraftStorageKey = "careverity-demo-lqcs-professional-referral-drafts";
const demoLqcsDraftAuditEventStorageKey = "careverity-demo-lqcs-draft-audit-events";

export const tenantQueryWarning =
  "Never query staff, service users, MAR, rota, documents, journal, invoices, reports or audit logs without filtering by company_id/provider_id.";

export function getCareVerityDbMode(): CareVerityDbMode {
  return process.env.NEXT_PUBLIC_DEMO_MODE === "false" ? "database" : "demo";
}

export function isCareVeritySupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export type CareVerityTenantScope = { companyId?: string; providerId?: string; locationId?: string };

const tenantScopedDatabaseTables = new Set([
  "provider_locations",
  "users",
  "role_permissions",
  "staff",
  "staff_documents",
  "service_users",
  "service_user_documents",
  "care_plans",
  "risk_assessments",
  "call_packages",
  "shifts",
  "rota_allocations",
  "live_ecm_records",
  "normal_mar_records",
  "controlled_drugs_mar_records",
  "medication_records",
  "medication_audit",
  "client_journal",
  "staff_journal",
  "tagged_tasks",
  "training_courses",
  "training_assignments",
  "certificates",
  "company_import_batches",
  "import_validation_rows",
  "invoices",
  "family_portal_access",
  "audit_logs",
  "system_settings",
  "backup_export_logs",
  "company_subscriptions",
  "company_feature_flags",
  "ai_usage_events",
  "performance_events",
  "staff_support_indicators",
  "staff_support_actions",
  "staff_support_evidence_links",
  "staff_support_ai_drafts",
  "kpi_snapshots",
  "kpi_metrics",
  "kpi_actions",
  "kpi_insights",
  "coordinator_action_tracking",
  "lqcs_assessment_sources",
  "lqcs_face_to_face_assessments",
  "lqcs_care_plan_drafts",
  "lqcs_care_domain_drafts",
  "lqcs_review_checker_issues",
  "lqcs_professional_referral_drafts",
  "lqcs_draft_audit_events",
  "tenant_access_test_runs",
  "saas_load_test_runs"
]);

export function getCareVerityProductionHardStops() {
  const hardStops: string[] = [];
  const databaseMode = getCareVerityDbMode() === "database";

  if (!databaseMode) {
    hardStops.push("NEXT_PUBLIC_DEMO_MODE is not false. Production cannot use demo/localStorage persistence.");
  }

  if (databaseMode && !isCareVeritySupabaseConfigured()) {
    hardStops.push("Supabase URL and anon key are required before database mode can run.");
  }

  if (process.env.CAREVERITY_MULTI_TENANT_MODE === "false") {
    hardStops.push("CAREVERITY_MULTI_TENANT_MODE must remain enabled for provider-safe SaaS launch.");
  }

  if (process.env.AUDIT_LOG_ENABLED === "false") {
    hardStops.push("AUDIT_LOG_ENABLED must remain enabled for production.");
  }

  return hardStops;
}

export function assertProductionDatabaseReady() {
  const hardStops = getCareVerityProductionHardStops();
  if (getCareVerityDbMode() === "database" && hardStops.length) {
    throw new Error(`CareVerity production database is not ready: ${hardStops.join(" ")}`);
  }
}

export function assertTenantScope(scope: CareVerityTenantScope, action = "access tenant records") {
  if (!scope.companyId || !scope.providerId) {
    throw new Error(`CareVerity tenant scope is required to ${action}. Include companyId and providerId.`);
  }
}

function assertTenantScopeForDatabaseTable(table: string, scope: CareVerityTenantScope) {
  if (getCareVerityDbMode() === "database" && tenantScopedDatabaseTables.has(table)) {
    assertTenantScope(scope, `query ${table}`);
  }
}

export function getCareVerityDatabaseStatus() {
  const mode = getCareVerityDbMode();
  const supabaseConfigured = isCareVeritySupabaseConfigured();
  const hardStops = getCareVerityProductionHardStops();
  return {
    mode,
    demoMode: mode === "demo",
    supabaseConfigured,
    multiTenantMode: process.env.CAREVERITY_MULTI_TENANT_MODE !== "false",
    auditLogEnabled: process.env.AUDIT_LOG_ENABLED !== "false",
    hardStops,
    launchBlocked: hardStops.length > 0,
    message:
      mode === "demo"
        ? "Demo/localStorage mode is active. Supabase queries are prepared but not used."
        : supabaseConfigured
          ? "Database mode is active and Supabase environment placeholders are configured."
          : "Database mode is requested, but Supabase URL/key placeholders are not configured."
  };
}

function getSupabaseClient(): SupabaseClient | null {
  assertProductionDatabaseReady();
  if (getCareVerityDbMode() !== "database" || !isCareVeritySupabaseConfigured()) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "");
}

function readDemoJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeDemoJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
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

// Tenant guard: every database read/write below applies company_id/provider_id filters when a tenant context is supplied.
function applyTenantFilter<T>(query: T, tenant: CareVerityTenantScope): T {
  let next = query;
  const filter = (column: string, value: string) => {
    next = (next as T & { eq: (filterColumn: string, filterValue: string) => T }).eq(column, value);
  };
  if (tenant.companyId) filter("company_id", tenant.companyId);
  if (tenant.providerId) filter("provider_id", tenant.providerId);
  if (tenant.locationId) filter("location_id", tenant.locationId);
  return next;
}

async function insertRecord<TInput extends Record<string, unknown>>(table: string, input: TInput, demoKey: string) {
  assertTenantScopeForDatabaseTable(table, input);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    const current = readDemoJson<Record<string, unknown>[]>(demoKey, []);
    const record = { id: input.id ?? `${table}-${Date.now()}`, ...input, updatedAt: new Date().toISOString() };
    writeDemoJson(demoKey, [record, ...current]);
    return record;
  }

  const { data, error } = await supabase.from(table).insert(toSnakeCasePayload(input)).select().single();
  if (error) throw error;
  return data;
}

async function updateRecord<TInput extends Record<string, unknown>>(table: string, id: string, input: TInput, demoKey: string) {
  assertTenantScopeForDatabaseTable(table, input);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    const current = readDemoJson<Record<string, unknown>[]>(demoKey, []);
    const next = current.map((record) => (record.id === id || record.ref === id ? { ...record, ...input, updatedAt: new Date().toISOString() } : record));
    writeDemoJson(demoKey, next);
    return next.find((record) => record.id === id || record.ref === id);
  }

  const query = applyTenantFilter(supabase.from(table).update(toSnakeCasePayload(input)).eq("id", id), input);
  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}

export async function getCurrentProvider() {
  const providers = await listProviders();
  return providers[0] ?? null;
}

export async function listProviders() {
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoProviderStorageKey, []);
  }

  const { data, error } = await supabase.from("providers").select("*").is("archived_at", null).order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createProvider(provider: CareVerityProviderInput) {
  return insertRecord(
    "providers",
    {
      companyId: provider.companyId,
      providerId: provider.providerId,
      locationId: provider.locationId,
      companyName: provider.companyName,
      tradingName: provider.tradingName,
      cqcProviderId: provider.cqcProviderId,
      status: provider.companyStatus ?? "Draft",
      migrationStatus: provider.migrationStatus ?? "Data import pending",
      registeredManagerName: provider.registeredManagerName,
      registeredManagerEmail: provider.registeredManagerEmail
    },
    demoProviderStorageKey
  );
}

export async function listStaff(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("staff", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoStaffStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("staff").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createStaff(staff: CareVerityStaffInput) {
  return insertRecord("staff", staff, demoStaffStorageKey);
}

export async function updateStaff(id: string, staff: CareVerityStaffInput) {
  return updateRecord("staff", id, staff, demoStaffStorageKey);
}

export async function listServiceUsers(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("service_users", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoServiceUserStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("service_users").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createServiceUser(serviceUser: CareVerityServiceUserInput) {
  return insertRecord("service_users", serviceUser, demoServiceUserStorageKey);
}

export async function updateServiceUser(id: string, serviceUser: CareVerityServiceUserInput) {
  return updateRecord("service_users", id, serviceUser, demoServiceUserStorageKey);
}

export async function listCallPackages(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("call_packages", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoCallPackageStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("call_packages").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createCallPackage(callPackage: CareVerityCallPackageInput) {
  return insertRecord("call_packages", callPackage, demoCallPackageStorageKey);
}

export async function createShift(shift: CareVerityShiftInput) {
  return insertRecord("shifts", shift, "careverity-demo-shifts");
}

export async function allocateShift(allocation: CareVerityShiftInput) {
  return insertRecord("rota_allocations", allocation, "careverity-demo-rota-allocations");
}

export async function listLiveECMRecords(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("live_ecm_records", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoLiveEcmStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("live_ecm_records").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createJournalEntry(entry: CareVerityJournalInput) {
  return insertRecord("client_journal", entry, demoJournalStorageKey);
}

export async function createAuditLog(entry: CareVerityAuditInput) {
  return insertRecord(
    "audit_logs",
    {
      audit_id: `AUD-${Date.now()}`,
      companyId: entry.companyId,
      providerId: entry.providerId,
      userId: entry.userId,
      userRole: entry.userRole,
      action: entry.action,
      module: entry.module,
      recordType: entry.recordType,
      recordId: entry.recordId,
      oldValue: entry.oldValue,
      newValue: entry.newValue,
      reason: entry.reason,
      ipAddress: "ip-address-placeholder",
      device: "device-placeholder"
    },
    demoAuditStorageKey
  );
}

export async function uploadDocumentPlaceholder(input: Record<string, unknown>) {
  return insertRecord("staff_documents", { ...input, storageStatus: "placeholder-no-file-uploaded" }, "careverity-demo-document-placeholders");
}

export async function listImportBatches(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("company_import_batches", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoImportBatchStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("company_import_batches").select("*"), tenant);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createImportBatch(batch: CareVerityImportBatchInput) {
  return insertRecord(
    "company_import_batches",
    {
      companyId: batch.companyId,
      providerId: batch.providerId,
      locationId: batch.locationId,
      importType: batch.importType,
      uploadedFileName: batch.fileName,
      status: batch.status ?? "Uploaded",
      totalRecords: batch.totalRecords ?? 0,
      successfulRecords: batch.successfulRecords ?? 0,
      failedRecords: batch.failedRecords ?? 0,
      duplicateRecords: batch.duplicateRecords ?? 0
    },
    demoImportBatchStorageKey
  );
}

export async function listCompanyFeatureFlags(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("company_feature_flags", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoFeatureFlagStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("company_feature_flags").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("feature_key", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createCompanySubscription(subscription: CareVerityCompanySubscriptionInput) {
  return insertRecord(
    "company_subscriptions",
    {
      ...subscription,
      subscriptionStatus: subscription.subscriptionStatus ?? "trial"
    },
    demoSubscriptionStorageKey
  );
}

export async function upsertCompanyFeatureFlag(flag: CareVerityCompanyFeatureFlagInput) {
  return insertRecord(
    "company_feature_flags",
    {
      ...flag,
      rolloutStatus: flag.enabled ? "enabled" : "disabled"
    },
    demoFeatureFlagStorageKey
  );
}

export async function recordAiUsageEvent(event: CareVerityAiUsageEventInput) {
  return insertRecord(
    "ai_usage_events",
    {
      ...event,
      approvalRequired: event.approvalRequired ?? true
    },
    demoAiUsageStorageKey
  );
}

export async function recordPerformanceEvent(event: CareVerityPerformanceEventInput) {
  return insertRecord(
    "performance_events",
    {
      ...event,
      success: event.success ?? true
    },
    demoPerformanceStorageKey
  );
}

export async function listStaffSupportIndicators(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("staff_support_indicators", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoStaffSupportIndicatorStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("staff_support_indicators").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("last_calculated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createStaffSupportIndicator(indicator: CareVerityStaffSupportIndicatorInput) {
  return insertRecord("staff_support_indicators", indicator, demoStaffSupportIndicatorStorageKey);
}

export async function createStaffSupportAction(action: CareVerityStaffSupportActionInput) {
  return insertRecord("staff_support_actions", action, demoStaffSupportActionStorageKey);
}

export async function recordStaffSupportAiDraft(draft: Record<string, unknown> & CareVerityTenantScope) {
  return insertRecord(
    "staff_support_ai_drafts",
    {
      ...draft,
      approvalRequired: draft.approvalRequired ?? true,
      status: draft.status ?? "Draft - approval required"
    },
    demoStaffSupportAiDraftStorageKey
  );
}

export async function listKpiSnapshots(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("kpi_snapshots", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoKpiSnapshotStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("kpi_snapshots").select("*").is("deleted_at", null), tenant);
  const { data, error } = await query.order("generated_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createKpiSnapshot(snapshot: CareVerityKpiSnapshotInput) {
  return insertRecord("kpi_snapshots", snapshot, demoKpiSnapshotStorageKey);
}

export async function createKpiMetric(metric: CareVerityKpiMetricInput) {
  return insertRecord("kpi_metrics", metric, demoKpiMetricStorageKey);
}

export async function createKpiAction(action: CareVerityKpiActionInput) {
  return insertRecord("kpi_actions", action, demoKpiActionStorageKey);
}

export async function recordKpiInsightDraft(insight: CareVerityKpiInsightInput) {
  return insertRecord(
    "kpi_insights",
    {
      ...insight,
      approvalRequired: insight.approvalRequired ?? true,
      status: insight.status ?? "Draft - manager approval required"
    },
    demoKpiInsightStorageKey
  );
}

export async function createCoordinatorActionTracking(action: CareVerityCoordinatorActionTrackingInput) {
  return insertRecord("coordinator_action_tracking", action, demoCoordinatorActionTrackingStorageKey);
}

export async function listLqcsCarePlanDrafts(tenant: CareVerityTenantScope = {}) {
  assertTenantScopeForDatabaseTable("lqcs_care_plan_drafts", tenant);
  const supabase = getSupabaseClient();
  if (!supabase) {
    if (getCareVerityDbMode() === "database") {
      throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY before disabling demo mode.");
    }
    return readDemoJson<Record<string, unknown>[]>(demoLqcsCarePlanDraftStorageKey, []);
  }

  const query = applyTenantFilter(supabase.from("lqcs_care_plan_drafts").select("*").is("archived_at", null), tenant);
  const { data, error } = await query.order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createLqcsAssessmentSource(source: CareVerityLqcsAssessmentSourceInput) {
  return insertRecord(
    "lqcs_assessment_sources",
    {
      ...source,
      status: source.status ?? "Recorded - source reliability visible"
    },
    demoLqcsAssessmentSourceStorageKey
  );
}

export async function createLqcsCarePlanDraft(draft: CareVerityLqcsCarePlanDraftInput) {
  return insertRecord(
    "lqcs_care_plan_drafts",
    {
      ...draft,
      status: draft.status ?? "AI-assisted draft - professional review and approval required.",
      approvalRequired: draft.approvalRequired ?? true,
      mobileVisible: draft.mobileVisible ?? false
    },
    demoLqcsCarePlanDraftStorageKey
  );
}

export async function createLqcsReviewCheckerIssue(issue: CareVerityLqcsReviewCheckerIssueInput) {
  return insertRecord(
    "lqcs_review_checker_issues",
    {
      ...issue,
      status: issue.status ?? "Needs Attention"
    },
    demoLqcsReviewCheckerIssueStorageKey
  );
}

export async function createLqcsProfessionalReferralDraft(draft: CareVerityLqcsProfessionalReferralDraftInput) {
  return insertRecord(
    "lqcs_professional_referral_drafts",
    {
      ...draft,
      approvalStatus: draft.approvalStatus ?? "AI-assisted draft - professional review and approval required.",
      sentStatus: draft.sentStatus ?? "Not sent"
    },
    demoLqcsProfessionalReferralDraftStorageKey
  );
}

export async function createLqcsDraftAuditEvent(event: Record<string, unknown> & CareVerityTenantScope) {
  return insertRecord(
    "lqcs_draft_audit_events",
    {
      ...event,
      lockedAt: event.lockedAt ?? new Date().toISOString()
    },
    demoLqcsDraftAuditEventStorageKey
  );
}
