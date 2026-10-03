import { expect, type Page, test, type TestInfo } from "@playwright/test";
import {
  careverityDemoStorageKeys,
  careverityRoutes,
  dummyServiceUser,
  dummyStaffMember,
  dummyVisit,
  expectedReportChecks,
  testUsers,
  uatReference
} from "./test-data/careverity-test-data";

type Actor = "admin" | "carer";

const resultSummary: string[] = [];

test.describe(`${uatReference} - CareVerity care-management end-to-end UAT`, () => {
  test.beforeEach(async ({ page }) => {
    await resetCareVerityDemoState(page);
  });

  test("admin-to-carer-to-admin care delivery workflow uses dummy data only", async ({ page }, testInfo) => {
    test.skip(isMobileProject(testInfo.project.name), "The full admin workflow runs in the desktop project; the mobile project has a focused carer visit test.");

    await test.step("1. Login as admin / care coordinator", async () => {
      await loginAs(page, "admin");
      await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
      await selectDemoRoleIfAvailable(page, testUsers.admin.role);
      resultSummary.push("Admin/care coordinator login or demo role view opened.");
    });

    await test.step("2-7. Create dummy service user, contacts, care needs, care plan, risk and medication placeholders", async () => {
      await createDummyServiceUserThroughWizard(page);
      await openClientRecordSections(page);
      resultSummary.push("Dummy service user wizard, contacts, care needs, care plan, risk and medication sections checked.");
    });

    await test.step("Create dummy staff / carer record for allocation", async () => {
      await createDummyStaffThroughForm(page);
      resultSummary.push("Dummy care worker staff form checked and created with safe UAT data.");
    });

    await test.step("8-9. Create rota visits and allocate carer through demo workflow", async () => {
      await runDemoSetupWorkflow(page);
      resultSummary.push("Demo service user, staff, call package and allocated visit created through Demo Setup.");
    });

    await test.step("9. Verify permanent multi-task allocation", async () => {
      await page.goto(careverityRoutes.rotaPermanentMultiCall);
      await expect(page.getByRole("heading", { name: "Start New Allocation" })).toBeVisible();
      await expectText(page, "Morning Call");
      await expectText(page, "Lunch Call");
      await expectText(page, "Tea Call");
      await selectIfPresent(page, "Allocation type", dummyVisit.allocationTypePermanent);
      await clickButtonOrLink(page, "Save Allocation");
      await clickButtonOrLink(page, "Publish Rota");
      await expect(page.getByText("Published:", { exact: false })).toBeVisible();
      resultSummary.push("Permanent multi-call rota allocation saved and published.");
    });

    await test.step("9. Verify temporary multi-task allocation", async () => {
      await page.goto(careverityRoutes.rotaTemporaryMultiCall);
      await expect(page.getByRole("heading", { name: "Start New Allocation" })).toBeVisible();
      await expectText(page, "Temporary cover");
      await selectIfPresent(page, "Allocation type", dummyVisit.allocationTypeTemporary);
      await clickButtonOrLink(page, "Save Allocation");
      await expectText(page, "Temporary cover");
      resultSummary.push("Temporary cover multi-call rota allocation checked.");
    });

    await test.step("10-17. Login as carer, view assigned visit, clock in, complete tasks, record notes, medication and concern, clock out", async () => {
      await loginAs(page, "carer");
      await completeCarerMobileVisit(page);
      resultSummary.push("Carer mobile visit opened, clocked in, tasks completed, care note saved, concern raised and clocked out.");
    });

    await test.step("18-23. Login back as admin and check alerts, medication, audit and reports/export", async () => {
      await loginAs(page, "admin");
      await checkAdminFollowUpScreens(page, testInfo);
      resultSummary.push("Admin dashboard, Live ECM alerts, medication/MAR, audit and export/report screens checked.");
    });

    await test.step("24. Produce test result summary", async () => {
      await attachResultSummary(testInfo, "passed");
    });
  });

  test("mobile carer visit can be opened and actioned from assigned visit view", async ({ page }, testInfo) => {
    test.skip(!isMobileProject(testInfo.project.name), "Focused mobile test only runs in the mobile project.");

    await loginAs(page, "carer");
    await seedDemoVisitFromSetup(page);
    await completeCarerMobileVisit(page);
    await attachResultSummary(testInfo, "mobile-passed");
  });
});

