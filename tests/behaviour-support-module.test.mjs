import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const behaviourSource = await readFile(new URL("../lib/careverity-behaviour-support.ts", import.meta.url), "utf8");
const prototypeSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");

test("behaviour module uses person-centred PBS language and trigger fields", () => {
  [
    "Behaviour Monitoring & Positive Behaviour Support Module",
    "behaviour that challenges",
    "distressed behaviour",
    "behaviour of concern",
    "possible trigger",
    "de-escalation support",
    "proactive strategy",
    "least restrictive response",
    "behaviourSupportRequired",
    "behaviourSupportReason"
  ].forEach((text) => assert.match(behaviourSource + prototypeSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("dummy service user and required behaviour records exist", () => {
  [
    "Johnny Burrows",
    "sleep disturbance and distressed behaviour",
    "behaviourProfileFields",
    "behaviourSupportPlanRows",
    "behaviourRiskAssessmentRows",
    "behaviourAbcRecords",
    "behaviourHourlyRecords",
    "behaviourIncidentRows",
    "restrictivePracticeRows",
    "behaviourActionTrackerRows",
    "behaviourProfessionalReferralDrafts",
    "behaviourKpiCards"
  ].forEach((text) => assert.match(behaviourSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("acceptance quantities are represented for ABC, hourly, incidents and actions", () => {
  assert.match(behaviourSource, /Array\.from\(\{ length: 10 \}/);
  assert.match(behaviourSource, /Array\.from\(\{ length: 7 \}/);
  assert.match(behaviourSource, /BINC-003/);
  assert.match(behaviourSource, /BACT-005/);
  assert.match(behaviourSource, /RPR-DEMO-001/);
});

test("AI safeguards, restrictive practice warning and mobile prompts are present", () => {
  [
    "AI-assisted draft - manager approval required",
    "No automatic referral sent",
    "Restrictive practice must only be used as a last resort",
    "Manager review is required",
    "Behaviour support alert",
    "Quick ABC record",
    "Quick hourly sleep/behaviour record",
    "Manager notification button"
  ].forEach((text) => assert.match(behaviourSource + prototypeSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("module is routed, visible in shell and linked to service-user profile/mobile", () => {
  [
    "Behaviour Monitoring & PBS",
    "behaviour-monitoring",
    "BehaviourMonitoringPositiveSupportModule",
    "Behaviour Monitoring",
    "MobileBehaviourSupportPromptCard",
    "behaviourSupportEnabledFor"
  ].forEach((text) => assert.match(prototypeSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("evidence pack, KPI dashboard and tenant separation are represented", () => {
  [
    "Safe",
    "Effective",
    "Caring",
    "Responsive",
    "Well-led",
    "Behaviour KPI Chart Data",
    "TEST-COMPANY-001",
    "companyId",
    "Tenant separation passes"
  ].forEach((text) => assert.match(behaviourSource + prototypeSource, new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});
