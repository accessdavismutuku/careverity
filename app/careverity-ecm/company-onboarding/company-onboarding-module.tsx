"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  createAuditLog as createDatabaseAuditLog,
  createImportBatch as createDatabaseImportBatch,
  createProvider as createDatabaseProvider,
  createServiceUser as createDatabaseServiceUser,
  createStaff as createDatabaseStaff,
  getCareVerityDatabaseStatus,
  tenantQueryWarning
} from "../../../lib/careverity-db";

type Tone = "green" | "red" | "amber" | "blue" | "teal" | "slate" | "purple";
type ImportType = "staff" | "service-users";
type ValidationStatus = "Valid" | "Warning" | "Error" | "Duplicate" | "Missing required field" | "Needs review";

type OnboardingCompany = {
  companyId: string;
  providerId: string;
  branchId: string;
  companyName: string;
  tradingName: string;
  registrationNumber: string;
  cqcProviderId: string;
  cqcLocationId: string;
  address: string;
  postcode: string;
  telephone: string;
  email: string;
  website: string;
  registeredManagerName: string;
  registeredManagerEmail: string;
  nominatedIndividualName: string;
  serviceTypes: string[];
  localAuthorityContracts: string;
  nhsFundedClients: string;
  privateClients: string;
  logoStatus: string;
  primaryContact: string;
  billingContact: string;
  dataProtectionLead: string;
  goLiveDate: string;
  migrationStatus: string;
  companyStatus: string;
};

type ImportRow = {
  rowNumber: number;
  source: Record<string, string>;
  mapped: Record<string, string>;
  status: ValidationStatus;
  issues: string[];
  duplicateReasons: string[];
  approved: boolean;
  ignored: boolean;
};

type ImportBatch = {
  id: string;
  companyId: string;
  companyName: string;
  importType: ImportType;
  fileName: string;
  uploadedBy: string;
  uploadedAt: string;
  totalRecords: number;
  successfulRecords: number;
  failedRecords: number;
  duplicateRecords: number;
  status: string;
};

type AuditEvent = {
  id: string;
  dateTime: string;
  user: string;
  role: string;
  company: string;
  action: string;
  recordType: string;
  rowNumber: string;
  oldValue: string;
  newValue: string;
  reason: string;
  device: string;
  auditReference: string;
};

type SavedMappingTemplate = {
  staff?: Record<string, string>;
  serviceUsers?: Record<string, string>;
};

type ImportDashboardMetrics = {
  staffUploaded: number;
  staffValid: number;
  staffErrors: number;
  serviceUploaded: number;
  serviceValid: number;
  serviceErrors: number;
  duplicates: number;
  ready: number;
  imported: number;
  failed: number;
};

type StaffMemberRecord = {
  name: string;
  ref: string;
  role: string;
  dbs: string;
  training: string;
  ni: string;
  photo: string;
  status: string;
  email?: string;
  mobile?: string;
  jobTitle?: string;
  address?: string;
  startDate?: string;
  rightToWork?: string;
  companyId?: string;
  providerId?: string;
  branchId?: string;
};

type ServiceUserRecord = {
  id: string;
  name: string;
  package: string;
  funding: string;
  preferredName?: string;
  address?: string;
  postcode?: string;
  riskLevel?: "Low" | "Medium" | "High" | "Critical";
  companyId?: string;
  providerId?: string;
  branchId?: string;
  regularTeam: {
    primary: string;
    additional: string;
    outreach: string;
    additionalOutreach: string;
    preferred: string[];
    excluded: string[];
    skills: string[];
    preference: string;
    usualTimes: string[];
    duration: string;
    doubleUp: string;
    continuity: string;
  };
};

const companyStoreKeys = {
  companies: "careverity-company-onboarding-companies",
  batches: "careverity-company-onboarding-import-batches",
  audit: "careverity-company-onboarding-audit",
  mapping: "careverity-company-onboarding-mapping"
} as const;

const demoStoreKeys = {
  staff: "careverity-demo-staff",
  clients: "careverity-demo-clients"
} as const;

const serviceTypeOptions = [
  "Personal Care",
  "Outreach",
  "Supported Living",
  "Sitting Service",
  "Cleaning / Domestic Support",
  "Medication Support",
  "Live-in Care",
  "Respite Care",
  "Hospital Discharge Support",
  "NHS Funded Care",
  "Local Authority Funded Care",
  "Private Care",
  "Other"
];

const companyStatusOptions = ["Draft", "Onboarding", "Data import pending", "Validation required", "Ready for review", "Approved", "Live", "Suspended", "Archived"];
const fundingSourceOptions = ["Local Authority", "NHS / ICB", "Self-Funding", "Private", "Direct Payment", "Mixed Funding", "Other"];
const packageTypeOptions = ["Morning Call", "Lunch Call", "Tea Call", "Bed Call", "Personal Care", "Outreach", "Sitting Service", "Cleaning", "Medication Support", "Welfare Check", "Night Call", "Double-Up Care", "Hospital Discharge Support", "Emergency Support", "Other"];
const riskLevelOptions = ["Low", "Medium", "High", "Critical"];

const requiredStaffColumns = [
  "Staff Reference Number",
  "First Name",
  "Surname",
  "Date of Birth",
  "Email",
  "Mobile Number",
  "Telephone Number",
  "Address Line 1",
  "Address Line 2",
  "Town/City",
  "Postcode",
  "Job Role",
  "Employment Start Date",
  "Employment Status",
  "National Insurance Number",
  "Right to Work Status",
  "DBS Status",
  "Next of Kin Name",
  "Next of Kin Relationship",
  "Next of Kin Telephone"
];

const optionalStaffColumns = [
  "Title",
  "Preferred Name",
  "Sex",
  "Gender Identity",
  "Gender Identity Self-Describe",
  "Ethnicity",
  "Religion or Belief",
  "Religion or Belief Self-Describe",
  "Disability Status",
  "Sexual Orientation",
  "Sexual Orientation Self-Describe",
  "Marital / Civil Partnership Status",
  "Nationality",
  "Preferred Language",
  "Preferred Language Other",
  "Pronouns",
  "Work Area",
  "Line Manager",
  "Contract Type",
  "Weekly Contracted Hours",
  "Payroll Number",
  "Bank Details Placeholder",
  "DBS Certificate Number",
  "DBS Issue Date",
  "DBS Renewal Date",
  "Right to Work Document Reference",
  "Passport/ID Reference",
  "Training Status",
  "Medication Competency",
  "Moving and Handling Competency",
  "Safeguarding Training",
  "Reference 1 Name",
  "Reference 1 Contact",
  "Reference 2 Name",
  "Reference 2 Contact",
  "Emergency Contact Name",
  "Emergency Contact Telephone",
  "Notes"
];

const requiredServiceUserColumns = [
  "Service User Reference Number",
  "First Name",
  "Surname",
  "Date of Birth",
  "Telephone Number",
  "Address Line 1",
  "Address Line 2",
  "Town/City",
  "Postcode",
  "Next of Kin Name",
  "Next of Kin Relationship",
  "Next of Kin Telephone",
  "Funding Source",
  "Package Type",
  "Risk Level"
];

const optionalServiceUserColumns = [
  "Title",
  "Preferred Name",
  "Gender",
  "NHS Number",
  "GP Surgery",
  "GP Telephone",
  "Social Worker Name",
  "Social Worker Email",
  "Local Authority",
  "NHS/ICB Team",
  "Funding Reference",
  "Emergency Contact Name",
  "Emergency Contact Telephone",
  "Family Portal Contact",
  "Main Language",
  "Communication Needs",
  "Lives Alone yes/no",
  "Dementia yes/no",
  "Mental Health yes/no",
  "Challenging Behaviour yes/no",
  "Medication Support Required yes/no",
  "Moving and Handling Required yes/no",
  "Falls Risk",
  "Pressure Area Risk",
  "Allergies",
  "Medical Conditions",
  "Key Safe Location",
  "Key Safe Code restricted field",
  "Care Plan Status",
  "Risk Assessment Status",
  "Start Date",
  "Review Date",
  "Notes"
];

const staffAliases: Record<string, string> = {
  "worker first name": "First Name",
  "employee first name": "First Name",
  "forename": "First Name",
  "last name": "Surname",
  "worker surname": "Surname",
  "employee surname": "Surname",
  "staff ref": "Staff Reference Number",
  "employee ref": "Staff Reference Number",
  "worker reference": "Staff Reference Number",
  "mobile": "Mobile Number",
  "phone": "Telephone Number",
  "role": "Job Role",
  "start date": "Employment Start Date",
  "gender": "Gender Identity",
  "sex": "Sex",
  "gender identity": "Gender Identity",
  "religion": "Religion or Belief",
  "religion or belief": "Religion or Belief",
  "disability": "Disability Status",
  "sexual orientation": "Sexual Orientation",
  "marital status": "Marital / Civil Partnership Status",
  "language": "Preferred Language",
  "preferred language": "Preferred Language",
  "ni number": "National Insurance Number",
  "dbs": "DBS Status",
  "rtw": "Right to Work Status"
};

const serviceUserAliases: Record<string, string> = {
  "client ref": "Service User Reference Number",
  "service user ref": "Service User Reference Number",
  "client reference": "Service User Reference Number",
  "forename": "First Name",
  "client first name": "First Name",
  "last name": "Surname",
  "client surname": "Surname",
  "phone": "Telephone Number",
  "funding": "Funding Source",
  "package": "Package Type",
  "risk": "Risk Level",
  "nhs no": "NHS Number"
};

const demoCompany: OnboardingCompany = {
  companyId: "company-demo-care-provider",
  providerId: "provider-demo-care-provider",
  branchId: "DEMO-CQC-001",
  companyName: "Demo Care Provider Ltd",
  tradingName: "Demo Care Provider",
  registrationNumber: "DEMO-REG-001",
  cqcProviderId: "DEMO-PROVIDER-001",
  cqcLocationId: "DEMO-CQC-001",
  address: "Demo House, 1 Care Provider Street, Hayes",
  postcode: "UB4 0SD",
  telephone: "07000000000",
  email: "provider.demo@example.com",
  website: "https://demo-care-provider.example.com",
  registeredManagerName: "Demo Registered Manager",
  registeredManagerEmail: "registered.manager@example.com",
  nominatedIndividualName: "Demo Nominated Individual",
  serviceTypes: ["Personal Care", "Outreach", "NHS Funded Care", "Local Authority Funded Care"],
  localAuthorityContracts: "Yes",
  nhsFundedClients: "Yes",
  privateClients: "Yes",
  logoStatus: "Logo upload placeholder ready",
  primaryContact: "Demo Registered Manager",
  billingContact: "Demo Finance Administrator A",
  dataProtectionLead: "Demo IG Lead",
  goLiveDate: "2026-06-15",
  migrationStatus: "Data import pending",
  companyStatus: "Onboarding"
};

