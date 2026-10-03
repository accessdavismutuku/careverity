# CareVerity ECM & Care Compliance Platform

## Current Project Status

This workspace contains the current CareVerity ECM prototype with the major care operations, compliance, reporting, rota, mobile, training, governance and demo workflow screens saved in the codebase. The app is still a prototype and uses local browser storage plus saved seed data for demonstration workflows.

The checkpoint for this handover is stored in project files, including a durable demo seed file at `public/demo-data/careverity-demo-seed.json`.

Git checkpoint note: this environment did not have the `git` command available, so a git commit could not be created here. This file is the checkpoint summary for cross-computer continuation.

## Main Completed Modules

- CareVerity ECM dashboard and navigation.
- Demo Setup / Test Workflow.
- HR / Staff Files landing page, Add New Staff, individual staff file pages, staff tabs and availability schedule workflow.
- Service Users / Client Files landing page, Existing Service Users list, Add New Service User, individual client file pages and tabbed client records.
- Client Journal / Communication Log with locked entries, addendum process, staff tagging, task assignment and audit evidence.
- Rota / Shift Allocation separated from Live ECM, including multi-call allocation, date range allocation, permanent and temporary allocation options.
- Live ECM Board and Live ECM TV Wallboard.
- Mobile Carer App prototype with visit task icons, care document shortcuts, observations and future shifts.
- Medication / eMAR prototype sections.
- Training Academy, course library and certificate design/register workflow.
- Roles & Permissions with expanded admin and care roles.
- Information Governance & DSPT screens.
- Data Protection & Article 32 Compliance module with operational controls, registers and evidence areas.
- Reports & Governance Centre prototype screens.
- Backup / Export / Import module for prototype demo data migration.

## Current Routes / Pages

- `http://localhost:3000/careverity-ecm`
- `http://localhost:3000/careverity-ecm/demo-setup`
- `http://localhost:3000/careverity-ecm/staff`
- `http://localhost:3000/careverity-ecm/staff/new`
- `http://localhost:3000/careverity-ecm/staff/demo-care-worker-a`
- `http://localhost:3000/careverity-ecm/clients`
- `http://localhost:3000/careverity-ecm/clients/existing`
- `http://localhost:3000/careverity-ecm/clients/new`
- `http://localhost:3000/careverity-ecm/clients/demo-service-user-101`
- `http://localhost:3000/careverity-ecm/clients/demo-service-user-101/journal`
- `http://localhost:3000/careverity-ecm/rota`
- `http://localhost:3000/careverity-ecm/live-ecm`
- `http://localhost:3000/careverity-ecm/live-ecm/wallboard`
- `http://localhost:3000/careverity-ecm/mobile`
- `http://localhost:3000/careverity-ecm/settings/roles-permissions`
- `http://localhost:3000/careverity-ecm/data-protection-compliance`
- `http://localhost:3000/careverity-ecm/information-governance`
- `http://localhost:3000/careverity-ecm/policies/information-governance`
- `http://localhost:3000/careverity-ecm/backup-export`

## Startup Instructions

To open the project on another computer:

1. Open the same Codex workspace.
2. Open terminal.
3. Run:

```bash
npm install
```

4. Run:

```bash
npm run dev
```

5. Open:

```text
http://localhost:3000/careverity-ecm
```

6. Test:

```text
http://localhost:3000/careverity-ecm/demo-setup
http://localhost:3000/careverity-ecm/staff
http://localhost:3000/careverity-ecm/clients
http://localhost:3000/careverity-ecm/rota
http://localhost:3000/careverity-ecm/live-ecm
http://localhost:3000/careverity-ecm/live-ecm/wallboard
http://localhost:3000/careverity-ecm/mobile
http://localhost:3000/careverity-ecm/settings/roles-permissions
http://localhost:3000/careverity-ecm/data-protection-compliance
```

## Demo Seed Data

The saved seed file is:

```text
public/demo-data/careverity-demo-seed.json
```

To reload the seed data in a new browser:

