import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const backendSource = await readFile(new URL("../lib/careverity-production-backend.ts", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../app/api/[...careverity]/route.ts", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const envSource = await readFile(new URL("../.env.staging.example", import.meta.url), "utf8");
const packageSource = await readFile(new URL("../package.json", import.meta.url), "utf8");
const scriptSource = await readFile(new URL("../scripts/careverity-staging-readiness.mjs", import.meta.url), "utf8");

function expectText(source, text) {
  assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

test("staging backend requires real Supabase/Postgres environment values", () => {
  [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "DATABASE_URL",
    "JWT_SECRET",
    "APP_ENV=staging",
    "ENABLE_PRODUCTION_BACKEND=true"
  ].forEach((text) => expectText(envSource + backendSource + scriptSource, text));
});

test("production API uses verified Supabase context instead of demo headers in staging", () => {
  [
    "getVerifiedProductionRequestContext",
    "Production backend requires a verified bearer session.",
    "verified-supabase-session",
    "Invalid or expired Supabase session.",
    "CareVerity user account is inactive or suspended.",
    "CareVerity user account is temporarily locked.",
    "Verified authentication failed."
  ].forEach((text) => expectText(backendSource + routeSource, text));
});

test("core API routes have real persistence targets for staging UAT records", () => {
  [
    "careverityApiPersistenceTargets",
    "runProductionPersistenceForApi",
    "providers",
    "staff",
    "service_users",
    "care_plans",
    "risk_assessments",
    "emergency_calls",
    "medication_records",
    "mar_records",
    "controlled_medication_records",
    "incidents",
    "ai_care_plan_drafts",
    "audit_logs",
    "databaseResult"
  ].forEach((text) => expectText(backendSource + routeSource, text));
});

test("schema covers requested staging database tables and private storage evidence", () => {
  [
    "public.companies",
    "public.users",
    "public.staff",
    "public.service_users",
    "public.care_plans",
    "public.risk_assessments",
    "'visits'",
    "public.medication_records",
    "'mar_records'",
    "'controlled_medication_records'",
    "'incidents'",
    "'complaints'",
    "'compliments'",
    "public.ai_draft_documents",
    "public.audit_logs",
    "public.private_file_objects",
    "'inspector_access_sessions'",
    "'backup_logs'",
    "careverity_tenant_select",
    "provider-documents"
  ].forEach((text) => expectText(schemaSource, text));
});

test("staging check commands are available but do not mark live readiness automatically", () => {
  [
    "staging:check",
    "staging:uat",
    "CAREVERITY-STAGING-BACKEND-READINESS-001",
    "liveCareRecordsReady: false",
    "Blocked until staging env"
  ].forEach((text) => expectText(packageSource + scriptSource, text));
});
