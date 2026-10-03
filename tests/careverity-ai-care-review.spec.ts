import { expect, test } from "@playwright/test";

test.describe("CareVerity AI Care Review & Referral Assistant", () => {
  test("manager can generate and approve a review-only AI-assisted draft", async ({ page }) => {
    await page.goto("/careverity-ecm#aireview");
    const main = page.getByRole("main");

    await expect(main.getByRole("heading", { name: "AI Care Review & Referral Assistant" }).first()).toBeVisible();
    await expect(main.getByText("AI supports drafting only", { exact: false }).first()).toBeVisible();
    await expect(main.getByText("companyId", { exact: true })).toBeVisible();
    await expect(main.getByText("OT referral recommended", { exact: false }).first()).toBeVisible();

    await main.getByRole("button", { name: "Generate AI-assisted draft" }).click();
    await expect(main.getByText("AI-assisted draft - approval required", { exact: false }).first()).toBeVisible();
    await expect(main.getByLabel("Editable draft")).toHaveValue(/Source records used:/);
    await expect(main.getByLabel("Editable draft")).toHaveValue(/Missing information to confirm before approval:/);

    await main.getByLabel("Show emergency red-flag safeguard").check();
    await expect(main.getByText("This may require immediate emergency action. Do not rely only on email.", { exact: false })).toBeVisible();

    await main.getByRole("button", { name: "Approve and save to client file" }).click();
    await expect(main.getByText("Approved demo draft saved to the client file", { exact: false })).toBeVisible();
  });

  test("client file exposes the assistant as a governed client tab", async ({ page }) => {
    await page.goto("/careverity-ecm/clients/demo-service-user-101/ai-care-review");
    const main = page.getByRole("main");

    await expect(main.getByRole("heading", { name: /Demo Service User 101/ }).first()).toBeVisible();
    await expect(main.getByRole("button", { name: "AI Care Review & Referral Assistant" }).first()).toBeVisible();
    await expect(main.getByText("AI suggestions and generated drafts are review-only", { exact: false })).toBeVisible();
    await expect(main.getByText("serviceUserId", { exact: true })).toBeVisible();
  });
});
