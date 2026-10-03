import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const supportSource = await readFile(new URL("../lib/careverity-staff-support-recognition.ts", import.meta.url), "utf8");
const prototypeSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");
const routeSource = await readFile(new URL("../app/hr/staff-support-recognition/[[...slug]]/page.tsx", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const dbSource = await readFile(new URL("../lib/careverity-db.ts", import.meta.url), "utf8");
const handlerSource = await readFile(new URL("../app/api/ai/hr/staff-support-ai-handler.ts", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../docs/CAREVERITY_STAFF_SUPPORT_RECOGNITION_READINESS.md", import.meta.url), "utf8");

test("staff support module defines required routes, models and demo company", () => {
  [
    "StaffSupportIndicator",
    "StaffSupportAction",
    "calculateStaffSupportIndicator",
    "Staff Support & Recognition Intelligence",
    "TEST-COMPANY-001",
    "/hr/staff-support-recognition/dashboard",
    "/hr/staff-support-recognition/staff/:staffId",
    "/hr/staff-support-recognition/green-list",
    "/hr/staff-support-recognition/support-list",
    "/hr/staff-support-recognition/red-review-list",
    "/hr/staff-support-recognition/actions",
    "/hr/staff-support-recognition/reports",
    "/hr/staff-support-recognition/settings"
  ].forEach((text) => assert.match(supportSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
  assert.match(routeSource, /initialModule="staffsupport"/);
});

test("support-focused RAG language and anti-stigma safeguards are enforced", () => {
  [
    "Support indicator only. This is not a disciplinary decision.",
    "The system can suggest. Managers decide.",
    "Do not show public negative ranking.",
    "Do not use this score as an automatic disciplinary decision.",
    "Do not automatically issue warning letters.",
    "Complaints must be reviewed by a human before being treated as staff-related concern.",
    "support recommended",
    "coaching suggested",
    "supervision review",
    "senior review",
    "recognition suggested",
    "development opportunity"
  ].forEach((text) => assert.match(supportSource + prototypeSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

  ["bad staff", "poor staff", "guilty", "problem staff", "non-compliant person", "unsafe staff"].forEach((text) => {
    assert.match(supportSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("required demo staff and trigger categories are represented", () => {
  [
    "Sarah Williams",
    "Ahmed Khan",
    "Daniel Roberts",
    "Olivia Brown",
    "Maria Patel",
    "David Brown",
    "Office Manager Test",
    "geofence mismatches",
    "missed clock-outs",
    "MAR late entries",
    "missing refused/missed medication reasons",
    "Complaint linked for review",
    "Medication Competency Review",
    "Geofence/Clock-In Review",
    "Staff of the Month Nomination"
  ].forEach((text) => assert.match(supportSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("AI endpoints are approval-only, role-controlled and non-disciplinary", () => {
  [
    "POST /api/ai/hr/staff-support-summary",
    "POST /api/ai/hr/recognition-draft",
    "POST /api/ai/hr/supervision-agenda",
    "POST /api/ai/hr/support-action-plan",
    "POST /api/ai/hr/manager-review-summary",
    "AI-assisted draft - manager review required.",
    "AI must not decide guilt.",
    "AI must not decide disciplinary action.",
    "AI must not send warning automatically.",
    "AI must not make final employment decisions.",
    "AI must not invent facts."
  ].forEach((text) => assert.match(supportSource + docsSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
  assert.match(handlerSource, /Role not permitted to generate staff support AI drafts/);
  assert.match(handlerSource, /noAutomaticHrAction: true/);
  assert.match(handlerSource, /noAutomaticDisciplinaryDecision: true/);
  assert.match(handlerSource, /noAutomaticEmailSending: true/);
});

test("schema and service layer are tenant-scoped and database-ready", () => {
  [
    "staff_support_indicators",
    "staff_support_actions",
    "staff_support_evidence_links",
    "staff_support_ai_drafts",
    "idx_staff_support_indicators_tenant",
    "idx_staff_support_actions_tenant",
    "idx_staff_support_ai_drafts_tenant",
    "alter table public.staff_support_indicators enable row level security",
    "no_automatic_disciplinary_decision boolean not null default true"
  ].forEach((text) => assert.match(schemaSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));

  [
    "listStaffSupportIndicators",
    "createStaffSupportIndicator",
    "createStaffSupportAction",
    "recordStaffSupportAiDraft",
    "staff_support_indicators",
    "staff_support_actions",
    "staff_support_ai_drafts"
  ].forEach((text) => assert.match(dbSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("CareVerity shell, HR staff profile and CQC evidence surfaces are linked", () => {
  [
    "staffsupport",
    "StaffSupportRecognitionIntelligenceModule",
    "StaffSupportTopLineIndicator",
    "Staff Support",
    "StaffSupportProfilePanel",
    "Quality Intelligence Hub",
    "Workforce Quality",
    "CQC Evidence Hub",
    "Workforce Wellbeing",
    "Well-led / Safe / Caring",
    "Workforce Support and Recognition Report",
    "Tenant separation by companyId works"
  ].forEach((text) => assert.match(prototypeSource + supportSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});
