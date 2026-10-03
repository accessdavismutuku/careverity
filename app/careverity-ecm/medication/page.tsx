import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Medication / eMAR | CareVerity ECM",
  description: "Medication profile, eMAR, MAR and medication governance workspace inside the CareVerity ECM prototype."
};

export default function CareVerityMedicationPage() {
  return <CareVerityPrototype initialModule="emar" />;
}