const demoStaffRows: Record<string, string>[] = [
  { "Staff Reference Number": "DCP-CW-001", "First Name": "Demo", Surname: "Care Worker A", "Date of Birth": "1986-01-12", Email: "demo.care.worker.a@provider.example", "Mobile Number": "07000000101", "Telephone Number": "02000000101", "Address Line 1": "1 Demo Road", "Address Line 2": "Flat A", "Town/City": "Hayes", Postcode: "UB4 0SD", "Job Role": "Care Worker / Mobile User", "Employment Start Date": "2026-05-01", "Employment Status": "Active", "National Insurance Number": "QQ123456C", "Right to Work Status": "Current", "DBS Status": "Current", "Next of Kin Name": "Demo NOK A", "Next of Kin Relationship": "Sibling", "Next of Kin Telephone": "07000000901", "Training Status": "Compliant", "Medication Competency": "Yes", "Moving and Handling Competency": "Yes", "Safeguarding Training": "Current" },
  { "Staff Reference Number": "DCP-CW-002", "First Name": "Demo", Surname: "Care Worker B", "Date of Birth": "1990-03-04", Email: "demo.care.worker.b@provider.example", "Mobile Number": "07000000102", "Telephone Number": "02000000102", "Address Line 1": "2 Demo Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0SE", "Job Role": "Care Worker", "Employment Start Date": "2026-05-02", "Employment Status": "Active", "National Insurance Number": "QQ123457C", "Right to Work Status": "Current", "DBS Status": "Current", "Next of Kin Name": "Demo NOK B", "Next of Kin Relationship": "Parent", "Next of Kin Telephone": "07000000902", "Training Status": "Compliant", "Medication Competency": "Yes", "Moving and Handling Competency": "Yes", "Safeguarding Training": "Current" },
  { "Staff Reference Number": "DCP-COORD-001", "First Name": "Demo", Surname: "Care Coordinator A", "Date of Birth": "1984-07-18", Email: "demo.coordinator.a@provider.example", "Mobile Number": "07000000103", "Telephone Number": "02000000103", "Address Line 1": "3 Demo Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0SF", "Job Role": "Care Coordinator", "Employment Start Date": "2026-05-03", "Employment Status": "Active", "National Insurance Number": "QQ123458C", "Right to Work Status": "Current", "DBS Status": "Current", "Next of Kin Name": "Demo NOK C", "Next of Kin Relationship": "Partner", "Next of Kin Telephone": "07000000903", "Training Status": "Compliant" },
  { "Staff Reference Number": "DCP-HR-001", "First Name": "Demo", Surname: "HR Administrator A", "Date of Birth": "1988-09-10", Email: "demo.hr.a@provider.example", "Mobile Number": "07000000104", "Telephone Number": "02000000104", "Address Line 1": "4 Demo Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0SG", "Job Role": "HR Administrator", "Employment Start Date": "2026-05-04", "Employment Status": "Active", "National Insurance Number": "QQ123459C", "Right to Work Status": "Current", "DBS Status": "Current", "Next of Kin Name": "Demo NOK D", "Next of Kin Relationship": "Friend", "Next of Kin Telephone": "07000000904", "Training Status": "Compliant" },
  { "Staff Reference Number": "DCP-FIN-001", "First Name": "Demo", Surname: "Finance Administrator A", "Date of Birth": "1982-11-20", Email: "demo.finance.a@provider.example", "Mobile Number": "07000000105", "Telephone Number": "02000000105", "Address Line 1": "5 Demo Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0SH", "Job Role": "Finance Administrator", "Employment Start Date": "2026-05-05", "Employment Status": "Active", "National Insurance Number": "QQ123450C", "Right to Work Status": "Current", "DBS Status": "Current", "Next of Kin Name": "Demo NOK E", "Next of Kin Relationship": "Sibling", "Next of Kin Telephone": "07000000905", "Training Status": "Compliant" }
];

