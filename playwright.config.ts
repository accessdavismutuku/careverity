import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.CAREVERITY_BASE_URL ?? "http://localhost:3000";
const shouldStartLocalServer = !process.env.CAREVERITY_BASE_URL;

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  timeout: 120_000,
  expect: {
    timeout: 15_000
  },
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  workers: 1,
  reporter: [
    ["html", { open: "never" }],
    ["list"]
  ],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      name: "Desktop Chrome",
      use: {
        ...devices["Desktop Chrome"]
      }
    },
    {
      name: "Mobile Chrome",
      testMatch: "**/careverity-end-to-end.spec.ts",
      use: {
        ...devices["Pixel 5"]
      }
    }
  ],
  webServer: shouldStartLocalServer
    ? {
        command: "\"C:\\Program Files\\nodejs\\npm.cmd\" run dev",
        url: `${baseURL}/careverity-ecm`,
        reuseExistingServer: true,
        timeout: 120_000
      }
    : undefined
});
