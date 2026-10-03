import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "Staff Profile Generator | CareVerity ECM",
  description: "Generate, preview and export authorised CareVerity ECM staff profile reports."
};

export default function StaffProfileReportPage() {
  return <CareVerityPrototype initialModule="staff" />;
}
