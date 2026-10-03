import { NextResponse } from "next/server";
import { getProductionBackendReadiness } from "@/lib/careverity-backend-security";
import { getLiveReadinessDecision, isProductionDatabaseConfigured, productionLiveReadinessAreas } from "@/lib/careverity-production-backend";
import { createBackendNotConfiguredError, getCareVerityRuntimeMode } from "@/lib/careverity-runtime-mode";

export async function GET() {
  const runtimeMode = getCareVerityRuntimeMode();
  if (runtimeMode.demoMode) {
    return NextResponse.json(
      {
        ok: true,
        status: "demo_mode",
        appEnv: runtimeMode.appEnv,
        productionBackendEnabled: false,
        database: "not_configured",
        auth: "not_configured",
        warning: "Not for live care records"
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store",
          "X-CareVerity-Health": "demo_mode"
        }
      }
    );
  }

  if (runtimeMode.productionBackendEnabled && !runtimeMode.backendConfigured) {
    return NextResponse.json(
      {
        ...createBackendNotConfiguredError(runtimeMode),
        status: "backend_not_configured",
        appEnv: runtimeMode.appEnv,
        productionBackendEnabled: true,
        database: runtimeMode.database,
        auth: runtimeMode.auth,
        configStatus: runtimeMode.configStatus
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "X-CareVerity-Health": "backend_not_configured"
        }
      }
    );
  }

  const readiness = getProductionBackendReadiness();
  const controlEvidence = Object.fromEntries(
    productionLiveReadinessAreas.map((area) => [
      area,
      area === "database persistence" && isProductionDatabaseConfigured() ? "Pass" : "Blocked"
    ])
  ) as Record<string, "Pass" | "Partial" | "Blocked" | "Not tested">;
  const liveReadiness = getLiveReadinessDecision(controlEvidence);

  return NextResponse.json(
    {
      app: "CareVerity ECM",
      appStatusLabel: "app status",
      appStatus: readiness.appStatus,
      status: readiness.appStatus,
      database: readiness.databaseStatus,
      version: readiness.version,
      environment: readiness.environment,
      timestamp: readiness.timestamp,
      productionReady: readiness.hardStops.length === 0,
      hardStops: readiness.hardStops,
      liveCareRecordsReady: liveReadiness.readyForLiveCareRecords,
      liveReadinessDecision: liveReadiness.decision,
      liveReadinessBlockers: liveReadiness.blockers,
      controls: {
        databaseConfigured: isProductionDatabaseConfigured(),
        mfaRequiredRoles: ["Super Admin", "System Owner", "Company Admin", "Provider Admin", "Registered Manager"],
        auditMode: process.env.AUDIT_TAMPER_RESISTANT_MODE ?? "append-only-hash-chain",
        privateFileStorage: process.env.FILE_STORAGE_PROVIDER === "supabase" && Boolean(process.env.FILE_STORAGE_BUCKET),
        backupProviderConfigured: Boolean(process.env.BACKUP_STORAGE),
        rateLimitConfigured: Boolean(process.env.RATE_LIMIT_MAX_REQUESTS),
        vulnerabilityScanRequired: process.env.VULNERABILITY_SCAN_REQUIRED !== "false",
        stagingUatRequired: true,
        securityTestRequired: true
      }
    },
    {
      status: readiness.hardStops.length ? 503 : 200,
      headers: {
        "Cache-Control": "no-store",
        "X-CareVerity-Health": readiness.appStatus
      }
    }
  );
}
