import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const recognitionSource = await readFile(new URL("../lib/careverity-staff-recognition.ts", import.meta.url), "utf8");
const prototypeSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../app/hr/staff-recognition/[[...slug]]/page.tsx", import.meta.url), "utf8");
const endpointSource = await readFile(new URL("../app/api/ai/hr/staff-recognition-draft/route.ts", import.meta.url), "utf8");

test("staff recognition module defines required models and routes", () => {
  [
    "StaffRecognitionNomination",
    "StaffRecognitionEvidence",
    "StaffRecognitionStory",
    "StaffRecognitionConsent",
    "StaffRewardRecord",
    "/hr/staff-recognition/dashboard",
    "/hr/staff-recognition/nominations",
    "/hr/staff-recognition/staff-of-the-month",
    "/hr/staff-recognition/approvals",
    "/hr/staff-recognition/recognition-stories",
    "/hr/staff-recognition/consent",
    "/hr/staff-recognition/evidence-pack"
  ].forEach((text) => assert.match(recognitionSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
  assert.match(routeSource, /initialModule="recognition"/);
});

test("recognition categories, permissions and test people are represented", () => {
  [
    "Staff of the Month",
    "Most Person-Centred Care",
    "Outstanding Communication",
    "Medication Safety Champion",
    "Reliability Award",
    "Going the Extra Mile",
    "Teamwork Award",
    "Sarah Williams",
    "Ahmed Khan",
    "Maria Patel",
    "David Brown",
    "Office Manager Test",
    "Care Coordinator",
    "Supervisor",
    "HR Manager",
    "Registered Manager / Senior Manager",
    "Staff Member",
    "System Admin"
  ].forEach((text) => assert.match(recognitionSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("positive evidence, fairness safeguards and no negative public ranking are enforced", () => {
  assert.match(recognitionSource, /positive approved evidence only/i);
  assert.match(recognitionSource, /Do not publish staff ranking/);
  assert.match(recognitionSource, /Do not use recognition score for disciplinary action/);
  assert.match(recognitionSource, /Do not use recognition module to penalise staff/);
  assert.match(recognitionSource, /Do not show negative staff ranking publicly/);
  assert.match(prototypeSource, /does not shame staff, publish negative rankings or make automatic employment decisions/);
});

test("consent, photo/story controls and internal announcement templates are present", () => {
  [
    "I agree that my name, photo and recognition story may be used",
    "consentForInternalEmail",
    "consentForStaffNoticeboard",
    "consentForCqcEvidencePack",
    "consentForWebsite",
    "consentForSocialMedia",
    "consentForMarketingLeaflet",
    "consentForPhotoUse",
    "consentForStoryUse",
    "Do not include photo unless consent is recorded",
    "Congratulations to [Staff Name] - [Award Category]"
  ].forEach((text) => assert.match(recognitionSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("AI recognition draft endpoint is approval-only and role controlled", () => {
  assert.match(endpointSource, /staff-recognition-draft/);
  assert.match(endpointSource, /Role not permitted to generate staff recognition drafts/);
  assert.match(endpointSource, /approvalRequired: true/);
  assert.match(endpointSource, /noAutomaticPublishing: true/);
  assert.match(endpointSource, /noAutomaticEmailSending: true/);
  assert.match(recognitionSource, /AI-assisted draft - approval required/);
  assert.match(recognitionSource, /Do not include confidential service-user details unless approved and anonymised/);
  assert.match(recognitionSource, /Do not include photo unless consent is recorded/);
});

test("CareVerity shell, quality hub and staff file are linked", () => {
  [
    "Staff Recognition",
    "StaffRecognitionGoodPracticeEvidenceModule",
    "Recognition History",
    "StaffRecognitionHistoryPanel",
    "Staff Recognition / Good Practice Evidence",
    "Open Staff Recognition",
    "Quality Intelligence Hub",
    "CQC Evidence Hub > Workforce Wellbeing / Positive Culture"
  ].forEach((text) => assert.match(prototypeSource + recognitionSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("demo data, audit trail, evidence mapping and tenant separation are represented", () => {
  assert.match(recognitionSource, /Array\.from\(\{ length: 10 \}/);
  assert.match(recognitionSource, /Array\.from\(\{ length: 5 \}/);
  assert.match(recognitionSource, /REC-NOM-003/);
  assert.match(recognitionSource, /REC-REWARD-001/);
  assert.match(recognitionSource, /REC-AUD-009/);
  assert.match(recognitionSource, /TEST-COMPANY-001/);
  assert.match(recognitionSource, /Caring/);
  assert.match(recognitionSource, /Effective/);
  assert.match(recognitionSource, /Responsive/);
  assert.match(recognitionSource, /Safe/);
  assert.match(recognitionSource, /Well-led/);
  assert.match(recognitionSource, /Tenant separation by companyId works/);
});
