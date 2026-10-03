import type { Metadata } from "next";
import { CareVerityPrototype } from "./careverity-prototype";

export const metadata: Metadata = {
  title: "CareVerity ECM & Care Compliance System",
  description: "CareVerity ECM & Care Compliance System with CareVerity Training Academy, demo workflows, rota, Live ECM, eMAR, certificates and compliance evidence."
};

export default function CareVerityEcmPage() {
  return <CareVerityPrototype />;
}
