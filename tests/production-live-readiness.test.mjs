import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const productionBackendSource = await readFile(new URL("../lib/careverity-production-backend.ts", import.meta.url), "utf8");
const catchAllRouteSource = await readFile(new URL("../app/api/[...careverity]/route.ts", import.meta.url), "utf8");
const healthRouteSource = await readFile(new URL("../app/api/health/route.ts", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const envSource = await readFile(new URL("../.env.example", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../docs/CAREVERITY_PRODUCTION_BACKEND_READINESS.md", import.meta.url), "utf8");
const proxySource = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");

function expectText(source, text) {
  assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

test("production backend adapter supports persistent database, private storage and backup status", () => {
  [
    "getProductionServiceClient",
    "insertProductionRecord",
    "listProductionRecords",
    "recordTamperResistantAuditLog",
    "createPrivateFileUploadRequest",
    "getBackupRestoreStatus",
    "provider-documents",
    "Production database is not configured"
  ].forEach((text) => expectText(productionBackendSource, text));
});

test("production API guard exposes MFA, rate limiting and hash-chain audit persistence hooks", () => {
  [
    "evaluateMfaRequirement",
    "MFA required.",
    "evaluateFixedWindowRateLimit",
    "Rate limit exceeded.",
    "recordTamperResistantAuditLog",
    "persistentAudit",
    "backupRestoreStatus",
    "authControls"
  ].forEach((text) => expectText(catchAllRouteSource, text));
});

test("database migration includes private file metadata, access logs and tenant RLS policies", () => {
  [
    "careverity_tenant_select",
    "careverity_tenant_insert",
    "careverity_tenant_update",
    "current_user_is_system_owner",
    "private_file_objects",
    "private_file_access_logs",
    "provider-documents",
    "storage.buckets",
    "public = false",
    "prevent_audit_log_mutation"
  ].forEach((text) => expectText(schemaSource, text));
});

test("environment, middleware and health endpoint expose live-readiness controls", () => {
  [
    "AUTH_COOKIE_HTTP_ONLY",
    "AUTH_COOKIE_SECURE",
    "SUPABASE_PRIVATE_DOCUMENT_BUCKET",
    "BACKUP_RETENTION_DAYS",
    "AUDIT_HASH_CHAIN_REQUIRED",
    "RATE_LIMIT_LOGIN_MAX_REQUESTS",
    "SECURITY_ALERT_EMAIL",
    "liveCareRecordsReady",
    "liveReadinessBlockers",
    "x-careverity-tenant-rule",
    "strict-transport-security"
  ].forEach((text) => expectText(envSource + healthRouteSource + proxySource, text));
});

test("readiness documentation still blocks live care records until staging evidence passes", () => {
  [
    "Not ready for live production data",
    "Real Supabase/Postgres migration and connection still required",
    "Must be run against production-like database and verified under UAT",
    "Daily encrypted backups and restore tests still required",
    "API calls persist records through the server-side production database adapter"
  ].forEach((text) => expectText(docsSource, text));
});
