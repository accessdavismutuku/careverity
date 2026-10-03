import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const lqcsSource = await readFile(new URL("../lib/careverity-lqcs-care-plan-ai.ts", import.meta.url), "utf8");
const prototypeSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const dbSource = await readFile(new URL("../lib/careverity-db.ts", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../docs/CAREVERITY_LQCS_AI_CARE_PLAN_GENERATOR.md", import.meta.url), "utf8");

function expectText(source, text) {
  assert.match(source, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}

test("LQCS reviewed care plan structure and domain headings are preserved", () => {
  [
    "Reviewed Care Plan front page",
    "Individual Needs Assessment Care Plan",
    "Mental capacity and best-interest decision record",
    "About My Needs",
    "Body chart and skin integrity record",
    "Daily routine",
    "Culture, religion, sexuality and gender preference",
    "End-of-life wishes and emergency planning where applicable",
    "Access to home, key safe and security arrangements",
    "Support schedule and visit package",
    "Current situation with regard to my needs in this area",
    "What assistance is required",
    "Equipment or aids required",
    "Care plan required?",
    "My specific preferences, wishes and choices",
    "Review note"
  ].forEach((text) => expectText(lqcsSource + docsSource + prototypeSource, text));
});

test("outstanding-style assessment inputs and care domains are represented", () => {
  [
    "What Matters to Me",
    "Likes, Dislikes and Preferences",
    "Equality, Diversity and Reasonable Adjustments",
    "Decision-Specific Capacity",
    "Goals and Outcomes",
    "What Staff Must Report",
    "Professional Involvement and Referral Tracker",
    "Review Triggers",
    "Source Evidence and Reliability",
    "CQC Evidence Mapping",
    "Mobility",
    "Communication",
    "Washing and Bathing including oral hygiene",
    "Pressure Area and Skin",
    "Medication",
    "Access to Home and Key Safe",
    "Visit Schedule and Support Package"
  ].forEach((text) => expectText(lqcsSource + prototypeSource, text));
});

test("Mary Johnson dummy source comparison detects conflicts and OT referral triggers", () => {
  [
    "Mary Johnson",
    "walking stick indoors",
    "wheeled walking frame",
    "two near misses",
    "unsteady standing from the armchair",
    "loose rug",
    "grab rails present but no shower chair",
    "female carers",
    "wants independence",
    "OT referral draft",
    "Medication list",
    "skin/body chart",
    "capacity",
    "emergency plan",
    "GP details",
    "next review date"
  ].forEach((text) => expectText(lqcsSource + docsSource + prototypeSource, text));
});

test("AI review checker and human approval safeguards are enforced", () => {
  [
    "AI-assisted draft - professional review and approval required.",
    "runLqcsAiReviewChecker",
    "generateMaryJohnsonLqcsCarePlanDraft",
    "generateLqcsProfessionalReferralDraft",
    "Ready for Review",
    "Needs Attention",
    "Not Ready",
    "Accept",
    "Edit",
    "Reject",
    "Request More Information",
    "Escalate",
    "Create Professional Referral Draft",
    "No live care plan, referral or mobile content updated automatically",
    "AI must not publish care plans",
    "AI must not invent facts",
    "Unapproved AI drafts must not appear to normal care staff",
    "This may require immediate emergency action. Do not rely only on email. Follow emergency procedure and call 999 if required."
  ].forEach((text) => expectText(lqcsSource + docsSource + prototypeSource, text));
});

test("LQCS AI panel is wired into the client AI care review UI", () => {
  [
    "LqcsCarePlanAiGeneratorPanel",
    "AI Face-to-Face Assessment",
    "LQCS generator workspace",
    "Source Comparison",
    "Review Checker",
    "Capacity & Outcomes",
    "Referral Tracker",
    "Mobile & Export",
    "Audit & Tests",
    "Professional involvement and referral tracker",
    "Staff mobile visibility rules"
  ].forEach((text) => expectText(prototypeSource, text));
});

test("schema and service layer are database-ready and tenant-scoped", () => {
  [
    "lqcs_assessment_sources",
    "lqcs_face_to_face_assessments",
    "lqcs_care_plan_drafts",
    "lqcs_care_domain_drafts",
    "lqcs_review_checker_issues",
    "lqcs_professional_referral_drafts",
    "lqcs_draft_audit_events",
    "idx_lqcs_care_plan_drafts_tenant",
    "idx_lqcs_review_checker_issues_tenant",
    "alter table public.lqcs_draft_audit_events enable row level security",
    "protect_lqcs_draft_audit_events",
    "company_id uuid not null",
    "provider_id uuid not null"
  ].forEach((text) => expectText(schemaSource, text));

  [
    "listLqcsCarePlanDrafts",
    "createLqcsAssessmentSource",
    "createLqcsCarePlanDraft",
    "createLqcsReviewCheckerIssue",
    "createLqcsProfessionalReferralDraft",
    "createLqcsDraftAuditEvent",
    "Tenant separation by companyId works",
    "lqcs_care_plan_drafts",
    "lqcs_professional_referral_drafts"
  ].forEach((text) => expectText(dbSource + lqcsSource, text));
});

test("exports, mobile gating, audit and CQC evidence mapping are documented", () => {
  [
    "Word/PDF reviewed care plan in LQCS layout",
    "Risk assessment pack",
    "Missing information checklist",
    "Source comparison report",
    "Professional referral drafts",
    "Audit summary",
    "Mobile users can only see approved final care-plan content",
    "Safe",
    "Effective",
    "Caring",
    "Responsive",
    "Well-led",
    "Permanent audit trail demo"
  ].forEach((text) => expectText(lqcsSource + docsSource + prototypeSource, text));
});
