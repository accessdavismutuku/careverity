# CareVerity SaaS Multi-Tenant Architecture

Reference: `CAREVERITY-SAAS-MULTI-TENANT-ARCHITECTURE-001`

Status: **Architecture prepared, not production-ready**

CareVerity should launch as a provider-safe SaaS platform for **100 active care companies** and be capable of scaling to **500 companies** without a major redesign. This document records the architecture guardrails that must be followed before production launch.

## Scale Targets

| Target | Purpose | Evidence required |
| --- | --- | --- |
| 100 companies | Initial UK launch capacity | Passing staging load test, tenant isolation test, UAT and backup restore |
| 250 companies | Growth checkpoint | Passing performance test with no tenant leakage and acceptable p95 latency |
| 500 companies | Architecture target | Passing load test without redesign, no hard-coded company limit |

Do not hard-code limits that prevent future scale. Subscription plans may have commercial limits, but the platform architecture must not assume only 100 tenants.

## Tenant Separation

Every production record must include `companyId` in TypeScript/API payloads and `company_id` in Postgres tables. Provider and location-specific records should also include `providerId/provider_id` and `locationId/location_id`.

Every production query must filter by company before returning data. Apply tenant scope before search, reports, exports, pagination, AI prompts, document access and dashboard aggregation.

Rules:

- Never query staff, service users, MAR, rota, documents, journals, invoices, reports, AI drafts or audit logs without `companyId`.
- Server APIs must take tenant scope from verified auth/session claims, not only from client-provided body values.
- Supabase/Postgres Row Level Security must enforce tenant isolation.
- System Owner cross-tenant access must be explicit, role-controlled and audited.
- Company A must never access Company B data through UI, API, search, reports, exports, files, MAR, rota, finance or audit logs.

## Modular Boundaries

| Module | Scalable boundary |
| --- | --- |
| Core tenant platform | providers, locations, users, roles, role permissions, subscriptions, feature flags |
| HR / Staff Files | staff, documents, training, journals, recognition |
| Service Users / Client Files | service users, care plans, risk assessments, documents, journals |
| Rota / Live ECM | call packages, shifts, rota allocations, live ECM records |
| Medication / MAR | medication records, normal MAR, controlled drugs MAR, medication audit |
| Training Academy | courses, assignments, certificates, course content |
| AI modules | AI usage tracking, AI drafts, AI audit events |
| Inspection / Quality Hub | KPI snapshots, evidence items, reports, inspection packs |
| Finance | invoices, funding records, export controls |
| Platform operations | performance events, security events, backup restore tests, SaaS load test runs |

## Database Design

The schema now includes SaaS operational tables:

- `company_subscriptions`
- `company_feature_flags`
- `ai_usage_events`
- `performance_events`
- `tenant_access_test_runs`
- `saas_load_test_runs`

These are in addition to tenant-scoped module tables such as `staff`, `service_users`, `care_plans`, `risk_assessments`, `shifts`, `rota_allocations`, `medication_records`, `audit_logs`, `quality_reports` and AI draft tables.

Indexes must include tenant columns first for high-volume tables, for example:

```sql
create index ... on public.staff(company_id, provider_id, location_id);
create index ... on public.service_users(company_id, provider_id, location_id);
create index ... on public.ai_usage_events(company_id, provider_id, module, created_at desc);
create index ... on public.performance_events(company_id, provider_id, module, created_at desc);
```

## Server-Side API Rules

Production APIs must:

- Reject tenant-scoped requests without verified `companyId/providerId`.
- Check role permissions before reads and mutations.
- Use server-side database access only.
- Never expose service role keys to the browser.
- Record audit logs for important actions.
- Record AI usage per company before returning AI-generated drafts.
- Return minimum necessary data.

## Environments

| Environment | Demo mode | Data rule |
| --- | --- | --- |
| Local demo | `NEXT_PUBLIC_DEMO_MODE=true` | Dummy data/localStorage allowed for development only |
| Staging | `NEXT_PUBLIC_DEMO_MODE=false` | Separate database/storage/auth, dummy test tenants only unless explicitly authorised |
| Production | `NEXT_PUBLIC_DEMO_MODE=false` | Production database/storage/auth, MFA, RLS, backups, monitoring, incident response |

Staging and production must use separate Supabase projects, storage buckets, secrets, auth settings and backup policies.

## Subscription And Feature Flags

Use company-level subscriptions and feature flags to control module access:

- HR / Staff Files
- AI modules
- Inspection portal
- Medication / MAR
- Rota / Live ECM
- Quality Intelligence Hub
- Finance
- Training Academy

Feature flags must not bypass RBAC or tenant separation.

## AI Usage Tracking

Every AI request must record:

- `company_id`
- `provider_id`
- user/role
- module
- action
- provider/model
- prompt template
- input/output/total tokens
- estimated cost
- purpose
- source records
- approval requirement

AI must remain drafting/support only where human approval is required.

## Monitoring

Performance monitoring should capture:

- route path
- module
- environment
- company/provider where available
- duration
- status code
- success/failure
- trace ID

Security monitoring should alert on:

- failed logins
- lockouts
- export spikes
- restricted-record access
- cross-tenant access attempts
- medication/MAR changes
- controlled drug stock changes
- failed RLS checks

## Backup And Restore

Before go-live:

- Encrypted database backup configured.
- Encrypted storage backup configured.
- Audit log backup/hash-chain verification included.
- Restore test completed in isolated environment.
- Restore evidence recorded.

Do not mark launch-ready until backup restore passes.

## Load Testing

Commands:

```powershell
npm run test:load:saas:100
npm run test:load:saas:250
npm run test:load:saas:500
```

These require k6 installed. Record the results in `saas_load_test_runs`.

## Go-Live Position

Do not mark CareVerity ready for launch until:

- `npm run build` passes.
- UAT passes in database mode.
- Tenant isolation passes with Company A and Company B test users.
- MAR and controlled-drug stock balance pass.
- Backup restore passes.
- Security tests pass.
- 100, 250 and 500 company load tests pass.
- No critical or high-risk findings remain.
