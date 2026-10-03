export type LaunchReadinessStatus = "Pass" | "Prepared" | "Blocked" | "Action required";

export type LaunchReadinessControl = {
  area: string;
  status: LaunchReadinessStatus;
  evidence: string;
  launchGate: string;
};

export const careverityLaunchReference = "CAREVERITY-UK-LAUNCH-READINESS-001";

export const careverityLaunchDecision =
  "Not ready for full UK launch until production database, authentication, tenant isolation, backup restore, security testing, load testing and full UAT evidence all pass.";

export const careverityLaunchHardStops = [
  "Production Supabase/Postgres project, migrations and verified Row Level Security are not yet evidenced.",
  "Secure production authentication, MFA enrolment and admin/super-admin session policies are not yet evidenced.",
  "Real tenant isolation tests with Company A and Company B users must pass against the production-like database.",
  "Backup restore has not been evidenced against production-like database and file storage.",
  "100-company load test cannot be signed off until k6 or equivalent load tooling is installed and executed.",
  "Vulnerability scan, OWASP Top 10 test pass and external penetration test are required before launch.",
  "Full UAT with sandbox admin and carer credentials remains required before go-live."
] satisfies string[];

export const careverityLaunchSecurityControls: LaunchReadinessControl[] = [
  {
    area: "Build errors",
    status: "Pass",
    evidence: "Local npm run lint and npm run build are required evidence gates.",
    launchGate: "Build must pass before every release candidate."
  },
  {
    area: "Remove demo/localStorage-only production mode",
    status: "Prepared",
    evidence: "Database mode guard blocks Supabase operations when required environment values are missing; demo mode remains for local testing only.",
    launchGate: "Set NEXT_PUBLIC_DEMO_MODE=false in production and verify no localStorage persistence path is used for live records."
  },
  {
    area: "Real database persistence",
    status: "Prepared",
    evidence: "Supabase/Postgres schema and service layer are present with tenant-scoped tables.",
    launchGate: "Run migrations on a production-like Supabase project and execute CRUD/UAT tests against database mode."
  },
  {
    area: "Secure authentication",
    status: "Blocked",
    evidence: "Middleware redirects protected non-demo routes when no Supabase session cookie exists.",
    launchGate: "Configure Supabase Auth or approved identity provider, test login, reset, lockout and role claims."
  },
  {
    area: "MFA for admin and super-admin",
    status: "Blocked",
    evidence: "MFA control rows and schema placeholders exist.",
    launchGate: "Require and test MFA for System Owner, Provider Admin, Registered Manager and super-admin roles."
  },
  {
    area: "Role-based access control",
    status: "Prepared",
    evidence: "Role matrix and RLS policy placeholders exist.",
    launchGate: "Prove each role can only view permitted modules and records with real auth claims."
  },
  {
    area: "Strict companyId tenant separation",
    status: "Prepared",
    evidence: "Core demo fixtures include companyId/providerId and Playwright checks tenant identifiers.",
    launchGate: "Company A/Company B database tests must pass with RLS enabled and direct API calls attempted."
  },
  {
    area: "Cross-company data prevention",
    status: "Prepared",
    evidence: "Service layer requires tenant scope for tenant-scoped database tables.",
    launchGate: "Prove Company A cannot read, search, export or infer Company B staff, clients, MAR, rota, invoices or audit logs."
  },
  {
    area: "HTTPS in transit",
    status: "Action required",
    evidence: "Security headers are set by middleware.",
    launchGate: "Host only behind HTTPS with HSTS and secure cookies in production."
  },
  {
    area: "Sensitive data encryption at rest",
    status: "Prepared",
    evidence: "Schema enables pgcrypto and restricted document storage planning.",
    launchGate: "Enable managed database/storage encryption and field-level encryption for key-safe, payroll, MAR and restricted records where required."
  },
  {
    area: "Password hashing",
    status: "Blocked",
    evidence: "The app should use Supabase Auth or an approved auth service; no custom plaintext password storage is present.",
    launchGate: "Confirm bcrypt/Argon2id hashing through the identity provider or implement Argon2id if self-hosting auth."
  },
  {
    area: "Secure password reset",
    status: "Blocked",
    evidence: "Password reset request schema placeholders are prepared.",
    launchGate: "Test expiring, single-use reset tokens and audit reset events."
  },
  {
    area: "Session timeout",
    status: "Prepared",
    evidence: "Session timeout environment placeholders are documented.",
    launchGate: "Enforce idle and absolute timeout in auth middleware/session provider."
  },
  {
    area: "Account lockout",
    status: "Prepared",
    evidence: "Login attempt table and environment placeholders are prepared.",
    launchGate: "Test lockout after failed attempts and unlock/admin review process."
  },
  {
    area: "Rate limiting",
    status: "Prepared",
    evidence: "Rate limit table and environment placeholders are prepared.",
    launchGate: "Deploy edge/API rate limiting for login, password reset, export, import and medication actions."
  },
  {
    area: "Audit all create/view/edit/delete/login/export/MAR actions",
    status: "Prepared",
    evidence: "Audit schema includes action, module, record type, old/new values, reason, IP/device placeholders and tenant identifiers.",
    launchGate: "Verify audit insertion for every sensitive action in UAT."
  },
  {
    area: "Tamper-resistant audit logs",
    status: "Prepared",
    evidence: "Schema adds append-only/hash-chain fields and mutation-blocking trigger.",
    launchGate: "Prove update/delete attempts fail and hash-chain verification passes."
  },
  {
    area: "Backup and restore process",
    status: "Prepared",
    evidence: "Backup/restore evidence tables and UI placeholders exist.",
    launchGate: "Run and record a restore test from encrypted database and file backups."
  },
  {
    area: "Data retention and deletion controls",
    status: "Prepared",
    evidence: "Retention rules and deletion request schema are prepared.",
    launchGate: "Approve retention schedule, test deletion/anonymisation workflow and audit outcomes."
  },
  {
    area: "Export controls",
    status: "Prepared",
    evidence: "Export approval and backup/export log structures exist.",
    launchGate: "Prove role-controlled exports, purpose recording, audit logging and tenant filtering."
  },
  {
    area: "Breach-reporting workflow",
    status: "Prepared",
    evidence: "Breach report schema and Article 32 demo register are present.",
    launchGate: "Run tabletop test for triage, ICO/DSPT/safeguarding notification decision and evidence retention."
  },
  {
    area: "Monitoring and security alerts",
    status: "Prepared",
    evidence: "Security event and alert schema placeholders are prepared.",
    launchGate: "Connect production logs to alerting for auth abuse, export spikes, failed RLS attempts and medication anomalies."
  },
  {
    area: "Vulnerability scanning",
    status: "Blocked",
    evidence: "Vulnerability scan run table is prepared.",
    launchGate: "Run dependency, SAST, DAST and container/hosting scans; resolve high and critical findings."
  },
  {
    area: "OWASP Top 10 testing",
    status: "Blocked",
    evidence: "OWASP checklist is prepared for testing.",
    launchGate: "Pass OWASP Top 10 testing, including broken access control and injection attempts."
  },
  {
    area: "Penetration testing checklist",
    status: "Prepared",
    evidence: "Pen-test checklist and findings table are prepared.",
    launchGate: "Complete independent penetration test and close high/critical issues."
  },
  {
    area: "Cyber Essentials readiness",
    status: "Prepared",
    evidence: "Cyber Essentials checklist is prepared.",
    launchGate: "Confirm boundary firewalls, secure configuration, access control, malware protection and patching evidence."
  },
  {
    area: "DPIA support",
    status: "Prepared",
    evidence: "DPIA support checklist and records table are prepared.",
    launchGate: "Complete DPIA with DPO/IG sign-off before processing real care records."
  },
  {
    area: "Privacy notice and DPA templates",
    status: "Prepared",
    evidence: "Template register tables and document checklist are prepared.",
    launchGate: "Have UK GDPR privacy notice and processor/controller agreements legally reviewed and approved."
  },
  {
    area: "100-company load test",
    status: "Blocked",
    evidence: "Playwright 100-company data test exists; k6 load script exists.",
    launchGate: "Install/run k6 or equivalent and pass defined latency/error thresholds."
  },
  {
    area: "Final launch readiness report",
    status: "Prepared",
    evidence: "Launch readiness report document and UI panel are prepared.",
    launchGate: "Update report only after all blocked gates have passed."
  }
];

