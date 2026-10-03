import { expect, test, type Page } from "@playwright/test";

const fullUatReference = "LQCS-CAREVERITY-FULL-UAT-001";

const demoStorageKeys = [
  "careverity-demo-staff",
  "careverity-demo-clients",
  "careverity-demo-call-cards",
  "careverity-demo-allocations",
  "careverity-demo-visit",
  "careverity-demo-visits",
  "careverity-demo-visit-audit",
  "careverity-demo-mar-records",
  "careverity-demo-workflow-status",
  "careverity-demo-last-export"
] as const;

test.describe(`${fullUatReference} - CareVerity full demo-mode UAT retest`, () => {
  test("Mary/Sarah/Ahmed allocation, mobile, MAR and admin monitoring workflow", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.toLowerCase().includes("mobile"), "Full UAT retest runs on desktop; mobile rendering is covered by the existing focused mobile UAT.");

    await page.goto("/careverity-ecm");
    await page.evaluate((keys) => keys.forEach((key) => window.localStorage.removeItem(key)), [...demoStorageKeys]);
    await expectText(page, "CareVerity ECM");

    await page.goto("/careverity-ecm/demo-setup");
    await clickByName(page, "Create Full UAT Mary / Sarah / Ahmed Workflow");
    await expectText(page, "31 Sarah / Mary visits");
    await expectText(page, "Ahmed Khan allocated");

    await page.goto("/careverity-ecm/staff/new");
    await selectByLabel(page, "Staff role", "Permanent Care Worker");
    await selectByLabel(page, "Staff role", "One-off / Emergency Cover Care Worker");

    await page.goto("/careverity-ecm/rota");
    await expectText(page, "Mary Johnson");
    await expectText(page, "Sarah Williams");
    await expectText(page, "Ahmed Khan");
    await expectText(page, "31 visits created");

    await page.goto("/careverity-ecm/rota?client=uat-mary-johnson&calls=Permanent%20Morning%20Call&range=One%20month&allocation=Permanent%20regular%20carer");
    await expectText(page, "Start New Allocation");
    await expectText(page, "Permanent Morning Call");
    await expectText(page, "31 visit records");
    await clickByName(page, "Publish Rota");
    await expectText(page, "Published");

    await page.goto("/careverity-ecm/rota?client=uat-mary-johnson&calls=Emergency%20Welfare%20Call&allocation=One-off%20/%20emergency%20cover");
    await expectText(page, "Emergency Welfare Call");
    await expectText(page, "One-off / emergency cover");
    await clickByName(page, "Save Allocation");
    await expectText(page, "Ahmed Khan");

    await page.goto("/careverity-ecm/mobile/demo-visit?staff=sarah");
    await expectText(page, "Sarah Williams");
    await expectText(page, "Permanent Morning Call");
    await clickByName(page, "Check in");
    await expectText(page, "In progress");
    await clickByName(page, "Save visit note");
    await clickByName(page, "Check out");
    await expectText(page, "Completed");
    await expectText(page, "Medication recorded: Yes");

    await page.goto("/careverity-ecm/mobile/demo-visit?staff=ahmed&visit=emergency");
    await expectText(page, "Ahmed Khan");
    await expectText(page, "Emergency Welfare Call");
    await expectText(page, "other visits hidden");
    await clickByName(page, "Check in");
    await expectText(page, "In progress");
    await clickByName(page, "Save visit note");
    await clickByName(page, "Check out");
    await expectText(page, "Completed");
    await expectText(page, "Not required");

    await page.goto("/careverity-ecm#mar");
    await expectText(page, "Normal Medication Administration");
    await expectText(page, "Paracetamol 500mg");
    await clickByName(page, "Record Paracetamol Given");
    await clickByName(page, "Record Paracetamol Refused");
    await clickByName(page, "Record Paracetamol Missed / Not Given");
    await expectText(page, "Normal MAR audit");
    await expectText(page, "Missed / Not Given");

    await page.goto("/careverity-ecm#controlledmar");
    await expectText(page, "Controlled Medication Administration");
    await expectText(page, "Morphine Sulphate Oral Solution");
    await clickByName(page, "Record Morphine Given");
    await clickByName(page, "Record Morphine Refused");
    await clickByName(page, "Record Morphine Missed / Not Given");
    await expectText(page, "Controlled MAR audit");
    await expectText(page, "97.5ml");

    await page.goto("/careverity-ecm/live-ecm");
    await expectText(page, "Mary Johnson");
    await expectText(page, "Sarah Williams");
    await expectText(page, "Ahmed Khan");
    await expectText(page, "Completed");

    await page.goto("/careverity-ecm/data-protection-compliance");
    await expectText(page, "audit");
    await page.goto("/careverity-ecm/export-preview");
    await expectText(page, "Export");
  });
});

async function clickByName(page: Page, name: string) {
  const button = page.getByRole("button", { name });
  if (await button.count()) {
    await button.first().click();
    return;
  }
  await page.getByRole("link", { name }).first().click();
}

async function expectText(page: Page, text: string) {
  await expect(page.getByText(text, { exact: false }).filter({ visible: true }).first()).toBeVisible();
}

async function selectByLabel(page: Page, label: string, option: string) {
  const labelledControl = page.getByLabel(label, { exact: true }).first();
  if (await labelledControl.count()) {
    await labelledControl.selectOption({ label: option });
    return;
  }

  await page.getByRole("combobox", { name: label, exact: true }).first().selectOption({ label: option });
}
