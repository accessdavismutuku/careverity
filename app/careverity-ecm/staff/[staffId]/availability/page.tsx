import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-prototype";

export const metadata: Metadata = {
  title: "Staff Availability | CareVerity ECM",
  description: "Simple staff availability, absence and admin access schedule builder."
};

export default async function CareVerityStaffAvailabilityPage({ params }: { params: Promise<{ staffId: string }> }) {
  const { staffId } = await params;
  return <CareVerityPrototype initialModule="staff" initialStaffPath={`${staffId}/availability`} />;
}
