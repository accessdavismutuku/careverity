export const careveritySaasArchitectureReference = "CAREVERITY-SAAS-MULTI-TENANT-ARCHITECTURE-001";

export const careveritySaasLaunchTargets = {
  initialActiveCompanies: 100,
  scaleTargetCompanies: 500,
  designRule: "Do not hard-code company-count limits that prevent future scale."
} as const;

export const careverityTenantSeparationRule =
  "Every production record must include companyId, and every production query/API/export/report must enforce companyId tenant separation before returning data.";

export const careverityProductionPersistenceRule =
  "Production must not rely on localStorage. NEXT_PUBLIC_DEMO_MODE=false must use server-side APIs backed by Supabase/Postgres with RLS, RBAC, audit logs and backups.";

export const careveritySaasCorePrinciples = [
  "Every record includes companyId and providerId where applicable.",
  "Every query enforces companyId tenant separation.",
  "All tenant tables have company_id/provider_id indexes.",
  "Role-based access control is enforced in server-side APIs and database RLS.",
  "Important create, view, edit, delete, login, export, import, medication and AI actions create audit records.",
  "Server-side APIs validate tenant scope and never trust client-side companyId alone.",
  "Staging and production are separate environments with separate databases, storage buckets, auth projects and secrets.",
  "Company subscriptions and feature flags control module access without hard-coded limits.",
  "AI usage is tracked per company, module, model, token count, estimated cost and purpose.",
  "Performance monitoring records route/module latency, error rates and tenant impact.",
  "Backups and restore tests are required before go-live.",
  "Load testing covers 100, 250 and 500 companies.",
  "Modules stay modular so HR, AI, inspection portal, medication, rota and quality hub can scale independently."
] as const;

export const careveritySaasModuleBoundaries = [
  ["Core tenant platform", "providers, locations, users, roles, role_permissions, subscriptions, feature flags"],
  ["HR / Staff Files", "staff, staff_documents, training, staff_journal, recognition"],
  ["Service Users / Client Files", "service_users, care_plans, risk_assessments, documents, journals"],
  ["Rota / Live ECM", "call_packages, shifts, rota_allocations, live_ecm_records"],
  ["Medication / MAR", "medication_records, normal_mar_records, controlled_drugs_mar_records, medication_audit"],
  ["Training Academy", "training_courses, training_assignments, certificates, course content"],
  ["AI modules", "ai_usage_events, ai_draft_documents, ai audit events and module-specific draft tables"],
  ["Inspection / Quality Hub", "quality_kpi_snapshots, quality_evidence_items, inspection_evidence_packs"],
  ["Finance", "invoices, funding records, export controls"],
  ["Platform operations", "performance_events, security_events, backup_restore_tests, saas_load_test_runs"]
] satisfies string[][];

export const careveritySaasRoleAccessModel = [
  ["System Owner", "Cross-tenant administration with audited support access and break-glass controls"],
  ["Provider Admin", "Own company/provider administration only"],
  ["Registered Manager", "Own provider/location management and approval workflows"],
  ["HR Administrator", "Own company staff/HR records only, restricted sensitive fields where permitted"],
  ["Care Coordinator", "Own provider service-user, rota and journal records where authorised"],
  ["Care Worker", "Assigned visits/service users only, no cross-staff private records"],
  ["Finance Administrator", "Own provider finance/funding records where authorised"],
  ["Auditor / Inspector Read-Only", "Read-only evidence access where authorised and time-limited"]
] satisfies string[][];

export const careveritySaasDatabaseTables = [
  "providers",
  "provider_locations",
  "users",
  "roles",
  "role_permissions",
  "company_subscriptions",
  "company_feature_flags",
  "staff",
  "service_users",
  "care_plans",
  "risk_assessments",
  "call_packages",
  "shifts",
  "rota_allocations",
  "live_ecm_records",
  "medication_records",
  "normal_mar_records",
  "controlled_drugs_mar_records",
  "training_assignments",
  "certificates",
  "invoices",
  "audit_logs",
  "ai_usage_events",
  "performance_events",
  "backup_restore_tests",
  "saas_load_test_runs"
] as const;