export const careverityOwaspChecklist = [
  "A01 Broken Access Control: test tenant escape, IDOR, role bypass, export and MAR access.",
  "A02 Cryptographic Failures: verify TLS, secure cookies, encryption at rest and restricted field handling.",
  "A03 Injection: test forms, imports, search, filters, notes and report parameters.",
  "A04 Insecure Design: review tenant model, break-glass access, medication safety and audit immutability.",
  "A05 Security Misconfiguration: review headers, CORS, storage buckets, Supabase RLS and environment secrets.",
  "A06 Vulnerable and Outdated Components: run npm audit/dependency scanning and patch high/critical findings.",
  "A07 Identification and Authentication Failures: test MFA, reset, lockout, session timeout and credential stuffing controls.",
  "A08 Software and Data Integrity Failures: validate import templates, package integrity, CI/CD and audit hash chain.",
  "A09 Security Logging and Monitoring Failures: test alerts for failed logins, exports, restricted views and MAR changes.",
  "A10 Server-Side Request Forgery: review any URL import, hosted video, document fetch or integration endpoint."
] satisfies string[];

export const careverityCyberEssentialsChecklist = [
  "Boundary firewalls and internet gateways documented.",
  "Secure configuration baseline for servers, Supabase, storage and admin devices.",
  "Access control and least privilege for staff, admins, providers and support users.",
  "Malware protection and endpoint management evidence.",
  "Security update management and vulnerability remediation timescales."
] satisfies string[];

