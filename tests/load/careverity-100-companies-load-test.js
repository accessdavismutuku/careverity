import http from "k6/http";
import { check, group, sleep } from "k6";
import { Trend, Rate } from "k6/metrics";

const baseUrl = __ENV.CAREVERITY_BASE_URL || "http://localhost:3000";
const dashboardTrend = new Trend("careverity_dashboard_load_ms");
const mobileTrend = new Trend("careverity_mobile_load_ms");
const marTrend = new Trend("careverity_mar_load_ms");
const leakageFailures = new Rate("careverity_tenant_leakage_failures");

export const options = {
  scenarios: {
    launch_readiness_100_companies: {
      executor: "ramping-vus",
      stages: [
        { duration: "30s", target: 25 },
        { duration: "1m", target: 100 },
        { duration: "30s", target: 0 }
      ]
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    careverity_dashboard_load_ms: ["p(95)<3000"],
    careverity_mobile_load_ms: ["p(95)<3000"],
    careverity_mar_load_ms: ["p(95)<3000"],
    careverity_tenant_leakage_failures: ["rate<0.01"]
  }
};

function get(path) {
  return http.get(`${baseUrl}${path}`, {
    headers: {
      "X-CareVerity-Test-Reference": "CAREVERITY-LAUNCH-READINESS-001",
      "X-CareVerity-Dummy-Only": "true"
    }
  });
}

export default function () {
  const companyNumber = String((__VU % 100) + 1).padStart(3, "0");
  const companyId = `TEST-COMPANY-${companyNumber}`;

  group(`company ${companyId} dashboard`, () => {
    const response = get("/careverity-ecm");
    dashboardTrend.add(response.timings.duration);
    const ok = check(response, {
      "dashboard status 200": (res) => res.status === 200,
      "dashboard mentions CareVerity": (res) => res.body.includes("CareVerity")
    });
    leakageFailures.add(!ok);
  });

  group(`company ${companyId} staff mobile`, () => {
    const staffParam = companyId === "TEST-COMPANY-001" ? "sarah" : "care";
    const response = get(`/careverity-ecm/mobile/demo-visit?staff=${staffParam}`);
    mobileTrend.add(response.timings.duration);
    const ok = check(response, {
      "mobile status 200": (res) => res.status === 200,
      "mobile is scoped app": (res) => res.body.includes("CareVerity")
    });
    leakageFailures.add(!ok);
  });

  group(`company ${companyId} MAR`, () => {
    const response = get("/careverity-ecm#mar");
    marTrend.add(response.timings.duration);
    const ok = check(response, {
      "MAR status 200": (res) => res.status === 200,
      "MAR page shell returned": (res) => res.body.includes("CareVerity")
    });
    leakageFailures.add(!ok);
  });

  sleep(1);
}