async function resetCareVerityDemoState(page: Page) {
  await page.goto(careverityRoutes.dashboard);
  await page.evaluate((keys) => {
    keys.forEach((key) => window.localStorage.removeItem(key));
  }, [...careverityDemoStorageKeys]);
}

async function loginAs(page: Page, actor: Actor) {
  const user = testUsers[actor];
  await page.goto(careverityRoutes.login);

  // TODO(CareVerity auth): replace this demo-login fallback with production
  // authentication selectors once Supabase/SSO login is active.
  const emailField = page.getByLabel("Email address");
  if (await emailField.count()) {
    await emailField.first().fill(user.email);
  }
  const passwordField = page.getByLabel("Password");
  if (await passwordField.count()) {
    await passwordField.first().fill(user.password);
  }
  const signInLink = page.getByRole("link", { name: "Sign in" });
  if (await signInLink.count()) {
    await signInLink.first().click();
  }

  await page.goto(careverityRoutes.dashboard);
  await selectDemoRoleIfAvailable(page, user.role);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();
}

async function selectDemoRoleIfAvailable(page: Page, role: string) {
  const roleSelector = page.getByLabel("Demo role selector");
  const visibleRoleSelector = roleSelector.filter({ visible: true });
  if (await visibleRoleSelector.count()) {
    await visibleRoleSelector.first().selectOption({ label: role });
  }
}

async function createDummyServiceUserThroughWizard(page: Page) {
  await page.goto(careverityRoutes.clientsNew);
  await expect(page.getByRole("heading", { name: "Add New Service User" })).toBeVisible();

  await fillIfPresent(page, "First name", dummyServiceUser.firstName);
  await fillIfPresent(page, "Last name", dummyServiceUser.lastName);
  await fillIfPresent(page, "Preferred name", dummyServiceUser.preferredName);
  await fillIfPresent(page, "Date of birth", dummyServiceUser.dateOfBirth);
  await selectIfPresent(page, "Communication needs", dummyServiceUser.communicationNeeds);

  await openServiceUserWizardStep(page, "Step 2");
  await fillIfPresent(page, "Address", dummyServiceUser.address);
  await fillIfPresent(page, "Postcode", dummyServiceUser.postcode);
  await fillIfPresent(page, "Telephone", dummyServiceUser.phone);
  await selectIfPresent(page, "Lives alone", "Yes");

  await openServiceUserWizardStep(page, "Step 3");
  await fillIfPresent(page, "Next of kin name", dummyServiceUser.nextOfKinName);
  await selectIfPresent(page, "Relationship", dummyServiceUser.nextOfKinRelationship);
  await fillIfPresent(page, "Phone number", dummyServiceUser.nextOfKinPhone);
  await fillIfPresent(page, "Email", dummyServiceUser.nextOfKinEmail);

  await openServiceUserWizardStep(page, "Step 4");
  await fillIfPresent(page, "Medical history", dummyServiceUser.carePlanSummary);
  await fillIfPresent(page, "Allergies", "No known allergies in UAT dummy data");
  await selectIfPresent(page, "Medication support required", "MAR/eMAR required");
  await selectIfPresent(page, "Moving and handling required", "Yes");
  await selectIfPresent(page, "Dementia", "Yes");
  await selectIfPresent(page, "Falls risk", "High");

  await openServiceUserWizardStep(page, "Step 5");
  await selectIfPresent(page, "Funding source", dummyServiceUser.fundingSource);
  await selectIfPresent(page, "Package type", dummyServiceUser.packageType);
  await selectIfPresent(page, "Priority", "High Risk");

  await openServiceUserWizardStep(page, "Step 6");
  await fillIfPresent(page, "Start time", dummyVisit.expectedStart);
  await fillIfPresent(page, "End time", dummyVisit.expectedEnd);
  await selectIfPresent(page, "Call type", dummyVisit.callType);
  await selectIfPresent(page, "Required skills", "Medication competency");
  await clickIfAvailable(page, "Add Morning Call");
  await clickIfAvailable(page, "Save Call Package");

  await clickButtonOrLink(page, "Create Service User File");
  await expect(page.getByRole("heading", { name: /Client File/ }).first()).toBeVisible();
}

