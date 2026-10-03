# CareVerity Staging Backend Readiness Report

Reference: `CAREVERITY-STAGING-BACKEND-READINESS-001`

Current decision: **Not ready for live care records**.

The codebase is now prepared to connect to a real Supabase/Postgres staging backend, but this workspace does not contain `.env.local` or staging secrets. Real staging execution remains blocked until the Supabase project, authentication provider, private storage bucket and backup process are configured with dummy test data only.

## Required Staging Environment

Create `.env.local` or a secure staging secret set with:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
JWT_SECRET=
APP_ENV=staging
ENABLE_PRODUCTION_BACKEND=true
```

Additional required launch controls are listed in `.env.staging.example`.

## What Was Added

- Real staging/production backend enablement flag: `ENABLE_PRODUCTION_BACKEND=true`.
- Verified Supabase bearer-session context for staging/prod API calls.
- Staging/prod API calls no longer rely on demo headers when production backend is enabled.
- Server-side Supabase service-role adapter for tenant-scoped list/insert operations.
- API persistence targets for companies/providers, staff, service users, care plans, risk assessments, visits, emergency visits, medication, MAR, controlled medication, incidents, AI care plan drafts, audit logs and backup status.
- MFA enforcement for high-privilege roles.
- Rate-limit guard response.
- Tamper-resistant audit hash-chain writer.
- Private file storage path and signed-upload helper.
- Private file object and access log schema.
- Explicit `companies` table alongside provider records.
- Staging readiness command: `npm run staging:check`.
- Staging UAT command: `npm run staging:uat`.

## Staging Migration Checklist

Run the contents of `supabase/schema.sql` against the staging database, then confirm these SQL tables or mapped tables exist:

| User-facing area | SQL table |
| --- | --- |
| companies | `companies`, `providers` |
| users | `users` |
| staff | `staff` |
| serviceUsers | `service_users` |
| carePlans | `care_plans` |
| riskAssessments | `risk_assessments` |
| visits | `visits`, `shifts`, `emergency_calls` |
| medications | `medication_records` |
| marRecords | `mar_records`, `normal_mar_records` |
| controlledMedicationRecords | `controlled_medication_records`, `controlled_drugs_mar_records`, `controlled_drug_stock_balance` |
| incidents | `incidents` |
| complaints | `complaints` |
| compliments | `compliments` |
| aiDrafts | `ai_draft_documents`, `ai_care_plan_drafts` |
| auditLogs | `audit_logs` |
| files | `private_file_objects`, `private_file_access_logs` |
| inspectorAccessSessions | `inspector_access_sessions` |
| backupLogs | `backup_logs`, `backup_restore_tests` |

## Updated Readiness Table

| Area | Result | Evidence | Notes |
| --- | --- | --- | --- |
| real database persistence | Prepared / blocked | `careverity-production-backend.ts`, API persistence targets | Requires real Supabase/Postgres credentials and migration execution. |
| auth | Prepared / blocked | Verified Supabase bearer session context | Requires Supabase Auth staging users and role claims. |
| MFA | Prepared / blocked | MFA role guard | Must be configured and tested in Supabase/Auth provider. |
| role-based access | Prepared | API permission matrix and route guard | Must be proven using real staging accounts. |
| tenant isolation | Prepared / not yet proven | API guard plus database RLS migration | Company A/B DB and API tests must be run in staging. |
| audit logs | Prepared / not yet proven | Hash-chain audit writer and append-only DB triggers | Must verify real DB writes and mutation rejection. |
| private storage | Prepared / blocked | `private_file_objects`, `private_file_access_logs`, `provider-documents` bucket plan | Supabase private bucket and policies must be created. |
| backup/restore | Prepared / blocked | backup status helper and restore test table | Dummy backup/restore must be run and recorded. |
| staging UAT | Blocked | `npm run staging:uat` command exists | Requires staging URL and dummy admin/carer accounts. |
| security tests | Prepared / not run | Existing security readiness tests and staging command | Must execute OWASP/auth/RBAC/tenant/file/API/AI/audit tests. |
| vulnerabilities | Partial | `npm audit` reports 2 moderate Next/PostCSS findings | No safe fix available from npm; see vulnerability register. |
| build | Pass | `npm run build` passed after backend changes | Keep as release gate. |
| final decision | Not ready | No real staging credentials or UAT evidence in this workspace | Do not enter live care records. |

## Required Next Execution Steps

1. Create staging Supabase project.
2. Apply `supabase/schema.sql`.
3. Create private `provider-documents` bucket and storage policies.
4. Configure Supabase Auth, role claims, account status and MFA.
5. Copy `.env.staging.example` to secure staging secrets and fill values.
6. Run `npm run staging:check`.
7. Create dummy companies `TEST-COMPANY-001` and `TEST-COMPANY-002`.
8. Run Company A/B tenant isolation tests at SQL/API level.
9. Run full staging UAT with dummy data only.
10. Run security tests and resolve any critical/high findings.

Live care records must remain blocked until all above items pass.
