import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Reports & Governance Centre | CareVerity ECM",
  description: "CareVerity ECM governance reporting, trackers, KPI trends, CQC evidence and export centre."
};

export default function CareVerityReportsPage() {
  return <CareVerityPrototype initialModule="reports" />;
}
