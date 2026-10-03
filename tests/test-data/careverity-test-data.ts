export const uatReference = "LQCS-CAREVERITY-UAT-001";

export const careverityRoutes = {
  login: "/login",
  dashboard: "/careverity-ecm",
  demoSetup: "/careverity-ecm/demo-setup",
  staffNew: "/careverity-ecm/staff/new",
  clientsNew: "/careverity-ecm/clients/new",
  demoClientFile: "/careverity-ecm/clients/demo-service-user-620",
  rota: "/careverity-ecm/rota",
  rotaPermanentMultiCall: "/careverity-ecm/rota?client=demo-su-101&calls=Morning%20Call,Lunch%20Call,Tea%20Call&allocation=Permanent%20regular%20carer",
  rotaTemporaryMultiCall: "/careverity-ecm/rota?client=demo-su-101&calls=Morning%20Call,Bed%20Call&allocation=Temporary%20cover",
  mobileDemoVisit: "/careverity-ecm/mobile/demo-visit",
  liveEcm: "/careverity-ecm/live-ecm",
  medication: "/careverity-ecm#emar",
  dataProtection: "/careverity-ecm/data-protection-compliance",
  backupExport: "/careverity-ecm/backup-export",
  exportPreview: "/careverity-ecm/export-preview"
} as const;

export const careverityDemoStorageKeys = [
  "careverity-demo-staff",
  "careverity-demo-clients",
  "careverity-demo-call-cards",
  "careverity-demo-allocations",
  "careverity-demo-visit",
  "careverity-demo-visit-audit",
  "careverity-demo-training-assignments",
  "careverity-demo-last-export",
  "careverity-demo-workflow-status",
  "careverity-demo-backup-audit"
] as const;

export const testUsers = {
  admin: {
    role: "Care Coordinator",
    email: process.env.CAREVERITY_ADMIN_EMAIL ?? "care.coordinator.uat@lqcs.example.test",
    password: process.env.CAREVERITY_ADMIN_PASSWORD ?? "DemoAdminPassword123!"
  },
  carer: {
    role: "Care Worker",
    email: process.env.CAREVERITY_CARER_EMAIL ?? "care.worker.uat@lqcs.example.test",
    password: process.env.CAREVERITY_CARER_PASSWORD ?? "DemoCarerPassword123!"
  }
} as const;

export const dummyServiceUser = {
  reference: "DEMO-UAT-SU-001",
  firstName: "Demo UAT",
  lastName: "Service User",
  preferredName: "Demo UAT",
  dateOfBirth: "1950-01-01",
  address: "1 Demo UAT Road, Uxbridge",
  postcode: "UB8 1AA",
  phone: "07000 000 101",
  fundingSource: "Local Authority",
  packageType: "Double-up",
  riskLevel: "High",
  nextOfKinName: "Demo UAT Next of Kin",
  nextOfKinRelationship: "Daughter",
  nextOfKinPhone: "07000 000 102",
  nextOfKinEmail: "demo.nok.uat@example.test",
  emergencyContactName: "Demo UAT Emergency Contact",
  emergencyContactPhone: "07000 000 103",
  communicationNeeds: "Dementia-related communication needs",
  careNeeds: [
    "Morning personal care",
    "Medication prompt",
    "Moving and handling support",
    "Lives alone welfare check"
  ],
  carePlanSummary: "UAT care plan: morning support, medication prompt and dementia-aware communication.",
  riskAssessmentSummary: "UAT risk assessment: high risk because of medication, moving and handling and living alone.",
  medicationInstruction: "UAT medication prompt according to MAR/eMAR instructions."
} as const;

export const dummyStaffMember = {
  reference: "DEMO-UAT-ST-001",
  firstName: "Demo UAT",
  lastName: "Care Worker",
  role: "Care Worker",
  email: "demo.uat.care.worker@example.test",
  mobile: "07000 000 201",
  employmentStatus: "Active",
  startDate: "2026-06-01",
  dbsStatus: "Current",
  rightToWorkStatus: "Checked and valid"
} as const;

export const dummyVisit = {
  id: "DEMO-UAT-VISIT-001",
  callType: "Morning Call",
  expectedStart: "08:00",
  expectedEnd: "08:45",
  allocationTypePermanent: "Permanent regular carer",
  allocationTypeTemporary: "Temporary cover",
  tasks: [
    "Medication support",
    "Prepare breakfast",
    "Personal care",
    "Moving and handling",
    "Record care notes"
  ],
  careNote: "UAT demo visit completed. Personal care support provided. Medication prompt recorded. No concerns reported.",
  concern: "UAT demo concern: medication concern selected for audit trail validation."
} as const;

export const testServiceUser = {
  code: "TEST-SU-001",
  firstName: "Mary",
  lastName: "Johnson",
  fullName: "Mary Johnson",
  dateOfBirth: "12/03/1942",
  address: "10 Test Road, Uxbridge",
  postcode: "UB8 1AA",
  phone: "07000000001",
  fundingType: "Local Authority",
  packageType: "Domiciliary care - 4 calls per day",
  communicationNeeds: "Speaks clearly. Wears hearing aids. Staff should speak slowly and clearly.",
  mobilityNeeds: "Uses walking frame. High falls risk. Requires supervision when mobilising.",
  personalCareNeeds: "Requires support with washing, dressing, continence care and evening routine.",
  nutritionNeeds: "Requires meal preparation, fluid encouragement and monitoring of food intake.",
  nextOfKin: {
    name: "David Johnson",
    relationship: "Son",
    phone: "07000000002"
  },
  emergencyContact: {
    name: dummyServiceUser.emergencyContactName,
    phone: dummyServiceUser.emergencyContactPhone
  }
} as const;

export const testVisits = [
  {
    code: "TEST-VISIT-001",
    type: "Morning personal care",
    startTime: "08:00",
    endTime: "08:45",
    tasks: "Personal care, medication prompt, breakfast, fluid intake, safety check"
  },
  {
    code: "TEST-VISIT-002",
    type: "Lunch call",
    startTime: "12:30",
    endTime: "13:00",
    tasks: "Meal preparation, hydration, welfare check"
  },
  {
    code: "TEST-VISIT-003",
    type: "Tea call",
    startTime: "17:00",
    endTime: "17:30",
    tasks: "Meal support, medication prompt, mobility check"
  },
  {
    code: "TEST-VISIT-004",
    type: "Bedtime call",
    startTime: "21:00",
    endTime: "21:30",
    tasks: "Personal care, continence support, night safety check"
  }
] as const;

export const testMedication = {
  name: "Paracetamol 500mg",
  dose: "Two tablets",
  frequency: "Morning and evening",
  instructions: "Administer as prescribed. Record given, refused or missed medication on MAR."
} as const;

export const testIncident = {
  type: "Low level concern",
  details: "TEST INCIDENT ONLY: Service user reported feeling slightly unsteady when standing. No fall occurred.",
  actionTaken: "Carer supported service user to sit safely, monitored wellbeing and reported to office."
} as const;

export const expectedReportChecks = [
  "Dashboard alerts reviewed",
  "Late/missed call alerts reviewed",
  "Medication records reviewed",
  "Audit trail reviewed",
  "Export preview reviewed"
] as const;
