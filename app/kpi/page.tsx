import type { Metadata } from "next";
import { SeniorManagementKpiDashboard } from "@/components/ecm/KPI";

export const metadata: Metadata = {
  title: "Senior Management KPI Dashboard | CareVerity ECM",
  description: "CareVerity senior management KPI and performance intelligence dashboard for authorised management, compliance and CQC evidence review."
};

export default function KpiDashboardPage() {
  return <SeniorManagementKpiDashboard initialSection="executive-dashboard" />;
}