const demoServiceUserRows: Record<string, string>[] = [
  { "Service User Reference Number": "DCP-SU-101", "First Name": "Demo", Surname: "Service User 101", "Date of Birth": "1942-02-14", "Telephone Number": "02000000201", "Address Line 1": "101 Demo Avenue", "Address Line 2": "Flat 1", "Town/City": "Hayes", Postcode: "UB4 0AA", "Next of Kin Name": "Demo Family 101", "Next of Kin Relationship": "Daughter", "Next of Kin Telephone": "07000000801", "Funding Source": "Local Authority", "Package Type": "Personal Care", "Risk Level": "High", "Medication Support Required yes/no": "Yes", "Moving and Handling Required yes/no": "Yes", "Care Plan Status": "Draft", "Risk Assessment Status": "Draft" },
  { "Service User Reference Number": "DCP-SU-102", "First Name": "Demo", Surname: "Service User 102", "Date of Birth": "1950-04-22", "Telephone Number": "02000000202", "Address Line 1": "102 Demo Avenue", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0AB", "Next of Kin Name": "Demo Family 102", "Next of Kin Relationship": "Son", "Next of Kin Telephone": "07000000802", "Funding Source": "Mixed Funding", "Package Type": "Outreach", "Risk Level": "Medium", "Medication Support Required yes/no": "No", "Moving and Handling Required yes/no": "No", "Care Plan Status": "Draft", "Risk Assessment Status": "Draft" },
  { "Service User Reference Number": "DCP-NHS-201", "First Name": "Demo", Surname: "NHS Funded Service User 201", "Date of Birth": "1938-06-30", "Telephone Number": "02000000203", "Address Line 1": "201 Demo NHS Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0AC", "Next of Kin Name": "Demo NHS Family", "Next of Kin Relationship": "Nephew", "Next of Kin Telephone": "07000000803", "Funding Source": "NHS / ICB", "Package Type": "Medication Support", "Risk Level": "Critical", "NHS Number": "999 000 0201", "Medication Support Required yes/no": "Yes", "Moving and Handling Required yes/no": "Yes", "Care Plan Status": "Draft", "Risk Assessment Status": "Draft" },
  { "Service User Reference Number": "DCP-LA-301", "First Name": "Demo", Surname: "Local Authority Service User 301", "Date of Birth": "1945-08-08", "Telephone Number": "02000000204", "Address Line 1": "301 Demo LA Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0AD", "Next of Kin Name": "Demo LA Family", "Next of Kin Relationship": "Brother", "Next of Kin Telephone": "07000000804", "Funding Source": "Local Authority", "Package Type": "Welfare Check", "Risk Level": "Medium", "Medication Support Required yes/no": "No", "Moving and Handling Required yes/no": "No", "Care Plan Status": "Draft", "Risk Assessment Status": "Draft" },
  { "Service User Reference Number": "DCP-PRIV-401", "First Name": "Demo", Surname: "Private Client 401", "Date of Birth": "1955-12-02", "Telephone Number": "02000000205", "Address Line 1": "401 Demo Private Road", "Address Line 2": "", "Town/City": "Hayes", Postcode: "UB4 0AE", "Next of Kin Name": "Demo Private Family", "Next of Kin Relationship": "Daughter", "Next of Kin Telephone": "07000000805", "Funding Source": "Private", "Package Type": "Sitting Service", "Risk Level": "Low", "Medication Support Required yes/no": "No", "Moving and Handling Required yes/no": "No", "Family Portal Contact": "family.portal.demo@example.com", "Care Plan Status": "Draft", "Risk Assessment Status": "Draft" }
];

function readLocalJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeLocalJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function mergeByKey<T>(items: T[], additions: T[], keyFn: (item: T) => string) {
  const map = new Map(items.map((item) => [keyFn(item), item]));
  additions.forEach((item) => map.set(keyFn(item), item));
  return Array.from(map.values());
}

function normalise(value: string) {
  return value.trim().toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "CV";
}

function parseCsv(text: string) {
  const rows: string[][] = [];
  let current = "";
  let row: string[] = [];
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(current.trim());
      current = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(current.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      current = "";
    } else {
      current += char;
    }
  }
  row.push(current.trim());
  if (row.some(Boolean)) rows.push(row);
  const headers = rows[0] ?? [];
  return rows.slice(1).map((values) =>
    headers.reduce<Record<string, string>>((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {})
  );
}

function csvEscape(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

function downloadTextFile(name: string, content: string, type = "text/csv") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function buildCsv(headers: string[], rows: Record<string, string>[]) {
  return [headers.map(csvEscape).join(","), ...rows.map((row) => headers.map((header) => csvEscape(row[header] ?? "")).join(","))].join("\n");
}

function suggestedMapping(headers: string[], type: ImportType, saved: Record<string, string>) {
  const fields = type === "staff" ? [...requiredStaffColumns, ...optionalStaffColumns] : [...requiredServiceUserColumns, ...optionalServiceUserColumns];
  const aliases = type === "staff" ? staffAliases : serviceUserAliases;
  return headers.reduce<Record<string, string>>((mapping, header) => {
    const direct = fields.find((field) => normalise(field) === normalise(header));
    mapping[header] = saved[header] ?? direct ?? aliases[normalise(header)] ?? "Ignore column";
    return mapping;
  }, {});
}

function applyMapping(rows: Record<string, string>[], mapping: Record<string, string>) {
  return rows.map((row) =>
    Object.entries(row).reduce<Record<string, string>>((mapped, [sourceField, value]) => {
      const target = mapping[sourceField];
      if (target && target !== "Ignore column") mapped[target] = value;
      return mapped;
    }, {})
  );
}

function validateEmail(value: string) {
  return !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function buildImportRows(type: ImportType, rows: Record<string, string>[], mapping: Record<string, string>, company: OnboardingCompany) {
  const mappedRows = applyMapping(rows, mapping);
  const currentStaff = readLocalJson<StaffMemberRecord[]>(demoStoreKeys.staff, []);
  const currentClients = readLocalJson<ServiceUserRecord[]>(demoStoreKeys.clients, []);
  const staffRefs = new Set(currentStaff.map((item) => item.ref));
  const staffEmails = new Set(currentStaff.map((item) => (item.email ?? "").toLowerCase()).filter(Boolean));
  const clientRefs = new Set(currentClients.map((item) => item.id));
  const currentClientNames = new Set(currentClients.map((item) => `${normalise(item.name)}|${item.postcode ?? ""}`));
  const seenRefs = new Set<string>();
  const seenEmails = new Set<string>();
  const seenDobNames = new Set<string>();

  return mappedRows.map<ImportRow>((mapped, index) => {
    const issues: string[] = [];
    const duplicates: string[] = [];
    const required = type === "staff" ? requiredStaffColumns : requiredServiceUserColumns;
    required.forEach((field) => {
      if (!mapped[field]) issues.push(`${field} missing`);
    });

    if (type === "staff") {
      const ref = mapped["Staff Reference Number"];
      const email = mapped.Email?.toLowerCase() ?? "";
      const nameDob = `${normalise(`${mapped["First Name"] ?? ""} ${mapped.Surname ?? ""}`)}|${mapped["Date of Birth"] ?? ""}`;
      if (!validateEmail(mapped.Email ?? "")) issues.push("Email format warning");
      if (ref && (staffRefs.has(ref) || seenRefs.has(ref))) duplicates.push("Duplicate staff reference");
      if (email && (staffEmails.has(email) || seenEmails.has(email))) duplicates.push("Duplicate email");
      if (nameDob.includes("|") && seenDobNames.has(nameDob)) duplicates.push("Same name and date of birth");
      if ((mapped["National Insurance Number"] ?? "").length < 8) issues.push("NI number format warning");
      if (!mapped["Mobile Number"]) issues.push("Mobile number warning");
      if (!mapped["DBS Status"]) issues.push("DBS status warning");
      if (!mapped["Right to Work Status"]) issues.push("Right-to-work missing warning");
      if (!mapped["Next of Kin Name"] || !mapped["Next of Kin Telephone"]) issues.push("Next of kin missing warning");
      if (!mapped.Postcode) issues.push("Postcode missing warning");
      if (ref) seenRefs.add(ref);
      if (email) seenEmails.add(email);
      if (nameDob) seenDobNames.add(nameDob);
    } else {
      const ref = mapped["Service User Reference Number"];
      const nhs = mapped["NHS Number"];
      const nameDob = `${normalise(`${mapped["First Name"] ?? ""} ${mapped.Surname ?? ""}`)}|${mapped["Date of Birth"] ?? ""}`;
      const addressDob = `${normalise(`${mapped["Address Line 1"] ?? ""} ${mapped.Postcode ?? ""}`)}|${mapped["Date of Birth"] ?? ""}`;
      if (ref && (clientRefs.has(ref) || seenRefs.has(ref))) duplicates.push("Duplicate service user reference");
      if (nhs && seenEmails.has(nhs)) duplicates.push("Duplicate NHS number");
      if (nameDob && seenDobNames.has(nameDob)) duplicates.push("Same name and date of birth");
      if (currentClientNames.has(`${normalise(`${mapped["First Name"] ?? ""} ${mapped.Surname ?? ""}`)}|${mapped.Postcode ?? ""}`) || seenEmails.has(addressDob)) duplicates.push("Same address and date of birth");
      if (!mapped["Telephone Number"]) issues.push("Telephone warning");
      if (!mapped["Address Line 1"]) issues.push("Address required");
      if (!mapped.Postcode) issues.push("Postcode required");
      if (!mapped["Next of Kin Name"] || !mapped["Next of Kin Telephone"]) issues.push("Next of kin warning");
      if (!mapped["Funding Source"]) issues.push("Funding source required");
      if (!mapped["Risk Level"]) issues.push("Risk level required");
      if (mapped["Key Safe Code restricted field"]) issues.push("Key safe code restricted field warning");
      if (ref) seenRefs.add(ref);
      if (nhs) seenEmails.add(nhs);
      if (nameDob) seenDobNames.add(nameDob);
      if (addressDob) seenEmails.add(addressDob);
    }

    const hasMissingRequired = issues.some((issue) => issue.includes("missing") || issue.includes("required"));
    const status: ValidationStatus = duplicates.length ? "Duplicate" : hasMissingRequired ? "Missing required field" : issues.length ? "Warning" : "Valid";
    return {
      rowNumber: index + 2,
      source: rows[index],
      mapped: {
        ...mapped,
        companyId: company.companyId,
        providerId: company.providerId,
        branchId: company.branchId
      },
      status,
      issues,
      duplicateReasons: duplicates,
      approved: status === "Valid",
      ignored: false
    };
  });
}

function statusTone(status: ValidationStatus): Tone {
  if (status === "Valid") return "green";
  if (status === "Warning" || status === "Needs review") return "amber";
  if (status === "Duplicate") return "purple";
  return "red";
}

function makeStaffRecord(row: ImportRow, company: OnboardingCompany): StaffMemberRecord {
  const name = `${row.mapped["First Name"] ?? ""} ${row.mapped.Surname ?? ""}`.trim();
  return {
    name,
    ref: row.mapped["Staff Reference Number"],
    role: row.mapped["Job Role"] || "Care Worker",
    dbs: row.mapped["DBS Status"] || "Review",
    training: row.mapped["Training Status"] || "Import review",
    ni: "Restricted",
    photo: initialsFromName(name),
    status: row.mapped["Employment Status"] || "Active",
    email: row.mapped.Email,
    mobile: row.mapped["Mobile Number"],
    jobTitle: row.mapped["Job Role"],
    address: [row.mapped["Address Line 1"], row.mapped["Address Line 2"], row.mapped["Town/City"], row.mapped.Postcode].filter(Boolean).join(", "),
    startDate: row.mapped["Employment Start Date"],
    rightToWork: row.mapped["Right to Work Status"],
    companyId: company.companyId,
    providerId: company.providerId,
    branchId: company.branchId
  };
}

function makeServiceUserRecord(row: ImportRow, company: OnboardingCompany): ServiceUserRecord {
  const name = `${row.mapped["First Name"] ?? ""} ${row.mapped.Surname ?? ""}`.trim();
  const packageType = row.mapped["Package Type"] || "Personal Care";
  const funding = row.mapped["Funding Source"] || "Other";
  const risk = riskLevelOptions.includes(row.mapped["Risk Level"]) ? (row.mapped["Risk Level"] as ServiceUserRecord["riskLevel"]) : "Medium";
  return {
    id: row.mapped["Service User Reference Number"],
    name,
    package: packageType,
    funding,
    preferredName: row.mapped["Preferred Name"],
    address: [row.mapped["Address Line 1"], row.mapped["Address Line 2"], row.mapped["Town/City"]].filter(Boolean).join(", "),
    postcode: row.mapped.Postcode,
    riskLevel: risk,
    companyId: company.companyId,
    providerId: company.providerId,
    branchId: company.branchId,
    regularTeam: {
      primary: "Imported staff to allocate",
      additional: "Not assigned",
      outreach: packageType.includes("Outreach") ? "Imported outreach worker to allocate" : "Not applicable",
      additionalOutreach: "Not applicable",
      preferred: [],
      excluded: [],
      skills: [packageType, funding, `${risk} risk`],
      preference: "Imported record. Care plan, risk assessment and permissions require manager review before go-live.",
      usualTimes: [packageType],
      duration: "To be confirmed",
      doubleUp: row.mapped["Moving and Handling Required yes/no"] === "Yes" ? "Review double-up need" : "Not confirmed",
      continuity: risk === "Critical" || risk === "High" ? "High" : "Medium"
    }
  };
}

function CompanyOnboardingCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200 ${className}`}>{children}</section>;
}

function CompanySectionTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="min-w-0">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {subtitle ? <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-500">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

function CompanyPill({ children, tone = "slate" }: { children: ReactNode; tone?: Tone }) {
  const tones: Record<Tone, string> = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-rose-50 text-rose-700 ring-rose-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    teal: "bg-teal-50 text-teal-700 ring-teal-200",
    slate: "bg-slate-50 text-slate-700 ring-slate-200",
    purple: "bg-purple-50 text-purple-700 ring-purple-200"
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]}`}>{children}</span>;
}

function InputField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
      <input className="mt-2 w-full rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold" onChange={(event) => onChange(event.target.value)} type={type} value={value} />
    </label>
  );
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
      <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" onChange={(event) => onChange(event.target.value)} value={value}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function DashboardMetric({ label, value, tone }: { label: string; value: string | number; tone: Tone }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100">
      <div className="text-xs font-bold uppercase text-slate-500">{label}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <span className="text-2xl font-black text-slate-900">{value}</span>
        <CompanyPill tone={tone}>{label.includes("error") || label.includes("failed") ? "Review" : "Tracked"}</CompanyPill>
      </div>
    </div>
  );
}

function percentage(part: number, whole: number) {
  if (!whole) return 0;
  return Math.max(0, Math.min(100, Math.round((part / whole) * 100)));
}

function StatusDot({ tone }: { tone: Tone }) {
  const tones: Record<Tone, string> = {
    green: "bg-emerald-500",
    red: "bg-rose-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    teal: "bg-teal-500",
    slate: "bg-slate-500",
    purple: "bg-purple-500"
  };
  return <span className={`h-2.5 w-2.5 rounded-full ${tones[tone]}`} />;
}

