# CareVerity Current Status

## Completed Today

- Added the Backup / Export / Import route and page for prototype data migration.
- Added a durable demo seed file inside the project at `public/demo-data/careverity-demo-seed.json`.
- Added `Load Demo Seed Data` support through the Backup / Export / Import page.
- Added the CareVerity-scoped mobile route at `/careverity-ecm/mobile`.
- Added project handover documentation for cross-computer continuation.
- Added current project status documentation.
- Added safe environment placeholder settings in `.env.example`.

## Partially Completed

- The main CareVerity prototype modules are present and navigable.
- Demo staff, service user, call package, rota, journal, training, certificate, roles and compliance examples exist as prototype data.
- Role-based access, restricted fields, audit logs, Article 32 controls and backup evidence are represented in the UI and seed records.
- Demo workflow buttons use local browser storage rather than a production database.

## Prototype / Demo Only

- Staff and client records.
- Picture/avatar upload previews.
- Rota allocation and Live ECM examples.
- Mobile carer visits and task completion.
- Journal tagging, action assignment and read acknowledgement.
- Report exports and backup exports.
- Policy, DSPT, Article 32 and governance registers.
- Training certificate generation and certificate register.

## Needs Backend / Database Later

- Secure relational database or equivalent production data store.
- API routes and server actions for all create/edit/read workflows.
- Server-side validation and immutable audit records.
- User authentication and session management.
- Server-enforced role and permission checks.
- Persistent file/document records.
- Production rota, visit and mobile synchronisation.

## Needs Security Review

- Authentication and password/session configuration.
- Encryption at rest and in transit.
- Role-based permissions and restricted field enforcement.
- Secure export controls and lawful sharing workflow.
- Data retention and deletion/archiving controls.
- Audit log tamper resistance.
- Supplier, hosting and data processor controls.
- UK GDPR Article 32 evidence, DSPT evidence and DPIA review.

## Needs Proper Hosting

- Secure hosting environment.
- Secure database.
- Secure document storage.
- User login system.
- Role permissions enforced server-side.
- Audit logs stored outside browser local storage.
- Backups and restore testing.
- Disaster recovery process.
- Monitoring, alerting and incident response.

## Needs Real Testing Before Going Live

- Unit tests for core data helpers.
- End-to-end tests for staff, client, rota, Live ECM, mobile, journal and backup workflows.
- Permission tests for each user role.
- Security tests for restricted fields and exports.
- Accessibility testing for mobile carer workflows.
- Print/PDF tests for certificates and governance reports.
- Backup/restore tests in a clean environment.
- User acceptance testing with fake data before any production onboarding.

## Production Data Warning

Do not use real service user or staff data until secure database, hosting, backups, access controls and audit logs are production-ready.
