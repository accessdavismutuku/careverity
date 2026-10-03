import { expect, test, type Page } from "@playwright/test";

const launchReference = "CAREVERITY-LAUNCH-READINESS-001";

const launchStorageKeys = [
  "careverity-demo-companies",
  "careverity-demo-staff",
  "careverity-demo-clients",
  "careverity-demo-call-cards",
  "careverity-demo-allocations",
  "careverity-demo-visit",
  "careverity-demo-visits",
  "careverity-demo-visit-audit",
  "careverity-demo-mar-records",
  "careverity-demo-messages",
  "careverity-demo-tasks",
  "careverity-demo-incidents",
  "careverity-demo-workflow-status",
  "careverity-demo-last-export"
] as const;

test.describe(`${launchReference} - launch readiness`, () => {
  test("100-company tenant data, staff greeting, mobile, MAR and audit checks", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name.toLowerCase().includes("mobile"), "Launch readiness spec runs on desktop; mobile pages are opened in desktop browser for deterministic local demo-mode checks.");

    await page.goto("/careverity-ecm");
    await page.evaluate((keys) => keys.forEach((key) => window.localStorage.removeItem(key)), [...launchStorageKeys]);

    await page.goto("/careverity-ecm/demo-setup");
    await clickByName(page, "Create Launch Readiness 100 Companies");
    await expectText(page, "100 companies ready");
    await expectText(page, "companyId logged");

    const storageSummary = await page.evaluate(() => {
      const read = <T,>(key: string, fallback: T): T => {
        const raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) as T : fallback;
      };
      const companies = read<Array<{ companyId: string }>>("careverity-demo-companies", []);
      const staff = read<Array<{ companyId?: string; name: string }>>("careverity-demo-staff", []);
      const clients = read<Array<{ companyId?: string }>>("careverity-demo-clients", []);
      const visits = read<Array<{ companyId?: string; staffName: string; serviceUserName: string }>>("careverity-demo-visits", []);
      const mar = read<Array<{ companyId?: string; medicationName: string; newStockMl?: number }>>("careverity-demo-mar-records", []);
      const messages = read<Array<{ companyId?: string; taggedStaffIds: string[]; readByStaffIds: string[]; status: string }>>("careverity-demo-messages", []);
      const tasks = read<Array<{ companyId?: string; assignedStaffId: string; status: string }>>("careverity-demo-tasks", []);
      const audit = read<Array<{ companyId?: string }>>("careverity-demo-visit-audit", []);
      const companyIds = new Set(companies.map((company) => company.companyId));
      const allRecordsHaveCompanyId = [staff, clients, visits, mar, messages, tasks, audit].every((records) => records.every((record) => record.companyId && companyIds.has(record.companyId)));
      return {
        allRecordsHaveCompanyId,
        auditWithCompanyId: audit.some((record) => record.companyId === "TEST-COMPANY-001"),
        companies: companies.length,
        clients: clients.length,
        controlledBalance95: mar.some((record) => record.medicationName.includes("Morphine") && record.newStockMl === 95 && record.companyId === "TEST-COMPANY-001"),
        messages: messages.length,
        sarahUnreadMessages: messages.filter((message) => message.companyId === "TEST-COMPANY-001" && message.taggedStaffIds.includes("UAT-ST-SARAH-001") && !message.readByStaffIds.includes("UAT-ST-SARAH-001") && message.status !== "Read").length,
        sarahOutstandingTasks: tasks.filter((task) => task.companyId === "TEST-COMPANY-001" && task.assignedStaffId === "UAT-ST-SARAH-001" && task.status !== "Completed").length,
        ahmedUnreadMessages: messages.filter((message) => message.companyId === "TEST-COMPANY-001" && message.taggedStaffIds.includes("UAT-ST-AHMED-001") && !message.readByStaffIds.includes("UAT-ST-AHMED-001") && message.status !== "Read").length,
        ahmedOutstandingTasks: tasks.filter((task) => task.companyId === "TEST-COMPANY-001" && task.assignedStaffId === "UAT-ST-AHMED-001" && task.status !== "Completed").length,
        coordinatorUnreadMessages: messages.filter((message) => message.companyId === "TEST-COMPANY-001" && message.taggedStaffIds.includes("UAT-ST-COORD-001") && !message.readByStaffIds.includes("UAT-ST-COORD-001") && message.status !== "Read").length,
        coordinatorOutstandingTasks: tasks.filter((task) => task.companyId === "TEST-COMPANY-001" && task.assignedStaffId === "UAT-ST-COORD-001" && task.status !== "Completed").length,
        staff: staff.length,
        tasks: tasks.length,
        visits: visits.length
      };
    });

    expect(storageSummary.companies).toBe(100);
    expect(storageSummary.staff).toBeGreaterThanOrEqual(800);
    expect(storageSummary.clients).toBeGreaterThanOrEqual(500);
    expect(storageSummary.visits).toBeGreaterThanOrEqual(2000);
    expect(storageSummary.messages).toBeGreaterThanOrEqual(1000);
    expect(storageSummary.tasks).toBeGreaterThanOrEqual(1000);
    expect(storageSummary.allRecordsHaveCompanyId).toBe(true);
    expect(storageSummary.auditWithCompanyId).toBe(true);
    expect(storageSummary.controlledBalance95).toBe(true);
    expect(storageSummary.sarahUnreadMessages).toBe(4);
    expect(storageSummary.sarahOutstandingTasks).toBe(7);
    expect(storageSummary.ahmedUnreadMessages).toBe(2);
    expect(storageSummary.ahmedOutstandingTasks).toBe(3);
    expect(storageSummary.coordinatorUnreadMessages).toBe(5);
    expect(storageSummary.coordinatorOutstandingTasks).toBe(10);

    await page.goto("/careverity-ecm");
    await expectHeading(page, "Hi, Sarah Williams");
    await expectText(page, "You have: 4 tagged messages, 7 outstanding tasks, 3 visits today, 2 medication tasks due and 1 incident requiring action.");
    await selectStaff(page, "Ahmed Khan - One-off / Emergency Cover Care Worker");
    await expectHeading(page, "Hi, Ahmed Khan");
    await expectText(page, "You have: 2 tagged messages, 3 outstanding tasks");
    await selectStaff(page, "Demo Care Coordinator - Care Coordinator");
    await expectHeading(page, "Hi, Demo Care Coordinator");
    await expectText(page, "You have: 5 tagged messages, 10 outstanding tasks");

    await page.goto("/careverity-ecm/mobile/demo-visit?staff=sarah");
    await expectHeading(page, "Hi, Sarah Williams");
    await expectText(page, "Mary Johnson");
    await clickByName(page, "Check in");
    await expectText(page, "In progress");
    await clickByName(page, "Save visit note");
    await clickByName(page, "Check out");
    await expectText(page, "Completed");

    await page.goto("/careverity-ecm/mobile/demo-visit?staff=ahmed&visit=emergency");
    await expectHeading(page, "Hi, Ahmed Khan");
    await expectText(page, "Emergency Welfare Call");
    await expectText(page, "other visits hidden");
    await clickByName(page, "Check in");
    await expectText(page, "In progress");
    await clickByName(page, "Save visit note");
    await clickByName(page, "Check out");
    await expectText(page, "Completed");

    await page.goto("/careverity-ecm#mar");
    await expectText(page, "Normal Medication Administration");
    await clickByName(page, "Record Paracetamol Given");
    await clickByName(page, "Record Paracetamol Refused");
    await clickByName(page, "Record Paracetamol Missed / Not Given");
    await expectText(page, "Normal MAR audit");

    await page.goto("/careverity-ecm#controlledmar");
    await expectText(page, "Controlled Medication Administration");
    await expectText(page, "Current stock balance");
    await expectText(page, "95ml");
    await clickByName(page, "Record Morphine Given");
    await expectText(page, "92.5ml");

    await page.goto("/careverity-ecm/live-ecm");
    const completedAdminVisits = await page.evaluate(() => {
      const visits = JSON.parse(window.localStorage.getItem("careverity-demo-visits") || "[]") as Array<{ companyId?: string; serviceUserName: string; staffName: string; callType: string; status: string }>;
      return visits.filter((visit) => visit.companyId === "TEST-COMPANY-001" && visit.serviceUserName === "Mary Johnson" && visit.status === "Completed").map((visit) => `${visit.staffName}:${visit.callType}:${visit.status}`);
    });
    expect(completedAdminVisits.some((visit) => visit.includes("Sarah Williams"))).toBe(true);
    expect(completedAdminVisits.some((visit) => visit.includes("Ahmed Khan") && visit.includes("Emergency"))).toBe(true);
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
  const target = page.getByText(text, { exact: false }).first();
  await target.scrollIntoViewIfNeeded({ timeout: 30_000 });
  await expect(target).toBeVisible({ timeout: 30_000 });
}

async function expectHeading(page: Page, name: string) {
  const heading = page.getByRole("heading", { name, exact: true });
  await heading.scrollIntoViewIfNeeded({ timeout: 30_000 });
  await expect(heading).toBeVisible({ timeout: 30_000 });
}

async function selectStaff(page: Page, optionLabel: string) {
  await page.getByRole("combobox", { name: "Demo logged-in staff", exact: true }).selectOption({ label: optionLabel });
}
