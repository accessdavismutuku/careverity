import { expect, test } from "@playwright/test";

const launchReference = "CAREVERITY-UK-LAUNCH-READINESS-001";

test.describe(`${launchReference} - security launch gate`, () => {
  test("production readiness page shows hard-stop launch decision and security checklists", async ({ page }) => {
    await page.goto("/careverity-ecm/production-readiness");

    await expect(page.getByRole("heading", { name: "UK Launch Readiness", exact: true })).toBeVisible();
    await expect(page.getByText(launchReference)).toBeVisible();
    await expect(page.getByText("Not ready for full UK launch", { exact: false })).toBeVisible();
    await expect(page.getByText("Launch blocked", { exact: false })).toBeVisible();
    await expect(page.getByText("Hard stops before launch", { exact: true })).toBeVisible();
    await expect(page.getByText("Security and privacy control register", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "OWASP Top 10 test plan", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Penetration test checklist", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Cyber Essentials readiness", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "DPIA support checklist", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Backup and restore checklist", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Privacy notice / DPA templates", exact: true })).toBeVisible();
    await expect(page.getByText("Never query staff, service users, MAR, rota, documents, journal, invoices, reports or audit logs without filtering by company_id/provider_id.")).toBeVisible();
  });
});