function MiniBar({ label, value, max, tone }: { label: string; value: number; max: number; tone: Tone }) {
  const toneClass: Record<Tone, string> = {
    green: "bg-emerald-500",
    red: "bg-rose-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    teal: "bg-teal-500",
    slate: "bg-slate-500",
    purple: "bg-purple-500"
  };
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs font-black uppercase tracking-[0.08em] text-slate-500">
        <span>{label}</span>
        <span className="text-slate-900">{value}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${toneClass[tone]}`} style={{ width: `${percentage(value, Math.max(max, 1))}%` }} />
      </div>
    </div>
  );
}

function CompanyGraphicsCommandCentre({ company, metrics }: { company: OnboardingCompany; metrics: ImportDashboardMetrics }) {
  const totalUploaded = metrics.staffUploaded + metrics.serviceUploaded;
  const totalErrors = metrics.staffErrors + metrics.serviceErrors;
  const readyPercent = percentage(metrics.ready, Math.max(totalUploaded, 1));
  const importPercent = percentage(metrics.imported, Math.max(totalUploaded, metrics.imported, 1));
  const stageOrder = ["Draft", "Onboarding", "Data import pending", "Validation required", "Ready for review", "Approved", "Live"];
  const activeStage = Math.max(0, stageOrder.indexOf(company.companyStatus));
  const stages = [
    { label: "Provider shell", detail: company.companyStatus, tone: "blue" as Tone },
    { label: "Excel intake", detail: `${totalUploaded} rows`, tone: "teal" as Tone },
    { label: "Validation gate", detail: `${totalErrors + metrics.duplicates} checks`, tone: totalErrors || metrics.duplicates ? ("amber" as Tone) : ("green" as Tone) },
    { label: "Tenant vault", detail: company.companyId, tone: "purple" as Tone },
    { label: "Live ECM", detail: `${metrics.imported} imported`, tone: metrics.imported ? ("green" as Tone) : ("slate" as Tone) }
  ];
  const ringOffset = 326 - (326 * Math.max(readyPercent, importPercent)) / 100;

  return (
    <CompanyOnboardingCard className="overflow-hidden p-0">
      <div className="bg-[#071A32] p-5 text-white">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="text-xs font-black uppercase tracking-[0.16em] text-teal-200">Provider migration command centre</div>
            <h2 className="mt-2 text-2xl font-black tracking-tight">{company.companyName}</h2>
            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-slate-300">
              Visual overview for onboarding, Excel import, validation, approvals, tenant separation and go-live readiness.
            </p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <div className="rounded-md bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <div className="text-xs font-bold uppercase text-slate-300">Ready</div>
              <div className="mt-1 text-2xl font-black text-white">{readyPercent}%</div>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <div className="text-xs font-bold uppercase text-slate-300">Duplicates</div>
              <div className="mt-1 text-2xl font-black text-white">{metrics.duplicates}</div>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-3 ring-1 ring-white/15">
              <div className="text-xs font-bold uppercase text-slate-300">Imported</div>
              <div className="mt-1 text-2xl font-black text-white">{metrics.imported}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-5 xl:grid-cols-[360px_1fr]">
          <div className="rounded-lg bg-white p-5 text-slate-900 ring-1 ring-white/20">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Go-live signal</div>
                <div className="mt-1 text-lg font-black">{company.migrationStatus}</div>
              </div>
              <CompanyPill tone={metrics.failed ? "red" : metrics.ready ? "green" : "blue"}>{metrics.failed ? "Review" : metrics.ready ? "Ready" : "Preparing"}</CompanyPill>
            </div>
            <div className="mt-5 flex items-center justify-center">
              <svg aria-label="Readiness progress graphic" className="h-48 w-48" role="img" viewBox="0 0 128 128">
                <circle cx="64" cy="64" fill="none" r="52" stroke="#E2E8F0" strokeWidth="10" />
                <circle cx="64" cy="64" fill="none" r="52" stroke="#14B8A6" strokeDasharray="326" strokeDashoffset={ringOffset} strokeLinecap="round" strokeWidth="10" transform="rotate(-90 64 64)" />
                <circle cx="64" cy="64" fill="#0B1F3A" r="36" />
                <text fill="#FFFFFF" fontSize="22" fontWeight="900" textAnchor="middle" x="64" y="61">{Math.max(readyPercent, importPercent)}%</text>
                <text fill="#BAE6FD" fontSize="8" fontWeight="700" textAnchor="middle" x="64" y="77">IMPORT FLOW</text>
              </svg>
            </div>
            <div className="mt-2 space-y-3">
              <MiniBar label="Rows uploaded" max={Math.max(totalUploaded, 5)} tone="blue" value={totalUploaded} />
              <MiniBar label="Approved to import" max={Math.max(totalUploaded, 5)} tone="green" value={metrics.ready} />
              <MiniBar label="Needs review" max={Math.max(totalUploaded, 5)} tone="amber" value={totalErrors + metrics.duplicates} />
            </div>
          </div>

          <div className="rounded-lg bg-white/95 p-5 text-slate-900 ring-1 ring-white/20">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Migration route map</div>
                <div className="mt-1 text-lg font-black">Legacy exports into tenant-safe CareVerity modules</div>
              </div>
              <CompanyPill tone="teal">companyId locked</CompanyPill>
            </div>
            <div className="grid gap-3 md:grid-cols-5">
              {stages.map((stage, index) => (
                <div className="relative min-h-[150px] rounded-lg border border-slate-200 bg-slate-50 p-4" key={stage.label}>
                  {index < stages.length - 1 ? <div className="absolute right-[-18px] top-1/2 z-10 hidden h-0.5 w-9 bg-teal-400 md:block" /> : null}
                  <div className="flex items-center justify-between">
                    <StatusDot tone={stage.tone} />
                    <span className="text-xs font-black text-slate-400">0{index + 1}</span>
                  </div>
                  <div className="mt-5 text-sm font-black text-slate-900">{stage.label}</div>
                  <div className="mt-2 break-words text-xs font-bold leading-5 text-slate-500">{stage.detail}</div>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-2 md:grid-cols-7">
              {stageOrder.map((stage, index) => (
                <div className="text-center" key={stage}>
                  <div className={`h-2 rounded-full ${index <= activeStage ? "bg-teal-500" : "bg-slate-200"}`} />
                  <div className="mt-2 text-[11px] font-black uppercase leading-4 text-slate-500">{stage}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CompanyOnboardingCard>
  );
}

function ImportDashboardGraphics({ company, metrics, staffRows, serviceUserRows }: { company: OnboardingCompany; metrics: ImportDashboardMetrics; staffRows: ImportRow[]; serviceUserRows: ImportRow[] }) {
  const totalUploaded = metrics.staffUploaded + metrics.serviceUploaded;
  const totalValid = metrics.staffValid + metrics.serviceValid;
  const totalErrors = metrics.staffErrors + metrics.serviceErrors;
  const totalWarnings = [...staffRows, ...serviceUserRows].filter((row) => row.status === "Warning" || row.status === "Needs review").length;
  const maxFunnel = Math.max(totalUploaded, metrics.ready, metrics.imported, 1);
  const funnel = [
    { label: "Uploaded", value: totalUploaded, tone: "blue" as Tone },
    { label: "Valid", value: totalValid, tone: "green" as Tone },
    { label: "Ready", value: metrics.ready, tone: "teal" as Tone },
    { label: "Imported", value: metrics.imported, tone: "purple" as Tone }
  ];
  const validationSlices = [
    { label: "Valid", value: totalValid, color: "#10B981" },
    { label: "Warnings", value: totalWarnings, color: "#F59E0B" },
    { label: "Errors", value: totalErrors, color: "#F43F5E" },
    { label: "Duplicates", value: metrics.duplicates, color: "#8B5CF6" }
  ];
  const validationTotal = Math.max(validationSlices.reduce((total, slice) => total + slice.value, 0), 1);
  let cursor = 0;
  const conic = validationSlices
    .map((slice) => {
      const start = cursor;
      cursor += (slice.value / validationTotal) * 100;
      return `${slice.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="mb-5 grid gap-4 xl:grid-cols-[1.2fr_0.8fr_1fr]">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Import funnel</div>
            <div className="mt-1 text-lg font-black text-slate-900">Rows moving toward approved import</div>
          </div>
          <CompanyPill tone={metrics.failed ? "red" : "green"}>{metrics.failed ? "Exceptions" : "Controlled"}</CompanyPill>
        </div>
        <div className="mt-5 space-y-4">
          {funnel.map((stage) => (
            <div className="grid grid-cols-[88px_1fr_42px] items-center gap-3" key={stage.label}>
              <div className="text-xs font-black uppercase text-slate-500">{stage.label}</div>
              <div className="h-8 overflow-hidden rounded-md bg-slate-100">
                <div className={`h-full rounded-md ${stage.tone === "blue" ? "bg-blue-500" : stage.tone === "green" ? "bg-emerald-500" : stage.tone === "teal" ? "bg-teal-500" : "bg-purple-500"}`} style={{ width: `${percentage(stage.value, maxFunnel)}%` }} />
              </div>
              <div className="text-right text-sm font-black text-slate-900">{stage.value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 h-24 rounded-lg bg-slate-50 p-3 ring-1 ring-slate-100">
          <svg aria-label="Import trend graphic" className="h-full w-full" preserveAspectRatio="none" role="img" viewBox="0 0 300 80">
            <polyline fill="none" points="8,62 58,46 108,52 158,30 208,36 258,18 292,24" stroke="#0F766E" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
            <polyline fill="none" points="8,70 58,64 108,66 158,56 208,60 258,48 292,44" stroke="#2563EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            <polyline fill="none" points="8,74 58,72 108,70 158,72 208,68 258,70 292,66" stroke="#F59E0B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
          </svg>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Validation wheel</div>
        <div className="mt-1 text-lg font-black text-slate-900">Data quality balance</div>
        <div className="mt-5 flex items-center justify-center">
          <div className="grid h-44 w-44 place-items-center rounded-full" style={{ background: `conic-gradient(${conic})` }}>
            <div className="grid h-28 w-28 place-items-center rounded-full bg-white text-center ring-1 ring-slate-200">
              <div>
                <div className="text-3xl font-black text-slate-900">{percentage(totalValid, validationTotal)}%</div>
                <div className="text-xs font-black uppercase text-slate-500">valid</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 grid gap-2">
          {validationSlices.map((slice) => (
            <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-600" key={slice.label}>
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: slice.color }} />{slice.label}</span>
              <span className="font-black text-slate-900">{slice.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-black uppercase tracking-[0.12em] text-slate-500">Tenant separation graphic</div>
            <div className="mt-1 text-lg font-black text-slate-900">{company.companyId}</div>
          </div>
          <CompanyPill tone="purple">isolated</CompanyPill>
        </div>
        <div className="mt-5 grid gap-2">
          {[
            ["companyId", company.companyId, "bg-[#0B1F3A]"],
            ["providerId", company.providerId, "bg-teal-600"],
            ["branchId/locationId", company.branchId, "bg-blue-600"]
          ].map(([label, value, colour]) => (
            <div className="grid grid-cols-[128px_1fr] overflow-hidden rounded-md border border-slate-200" key={label}>
              <div className={`${colour} px-3 py-2 text-xs font-black uppercase text-white`}>{label}</div>
              <div className="min-w-0 break-words bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700">{value}</div>
            </div>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2">
          {["Staff", "Service users", "Rota", "Documents", "Training", "Medication", "Finance", "Reports"].map((domain) => (
            <div className="rounded-md bg-slate-50 px-3 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-100" key={domain}>
              {domain}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DatabaseReadinessPanel() {
  const status = getCareVerityDatabaseStatus();
  const rows = [
    ["Runtime mode", status.demoMode ? "Demo/localStorage mode" : "Database mode"],
    ["Supabase connected", status.supabaseConfigured ? "Configured" : "Not connected yet"],
    ["Multi-tenant mode", status.multiTenantMode ? "Prepared" : "Disabled"],
    ["Audit logging", status.auditLogEnabled ? "Enabled placeholder" : "Disabled"],
    ["Service layer", "/lib/careverity-db.ts ready"],
    ["Schema", "supabase/schema.sql includes CareVerity SaaS tables"]
  ] satisfies Array<[string, string]>;

  return (
    <CompanyOnboardingCard className="border-l-4 border-l-blue-500">
      <CompanySectionTitle
        action={<CompanyPill tone={status.demoMode ? "amber" : status.supabaseConfigured ? "green" : "red"}>{status.demoMode ? "Demo mode" : status.supabaseConfigured ? "Database ready" : "Needs Supabase env"}</CompanyPill>}
        subtitle={status.message}
        title="Database readiness status"
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {rows.map(([label, value]) => (
          <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100" key={label}>
            <div className="text-xs font-black uppercase text-slate-500">{label}</div>
            <div className="mt-2 text-sm font-black text-slate-900">{value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-lg bg-blue-50 p-4 text-sm font-bold leading-6 text-blue-900 ring-1 ring-blue-100">
        {tenantQueryWarning}
      </div>
    </CompanyOnboardingCard>
  );
}

function CompanyOnboardingPage() {
  const [companies, setCompanies] = useState<OnboardingCompany[]>(() => readLocalJson(companyStoreKeys.companies, [demoCompany]));
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.companyId ?? demoCompany.companyId);
  const [activeTab, setActiveTab] = useState("Company Details");
  const [staffSourceRows, setStaffSourceRows] = useState<Record<string, string>[]>([]);
  const [serviceUserSourceRows, setServiceUserSourceRows] = useState<Record<string, string>[]>([]);
  const [staffMapping, setStaffMapping] = useState<Record<string, string>>(() => readLocalJson<SavedMappingTemplate>(companyStoreKeys.mapping, {}).staff ?? {});
  const [serviceUserMapping, setServiceUserMapping] = useState<Record<string, string>>(() => readLocalJson<SavedMappingTemplate>(companyStoreKeys.mapping, {}).serviceUsers ?? {});
  const [staffRows, setStaffRows] = useState<ImportRow[]>([]);
  const [serviceUserRows, setServiceUserRows] = useState<ImportRow[]>([]);
  const [history, setHistory] = useState<ImportBatch[]>(() => readLocalJson(companyStoreKeys.batches, []));
  const [audit, setAudit] = useState<AuditEvent[]>(() => readLocalJson(companyStoreKeys.audit, []));
  const [message, setMessage] = useState("Ready to onboard providers and import Excel-compatible staff or service user data.");
  const [confirmations, setConfirmations] = useState<Record<string, boolean>>({});
  const selectedCompany = companies.find((company) => company.companyId === selectedCompanyId) ?? companies[0] ?? demoCompany;
  const allConfirmed = ["lawful", "accurate", "minimal", "authorised", "secure", "audited"].every((key) => confirmations[key]);
  const tabs = ["Company Details", "Import Staff", "Import Service Users", "Import Validation", "Import History", "Mapping Settings", "Data Protection Review", "Go-Live Checklist", "Audit Log"];
  const staffHeaders = useMemo(() => (staffSourceRows[0] ? Object.keys(staffSourceRows[0]) : requiredStaffColumns), [staffSourceRows]);
  const serviceUserHeaders = useMemo(() => (serviceUserSourceRows[0] ? Object.keys(serviceUserSourceRows[0]) : requiredServiceUserColumns), [serviceUserSourceRows]);
  const databaseStatus = getCareVerityDatabaseStatus();

  const addAudit = (action: string, recordType: string, reason: string, rowNumber = "") => {
    const event: AuditEvent = {
      id: `AUD-IMPORT-${Date.now()}-${audit.length + 1}`,
      dateTime: new Date().toISOString(),
      user: "Demo System Owner",
      role: "System Owner",
      company: selectedCompany.companyName,
      action,
      recordType,
      rowNumber,
      oldValue: "Prototype previous value",
      newValue: "Prototype new value",
      reason,
      device: "Office laptop/IP placeholder",
      auditReference: `AUD-${Date.now()}`
    };
    const nextAudit = [event, ...audit];
    setAudit(nextAudit);
    writeLocalJson(companyStoreKeys.audit, nextAudit);
  };

  const updateCompany = (patch: Partial<OnboardingCompany>) => {
    const nextCompanies = companies.map((company) => (company.companyId === selectedCompany.companyId ? { ...company, ...patch } : company));
    setCompanies(nextCompanies);
    writeLocalJson(companyStoreKeys.companies, nextCompanies);
    addAudit("company edited", "company", "Company onboarding details changed.");
  };

  const createDemoProvider = async () => {
    const nextCompanies = mergeByKey(companies, [demoCompany], (company) => company.companyId);
    setCompanies(nextCompanies);
    setSelectedCompanyId(demoCompany.companyId);
    writeLocalJson(companyStoreKeys.companies, nextCompanies);
    try {
      if (databaseStatus.mode === "database") {
        await createDatabaseProvider({
          companyId: demoCompany.companyId,
          providerId: demoCompany.providerId,
          locationId: demoCompany.branchId,
          companyName: demoCompany.companyName,
          tradingName: demoCompany.tradingName,
          cqcProviderId: demoCompany.cqcProviderId,
          cqcLocationId: demoCompany.cqcLocationId,
          registeredManagerName: demoCompany.registeredManagerName,
          registeredManagerEmail: demoCompany.registeredManagerEmail,
          migrationStatus: demoCompany.migrationStatus,
          companyStatus: demoCompany.companyStatus
        });
        await createDatabaseAuditLog({
          companyId: demoCompany.companyId,
          providerId: demoCompany.providerId,
          userRole: "System Owner",
          action: "provider created",
          module: "Company Onboarding",
          recordType: "provider",
          recordId: demoCompany.providerId,
          reason: "Demo provider company created from onboarding workflow."
        });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Database provider creation failed. Demo mode data was preserved.");
      return;
    }
    addAudit("company created", "company", "Demo provider company created for onboarding.");
    setMessage(databaseStatus.mode === "database" ? "Demo Care Provider Ltd created and sent to provider table workflow." : "Demo Care Provider Ltd created and selected in demo/localStorage mode.");
  };

  const resetDemoImport = () => {
    setStaffSourceRows([]);
    setServiceUserSourceRows([]);
    setStaffRows([]);
    setServiceUserRows([]);
    setStaffMapping({});
    setServiceUserMapping({});
    setMessage("Demo import workspace reset. Imported staff/client records already saved to modules remain until demo data is reset from Backup / Export.");
    addAudit("import cancelled", "staff/service users", "Demo import workspace reset.");
  };

  const refreshRows = (type: ImportType, sourceRows: Record<string, string>[], mapping: Record<string, string>) => {
    const built = buildImportRows(type, sourceRows, mapping, selectedCompany);
    if (type === "staff") setStaffRows(built);
    else setServiceUserRows(built);
    addAudit("validation completed", type, `${built.length} uploaded rows validated.`);
    return built;
  };

  const loadDemoRows = (type: ImportType) => {
    if (type === "staff") {
      const mapping = suggestedMapping(Object.keys(demoStaffRows[0]), "staff", staffMapping);
      setStaffSourceRows(demoStaffRows);
      setStaffMapping(mapping);
      refreshRows("staff", demoStaffRows, mapping);
      setActiveTab("Import Staff");
      setMessage("Demo staff Excel data loaded into preview.");
      addAudit("staff import file uploaded", "staff", "Demo staff Excel-compatible rows loaded.");
    } else {
      const mapping = suggestedMapping(Object.keys(demoServiceUserRows[0]), "service-users", serviceUserMapping);
      setServiceUserSourceRows(demoServiceUserRows);
      setServiceUserMapping(mapping);
      refreshRows("service-users", demoServiceUserRows, mapping);
      setActiveTab("Import Service Users");
      setMessage("Demo service user Excel data loaded into preview.");
      addAudit("service user import file uploaded", "service users", "Demo service user Excel-compatible rows loaded.");
    }
  };

  const handleUpload = async (file: File, type: ImportType) => {
    const isCsv = file.name.toLowerCase().endsWith(".csv");
    const sourceRows = isCsv ? parseCsv(await file.text()) : type === "staff" ? demoStaffRows : demoServiceUserRows;
    const currentMapping = type === "staff" ? staffMapping : serviceUserMapping;
    const mapping = suggestedMapping(Object.keys(sourceRows[0] ?? {}), type, currentMapping);
    if (type === "staff") {
      setStaffSourceRows(sourceRows);
      setStaffMapping(mapping);
      refreshRows("staff", sourceRows, mapping);
    } else {
      setServiceUserSourceRows(sourceRows);
      setServiceUserMapping(mapping);
      refreshRows("service-users", sourceRows, mapping);
    }
    setMessage(isCsv ? `${file.name} uploaded and parsed.` : `${file.name} accepted. Prototype loaded demo Excel preview rows while production XLSX parsing is connected.`);
    addAudit(type === "staff" ? "staff import file uploaded" : "service user import file uploaded", type, file.name);
  };

  const setRowState = (type: ImportType, rowNumber: number, patch: Partial<ImportRow>) => {
    const setter = type === "staff" ? setStaffRows : setServiceUserRows;
    setter((rows) => rows.map((row) => (row.rowNumber === rowNumber ? { ...row, ...patch } : row)));
    addAudit(patch.ignored ? "record skipped" : patch.approved ? "warning approved" : "mapping changed", type, "Row action changed.", String(rowNumber));
  };

  const saveMappingTemplate = () => {
    writeLocalJson(companyStoreKeys.mapping, { staff: staffMapping, serviceUsers: serviceUserMapping });
    setMessage("Column mapping template saved for future imports.");
    addAudit("mapping changed", "mapping", "Mapping template saved.");
  };

  const importRows = async (type: ImportType) => {
    if (!allConfirmed) {
      setMessage("Data protection confirmation is required before importing records.");
      setActiveTab("Data Protection Review");
      return;
    }
    const rows = type === "staff" ? staffRows : serviceUserRows;
    const importable = rows.filter((row) => row.approved && !row.ignored && row.status !== "Error" && row.status !== "Missing required field");
    const failed = rows.length - importable.length;
    try {
      if (databaseStatus.mode === "database") {
        if (type === "staff") {
          await Promise.all(
            importable.map((row) =>
              createDatabaseStaff({
                companyId: selectedCompany.companyId,
                providerId: selectedCompany.providerId,
                locationId: selectedCompany.branchId,
                staffReference: row.mapped["Staff Reference Number"],
                firstName: row.mapped["First Name"],
                surname: row.mapped.Surname,
                dateOfBirth: row.mapped["Date of Birth"],
                email: row.mapped.Email,
                mobileNumber: row.mapped["Mobile Number"],
                telephoneNumber: row.mapped["Telephone Number"],
                address: {
                  line1: row.mapped["Address Line 1"],
                  line2: row.mapped["Address Line 2"],
                  townCity: row.mapped["Town/City"],
                  postcode: row.mapped.Postcode
                },
                jobRole: row.mapped["Job Role"],
                employmentStartDate: row.mapped["Employment Start Date"],
                employmentStatus: row.mapped["Employment Status"],
                rightToWorkStatus: row.mapped["Right to Work Status"],
                dbsStatus: row.mapped["DBS Status"],
                metadata: row.mapped
              })
            )
          );
        } else {
          await Promise.all(
            importable.map((row) =>
              createDatabaseServiceUser({
                companyId: selectedCompany.companyId,
                providerId: selectedCompany.providerId,
                locationId: selectedCompany.branchId,
                serviceUserReference: row.mapped["Service User Reference Number"],
                firstName: row.mapped["First Name"],
                surname: row.mapped.Surname,
                dateOfBirth: row.mapped["Date of Birth"],
                telephoneNumber: row.mapped["Telephone Number"],
                address: {
                  line1: row.mapped["Address Line 1"],
                  line2: row.mapped["Address Line 2"],
                  townCity: row.mapped["Town/City"],
                  postcode: row.mapped.Postcode
                },
                fundingSource: row.mapped["Funding Source"],
                packageType: row.mapped["Package Type"],
                riskLevel: row.mapped["Risk Level"],
                carePlanStatus: row.mapped["Care Plan Status"],
                riskAssessmentStatus: row.mapped["Risk Assessment Status"],
                metadata: row.mapped
              })
            )
          );
        }
        await createDatabaseImportBatch({
          companyId: selectedCompany.companyId,
          providerId: selectedCompany.providerId,
          locationId: selectedCompany.branchId,
          importType: type,
          fileName: type === "staff" ? "staff-import-preview.csv" : "service-user-import-preview.csv",
          totalRecords: rows.length,
          successfulRecords: importable.length,
          failedRecords: failed,
          duplicateRecords: rows.filter((row) => row.status === "Duplicate").length,
          status: failed ? "Imported with exceptions" : "Imported successfully"
        });
        await createDatabaseAuditLog({
          companyId: selectedCompany.companyId,
          providerId: selectedCompany.providerId,
          userRole: "System Owner",
          action: "import approved",
          module: "Company Onboarding",
          recordType: type,
          reason: `${importable.length} approved ${type} records imported through database service layer.`
        });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Database import failed. Demo data was not removed.");
      return;
    }
    if (type === "staff") {
      const current = readLocalJson<StaffMemberRecord[]>(demoStoreKeys.staff, []);
      writeLocalJson(demoStoreKeys.staff, mergeByKey(current, importable.map((row) => makeStaffRecord(row, selectedCompany)), (member) => member.ref));
    } else {
      const current = readLocalJson<ServiceUserRecord[]>(demoStoreKeys.clients, []);
      writeLocalJson(demoStoreKeys.clients, mergeByKey(current, importable.map((row) => makeServiceUserRecord(row, selectedCompany)), (client) => client.id));
    }
    const batch: ImportBatch = {
      id: `IMP-${Date.now()}`,
      companyId: selectedCompany.companyId,
      companyName: selectedCompany.companyName,
      importType: type,
      fileName: type === "staff" ? "staff-import-preview.csv" : "service-user-import-preview.csv",
      uploadedBy: "Demo System Owner",
      uploadedAt: new Date().toISOString(),
      totalRecords: rows.length,
      successfulRecords: importable.length,
      failedRecords: failed,
      duplicateRecords: rows.filter((row) => row.status === "Duplicate").length,
      status: failed ? "Imported with exceptions" : "Imported successfully"
    };
    const nextHistory = [batch, ...history];
    setHistory(nextHistory);
    writeLocalJson(companyStoreKeys.batches, nextHistory);
    updateCompany({ migrationStatus: "Ready for review", companyStatus: "Ready for review" });
    addAudit(type === "staff" ? "record imported" : "record imported", type, `${importable.length} approved records imported.`);
    setMessage(`${importable.length} ${type === "staff" ? "staff" : "service user"} records imported for ${selectedCompany.companyName}. Refresh Staff Files, Client Files or Rota to see them.`);
  };

  const reportRows = [...staffRows, ...serviceUserRows];
  const metrics: ImportDashboardMetrics = {
    staffUploaded: staffRows.length,
    staffValid: staffRows.filter((row) => row.status === "Valid").length,
    staffErrors: staffRows.filter((row) => row.status === "Error" || row.status === "Missing required field").length,
    serviceUploaded: serviceUserRows.length,
    serviceValid: serviceUserRows.filter((row) => row.status === "Valid").length,
    serviceErrors: serviceUserRows.filter((row) => row.status === "Error" || row.status === "Missing required field").length,
    duplicates: reportRows.filter((row) => row.status === "Duplicate").length,
    ready: reportRows.filter((row) => row.approved && !row.ignored).length,
    imported: history.reduce((total, batch) => total + batch.successfulRecords, 0),
    failed: history.reduce((total, batch) => total + batch.failedRecords, 0)
  };

  const exportReport = () => {
    const rows = history.map((batch) => ({
      "Import Batch ID": batch.id,
      "Company/Provider": batch.companyName,
      "Import Type": batch.importType,
      "Uploaded File Name": batch.fileName,
      "Uploaded By": batch.uploadedBy,
      "Uploaded Date/Time": batch.uploadedAt,
      "Total Records": String(batch.totalRecords),
      "Successful Records": String(batch.successfulRecords),
      "Failed Records": String(batch.failedRecords),
      "Duplicate Records": String(batch.duplicateRecords),
      Status: batch.status
    }));
    const headers = Object.keys(rows[0] ?? { "Import Batch ID": "", "Company/Provider": "", Status: "" });
    downloadTextFile("careverity-import-report.csv", buildCsv(headers, rows));
    addAudit("import report exported", "import report", "Import history report exported.");
  };

  return (
    <div className="space-y-6">
      <CompanyOnboardingCard>
        <CompanySectionTitle
          action={<button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-black text-white" onClick={createDemoProvider} type="button">Create Demo Provider Company</button>}
          subtitle="Multi-company onboarding, Excel-compatible data migration, validation, duplicate review, audit evidence and tenant separation for healthcare and care providers."
          title="Company Onboarding / Import Companies"
        />
        <div className="rounded-lg bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900 ring-1 ring-amber-200">
          Users must only access records for the company/provider they are authorised to manage. Staff, service users, rota, journal, documents, training, medication, invoice and report records created here carry companyId, providerId and branchId/locationId placeholders.
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <SelectField label="System Owner company switcher" onChange={setSelectedCompanyId} options={companies.map((company) => company.companyId)} value={selectedCompany.companyId} />
          <DashboardMetric label="Onboarding status" tone="blue" value={selectedCompany.companyStatus} />
          <DashboardMetric label="Migration status" tone="amber" value={selectedCompany.migrationStatus} />
          <DashboardMetric label="Company data boundary" tone="green" value={selectedCompany.companyId} />
        </div>
      </CompanyOnboardingCard>

      <DatabaseReadinessPanel />

      <CompanyGraphicsCommandCentre company={selectedCompany} metrics={metrics} />

      <CompanyOnboardingCard>
        <CompanySectionTitle title="Import dashboard" subtitle="Preview, validation, duplicate detection and result counts for the selected provider." />
        <ImportDashboardGraphics company={selectedCompany} metrics={metrics} serviceUserRows={serviceUserRows} staffRows={staffRows} />
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <DashboardMetric label="Staff records uploaded" tone="blue" value={metrics.staffUploaded} />
          <DashboardMetric label="Staff records valid" tone="green" value={metrics.staffValid} />
          <DashboardMetric label="Staff records with errors" tone="red" value={metrics.staffErrors} />
          <DashboardMetric label="Service user records uploaded" tone="blue" value={metrics.serviceUploaded} />
          <DashboardMetric label="Service user records valid" tone="green" value={metrics.serviceValid} />
          <DashboardMetric label="Service user records with errors" tone="red" value={metrics.serviceErrors} />
          <DashboardMetric label="Duplicates found" tone="purple" value={metrics.duplicates} />
          <DashboardMetric label="Ready to import" tone="teal" value={metrics.ready} />
          <DashboardMetric label="Imported successfully" tone="green" value={metrics.imported} />
          <DashboardMetric label="Import failed" tone="red" value={metrics.failed} />
        </div>
      </CompanyOnboardingCard>

      <ImportResultSummary history={history} selectedCompany={selectedCompany} />

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button className={`rounded-md px-3 py-2 text-sm font-bold ring-1 ${activeTab === tab ? "bg-[#0B1F3A] text-white ring-[#0B1F3A]" : "bg-white text-slate-700 ring-slate-200"}`} key={tab} onClick={() => setActiveTab(tab)} type="button">
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Company Details" ? (
        <CompanyDetailsTab company={selectedCompany} onChange={updateCompany} />
      ) : activeTab === "Import Staff" ? (
        <ImportPreviewTab
          columns={[...requiredStaffColumns, ...optionalStaffColumns]}
          importType="staff"
          onDownloadTemplate={() => downloadTextFile("careverity-staff-import-template.csv", buildCsv([...requiredStaffColumns, ...optionalStaffColumns], demoStaffRows))}
          onDownloadExample={() => downloadTextFile("careverity-example-completed-staff-sheet.csv", buildCsv([...requiredStaffColumns, ...optionalStaffColumns], demoStaffRows))}
          onFile={handleUpload}
          onImport={importRows}
          onLoadDemo={loadDemoRows}
          onRowState={setRowState}
          rows={staffRows}
        />
      ) : activeTab === "Import Service Users" ? (
        <ImportPreviewTab
          columns={[...requiredServiceUserColumns, ...optionalServiceUserColumns]}
          importType="service-users"
          onDownloadTemplate={() => downloadTextFile("careverity-service-user-import-template.csv", buildCsv([...requiredServiceUserColumns, ...optionalServiceUserColumns], demoServiceUserRows))}
          onDownloadExample={() => downloadTextFile("careverity-example-completed-service-user-sheet.csv", buildCsv([...requiredServiceUserColumns, ...optionalServiceUserColumns], demoServiceUserRows))}
          onFile={handleUpload}
          onImport={importRows}
          onLoadDemo={loadDemoRows}
          onRowState={setRowState}
          rows={serviceUserRows}
        />
      ) : activeTab === "Import Validation" ? (
        <ValidationTab staffRows={staffRows} serviceUserRows={serviceUserRows} />
      ) : activeTab === "Import History" ? (
        <ImportHistoryTab history={history} onExport={exportReport} />
      ) : activeTab === "Mapping Settings" ? (
        <MappingSettingsTab
          onSave={saveMappingTemplate}
          serviceUserHeaders={serviceUserHeaders}
          serviceUserMapping={serviceUserMapping}
          setServiceUserMapping={setServiceUserMapping}
          setStaffMapping={setStaffMapping}
          staffHeaders={staffHeaders}
          staffMapping={staffMapping}
        />
      ) : activeTab === "Data Protection Review" ? (
        <DataProtectionTab confirmations={confirmations} setConfirmations={setConfirmations} />
      ) : activeTab === "Go-Live Checklist" ? (
        <GoLiveChecklistTab company={selectedCompany} />
      ) : (
        <AuditLogTab audit={audit} />
      )}

      <RolePermissionsPanel />

      <CompanyOnboardingCard>
        <CompanySectionTitle title="Demo company import" subtitle="End-to-end test buttons for fake demo data only." />
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-black text-white" onClick={createDemoProvider} type="button">Create Demo Provider Company</button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white" onClick={() => loadDemoRows("staff")} type="button">Load Demo Staff Excel Data</button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white" onClick={() => loadDemoRows("service-users")} type="button">Load Demo Service User Excel Data</button>
          <button className="rounded-md bg-purple-600 px-4 py-2 text-sm font-black text-white" onClick={() => { refreshRows("staff", staffSourceRows, staffMapping); refreshRows("service-users", serviceUserSourceRows, serviceUserMapping); setActiveTab("Import Validation"); }} type="button">Validate Demo Import</button>
          <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => importRows("staff")} type="button">Import Demo Staff</button>
          <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => importRows("service-users")} type="button">Import Demo Service Users</button>
          <a className="rounded-md bg-slate-900 px-4 py-2 text-sm font-black text-white" href="/careverity-ecm/staff">View Imported Staff</a>
          <a className="rounded-md bg-slate-900 px-4 py-2 text-sm font-black text-white" href="/careverity-ecm/clients">View Imported Service Users</a>
          <button className="rounded-md bg-rose-50 px-4 py-2 text-sm font-black text-rose-800 ring-1 ring-rose-200" onClick={resetDemoImport} type="button">Reset Demo Import</button>
        </div>
        <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-100">{message}</div>
      </CompanyOnboardingCard>
    </div>
  );
}

function CompanyDetailsTab({ company, onChange }: { company: OnboardingCompany; onChange: (patch: Partial<OnboardingCompany>) => void }) {
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Company setup" subtitle="Create a provider account, confirm provider identity, assign contacts, migration status and company data boundaries." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InputField label="Company name" onChange={(value) => onChange({ companyName: value })} value={company.companyName} />
        <InputField label="Trading name" onChange={(value) => onChange({ tradingName: value })} value={company.tradingName} />
        <InputField label="Company registration number" onChange={(value) => onChange({ registrationNumber: value })} value={company.registrationNumber} />
        <InputField label="CQC provider ID" onChange={(value) => onChange({ cqcProviderId: value })} value={company.cqcProviderId} />
        <InputField label="CQC location ID" onChange={(value) => onChange({ cqcLocationId: value, branchId: value })} value={company.cqcLocationId} />
        <InputField label="Main office address" onChange={(value) => onChange({ address: value })} value={company.address} />
        <InputField label="Postcode" onChange={(value) => onChange({ postcode: value })} value={company.postcode} />
        <InputField label="Main telephone number" onChange={(value) => onChange({ telephone: value })} value={company.telephone} />
        <InputField label="Main email address" onChange={(value) => onChange({ email: value })} value={company.email} />
        <InputField label="Website" onChange={(value) => onChange({ website: value })} value={company.website} />
        <InputField label="Registered Manager name" onChange={(value) => onChange({ registeredManagerName: value })} value={company.registeredManagerName} />
        <InputField label="Registered Manager email" onChange={(value) => onChange({ registeredManagerEmail: value })} value={company.registeredManagerEmail} />
        <InputField label="Nominated Individual name" onChange={(value) => onChange({ nominatedIndividualName: value })} value={company.nominatedIndividualName} />
        <SelectField label="Local Authority contracts" onChange={(value) => onChange({ localAuthorityContracts: value })} options={["Yes", "No"]} value={company.localAuthorityContracts} />
        <SelectField label="NHS/ICB funded clients" onChange={(value) => onChange({ nhsFundedClients: value })} options={["Yes", "No"]} value={company.nhsFundedClients} />
        <SelectField label="Private clients" onChange={(value) => onChange({ privateClients: value })} options={["Yes", "No"]} value={company.privateClients} />
        <InputField label="Company logo upload placeholder" onChange={(value) => onChange({ logoStatus: value })} value={company.logoStatus} />
        <InputField label="Primary contact person" onChange={(value) => onChange({ primaryContact: value })} value={company.primaryContact} />
        <InputField label="Billing contact person" onChange={(value) => onChange({ billingContact: value })} value={company.billingContact} />
        <InputField label="Data Protection Officer / IG lead" onChange={(value) => onChange({ dataProtectionLead: value })} value={company.dataProtectionLead} />
        <InputField label="Go-live date" onChange={(value) => onChange({ goLiveDate: value })} type="date" value={company.goLiveDate} />
        <SelectField label="Migration status" onChange={(value) => onChange({ migrationStatus: value })} options={companyStatusOptions} value={company.migrationStatus} />
        <SelectField label="Company status" onChange={(value) => onChange({ companyStatus: value })} options={companyStatusOptions} value={company.companyStatus} />
      </div>
      <div className="mt-5">
        <div className="mb-2 text-xs font-bold uppercase text-slate-500">Service types provided</div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
          {serviceTypeOptions.map((serviceType) => (
            <label className="flex items-center gap-2 rounded-md bg-slate-50 p-3 text-sm font-bold text-slate-700 ring-1 ring-slate-100" key={serviceType}>
              <input
                checked={company.serviceTypes.includes(serviceType)}
                onChange={(event) =>
                  onChange({
                    serviceTypes: event.target.checked ? [...company.serviceTypes, serviceType] : company.serviceTypes.filter((item) => item !== serviceType)
                  })
                }
                type="checkbox"
              />
              {serviceType}
            </label>
          ))}
        </div>
      </div>
    </CompanyOnboardingCard>
  );
}

function ImportResultSummary({ history, selectedCompany }: { history: ImportBatch[]; selectedCompany: OnboardingCompany }) {
  const latest = history.find((batch) => batch.companyId === selectedCompany.companyId);
  const rows = latest
    ? [
        ["Total rows uploaded", String(latest.totalRecords)],
        ["Records imported", String(latest.successfulRecords)],
        ["Records skipped", String(latest.totalRecords - latest.successfulRecords - latest.failedRecords)],
        ["Records with warning", "Included where approved by authorised user"],
        ["Records failed", String(latest.failedRecords)],
        ["Duplicates found", String(latest.duplicateRecords)],
        ["Import batch reference", latest.id],
        ["Imported by", latest.uploadedBy],
        ["Date/time", latest.uploadedAt],
        ["Company/provider", latest.companyName],
        ["Download import report", "Available in Import History"]
      ]
    : [
        ["Total rows uploaded", "0"],
        ["Records imported", "0"],
        ["Records skipped", "0"],
        ["Records with warning", "0"],
        ["Records failed", "0"],
        ["Duplicates found", "0"],
        ["Import batch reference", "No import batch yet"],
        ["Imported by", "Pending"],
        ["Date/time", "Pending"],
        ["Company/provider", selectedCompany.companyName],
        ["Download import report", "Available after import"]
      ];
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Import result summary" subtitle="Summary shown after each approved staff or service user import batch." />
      <SimpleTable headings={["Result item", "Value"]} rows={rows} />
    </CompanyOnboardingCard>
  );
}

function RolePermissionsPanel() {
  const rows = [
    ["System Owner", "Create company, import staff, import service users, approve import, delete failed import batch, export import report"],
    ["Provider Admin", "Create company onboarding draft, upload files, review validation, submit for approval"],
    ["Registered Manager", "Approve imported staff and service users for their own company"],
    ["HR Administrator", "Import and review staff data only"],
    ["Care Coordinator", "View imported service users after approval; cannot import staff unless permitted"],
    ["Finance Administrator", "View company billing and funding fields only where authorised"],
    ["Auditor / Inspector Read-Only", "Read-only access to import history and audit logs if authorised"]
  ];
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Role permissions" subtitle="Only authorised roles can import company data. Permission checks must be enforced with tenant-aware backend policies before production use." />
      <SimpleTable headings={["Role", "Import permission"]} rows={rows} />
    </CompanyOnboardingCard>
  );
}

function ImportPreviewTab({
  columns,
  importType,
  rows,
  onDownloadTemplate,
  onDownloadExample,
  onFile,
  onLoadDemo,
  onRowState,
  onImport
}: {
  columns: string[];
  importType: ImportType;
  rows: ImportRow[];
  onDownloadTemplate: () => void;
  onDownloadExample: () => void;
  onFile: (file: File, type: ImportType) => void;
  onLoadDemo: (type: ImportType) => void;
  onRowState: (type: ImportType, rowNumber: number, patch: Partial<ImportRow>) => void;
  onImport: (type: ImportType) => void;
}) {
  const isStaff = importType === "staff";
  return (
    <div className="space-y-6">
      <CompanyOnboardingCard>
        <CompanySectionTitle
          title={isStaff ? "Import Staff from Excel" : "Import Service Users from Excel"}
          subtitle="Allowed file types: .xlsx and .csv. CSV is parsed in this prototype; XLSX is accepted for workflow testing and production parser connection."
        />
        <div className="flex flex-wrap gap-2">
          <button className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-black text-white" onClick={onDownloadTemplate} type="button">{isStaff ? "Download Staff Import Template" : "Download Service User Import Template"}</button>
          <button className="rounded-md bg-slate-700 px-4 py-2 text-sm font-black text-white" onClick={onDownloadExample} type="button">{isStaff ? "Download Example Completed Staff Sheet" : "Download Example Completed Service User Sheet"}</button>
          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-black text-white" onClick={() => onLoadDemo(importType)} type="button">{isStaff ? "Load Demo Staff Excel Data" : "Load Demo Service User Excel Data"}</button>
          <button className="rounded-md bg-purple-600 px-4 py-2 text-sm font-black text-white" onClick={() => downloadTextFile("careverity-combined-import-guidance.txt", combinedGuidanceText(), "text/plain")} type="button">Download Combined Import Guidance</button>
        </div>
        <label className="mt-4 block rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
          <span className="block text-sm font-black text-slate-900">Upload .xlsx or .csv</span>
          <span className="mt-1 block text-xs font-semibold text-slate-500">Previous-system exports can be mapped before import. Uploaded files are not permanently stored in this prototype.</span>
          <input accept=".xlsx,.csv" className="mt-3 block w-full text-sm" onChange={(event) => { const file = event.target.files?.[0]; if (file) onFile(file, importType); }} type="file" />
        </label>
      </CompanyOnboardingCard>

      <PreviewTable importType={importType} rows={rows} onImport={onImport} onRowState={onRowState} />

      <CompanyOnboardingCard>
        <CompanySectionTitle title="Required and optional columns" subtitle="Templates include required headers, optional headers, fake example rows and field guidance." />
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
          {columns.map((column) => (
            <div className="rounded-md bg-slate-50 p-3 text-sm font-bold text-slate-700 ring-1 ring-slate-100" key={column}>
              {column}
            </div>
          ))}
        </div>
      </CompanyOnboardingCard>
    </div>
  );
}

function PreviewTable({ rows, importType, onRowState, onImport }: { rows: ImportRow[]; importType: ImportType; onRowState: (type: ImportType, rowNumber: number, patch: Partial<ImportRow>) => void; onImport: (type: ImportType) => void }) {
  const isStaff = importType === "staff";
  const headings = isStaff ? ["Row", "Staff reference", "Name", "DOB", "Email", "Role", "DBS", "Right-to-work", "Validation", "Action"] : ["Row", "Service user reference", "Name", "DOB", "Phone", "Address/postcode", "Funding source", "Risk level", "Validation", "Action"];
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle
        action={<div className="flex flex-wrap gap-2"><button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-black text-white" onClick={() => onImport(importType)} type="button">Import all valid records</button><button className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-black text-white" onClick={() => onImport(importType)} type="button">Import selected</button></div>}
        title="Preview before import"
        subtitle="Records with errors must not import until corrected. Warnings and duplicates require authorised review."
      />
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>{headings.map((heading) => <th className="p-3" key={heading}>{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.length ? rows.map((row) => {
              const name = `${row.mapped["First Name"] ?? ""} ${row.mapped.Surname ?? ""}`.trim();
              return (
                <tr className={row.ignored ? "bg-slate-50 opacity-60" : "bg-white"} key={`${importType}-${row.rowNumber}`}>
                  <td className="p-3 font-bold text-slate-900">{row.rowNumber}</td>
                  <td className="p-3">{isStaff ? row.mapped["Staff Reference Number"] : row.mapped["Service User Reference Number"]}</td>
                  <td className="p-3 font-bold text-slate-900">{name}</td>
                  <td className="p-3">{row.mapped["Date of Birth"]}</td>
                  <td className="p-3">{isStaff ? row.mapped.Email : row.mapped["Telephone Number"]}</td>
                  <td className="p-3">{isStaff ? row.mapped["Job Role"] : [row.mapped["Address Line 1"], row.mapped.Postcode].filter(Boolean).join(", ")}</td>
                  <td className="p-3">{isStaff ? row.mapped["DBS Status"] : row.mapped["Funding Source"]}</td>
                  <td className="p-3">{isStaff ? row.mapped["Right to Work Status"] : row.mapped["Risk Level"]}</td>
                  <td className="p-3">
                    <CompanyPill tone={statusTone(row.status)}>{row.status}</CompanyPill>
                    {[...row.issues, ...row.duplicateReasons].slice(0, 2).map((issue) => <div className="mt-1 text-xs font-semibold text-slate-500" key={issue}>{issue}</div>)}
                  </td>
                  <td className="p-3">
                    <div className="flex flex-wrap gap-1">
                      <button className="rounded bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700" onClick={() => onRowState(importType, row.rowNumber, { status: "Needs review" })} type="button">Edit row</button>
                      <button className="rounded bg-rose-50 px-2 py-1 text-xs font-bold text-rose-700" onClick={() => onRowState(importType, row.rowNumber, { ignored: true, approved: false })} type="button">Ignore row</button>
                      <button className="rounded bg-purple-50 px-2 py-1 text-xs font-bold text-purple-700" onClick={() => onRowState(importType, row.rowNumber, { status: "Duplicate", approved: false })} type="button">Mark as duplicate</button>
                      <button className="rounded bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-700" onClick={() => onRowState(importType, row.rowNumber, { approved: true })} type="button">Approve warning</button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td className="p-4 text-sm font-bold text-slate-500" colSpan={headings.length}>No upload preview yet. Load demo data or upload a CSV/XLSX file.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {["Skip", "Merge", "Create new record", "Replace existing record", "Manager review required", "Cancel import"].map((action) => (
          <button className="rounded-md bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 ring-1 ring-slate-200" key={action} type="button">{action}</button>
        ))}
      </div>
    </CompanyOnboardingCard>
  );
}

function MappingSettingsTab({
  staffHeaders,
  serviceUserHeaders,
  staffMapping,
  serviceUserMapping,
  setStaffMapping,
  setServiceUserMapping,
  onSave
}: {
  staffHeaders: string[];
  serviceUserHeaders: string[];
  staffMapping: Record<string, string>;
  serviceUserMapping: Record<string, string>;
  setStaffMapping: (mapping: Record<string, string>) => void;
  setServiceUserMapping: (mapping: Record<string, string>) => void;
  onSave: () => void;
}) {
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle action={<button className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-black text-white" onClick={onSave} type="button">Save mapping template</button>} title="Column mapping" subtitle="Automatic suggested mapping supports previous-system column names. Required field warnings remain visible until mapped." />
      <div className="grid gap-6 xl:grid-cols-2">
        <MappingTable fields={[...requiredStaffColumns, ...optionalStaffColumns]} headers={staffHeaders} mapping={staffMapping} setMapping={setStaffMapping} title="Staff column mapping" />
        <MappingTable fields={[...requiredServiceUserColumns, ...optionalServiceUserColumns]} headers={serviceUserHeaders} mapping={serviceUserMapping} setMapping={setServiceUserMapping} title="Service user column mapping" />
      </div>
    </CompanyOnboardingCard>
  );
}

function MappingTable({ title, headers, fields, mapping, setMapping }: { title: string; headers: string[]; fields: string[]; mapping: Record<string, string>; setMapping: (mapping: Record<string, string>) => void }) {
  return (
    <div>
      <div className="mb-3 font-black text-slate-900">{title}</div>
      <div className="space-y-2">
        {headers.map((header) => (
          <div className="grid gap-2 rounded-md bg-slate-50 p-3 ring-1 ring-slate-100 md:grid-cols-[1fr_1fr]" key={`${title}-${header}`}>
            <div>
              <div className="text-xs font-bold uppercase text-slate-500">Uploaded column</div>
              <div className="font-bold text-slate-900">{header}</div>
            </div>
            <label>
              <span className="text-xs font-bold uppercase text-slate-500">Map to CareVerity field</span>
              <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold" onChange={(event) => setMapping({ ...mapping, [header]: event.target.value })} value={mapping[header] ?? "Ignore column"}>
                <option>Ignore column</option>
                {fields.map((field) => <option key={field}>{field}</option>)}
              </select>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function ValidationTab({ staffRows, serviceUserRows }: { staffRows: ImportRow[]; serviceUserRows: ImportRow[] }) {
  const validationRows = [...staffRows.map((row) => ["Staff", String(row.rowNumber), row.status, [...row.issues, ...row.duplicateReasons].join("; ") || "No issues"]), ...serviceUserRows.map((row) => ["Service User", String(row.rowNumber), row.status, [...row.issues, ...row.duplicateReasons].join("; ") || "No issues"])];
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Import validation" subtitle="Validation covers missing required fields, warnings, duplicate checks, restricted field warnings and authorised-review gates." />
      <SimpleTable headings={["Record type", "Row number", "Validation status", "Validation report"]} rows={validationRows} />
    </CompanyOnboardingCard>
  );
}

function ImportHistoryTab({ history, onExport }: { history: ImportBatch[]; onExport: () => void }) {
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle action={<button className="rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-black text-white" onClick={onExport} type="button">Download import report</button>} title="Import history" subtitle="Import batch, validation report and audit log evidence for each provider migration." />
      <SimpleTable
        headings={["Import batch ID", "Company/provider", "Import type", "Uploaded file name", "Uploaded by", "Uploaded date/time", "Total records", "Successful", "Failed", "Duplicates", "Status"]}
        rows={history.map((batch) => [batch.id, batch.companyName, batch.importType, batch.fileName, batch.uploadedBy, batch.uploadedAt, String(batch.totalRecords), String(batch.successfulRecords), String(batch.failedRecords), String(batch.duplicateRecords), batch.status])}
      />
    </CompanyOnboardingCard>
  );
}

function DataProtectionTab({ confirmations, setConfirmations }: { confirmations: Record<string, boolean>; setConfirmations: (value: Record<string, boolean>) => void }) {
  const checks = [
    ["lawful", "The provider has lawful basis to migrate this data."],
    ["accurate", "The data has been checked for accuracy."],
    ["minimal", "The file does not contain unnecessary sensitive data."],
    ["authorised", "The import is authorised by the provider."],
    ["secure", "The import file will be handled securely."],
    ["audited", "The import will be recorded in audit log."]
  ];
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Data protection review" subtitle="Do not store uploaded Excel files permanently unless authorised. If stored, mark them restricted, encrypted placeholder, access logged and retention date required." />
      <div className="grid gap-3 md:grid-cols-2">
        {checks.map(([key, label]) => (
          <label className="flex items-center gap-3 rounded-lg bg-amber-50 p-4 text-sm font-bold text-amber-900 ring-1 ring-amber-100" key={key}>
            <input checked={Boolean(confirmations[key])} onChange={(event) => setConfirmations({ ...confirmations, [key]: event.target.checked })} type="checkbox" />
            {label}
          </label>
        ))}
      </div>
    </CompanyOnboardingCard>
  );
}

function GoLiveChecklistTab({ company }: { company: OnboardingCompany }) {
  const rows = [
    ["Company approved", company.companyStatus === "Approved" || company.companyStatus === "Live" ? "Complete" : "Open", "System Owner"],
    ["Data protection review confirmed", "Required before import", company.dataProtectionLead],
    ["Staff imported and reviewed", "Provider Admin / HR Administrator", "HR"],
    ["Service users imported and reviewed", "Registered Manager", "Operations"],
    ["Rota allocation smoke test", "Imported staff and clients available", "Care Coordinator"],
    ["Finance fields reviewed", "Billing and funding visible only where authorised", company.billingContact],
    ["Impersonation/view-as audit", "Placeholder enabled for System Owner only", "System Owner"],
    ["Go-live date", company.goLiveDate, company.registeredManagerName]
  ];
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Go-live checklist" subtitle="Provider readiness, tenant boundary checks, roles, data protection and operational module handoff." />
      <SimpleTable headings={["Checklist item", "Status", "Owner"]} rows={rows} />
    </CompanyOnboardingCard>
  );
}

function AuditLogTab({ audit }: { audit: AuditEvent[] }) {
  return (
    <CompanyOnboardingCard>
      <CompanySectionTitle title="Audit log" subtitle="Every import action is audited with user, role, company/provider, row reference and device placeholder." />
      <SimpleTable headings={["Date/time", "User", "Role", "Company/provider", "Action", "Record type", "Row", "Old value", "New value", "Reason/comment", "IP/device", "Audit reference"]} rows={audit.map((event) => [event.dateTime, event.user, event.role, event.company, event.action, event.recordType, event.rowNumber, event.oldValue, event.newValue, event.reason, event.device, event.auditReference])} />
    </CompanyOnboardingCard>
  );
}

function SimpleTable({ headings, rows }: { headings: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>{headings.map((heading) => <th className="p-3" key={heading}>{heading}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.length ? rows.map((row, index) => (
            <tr className="bg-white" key={`${row[0]}-${index}`}>
              {row.map((value, cellIndex) => <td className={`p-3 ${cellIndex === 0 ? "font-bold text-slate-900" : "text-slate-700"}`} key={`${row[0]}-${cellIndex}`}>{value}</td>)}
            </tr>
          )) : (
            <tr><td className="p-4 text-sm font-bold text-slate-500" colSpan={headings.length}>No records yet.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function combinedGuidanceText() {
  return [
    "CareVerity ECM Combined Import Guidance",
    "",
    "Use fake demo data only until secure database, storage, encryption, access controls and audit logging are production-ready.",
    "",
    "Required staff columns:",
    requiredStaffColumns.join(", "),
    "",
    "Required service user columns:",
    requiredServiceUserColumns.join(", "),
    "",
    "Column mapping allows previous-system headers such as Worker First Name or Client Ref to map to CareVerity fields.",
    "Rows with missing required fields cannot import. Warnings and duplicates need authorised review.",
    "Each imported record stores companyId, providerId and branchId/locationId placeholders for tenant separation."
  ].join("\n");
}

export { CompanyOnboardingPage };
