import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const architectureSource = await readFile(new URL("../lib/careverity-saas-architecture.ts", import.meta.url), "utf8");
const dbSource = await readFile(new URL("../lib/careverity-db.ts", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const loadSource = await readFile(new URL("../tests/load/careverity-saas-scale-load-test.js", import.meta.url), "utf8");
const packageSource = await readFile(new URL("../package.json", import.meta.url), "utf8");
const envSource = await readFile(new URL("../.env.example", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../docs/CAREVERITY_SAAS_MULTI_TENANT_ARCHITECTURE.md", import.meta.url), "utf8");

test("SaaS architecture captures 100-company launch and 500-company scale target", () => {
  assert.match(architectureSource, /initialActiveCompanies: 100/);
  assert.match(architectureSource, /scaleTargetCompanies: 500/);
  assert.match(architectureSource, /Do not hard-code company-count limits/);
  assert.match(docsSource, /100 active care companies/);
  assert.match(docsSource, /500 companies/);
});

test("tenant separation and production persistence rules are explicit", () => {
  assert.match(architectureSource, /Every production record must include companyId/);
  assert.match(architectureSource, /every production query\/API\/export\/report must enforce companyId tenant separation/i);
  assert.match(architectureSource, /Production must not rely on localStorage/);
  assert.match(dbSource, /assertTenantScope/);
  assert.match(dbSource, /tenantScopedDatabaseTables/);
  assert.match(schemaSource, /Never query operational SaaS records without company_id\/provider_id/);
});

test("schema contains subscription, feature flag, AI usage, performance and load-test tables with indexes", () => {
  [
    "company_subscriptions",
    "company_feature_flags",
    "ai_usage_events",
    "performance_events",
    "tenant_access_test_runs",
    "saas_load_test_runs",
    "idx_company_subscriptions_tenant",
    "idx_company_feature_flags_tenant",
    "idx_ai_usage_events_tenant",
    "idx_performance_events_tenant",
    "idx_saas_load_test_runs_scale"
  ].forEach((text) => assert.match(schemaSource, new RegExp(text)));
});

test("service layer recognises SaaS operational tables and functions", () => {
  [
    "company_subscriptions",
    "company_feature_flags",
    "ai_usage_events",
    "performance_events",
    "tenant_access_test_runs",
    "saas_load_test_runs",
    "createCompanySubscription",
    "upsertCompanyFeatureFlag",
    "recordAiUsageEvent",
    "recordPerformanceEvent"
  ].forEach((text) => assert.match(dbSource, new RegExp(text)));
});

test("role model, module boundaries and server API guardrails are defined", () => {
  [
    "System Owner",
    "Provider Admin",
    "Registered Manager",
    "Care Worker",
    "Core tenant platform",
    "HR / Staff Files",
    "AI modules",
    "Inspection / Quality Hub",
    "Accept tenant scope from verified auth/session claims",
    "never expose service role keys to the browser"
  ].forEach((text) => assert.match(architectureSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("load testing covers 100, 250 and 500 companies without hard-coded ceiling", () => {
  assert.match(loadSource, /CAREVERITY_COMPANY_COUNT/);
  assert.match(loadSource, /targetCompanies/);
  assert.match(loadSource, /p\(95\)<3000/);
  assert.match(loadSource, /p\(95\)<3500/);
  assert.match(loadSource, /p\(95\)<4000/);
  assert.match(packageSource, /test:load:saas:100/);
  assert.match(packageSource, /test:load:saas:250/);
  assert.match(packageSource, /test:load:saas:500/);
});

test("environment placeholders separate local, staging and production with monitoring and AI usage tracking", () => {
  [
    "NEXT_PUBLIC_ENVIRONMENT_NAME",
    "CAREVERITY_DEPLOYMENT_ENVIRONMENT",
    "CAREVERITY_STAGING_BASE_URL",
    "CAREVERITY_PRODUCTION_BASE_URL",
    "STAGING_SUPABASE_URL",
    "PRODUCTION_SUPABASE_URL",
    "PERFORMANCE_MONITORING_ENABLED",
    "AI_USAGE_TRACKING_ENABLED",
    "COMPANY_SUBSCRIPTIONS_ENABLED",
    "COMPANY_FEATURE_FLAGS_ENABLED",
    "TENANT_ISOLATION_TEST_REQUIRED",
    "LOAD_TEST_500_COMPANIES_REQUIRED"
  ].forEach((text) => assert.match(envSource, new RegExp(text)));
});
