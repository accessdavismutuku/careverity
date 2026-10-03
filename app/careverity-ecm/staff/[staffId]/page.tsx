import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Staff File | CareVerity ECM",
  description: "Private individual staff file with role-restricted HR, recruitment, DBS, right-to-work, documents, training, payroll and audit sections."
};

export default async function CareVerityStaffFilePage({ params }: { params: Promise<{ staffId: string }> }) {
  const { staffId } = await params;
  return <CareVerityPrototype initialModule="staff" initialStaffPath={staffId} />;
}
