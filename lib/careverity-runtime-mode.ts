export const careverityBackendRequiredEnvKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "DATABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "JWT_SECRET"
] as const;

export type CareVerityRuntimeModeStatus = "demo_mode" | "backend_configured" | "backend_not_configured";

export type CareVerityRuntimeMode = {
  appEnv: string;
  demoMode: boolean;
  productionBackendEnabled: boolean;
  backendConfigured: boolean;
  status: CareVerityRuntimeModeStatus;
  database: "configured" | "not_configured";
  auth: "configured" | "not_configured";
  missingConfig: string[];
  configStatus: Array<{ key: string; present: boolean }>;
};

export function isCareVerityProductionBackendRequired(env: NodeJS.ProcessEnv = process.env) {
  const appEnv = env.APP_ENV ?? env.CAREVERITY_DEPLOYMENT_ENVIRONMENT ?? env.NEXT_PUBLIC_ENVIRONMENT_NAME ?? "development";
  if (env.ENABLE_PRODUCTION_BACKEND === "false") return false;
  if (env.ENABLE_PRODUCTION_BACKEND === "true") return true;
  if (env.NEXT_PUBLIC_DEMO_MODE === "false") return true;
  return ["staging", "production"].includes(appEnv);
}

export function getCareVerityRuntimeMode(env: NodeJS.ProcessEnv = process.env): CareVerityRuntimeMode {
  const appEnv = env.APP_ENV ?? env.CAREVERITY_DEPLOYMENT_ENVIRONMENT ?? env.NEXT_PUBLIC_ENVIRONMENT_NAME ?? "development";
  const productionBackendEnabled = isCareVerityProductionBackendRequired(env);
  const missingConfig = productionBackendEnabled ? careverityBackendRequiredEnvKeys.filter((key) => !env[key]) : [];
  const databaseConfigured = Boolean(env.DATABASE_URL && env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY);
  const authConfigured = Boolean(env.JWT_SECRET && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  const backendConfigured = missingConfig.length === 0;

  return {
    appEnv,
    demoMode: !productionBackendEnabled,
    productionBackendEnabled,
    backendConfigured,
    status: !productionBackendEnabled ? "demo_mode" : backendConfigured ? "backend_configured" : "backend_not_configured",
    database: databaseConfigured ? "configured" : "not_configured",
    auth: authConfigured ? "configured" : "not_configured",
    missingConfig,
    configStatus: careverityBackendRequiredEnvKeys.map((key) => ({ key, present: Boolean(env[key]) }))
  };
}

export function createBackendNotConfiguredError(runtime = getCareVerityRuntimeMode()) {
  return {
    ok: false,
    errorCode: "BACKEND_NOT_CONFIGURED",
    message: "Backend/staging environment is not configured.",
    missingConfig: runtime.missingConfig
  };
}
