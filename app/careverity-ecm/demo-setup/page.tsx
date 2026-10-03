import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Demo Setup / Test Workflow | CareVerity ECM",
  description: "Create fake demo service user, staff, shift and allocation records to test the CareVerity workflow."
};

export default function CareVerityDemoSetupPage() {
  return <CareVerityPrototype initialModule="demo" />;
}
