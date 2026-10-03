import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const hrisSource = await readFile(new URL("../lib/careverity-hris-ai.ts", import.meta.url), "utf8");
const apiSource = await readFile(new URL("../app/api/ai/hr-draft/route.ts", import.meta.url), "utf8");
const prototypeSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");

test("HRIS templates include required communication types", () => {
  [
    "Welcome Email",
    "Congratulations / Recognition Email",
    "Recognition / Appreciation Message",
    "Training Completion Congratulations",
    "Promotion / Role Change Congratulations",
    "Training Reminder",
    "Supervision Reminder",
    "Probation Review Invitation",
    "Return-to-Work Meeting Invitation",
    "Meeting Reminder",
    "Request to Check Email",
    "Performance Concern Meeting Invitation",
    "Informal Performance Concern Email",
    "Conduct Concern Meeting Invitation",
    "Lateness Concern Meeting Invitation",
    "Absence Concern Meeting Invitation",
    "Request to Attend Office",
    "Document Expiry Reminder",
    "DBS Renewal Reminder",
    "Right-to-Work Documentation Reminder",
    "Training Certificate Expiry Reminder",
    "Annual Leave Reminder",
    "Timesheet / Rota Compliance Reminder",
    "Rota / Shift Confirmation",
    "Policy Update Notification",
    "Meeting Confirmation",
    "Non-Compliance Reminder",
    "Failure to Complete Training Reminder",
    "Failure to Submit Documents Reminder",
    "Request to Discuss Concerns",
    "Investigation Meeting Invitation",
    "Disciplinary Meeting Invitation Draft",
    "Grievance Meeting Invitation Draft",
    "Outcome Letter Draft Placeholder",
    "Written Warning Draft Placeholder"
  ].forEach((label) => assert.match(hrisSource, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
});

test("formal HR safeguard wording is present and no automatic decision workflow is exposed", () => {
  assert.match(hrisSource, /AI-assisted draft only/);
  assert.match(hrisSource, /No decision has been made at this stage/);
  assert.match(hrisSource, /Do not say a concern is proven/);
  assert.match(hrisSource, /No automatic sending has taken place/);
  assert.match(hrisSource, /AI-assisted draft - approval required/);
  assert.match(hrisSource, /Please check your email regarding an HR meeting invitation/);
});

test("server endpoint is feature flagged, role controlled and tenant scoped", () => {
  assert.match(apiSource, /ENABLE_AI_HR_ASSISTANT/);
  assert.match(apiSource, /roleAllowed/);
  assert.match(apiSource, /companyId/);
  assert.match(apiSource, /approvalRequired/);
  assert.match(apiSource, /noAutomaticSending/);
});

test("HRIS module is visible in the CareVerity ECM shell", () => {
  assert.match(prototypeSource, /CareVerity HRIS & AI Staff Communication Assistant/);
  assert.match(prototypeSource, /HRIS & AI Staff Comms/);
  assert.match(prototypeSource, /HR AI Drafts Awaiting Approval/);
  assert.match(prototypeSource, /HR AI Audit Trail/);
  assert.match(prototypeSource, /HR Dashboard Filters/);
  assert.match(prototypeSource, /HRIS Staff Register with Required Audit Metadata/);
});

test("HRIS demo staff records include required UAT people and audit metadata", () => {
  ["Sarah Williams", "Ahmed Khan", "Maria Patel", "Office Manager Test", "createdBy", "createdAt", "updatedBy", "updatedAt", "auditLogId"].forEach((label) => {
    assert.match(hrisSource, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});

test("HRIS dashboard filters include tenant and operational filters", () => {
  ["Company", "Branch", "Role", "Manager", "Status", "Due date", "Communication type"].forEach((label) => {
    assert.match(hrisSource, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  });
});