export const careverityDpiaChecklist = [
  "Describe processing: staff, service user, health, MAR, rota, finance, documents, audit and family portal data.",
  "Assess necessity and proportionality for care delivery, employment, safeguarding, medication and compliance.",
  "Identify risks to rights and freedoms, including unauthorised access, tenant leakage, export misuse and breach impact.",
  "Record mitigations: RLS, RBAC, MFA, encryption, audit logs, retention, backup restore and incident response.",
  "Seek DPO/IG advice and consult ICO if high risk cannot be mitigated."
] satisfies string[];

export const careverityPenetrationChecklist = [
  "Unauthenticated access and forced browsing.",
  "Role bypass between System Owner, Provider Admin, Registered Manager, HR, Care Coordinator and Care Worker.",
  "Company A to Company B tenant isolation attempts through UI, API, exports and predictable IDs.",
  "Medication/MAR tampering, controlled drugs balance manipulation and audit-log bypass.",
  "Import file abuse, formula injection, CSV injection and malicious document upload.",
  "Session fixation, timeout bypass, MFA bypass and account lockout evasion.",
  "Backup/export download authorisation and audit evidence."
] satisfies string[];

export const careverityBackupRestoreChecklist = [
  "Encrypted daily database backup configured.",
  "Encrypted document/storage backup configured.",
  "Audit-log backup and hash-chain verification included.",
  "Restore test completed to isolated environment.",
  "Restore result, data integrity checks, RPO/RTO and sign-off recorded.",
  "Failed restore escalation and corrective action process documented."
] satisfies string[];

export const careverityBreachWorkflowSteps = [
  "Detect and classify event.",
  "Contain access, preserve evidence and suspend affected sessions.",
  "Assess personal data, special category data, medication/safeguarding impact and tenant scope.",
  "Decide ICO, DSPT, commissioner, safeguarding and individual notifications.",
  "Record actions, timeline, lessons learned and corrective controls.",
  "Close only after manager/DPO sign-off."
] satisfies string[];

export const careverityPrivacyTemplateChecklist = [
  "Provider privacy notice for service users, relatives and staff.",
  "CareVerity SaaS data processing agreement.",
  "Sub-processor register and hosting location schedule.",
  "Data retention and deletion schedule.",
  "Data subject access/export process.",
  "International transfer assessment where applicable."
] satisfies string[];