export const careveritySaasOperationalTables = [
  ["company_subscriptions", "company_id/provider_id subscription plan, billing status, module allowance and renewal metadata"],
  ["company_feature_flags", "company_id/provider_id feature control for HR, AI, inspection portal, medication, rota and quality modules"],
  ["ai_usage_events", "company-level AI usage, tokens, model, module, estimated cost and approval/audit metadata"],
  ["performance_events", "company-aware route/module latency, status code and error telemetry"],
  ["tenant_access_test_runs", "Company A/Company B isolation test evidence"],
  ["saas_load_test_runs", "100, 250 and 500 company performance/load test evidence"]
] satisfies string[][];

export const careveritySaasEnvironmentPlan = [
  ["Local demo", "NEXT_PUBLIC_DEMO_MODE=true", "Dummy data/localStorage allowed for development only"],
  ["Staging", "NEXT_PUBLIC_DEMO_MODE=false", "Separate Supabase project, test tenants, test auth, no real service-user data unless authorised"],
  ["Production", "NEXT_PUBLIC_DEMO_MODE=false", "Separate Supabase project, production auth, MFA, RLS, backups, monitoring and incident response"]
] satisfies string[][];

export const careveritySaasPerformanceTargets = [
  ["100 companies", "Initial launch load test", "p95 route latency under 3000ms for dashboard, mobile visit and MAR routes"],
  ["250 companies", "Growth checkpoint", "p95 route latency under 3500ms and no tenant leakage failures"],
  ["500 companies", "Architecture target", "p95 route latency under 4000ms, no critical errors and no redesign required"]
] satisfies string[][];

export const careveritySaasLoadTestCommands = [
  ["100 companies", "CAREVERITY_COMPANY_COUNT=100 k6 run tests/load/careverity-saas-scale-load-test.js"],
  ["250 companies", "CAREVERITY_COMPANY_COUNT=250 k6 run tests/load/careverity-saas-scale-load-test.js"],
  ["500 companies", "CAREVERITY_COMPANY_COUNT=500 k6 run tests/load/careverity-saas-scale-load-test.js"]
] satisfies string[][];

export const careveritySaasApiGuardrails = [
  "Accept tenant scope from verified auth/session claims, not only request body.",
  "Reject tenant-scoped API requests without companyId/providerId.",
  "Apply companyId filter before other filters, pagination, search or export generation.",
  "Check role permission before data access and again before mutations/exports.",
  "Record audit log for important read/write/export/AI/medication actions.",
  "Record AI usage per company before returning AI draft output.",
  "Use server-side service role only inside trusted API handlers; never expose service role keys to the browser.",
  "Return minimum necessary data and avoid cross-module over-fetching."
] as const;

export const careveritySaasBackupRestorePlan = [
  "Encrypted daily database backup with point-in-time recovery where available.",
  "Encrypted storage backup for documents, imports, certificates, MAR attachments and evidence packs.",
  "Quarterly restore test for staging and before launch.",
  "Restore verification checks tenant record counts, audit hash-chain integrity, file links and sample module workflows.",
  "Record restore test result in backup_restore_tests and saas_load_test_runs where relevant.",
  "Do not mark launch ready until backup restore passes."
] as const;

export function getCareVeritySaasScaleReadiness() {
  return {
    reference: careveritySaasArchitectureReference,
    initialActiveCompanies: careveritySaasLaunchTargets.initialActiveCompanies,
    scaleTargetCompanies: careveritySaasLaunchTargets.scaleTargetCompanies,
    tenantSeparationRule: careverityTenantSeparationRule,
    productionPersistenceRule: careverityProductionPersistenceRule,
    requiredLoadTests: careveritySaasPerformanceTargets.map(([companyCount]) => companyCount),
    modularBoundaries: careveritySaasModuleBoundaries.map(([moduleName]) => moduleName),
    readyForProduction: false,
    reasonNotReady: "Architecture scaffolding is prepared, but production launch still requires database-mode UAT, RLS tenant isolation proof, backup restore, security testing and 100/250/500-company load-test evidence."
  };
}
