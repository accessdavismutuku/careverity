export const careverityProductionSeedReference = "CAREVERITY-PRODUCTION-SEED-001";

export type CareVeritySeedCompany = {
  companyId: string;
  companyName: string;
  users: { role: string; count: number; examples: string[] }[];
  serviceUsers: number;
  visits: number;
  carePlans: number;
  riskAssessments: number;
  medicationProfiles: number;
  controlledMedicationRecords: number;
  incidents: number;
  complaints: number;
  compliments: number;
  includesHrRecords: boolean;
  includesAiDrafts: boolean;
  includesInspectionEvidencePack: boolean;
};

export const careverityProductionSeedCompanies: CareVeritySeedCompany[] = [
  {
    companyId: "TEST-COMPANY-001",
    companyName: "CareVerity Test Provider One Ltd",
    users: [
      { role: "Company Admin", count: 1, examples: ["company1.admin@example.test"] },
      { role: "Registered Manager", count: 1, examples: ["company1.manager@example.test"] },
      { role: "Care Coordinator", count: 2, examples: ["company1.coordinator.a@example.test", "company1.coordinator.b@example.test"] },
      { role: "Care Worker", count: 5, examples: ["company1.carer.a@example.test", "company1.carer.b@example.test"] }
    ],
    serviceUsers: 5,
    visits: 20,
    carePlans: 5,
    riskAssessments: 5,
    medicationProfiles: 5,
    controlledMedicationRecords: 2,
    incidents: 5,
    complaints: 3,
    compliments: 5,
    includesHrRecords: true,
    includesAiDrafts: true,
    includesInspectionEvidencePack: true
  },
  {
    companyId: "TEST-COMPANY-002",
    companyName: "CareVerity Test Provider Two Ltd",
    users: [
      { role: "Company Admin", count: 1, examples: ["company2.admin@example.test"] },
      { role: "Registered Manager", count: 1, examples: ["company2.manager@example.test"] },
      { role: "Care Coordinator", count: 2, examples: ["company2.coordinator.a@example.test", "company2.coordinator.b@example.test"] },
      { role: "Care Worker", count: 5, examples: ["company2.carer.a@example.test", "company2.carer.b@example.test"] }
    ],
    serviceUsers: 5,
    visits: 20,
    carePlans: 5,
    riskAssessments: 5,
    medicationProfiles: 5,
    controlledMedicationRecords: 2,
    incidents: 5,
    complaints: 3,
    compliments: 5,
    includesHrRecords: true,
    includesAiDrafts: true,
    includesInspectionEvidencePack: true
  }
];

export const careverityProductionSeedPlainEnglishSummary = [
  "TEST-COMPANY-001 includes 5 service users, 20 visits, 5 care plans, 5 risk assessments and 5 medication profiles.",
  "TEST-COMPANY-002 includes 5 service users, 20 visits, 5 care plans, 5 risk assessments and 5 medication profiles.",
  "Both test companies include HR records, AI drafts, controlled medication records and an inspection evidence pack."
] as const;

export const careverityTenantIsolationSeedTests = [
  {
    test: "Company A cannot access Company B service users",
    actorCompanyId: "TEST-COMPANY-001",
    targetCompanyId: "TEST-COMPANY-002",
    module: "service_users",
    expectedResult: "403 tenant boundary denied"
  },
  {
    test: "Company A cannot access Company B care plans",
    actorCompanyId: "TEST-COMPANY-001",
    targetCompanyId: "TEST-COMPANY-002",
    module: "care_plans",
    expectedResult: "403 tenant boundary denied"
  },
  {
    test: "Company A cannot access Company B HR records",
    actorCompanyId: "TEST-COMPANY-001",
    targetCompanyId: "TEST-COMPANY-002",
    module: "staff_hr_records",
    expectedResult: "403 tenant boundary denied"
  },
  {
    test: "Company A cannot access Company B medication records",
    actorCompanyId: "TEST-COMPANY-001",
    targetCompanyId: "TEST-COMPANY-002",
    module: "medication_records",
    expectedResult: "403 tenant boundary denied"
  },
  {
    test: "Company A cannot access Company B AI drafts",
    actorCompanyId: "TEST-COMPANY-001",
    targetCompanyId: "TEST-COMPANY-002",
    module: "ai_drafts",
    expectedResult: "403 tenant boundary denied"
  },
  {
    test: "Inspector access is limited to approved company and scope",
    actorCompanyId: "TEST-COMPANY-001",
    targetCompanyId: "TEST-COMPANY-001",
    module: "inspection_evidence_packs",
    expectedResult: "read approved evidence only; no create/edit/delete/export unless approved"
  }
] as const;

export const careverityBackendReadinessAreas = [
  "database",
  "authentication",
  "role permissions",
  "tenant separation",
  "care plans",
  "risk assessments",
  "visits",
  "medication/MAR",
  "controlled medication",
  "incidents",
  "HR",
  "AI integration",
  "audit trail",
  "files",
  "backups",
  "inspection portal",
  "production build"
] as const;

export function getCareVeritySeedSummary() {
  return {
    reference: careverityProductionSeedReference,
    companies: careverityProductionSeedCompanies.length,
    totalServiceUsers: careverityProductionSeedCompanies.reduce((total, company) => total + company.serviceUsers, 0),
    totalVisits: careverityProductionSeedCompanies.reduce((total, company) => total + company.visits, 0),
    totalCarePlans: careverityProductionSeedCompanies.reduce((total, company) => total + company.carePlans, 0),
    totalRiskAssessments: careverityProductionSeedCompanies.reduce((total, company) => total + company.riskAssessments, 0),
    totalMedicationProfiles: careverityProductionSeedCompanies.reduce((total, company) => total + company.medicationProfiles, 0),
    tenantIsolationTests: careverityTenantIsolationSeedTests.length
  };
}