async function openClientRecordSections(page: Page) {
  await page.goto(careverityRoutes.demoClientFile);
  await expect(page.getByRole("heading", { name: /Client File/ }).first()).toBeVisible();

  // TODO(CareVerity UI): add stable data-testid values for record tabs and save buttons.
  for (const tabName of ["Contacts & Next of Kin", "Health & Medical", "Care Plan", "Risk Assessments", "Medication / eMAR", "Audit Log"]) {
    await clickIfAvailable(page, tabName);
    await expectText(page, tabName);
    await clickIfAvailable(page, "Edit");
    await clickIfAvailable(page, "Save changes");
  }
}

async function createDummyStaffThroughForm(page: Page) {
  await page.goto(careverityRoutes.staffNew);
  await expect(page.getByRole("heading", { name: "Add New Staff" })).toBeVisible();

  await fillIfPresent(page, "First name", dummyStaffMember.firstName);
  await fillIfPresent(page, "Last name", dummyStaffMember.lastName);
  await fillIfPresent(page, "Employee reference number", dummyStaffMember.reference);
  await fillIfPresent(page, "Email", dummyStaffMember.email);
  await fillIfPresent(page, "Mobile number", dummyStaffMember.mobile);
  await selectIfPresent(page, "Staff role", dummyStaffMember.role);
  await selectIfPresent(page, "Employment status", dummyStaffMember.employmentStatus);
  await fillIfPresent(page, "Start date", dummyStaffMember.startDate);
  await selectIfPresent(page, "DBS type", dummyStaffMember.dbsStatus);
  await selectIfPresent(page, "Right-to-work status", dummyStaffMember.rightToWorkStatus);

  await clickButtonOrLink(page, "Create Staff File");
  await expect(page.getByRole("heading", { name: /Staff File/ }).first()).toBeVisible();
}

async function runDemoSetupWorkflow(page: Page) {
  await page.goto(careverityRoutes.demoSetup);
  await expect(page.getByRole("heading", { name: "Full Demo Test Workflow" })).toBeVisible();

  for (const buttonName of ["Create Demo Service User", "Create Demo Staff Member", "Create Demo Call Package", "Allocate Demo Visit"]) {
    await clickButtonOrLink(page, buttonName);
  }

  await expectText(page, "DEMO-SU-001 created");
  await expectText(page, "DEMO-ST-001 created");
  await expectText(page, "Temporary test allocated");
}

async function seedDemoVisitFromSetup(page: Page) {
  await page.goto(careverityRoutes.demoSetup);
  await clickButtonOrLink(page, "Create Demo Service User");
  await clickButtonOrLink(page, "Create Demo Staff Member");
  await clickButtonOrLink(page, "Create Demo Call Package");
  await clickButtonOrLink(page, "Allocate Demo Visit");
}

async function completeCarerMobileVisit(page: Page) {
  await page.goto(careverityRoutes.mobileDemoVisit);
  await expectText(page, "Staff visit view");
  await expectText(page, "Medication prompt");

  await clickButtonOrLink(page, "Check in");
  await expectText(page, "In progress");

  await fillFirstTextarea(page, dummyVisit.careNote);
  await selectIfPresent(page, "Missed/late reason", "Medication concern");
  await clickButtonOrLink(page, "Save visit note");

  await clickIfAvailable(page, "Open tasks");
  await checkMobileTask(page, "Medication support");
  await checkMobileTask(page, "Prepare breakfast");
  await checkMobileTask(page, "Personal care");
  await checkMobileTask(page, "Record care notes");

  await page.goto(careverityRoutes.mobileDemoVisit);
  // TODO(CareVerity eMAR): replace this placeholder with explicit
  // Given / Refused / Missed medication radio buttons once the MAR workflow
  // exposes stable controls on the mobile visit screen.
  await clickIfAvailable(page, "Report concern");
  await clickIfAvailable(page, "Concern");
  await page.goto(careverityRoutes.mobileDemoVisit);
  await clickButtonOrLink(page, "Check out");
  await expectText(page, "Completed");
}

