# CareVerity ECM UK Launch Readiness Report

Reference: `CAREVERITY-UK-LAUNCH-READINESS-001`

Status: **Not ready for full UK launch**

CareVerity ECM remains suitable for local demo/UAT review only until production database persistence, secure authentication, MFA, tenant isolation, backup restore, load testing, security testing and full UAT evidence are completed.

## Current Evidence

| Area | Current result | Evidence |
| --- | --- | --- |
| Local lint/build gate | Pass when last run | `npm run lint` and `npm run build` must pass for every release candidate. |
| Local demo UAT | Pass in demo mode | Playwright tests cover launch fixtures, mobile visits, MAR and controlled MAR stock balance using dummy data. |
| 100-company data fixture | Prepared | Dummy-only 100-company fixture includes tenant `companyId`/`providerId` fields. |
| Supabase/Postgres schema | Prepared | `supabase/schema.sql` contains provider, staff, service user, rota, MAR, audit, security and governance tables. |
| SaaS scale operations schema | Prepared | Subscription, feature flag, AI usage, performance monitoring, tenant isolation test and SaaS load-test evidence tables are prepared. |
| 100/250/500 company load scripts | Prepared | `tests/load/careverity-saas-scale-load-test.js` supports `CAREVERITY_COMPANY_COUNT` for 100, 250 and 500 company runs. |
| Service layer | Prepared | `lib/careverity-db.ts` supports demo/database mode and requires tenant scope for database tenant tables. |
| Production auth/MFA | Blocked | Real sandbox/production auth provider, MFA enrolment and role claims are not yet evidenced. |
| Tenant isolation | Blocked | Must be proven against real database mode with Company A and Company B users. |
| Backup restore | Blocked | Must be tested with production-like database and file storage backups. |
| Load tests for 100, 250 and 500 companies | Blocked | k6/equivalent load runs must pass and be recorded before scale readiness can be signed off. |
| Security testing | Blocked | OWASP Top 10, vulnerability scanning and penetration testing must be completed. |

## Hard Go-Live Stops

- Do not enter real staff or service-user data while `NEXT_PUBLIC_DEMO_MODE=true`.
- Do not launch until Supabase/Postgres migrations and RLS policies are applied and tested.
- Do not launch until secure auth, MFA, password reset, session timeout, failed-login lockout and rate limiting are proven.
- Do not launch until tenant isolation proves Company A cannot access Company B data through UI, API, search, exports, documents, MAR, rota, reports or audit logs.
- Do not launch until normal MAR and controlled-drug MAR audit/stock-balance workflows pass UAT.
- Do not launch until encrypted backup restore is tested and signed off.
- Do not launch until no critical or high-risk security findings remain open.

## Security And Privacy Controls Prepared

- Security headers in middleware.
- Production route protection when demo mode is disabled.
- Supabase/Postgres multi-tenant schema with `company_id`, `provider_id` and location fields.
- Tenant-scope guard in the database service layer.
- Append-only audit log schema with hash-chain fields and mutation-blocking trigger.
- Login attempt, password reset, MFA, rate limit, security event and alert tables.
- Backup restore, export approval, retention/deletion and breach-report tables.
- Vulnerability scan, penetration finding, DPIA, privacy notice and processor agreement tables.
- Production readiness screen at `/careverity-ecm/production-readiness`.

## UK Compliance Evidence To Complete

- DPIA and residual-risk sign-off before processing real care records.
- Privacy notice for service users, relatives and staff.
- Data processing agreement and sub-processor register.
- Data retention and deletion schedule.
- Breach reporting process, including ICO/DSPT/commissioner/safeguarding notification decision points.
- Cyber Essentials evidence pack.
- OWASP Top 10 testing evidence.
- Penetration test report and remediation evidence.

## Recommended Pre-Launch Test Commands

```powershell
npm run lint
npm run build
npm run test:careverity
npm run test:launch-readiness
npm run test:load:100-companies
npm run test:load:saas:100
npm run test:load:saas:250
npm run test:load:saas:500
```

Install k6 before running the load test:

```powershell
winget install k6.k6
```

## Final Recommendation

Proceed with demo/UAT only. Do not approve UK production launch until all blocked gates are closed, UAT passes in database mode with sandbox credentials, tenant isolation passes, medication/MAR passes, controlled-drug audit and stock balance pass, backup restore passes, load testing passes, and security testing confirms no critical or high-risk findings remain.

References for the launch checklist should be checked against the current official ICO DPIA guidance, NCSC Cyber Essentials resources and OWASP Top 10 project before final sign-off.
