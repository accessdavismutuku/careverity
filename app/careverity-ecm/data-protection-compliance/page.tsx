import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Data Protection & Article 32 Compliance | CareVerity ECM",
  description: "Operational UK GDPR Article 32 security controls, registers, audit trails and evidence records for CareVerity ECM."
};

export default function CareVerityDataProtectionCompliancePage() {
  return <CareVerityPrototype initialModule="article32" />;
}
