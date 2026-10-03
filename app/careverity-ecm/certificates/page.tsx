import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Certificates | CareVerity ECM",
  description: "CareVerity Training Academy certificates and certificate register."
};

export default function CareVerityCertificatesPage() {
  return <CareVerityPrototype initialModule="certificates" />;
}
