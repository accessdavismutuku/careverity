import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const runtimeSource = await readFile(new URL("../lib/careverity-runtime-mode.ts", import.meta.url), "utf8");
const productionBackendSource = await readFile(new URL("../lib/careverity-production-backend.ts", import.meta.url), "utf8");
const clientsPageSource = await readFile(new URL("../app/careverity-ecm/clients/page.tsx", import.meta.url), "utf8");
const clientsErrorSource = await readFile(new URL("../app/careverity-ecm/clients/error.tsx", import.meta.url), "utf8");
const clientsLoadingSource = await readFile(new URL("../app/careverity-ecm/clients/loading.tsx", import.meta.url), "utf8");
const backendSetupComponentSource = await readFile(new URL("../components/careverity-backend-setup-message.tsx", import.meta.url), "utf8");
const healthRouteSource = await readFile(new URL("../app/api/health/route.ts", import.meta.url), "utf8");
const catchAllRouteSource = await readFile(new URL("../app/api/[...careverity]/route.ts", import.meta.url), "utf8");
const envSource = await readFile(new URL("../.env.example", import.meta.url), "utf8");
const proxySource = await readFile(new URL("../proxy.ts", import.meta.url), "utf8");

function expectText(source, text) {
  assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

test("runtime mode switch defaults local clients route to demo mode", () => {
  [
    "APP_ENV=development",
    "ENABLE_PRODUCTION_BACKEND=false",
    "NEXT_PUBLIC_DEMO_MODE=true",
    "if (env.ENABLE_PRODUCTION_BACKEND === \"false\") return false",
    "const demoMode = runtimeMode.demoMode",
    "demo_mode",
    "Demo mode - not for live care records"
  ].forEach((text) => expectText(envSource + runtimeSource + productionBackendSource + clientsPageSource + backendSetupComponentSource + proxySource, text));
});

test("clients page has backend setup, loading and error states instead of raw 500", () => {
  [
    "export const dynamic = \"force-dynamic\"",
    "getCareVerityRuntimeMode",
    "CareVerityBackendSetupMessage",
    "CareVerityDemoModeBanner",
    "Backend is not configured.",
    "x-careverity-backend-status",
    "Retry",
    "Return to Dashboard",
    "Loading demo service users safely...",
    "Retry page render"
  ].forEach((text) => expectText(clientsPageSource + clientsErrorSource + clientsLoadingSource + backendSetupComponentSource + proxySource, text));
});

test("health endpoint returns demo 200 or structured backend-not-configured 503", () => {
  [
    "status: \"demo_mode\"",
    "warning: \"Not for live care records\"",
    "productionBackendEnabled: false",
    "status: 200",
    "status: \"backend_not_configured\"",
    "createBackendNotConfiguredError",
    "missingConfig",
    "status: 503"
  ].forEach((text) => expectText(healthRouteSource + runtimeSource, text));
});

test("API errors are structured and backend missing secrets do not throw raw server errors", () => {
  [
    "ok: false",
    "errorCode: \"BACKEND_NOT_CONFIGURED\"",
    "errorCode: \"AUTHENTICATION_REQUIRED\"",
    "errorCode: \"ROLE_NOT_PERMITTED\"",
    "errorCode: \"TENANT_MISMATCH\"",
    "Backend is not configured. CareVerity production backend requires Supabase/Postgres environment variables before live data can be used.",
    "missingConfig"
  ].forEach((text) => expectText(catchAllRouteSource + runtimeSource, text));
});

test("backend setup message names required env keys without exposing secret values", () => {
  [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "DATABASE_URL",
    "SUPABASE_SERVICE_ROLE_KEY",
    "JWT_SECRET",
    "Secret values are not shown. Only present/missing status is displayed.",
    "Backend/staging environment is not configured."
  ].forEach((text) => expectText(runtimeSource + clientsErrorSource + healthRouteSource + backendSetupComponentSource, text));
});
