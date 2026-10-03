import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Training Matrix | CareVerity ECM",
  description: "CareVerity Training Academy matrix linked to staff files, certificates and rota eligibility."
};

export default function CareVerityTrainingMatrixPage() {
  return <CareVerityPrototype initialModule="trainingmatrix" />;
}