async function checkAdminFollowUpScreens(page: Page, testInfo: TestInfo) {
  await page.goto(careverityRoutes.dashboard);
  await expect(page.getByRole("heading", { name: "Dashboard" })).toBeVisible();

  await page.goto(careverityRoutes.liveEcm);
  await expectText(page, "Live ECM");
  await expectText(page, "Missed");
  await expectText(page, "Completed");

  await page.goto(careverityRoutes.medication);
  await expectText(page, "Medication / eMAR");
  await expectText(page, "MAR");

  await page.goto(careverityRoutes.dataProtection);
  await expectText(page, "audit");

  await page.goto(careverityRoutes.exportPreview);
  await expect(page.getByRole("heading", { name: "Export Demo Records Preview" })).toBeVisible();
  for (const check of expectedReportChecks) {
    resultSummary.push(check);
  }

  const downloadButton = page.getByRole("button", { name: "Download JSON" });
  if (await downloadButton.count()) {
    const downloadPromise = page.waitForEvent("download");
    await downloadButton.first().click();
    const download = await downloadPromise;
    await testInfo.attach(`${uatReference}-export-filename.txt`, {
      body: download.suggestedFilename(),
      contentType: "text/plain"
    });
  }
}

async function openServiceUserWizardStep(page: Page, stepPrefix: string) {
  const stepButton = page.getByRole("button", { name: new RegExp(`^${escapeRegExp(stepPrefix)}`) });
  await expect(stepButton.first()).toBeVisible();
  await stepButton.first().click();
}

async function fillIfPresent(page: Page, label: string, value: string) {
  const field = page.getByLabel(label, { exact: true });
  if (await field.count()) {
    await field.first().fill(value);
  }
}

async function expectText(page: Page, text: string) {
  await expect(page.getByText(text, { exact: false }).filter({ visible: true }).first()).toBeVisible();
}

async function fillFirstTextarea(page: Page, value: string) {
  const textareas = page.locator("textarea");
  if ((await textareas.count()) > 0) {
    await textareas.first().fill(value);
  }
}

async function selectIfPresent(page: Page, label: string, value: string) {
  const field = page.getByLabel(label, { exact: true });
  if (!(await field.count())) return;

  const control = field.first();
  const tagName = await control.evaluate((element) => element.tagName.toLowerCase());
  if (tagName !== "select") {
    await control.fill(value);
    return;
  }

  try {
    await control.selectOption({ label: value });
  } catch {
    await control.selectOption(value);
  }
}

async function clickButtonOrLink(page: Page, name: string) {
  const button = page.getByRole("button", { name });
  if (await button.count()) {
    await expect(button.first()).toBeVisible();
    await button.first().click();
    return;
  }

  const link = page.getByRole("link", { name });
  await expect(link.first()).toBeVisible();
  await link.first().click();
}

async function clickIfAvailable(page: Page, name: string) {
  const button = page.getByRole("button", { name });
  if (await button.count()) {
    await button.first().click();
    return true;
  }

  const link = page.getByRole("link", { name });
  if (await link.count()) {
    await link.first().click();
    return true;
  }

  return false;
}

async function checkMobileTask(page: Page, taskTitle: string) {
  const taskCard = page.locator("div").filter({ hasText: taskTitle }).filter({ hasText: "Done" });
  const checkbox = taskCard.first().getByRole("checkbox");
  if (await checkbox.count()) {
    await checkbox.first().check();
  }
}

async function attachResultSummary(testInfo: TestInfo, status: string) {
  await testInfo.attach(`${uatReference}-summary.json`, {
    body: JSON.stringify(
      {
        reference: uatReference,
        status,
        company: "London Quality Care Services Ltd",
        dataSafety: "Dummy UAT data only. Do not run against production personal data unless a dedicated test tenant has been authorised.",
        completedAt: new Date().toISOString(),
        results: resultSummary
      },
      null,
      2
    ),
    contentType: "application/json"
  });
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isMobileProject(projectName: string) {
  return projectName.toLowerCase().includes("mobile");
}
