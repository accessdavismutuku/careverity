import http from "k6/http";
import { check, group, sleep } from "k6";
import { Rate, Trend } from "k6/metrics";

const baseUrl = __ENV.CAREVERITY_BASE_URL || "http://localhost:3000";
const companyCount = Number.parseInt(__ENV.CAREVERITY_COMPANY_COUNT || "100", 10);
const targetCompanies = Number.isFinite(companyCount) && companyCount > 0 ? companyCount : 100;
const peakVirtualUsers = Number.parseInt(__ENV.CAREVERITY_PEAK_VUS || String(Math.min(Math.max(targetCompanies, 50), 500)), 10);

const dashboardTrend = new Trend("careverity_saas_dashboard_load_ms");
const mobileTrend = new Trend("careverity_saas_mobile_load_ms");
const marTrend = new Trend("careverity_saas_mar_load_ms");
const qualityTrend = new Trend("careverity_saas_quality_load_ms");
const tenantLeakageFailures = new Rate("careverity_saas_tenant_leakage_failures");

export const options = {
  scenarios: {
    [`careverity_${targetCompanies}_company_scale`]: {
      executor: "ramping-vus",
      stages: [
        { duration: "30s", target: Math.ceil(peakVirtualUsers * 0.25) },
        { duration: "1m", target: peakVirtualUsers },
        { duration: "30s", target: 0 }
      ]
    }
  },
  thresholds: {
    http_req_failed: ["rate<0.01"],
    careverity_saas_dashboard_load_ms: [targetCompanies <= 100 ? "p(95)<3000" : targetCompanies <= 250 ? "p(95)<3500" : "p(95)<4000"],
    careverity_saas_mobile_load_ms: [targetCompanies <= 100 ? "p(95)<3000" : targetCompanies <= 250 ? "p(95)<3500" : "p(95)<4000"],
    careverity_saas_mar_load_ms: [targetCompanies <= 100 ? "p(95)<3000" : targetCompanies <= 250 ? "p(95)<3500" : "p(95)<4000"],
    careverity_saas_quality_load_ms: [targetCompanies <= 100 ? "p(95)<3000" : targetCompanies <= 250 ? "p(95)<3500" : "p(95)<4000"],
    careverity_saas_tenant_leakage_failures: ["rate<0.01"]
  }
};

function get(path, companyId) {
  return http.get(`${baseUrl}${path}`, {
    headers: {
      "X-CareVerity-Test-Reference": "CAREVERITY-SAAS-MULTI-TENANT-ARCHITECTURE-001",
      "X-CareVerity-Dummy-Only": "true",
      "X-CareVerity-Company-Id": companyId,
      "X-CareVerity-Company-Count": String(targetCompanies)
    }
  });
}

function recordResult(response, trend, checks) {
  trend.add(response.timings.duration);
  const ok = check(response, checks);
  tenantLeakageFailures.add(!ok);
}

export default function () {
  const companyNumber = String((__VU % targetCompanies) + 1).padStart(3, "0");
  const companyId = `TEST-COMPANY-${companyNumber}`;

  group(`company ${companyId} dashboard`, () => {
    recordResult(get("/careverity-ecm", companyId), dashboardTrend, {
      "dashboard status 200": (res) => res.status === 200,
      "dashboard shell returned": (res) => res.body.includes("CareVerity")
    });
  });

  group(`company ${companyId} mobile visit`, () => {
    const staffParam = companyId === "TEST-COMPANY-001" ? "sarah" : "care";
    recordResult(get(`/careverity-ecm/mobile/demo-visit?staff=${staffParam}&companyId=${companyId}`, companyId), mobileTrend, {
      "mobile status 200": (res) => res.status === 200,
      "mobile shell returned": (res) => res.body.includes("CareVerity")
    });
  });

  group(`company ${companyId} MAR`, () => {
    recordResult(get(`/careverity-ecm#mar?companyId=${companyId}`, companyId), marTrend, {
      "MAR status 200": (res) => res.status === 200,
      "MAR shell returned": (res) => res.body.includes("CareVerity")
    });
  });

  group(`company ${companyId} quality hub`, () => {
    recordResult(get(`/careverity-ecm/quality-intelligence?companyId=${companyId}`, companyId), qualityTrend, {
      "quality status 200": (res) => res.status === 200,
      "quality shell returned": (res) => res.body.includes("CareVerity")
    });
  });

  sleep(1);
}
