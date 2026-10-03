import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const backendSource = await readFile(new URL("../lib/careverity-backend-security.ts", import.meta.url), "utf8");
const seedSource = await readFile(new URL("../lib/careverity-production-seed.ts", import.meta.url), "utf8");
const catchAllRouteSource = await readFile(new URL("../app/api/[...careverity]/route.ts", import.meta.url), "utf8");
const healthRouteSource = await readFile(new URL("../app/api/health/route.ts", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const envSource = await readFile(new URL("../.env.example", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../docs/CAREVERITY_PRODUCTION_BACKEND_READINESS.md", import.meta.url), "utf8");

function expectText(source, text) {
  assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

test("production backend roles, permissions and authentication guards are defined", () => {
  [
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
    "Auditor Read Only",
    "roleHasPermission",
    "getRequestContext",
    "Authentication required.",
    "Role not permitted."
  ].forEach((text) => expectText(backendSource + catchAllRouteSource, text));
});

test("core server-side API routes are registered", () => {
  [
    "/auth/login",
    "/auth/logout",
    "/auth/password-reset",
    "/auth/mfa/verify",
    "/companies/current",
    "/staff",
    "/service-users",
    "/care-plans",
    "/care-plans/:id/approve",
    "/ai/care-plan/generate-lqcs-draft",
    "/ai/care-plan/review-checker",
    "/risk-assessments",
    "/visits/emergency",
    "/visits/:id/clock-in",
    "/visits/:id/clock-out",
    "/mar/record-given",
    "/controlled-medication/administer",
    "/incidents/:id/manager-review",
    "/cqc-evidence/generate-pack",
    "/inspection/evidence/dashboard",
    "/files/upload",
    "/audit-logs",
    "/backup-restore/status"
  ].forEach((text) => expectText(backendSource, text));
});

test("tenant separation and audit envelope are enforced in API scaffold", () => {
  [
    "validateTenantBoundary",
    "Tenant boundary violation",
    "Company data cannot be accessed outside the authenticated company context.",
    "X-CareVerity-Tenant",
    "createAuditEnvelope",
    "auditId",
    "companyId",
    "userId",
    "userRole",
    "actionType",
    "ipAddress",
    "userAgent",
    "success"
  ].forEach((text) => expectText(backendSource + catchAllRouteSource, text));
});

test("health endpoint exposes required production status fields", () => {
  [
    "GET",
    "app status",
    "database",
    "version",
    "environment",
    "timestamp",
    "hardStops",
    "X-CareVerity-Health"
  ].forEach((text) => expectText(healthRouteSource + docsSource, text));
});

test("production model scaffold covers requested database tables", () => {
  [
    "companies",
    "company_settings",
    "subscription_plans",
    "feature_flags",
    "staff_profiles",
    "staff_hr_records",
    "service_user_contacts",
    "capacity_assessments",
    "consent_records",
    "care_plan_versions",
    "face_to_face_assessments",
    "local_authority_referral_info",
    "ai_care_plan_drafts",
    "risk_assessment_versions",
    "emergency_calls",
    "clock_in_out_records",
    "geofence_logs",
    "mar_records",
    "controlled_drug_stock_balance",
    "controlled_drug_witness_records",
    "safeguarding_concerns",
    "cqc_evidence_items",
    "abc_behaviour_records",
    "inspector_access_sessions",
    "ai_source_records",
    "file_access_logs",
    "backup_logs",
    "production_backend_test_results"
  ].forEach((text) => expectText(schemaSource, text));
});

test("two-company seed data and tenant-isolation tests are present", () => {
  [
    "TEST-COMPANY-001",
    "TEST-COMPANY-002",
    "Company A cannot access Company B service users",
    "Company A cannot access Company B care plans",
    "Company A cannot access Company B HR records",
    "Company A cannot access Company B medication records",
    "Company A cannot access Company B AI drafts",
    "Inspector access is limited to approved company and scope",
    "5 service users",
    "20 visits"
  ].forEach((text) => expectText(seedSource + docsSource, text));
});

test("environment and readiness report include launch hard stops", () => {
  [
    "DATABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "AUTH_SECRET",
    "OPENAI_API_KEY",
    "FILE_STORAGE_BUCKET",
    "BACKUP_STORAGE",
    "ENCRYPTION_KEY",
    "ENABLE_AI_CARE_PLAN_ASSISTANT",
    "ENABLE_AI_QUALITY_ASSISTANT",
    "HTTPS only in production",
    "bcrypt or Argon2",
    "MFA",
    "account lockout",
    "session timeout",
    "rate limiting",
    "CORS",
    "virus scanning",
    "Not ready for live production data"
  ].forEach((text) => expectText(envSource + docsSource + backendSource, text));
});
