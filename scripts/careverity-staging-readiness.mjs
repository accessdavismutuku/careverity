import { existsSync, readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const envFiles = [".env.local", ".env.staging.local", ".env.staging"];
const requiredEnv = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "DATABASE_URL",
  "JWT_SECRET",
  "APP_ENV",
  "ENABLE_PRODUCTION_BACKEND"
];

const requiredTables = [
  ["companies", "companies"],
  ["users", "users"],
  ["staff", "staff"],
  ["serviceUsers", "service_users"],
  ["clientDocuments", "client_documents"],
  ["clientDocumentAuditEvents", "client_document_audit_events"],
  ["carePlans", "care_plans"],
  ["riskAssessments", "risk_assessments"],
  ["visits", "visits"],
  ["medications", "medication_records"],
  ["marRecords", "mar_records"],
  ["controlledMedicationRecords", "controlled_medication_records"],
  ["incidents", "incidents"],
  ["complaints", "complaints"],
  ["compliments", "compliments"],
  ["aiDrafts", "ai_draft_documents"],
  ["auditLogs", "audit_logs"],
  ["files", "private_file_objects"],
  ["inspectorAccessSessions", "inspector_access_sessions"],
  ["backupLogs", "backup_logs"]
];

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq);
    const value = trimmed.slice(eq + 1);
    if (!process.env[key]) process.env[key] = value;
  }
}

for (const file of envFiles) loadEnvFile(file);

const schema = readFileSync("supabase/schema.sql", "utf8");
const missingEnv = requiredEnv.filter((key) => !process.env[key]);
function tablePresentInSchema(table) {
  return (
    new RegExp(`(?:create table if not exists public\\.${table}|create table if not exists public\\."${table}")`, "i").test(schema) ||
    new RegExp(`'${table}'`, "i").test(schema)
  );
}

const tableChecks = requiredTables.map(([label, table]) => ({
  label,
  table,
  presentInSchema: tablePresentInSchema(table)
}));

const result = {
  reference: "CAREVERITY-STAGING-BACKEND-READINESS-001",
  environment: process.env.APP_ENV || process.env.CAREVERITY_DEPLOYMENT_ENVIRONMENT || "not configured",
  productionBackendEnabled: process.env.ENABLE_PRODUCTION_BACKEND === "true",
  missingEnv,
  tableChecks,
  envReady: missingEnv.length === 0,
  schemaReady: tableChecks.every((check) => check.presentInSchema),
  supabaseReachable: false,
  databaseProbe: null,
  clientDocumentsBucket: null,
  liveCareRecordsReady: false,
  decision: "Blocked until staging env, database migration, auth/MFA, tenant isolation, private storage, backup restore, UAT and security tests pass."
};

if (result.envReady) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  try {
    const { data, error } = await supabase.from("companies").select("company_id").limit(1);
    result.supabaseReachable = !error;
    result.databaseProbe = error ? { ok: false, message: error.message } : { ok: true, rowsReturned: data?.length ?? 0 };

    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    const clientDocumentsBucket = buckets?.find((bucket) => bucket.name === "client-documents");
    result.clientDocumentsBucket = bucketError
      ? { ok: false, message: bucketError.message }
      : {
          ok: Boolean(clientDocumentsBucket && clientDocumentsBucket.public === false),
          present: Boolean(clientDocumentsBucket),
          public: clientDocumentsBucket?.public ?? null,
          expectedName: "client-documents"
        };
  } catch (error) {
    result.databaseProbe = { ok: false, message: error instanceof Error ? error.message : "Unknown Supabase connection error" };
  }
}

console.log(JSON.stringify(result, null, 2));

if (!result.envReady || !result.schemaReady || !result.supabaseReachable || (result.envReady && result.clientDocumentsBucket?.ok === false)) {
  process.exitCode = 1;
}
