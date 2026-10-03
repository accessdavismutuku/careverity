import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "Staff Recognition | CareVerity ECM",
  description: "CareVerity HRIS staff recognition, good practice evidence, nominations, approvals, consent and CQC evidence mapping."
};

export default function StaffRecognitionRoute() {
  return <CareVerityPrototype initialModule="recognition" />;
}