1. Open `http://localhost:3000/careverity-ecm/backup-export`.
2. Click `Load Demo Seed Data`.
3. Reopen the demo workflow, staff, clients, rota and live ECM pages.

The seed data contains fake demo records only:

- Demo staff.
- Demo service user.
- Demo call packages.
- Demo rota allocations.
- Demo one-off and emergency calls.
- Demo journal entry and tagged staff task.
- Demo audit logs.
- Demo training records and certificate.
- Demo roles and permissions.
- Demo availability and access schedules.
- Demo compliance registers.

## How To Test The Demo Workflow

1. Open `http://localhost:3000/careverity-ecm/demo-setup`.
2. Click `Create Test Staff`.
3. Click `Create Test Service User`.
4. Click `Create Test Call Package`.
5. Click `Allocate Test Staff for 2 Weeks` or `Allocate Test Staff for 1 Month`.
6. Open `http://localhost:3000/careverity-ecm/staff`.
7. Open `http://localhost:3000/careverity-ecm/clients`.
8. Open `http://localhost:3000/careverity-ecm/rota`.
9. Open `http://localhost:3000/careverity-ecm/live-ecm`.
10. Open `http://localhost:3000/careverity-ecm/mobile`.

## Creating Test Staff

Use `http://localhost:3000/careverity-ecm/staff/new` or the Demo Setup page. The current demo workflow creates:

- Demo Admin Coordinator A.
- Demo Care Worker A.
- Demo Care Worker B.
- Demo Float Worker C.

Profile pictures are prototype placeholders. If no picture is uploaded, initials avatars are used.

## Creating Test Service User

Use `http://localhost:3000/careverity-ecm/clients/new` or the Demo Setup page. The current test record is:

- Demo Service User 101.
- Preferred name: Demo User.
- Address: Demo House, 1 Care Street, Hayes.
- Postcode: UB4 0SD.
- Funding: Local Authority.
- Risk level: High.
- Package: Personal care double-up.

## Creating A Call Package

Open the client file and use the Call Package / Visits area, or use Demo Setup. The test package includes:

- Morning Call, 08:00 to 08:45.
- Lunch Call, 12:30 to 13:00.
- Tea Call, 17:00 to 17:30.
- Bed Call, 21:00 to 21:45.
- Welfare Check, 10:30 to 11:00.
- Outreach, 15:30 to 16:30.

## Allocating Staff For 2 Weeks Or 1 Month

Open `http://localhost:3000/careverity-ecm/rota`.

Workflow:

1. Select service user.
2. Select one or more calls.
3. Select date range.
4. Select suitable carer.
5. Choose permanent or temporary.
6. Save or publish.

The demo supports assigning Morning, Lunch and Tea calls together to Demo Care Worker A, and assigning Bed Call to Demo Care Worker B.

## Opening Live ECM

Open:

```text
http://localhost:3000/careverity-ecm/live-ecm
```

The Live ECM Board is for today's live monitoring only. It is separate from rota planning.

## Opening The Mobile Carer App

Open:

```text
http://localhost:3000/careverity-ecm/mobile
```

The mobile view shows demo visit details, icon-based expected tasks, observations, future shifts and check-in/check-out placeholders.

## Known Limitations

- This is a prototype with local browser storage, not a production backend.
- Uploads are placeholders unless connected to secure document storage.
- Exports are prototype JSON/PDF/Excel placeholders unless connected to a production export service.
- Role permissions are visually demonstrated and not yet enforced by a server-side access control layer.
- Audit logs are prototype/demo records and need backend persistence for production.
- The demo seed is fake data only.

## Next Development Priorities

- Add secure database schema and migrations.
- Add user login and server-enforced role permissions.
- Add encrypted document storage and secure file scanning.
- Add production audit log persistence.
- Add backup, restore and disaster recovery jobs.
- Add real API endpoints for staff, clients, rota, journal, mobile visits and reports.
- Add automated end-to-end tests for the core workflows.
- Add formal security review, DPIA, DSPT and hosting controls before go-live.

## Important Warning

Do not use real service user or staff data until secure database, hosting, backups, access controls and audit logs are production-ready.
