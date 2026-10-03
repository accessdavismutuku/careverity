# CareVerity ECM End-to-End Testing

Reference: `LQCS-CAREVERITY-UAT-001`

These Playwright tests exercise the CareVerity ECM & Care Compliance demo workflow for London Quality Care Services Ltd using dummy UAT data only.

## Safety

- Do not run these tests against production personal data.
- Use a sandbox, demo tenant or local prototype environment only.
- The tests clear only `careverity-demo-*` browser localStorage keys.
- The included names, emails, phone numbers and care records are fake test data.

## Environment Variables

Set these if testing a deployed sandbox. If `CAREVERITY_BASE_URL` is not set, Playwright starts the local Next.js dev server.

```powershell
$env:CAREVERITY_BASE_URL="http://localhost:3000"
$env:CAREVERITY_ADMIN_EMAIL="care.coordinator.uat@lqcs.example.test"
$env:CAREVERITY_ADMIN_PASSWORD="DemoAdminPassword123!"
$env:CAREVERITY_CARER_EMAIL="care.worker.uat@lqcs.example.test"
$env:CAREVERITY_CARER_PASSWORD="DemoCarerPassword123!"
```

Remote sandbox placeholder values:

```powershell
$env:CAREVERITY_BASE_URL="https://your-careverity-test-url.com"
$env:CAREVERITY_ADMIN_EMAIL="admin-test@example.com"
$env:CAREVERITY_ADMIN_PASSWORD="change-this-password"
$env:CAREVERITY_CARER_EMAIL="carer-test@example.com"
$env:CAREVERITY_CARER_PASSWORD="change-this-password"
```

Do not commit real credentials. Use placeholders in `.env.example` and set real sandbox secrets only in the local shell or CI secret store.

## Install

```powershell
cd "C:\Users\hnahm\Documents\CareVerity ECM"
"C:\Program Files\nodejs\npm.cmd" install
"C:\Program Files\nodejs\npx.cmd" playwright install chromium
```

## Run Tests

Headless:

```powershell
"C:\Program Files\nodejs\npm.cmd" run test:e2e
```

Headed browser:

```powershell
"C:\Program Files\nodejs\npm.cmd" run test:e2e:headed
```

Open HTML report:

```powershell
"C:\Program Files\nodejs\npm.cmd" run test:e2e:report
```

## What The Test Covers

- Admin/care coordinator login or demo role fallback
- Dummy service user creation workflow
- Next of kin and emergency contact fields
- Care needs and communication needs fields
- Care plan, risk assessment, medication/eMAR and audit tabs
- Dummy staff/care worker creation workflow
- Demo call package and visit allocation
- Permanent multi-call rota allocation
- Temporary multi-call rota cover allocation
- Carer/mobile visit view
- Check-in and check-out
- Visit task completion
- Care notes
- Medication placeholder path
- Incident/concern placeholder path
- Admin dashboard and Live ECM alerts
- Medication/MAR screen
- Audit trail and export preview
- JSON test summary attachment

## Data Exports

`tests/test-data/careverity-test-data.ts` exports the shared dummy UAT records used by the suite, including compatibility names from the original UAT reference: `testServiceUser`, `testVisits`, `testMedication` and `testIncident`.

## Developer TODOs

The current CareVerity prototype does not yet have a production authentication backend or stable `data-testid` selectors. The Playwright spec therefore uses accessible labels, button/link text and headings. As the platform hardens, add stable selectors for:

- Login submit
- Demo role selector or production role/session state
- Service user wizard steps
- Client file tabs
- Staff form controls
- Rota allocation workflow stages
- Mobile visit task cards
- Medication given/refused/missed controls
- Incident/concern submission controls
- Audit/export actions

When those selectors exist, replace the TODO-marked text-based selectors in `tests/careverity-end-to-end.spec.ts`.

## Launch Readiness UAT

Reference: `CAREVERITY-LAUNCH-READINESS-001`

Run the 100-company launch-readiness Playwright check:

```powershell
cd "C:\Users\hnahm\Documents\CareVerity ECM"
$env:CAREVERITY_BASE_URL="http://localhost:3000"
"C:\Program Files\nodejs\npm.cmd" run test:launch-readiness
```

The spec seeds dummy-only data for `TEST-COMPANY-001` to `TEST-COMPANY-100`, then checks tenant `companyId` presence, Sarah/Ahmed/coordinator greeting counters, one-month permanent allocation, emergency mobile visit isolation, normal MAR, controlled MAR balance and audit evidence.

## 100 / 250 / 500 Company Load Tests

The original 100-company k6 script is:

```text
tests/load/careverity-100-companies-load-test.js
```

The SaaS scale script is:

```text
tests/load/careverity-saas-scale-load-test.js
```

Run it after installing k6:

```powershell
# Install k6 first if it is not already available:
winget install k6.k6

$env:CAREVERITY_BASE_URL="http://localhost:3000"
k6 run tests/load/careverity-100-companies-load-test.js

# SaaS scale runs:
"C:\Program Files\nodejs\npm.cmd" run test:load:saas:100
"C:\Program Files\nodejs\npm.cmd" run test:load:saas:250
"C:\Program Files\nodejs\npm.cmd" run test:load:saas:500
```

If `k6` is not recognised, install it from the official k6 installer or with `winget install k6.k6`, then reopen Command Prompt/PowerShell so PATH refreshes.

## UK Launch Readiness Gate

Reference: `CAREVERITY-UK-LAUNCH-READINESS-001`

The current launch report is:

```text
docs/CAREVERITY_UK_LAUNCH_READINESS_REPORT.md
```

CareVerity must not be marked ready for full UK launch until all of these pass in a production-like sandbox:

- `npm run lint`
- `npm run build`
- `npm run test:careverity`
- `npm run test:launch-readiness`
- `npm run test:load:100-companies`
- `npm run test:load:saas:100`
- `npm run test:load:saas:250`
- `npm run test:load:saas:500`
- Tenant isolation tests for Company A / Company B
- Normal MAR and controlled-drug MAR stock-balance UAT
- Backup restore test
- Vulnerability scan
- OWASP Top 10 test pass
- Penetration test with no open critical or high findings

The production readiness UI is available at:

```text
http://localhost:3000/careverity-ecm/production-readiness
```

Keep `NEXT_PUBLIC_DEMO_MODE=true` for local demo testing only. Production must run with database mode, secure authentication, MFA, role claims, Row Level Security and audited tenant-scoped exports enabled.
