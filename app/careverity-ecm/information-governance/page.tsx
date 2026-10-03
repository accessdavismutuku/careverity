import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Information Governance & DSPT | CareVerity ECM",
  description: "Data protection, DSPT and cyber security governance evidence for CareVerity ECM."
};

export default function CareVerityInformationGovernancePage() {
  return <CareVerityPrototype initialModule="ig" />;
}
