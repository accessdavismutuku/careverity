# CareVerity ECM Prototype - Developer Handover

This repository contains the CareVerity ECM and Care Compliance System prototype.

## Important status

- Demo/prototype only.
- Uses dummy data only.
- Not approved for real service-user, staff, medication or payroll data.
- Not live-ready.
- Real Supabase/Postgres persistence, authentication, MFA, tenant-isolation UAT, private storage, backup/restore testing and security testing must pass before production use.

## Local setup

Requirements:

- Node.js 20 or later
- npm

Install and run:

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000/careverity-ecm
```

If port 3000 is unavailable:

```bash
npm run dev -- -H 127.0.0.1 -p 3001
```

Then open:

```text
http://127.0.0.1:3001/careverity-ecm
```

## Environment configuration

Copy `.env.staging.example` to `.env.local` and configure values locally. The broader local `.env.example` is intentionally not included in the GitHub package because it contains prefilled demo login values.

Never commit:

- `.env.local`
- Supabase service-role keys
- database passwords or connection strings containing passwords
- JWT or authentication secrets
- private storage credentials
- real care or HR information

The supplied ZIP intentionally excludes the local environment file, build cache, dependencies, test reports, logs and Codex working folders.

## Verification

Run before opening a pull request:

```bash
npm run lint
npm test
npm run build
npm run staging:check
```

`staging:check` must remain blocked until a real staging backend has been configured and all production-readiness checks have passed.

## Key prototype routes

- `/careverity-ecm`
- `/careverity-ecm/clients`
- `/careverity-ecm/staff`
- `/careverity-ecm/rota`
- `/careverity-ecm/medication`
- `/careverity-ecm/trainingacademy`
- `/kpi`

## Recommended GitHub workflow

1. Create a private GitHub repository.
2. Extract this package into a clean working folder.
3. Confirm `.env.local` is absent.
4. Initialise Git and commit the source.
5. Push to the private repository.
6. Add developers using GitHub repository access controls.
7. Store staging secrets in the deployment platform's encrypted secret store, never in Git.

## Production blockers

Do not mark the system live-ready until real database persistence, authentication and MFA, database and API tenant isolation, private document storage, signed downloads, immutable audit records, backup/restore, staging UAT and security testing have all passed with no unresolved critical or high-risk findings.
