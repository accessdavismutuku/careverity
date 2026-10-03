import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Add New Staff | CareVerity ECM",
  description: "Create a private CareVerity ECM staff file with HR, recruitment, DBS, right-to-work, training and payroll sections."
};

export default function CareVerityAddStaffPage() {
  return <CareVerityPrototype initialModule="staff" initialStaffPath="new" />;
}
