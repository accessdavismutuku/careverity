# CareVerity Production Backend Readiness

Reference: `CAREVERITY-PRODUCTION-BACKEND-001`

Current result: **Not ready for live production data**.

The production backend foundation has been scaffolded, but CareVerity must not be marked ready for launch until a real database, authentication provider, tenant-isolation tests, audit logging, storage, backup/restore and security testing have all passed in staging.

## Implemented In This Pass

- Server-side API route registry for CareVerity backend modules.
- Catch-all API route at `/api/[...careverity]` for registered backend routes.
- Health endpoint at `/api/health`.
- Server-side role permission map for:
  - Super Admin
  - Company Admin
  - Registered Manager
  - Nominated Individual
  - Care Coordinator
  - Supervisor
  - Care Worker
  - HR Manager
  - Compliance Manager
  - Medication Lead
  - Inspector Read Only
  - Auditor Read Only
- Tenant guard using authenticated request company context.
- Safe tenant-boundary rejection when request body companyId differs from authenticated companyId.
- Audit envelope for important API actions.
- Runtime audit writer for append-only hash-chain audit entries when the production database is configured.
- Production service-role database adapter for tenant-scoped list/insert operations.
- MFA enforcement hook for Super Admin, System Owner, Company Admin, Provider Admin and Registered Manager roles.
- API fixed-window rate-limit hook using `RATE_LIMIT_MAX_REQUESTS`.
- Private Supabase Storage path builder and signed upload request helper for `provider-documents`.
- Backup/restore status helper for production evidence checks.
- Database-level tenant RLS policy migration for company/provider isolation.
- Private file object and file access log tables, with append-only access log protection.
- PostgreSQL production model scaffold for requested backend tables.
- Two-company seed model for `TEST-COMPANY-001` and `TEST-COMPANY-002`.
- Tenant isolation test definitions for service users, care plans, HR, medication, AI drafts and inspector scope.

## API Security Rules

Every registered API route must:

- authenticate the user,
- check role permission,
- enforce `companyId`,
- validate request tenant boundary,
- return safe error messages,
- create audit evidence for important actions.

The server must derive tenant context from verified auth/session claims in production. The current route scaffold supports demo/test headers only for local testing and must be replaced with verified Supabase/Auth session claims before live use.

Required security controls before production:

- HTTPS only in production.
- secure HTTP-only session cookies or verified JWT sessions.
- password hashing through the managed auth provider, bcrypt or Argon2.
- password reset token expiry and audit.
- account lockout after repeated failed login attempts.
- MFA for Super Admin, Company Admin and Registered Manager roles.
- session timeout and absolute session lifetime.
- rate limiting for auth, AI, export, file and medication endpoints.
- CORS locked to approved CareVerity domains.
- API security headers enabled.
- input validation on every mutation route.
- safe error messages with no stack traces or secrets.

## Production Environment Variables

Required before production launch:

- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `AUTH_SECRET`
- `OPENAI_API_KEY`
- `FILE_STORAGE_BUCKET`
- `BACKUP_STORAGE`
- `ENCRYPTION_KEY`

AI API keys must remain server-side only and must never be exposed to the browser.

## Backend Readiness Table

| Area | Result | Evidence | Notes |
| --- | --- | --- | --- |
| database | Prepared | `supabase/schema.sql`, `careverity-production-backend.ts` production adapter | Real Supabase/Postgres migration and connection still required. |
| authentication | Prepared | `/api/auth/*` route registry, MFA hook, reset token digest and login control tables | Real Supabase/Auth or equivalent provider must be connected and tested. |
| role permissions | Prepared | `careverityRolePermissions` server map | Must be enforced from verified session claims and mirrored in RLS. |
| tenant separation | Prepared | server tenant guard, database RLS policy migration and seed tenant-isolation tests | Must pass database/RLS tests with Company A/Company B fixtures. |
| care plans | Partial | API registry and LQCS AI draft schema | Persistence and approval workflow require database integration. |
| risk assessments | Partial | API registry and schema scaffold | Persistence and approval workflow require database integration. |
| visits | Partial | visits, recurring and emergency API routes registered | Permanent visit allocation/clock-in storage still required. |
| medication/MAR | Partial | MAR and medication API routes registered | MAR persistence and medication authority checks still required. |
| controlled medication | Partial | controlled medication routes registered | Stock balance transaction logic and witness checks still required. |
| incidents | Partial | incident routes registered | Permanent incident manager review workflow still required. |
| HR | Partial | HR routes and AI HR routes registered | Full HR records persistence and access controls still required. |
| AI integration | Partial | AI route registry, env placeholders, audit envelope | Real server-side OpenAI call adapter and cost tracking still required. |
| audit trail | Prepared | audit envelope, append-only schema controls and hash-chain writer | Must be run against production-like database and verified under UAT. |
| files | Prepared | file upload/download/delete routes, private file metadata, access logs and private bucket plan | Secure storage buckets, signed URLs and virus scanning still require staging verification. |
| backups | Prepared | backup status/test route, schema scaffold and backup status helper | Daily encrypted backups and restore tests still required. |
| inspection portal | Partial | inspection access/evidence routes registered | Scoped read-only evidence sessions still required. |
| production build | Required | `npm run build` | Must pass after each backend change. |

## Do Not Mark Ready Until

- `npm run build` passes.
- real database works with `NEXT_PUBLIC_DEMO_MODE=false`.
- API calls persist records through the server-side production database adapter, not browser localStorage.
- tenant separation passes in staging.
- audit trail writes are append-only and tamper-resistant.
- authentication works with password reset, lockout and MFA for admin roles.
- server-side permissions are enforced from verified auth/session claims.
- localStorage is removed from production workflows.
- backup and restore test passes.
- file storage is private and access logged.
- uploaded files are virus scanned where the provider/platform supports it.
- CORS and security headers are locked down for staging and production.
- rate limiting is active on auth, AI, medication, export and file routes.
- no high-risk security issues remain.
