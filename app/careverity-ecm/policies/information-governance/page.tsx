import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Policies > Information Governance | CareVerity ECM",
  description: "Information governance, DSPT and cyber security policy evidence for CareVerity ECM."
};

export default function CareVerityInformationGovernancePoliciesPage() {
  return <CareVerityPrototype initialModule="ig" />;
}
