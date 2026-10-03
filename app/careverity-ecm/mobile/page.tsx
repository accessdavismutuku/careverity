import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Mobile Carer App | CareVerity ECM",
  description: "CareVerity mobile carer visit tasks, observations, care plan quick view and shift calendar."
};

export default function CareVerityMobilePage() {
  return <CareVerityPrototype initialModule="mobile" />;
}
