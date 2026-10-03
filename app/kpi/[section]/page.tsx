import type { Metadata } from "next";
import { SeniorManagementKpiDashboard } from "@/components/ecm/KPI";

export const metadata: Metadata = {
  title: "KPI Section | CareVerity ECM",
  description: "CareVerity senior management KPI section with role-controlled performance intelligence, RAG ratings, drill-downs, reports and audit evidence."
};

export default async function KpiSectionPage({ params }: { params: Promise<{ section: string }> }) {
  const { section } = await params;
  return <SeniorManagementKpiDashboard initialSection={section} />;
}
