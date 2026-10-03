import { expect, test } from "@playwright/test";

test.describe("CareVerity Quality Intelligence & CQC Evidence Hub", () => {
  test("quality hub opens, shows AI safeguards, drafts a report and generates an evidence pack", async ({ page }) => {
    await page.goto("/careverity-ecm/quality-intelligence");
    const main = page.getByRole("main");

    await expect(main.getByRole("heading", { name: "Quality Intelligence & CQC Evidence Hub" }).first()).toBeVisible();
    await expect(main.getByText("AI suggestions are draft only", { exact: false })).toBeVisible();
    await expect(main.getByText("companyId", { exact: true })).toBeVisible();
    await expect(main.getByText("Total incidents", { exact: true })).toBeVisible();
    await expect(main.getByText("CQC Evidence Mapping", { exact: true })).toBeVisible();

    await main.getByRole("button", { name: "Lessons Learned Tracker" }).click();
    await expect(main.getByText("Lessons learned tracker", { exact: false }).first()).toBeVisible();
    await expect(main.getByText("Review transfer instructions after mobility change", { exact: false })).toBeVisible();

    await main.getByRole("button", { name: "Complaints and Compliments Analysis" }).click();
    await expect(main.getByText("Complaints and compliments AI-assisted analysis", { exact: false })).toBeVisible();
    await expect(main.getByText("Generate good news story", { exact: false })).toBeVisible();

    await main.getByRole("button", { name: "Monthly Quality Report Generator" }).click();
    await main.getByRole("button", { name: "Generate Draft Monthly Quality Report" }).click();
    await expect(main.getByLabel("Draft monthly quality report")).toHaveValue(/AI-assisted draft - approval required/);
    await expect(main.getByLabel("Draft monthly quality report")).toHaveValue(/Missing information before approval:/);
    await main.getByRole("button", { name: "Approve Quality Report" }).click();
    await expect(main.getByText("Approved quality report", { exact: false })).toBeVisible();

    await main.getByRole("button", { name: "Inspection Evidence Pack" }).click();
    await main.getByRole("button", { name: "Generate Draft Evidence Pack" }).click();
    await expect(main.getByText("Draft evidence pack generated for manager review", { exact: false })).toBeVisible();
    await expect(main.getByRole("cell", { name: "Approved reports" })).toBeVisible();
  });
});
