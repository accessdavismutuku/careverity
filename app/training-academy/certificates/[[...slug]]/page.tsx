import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "Training Certificate Generator | CareVerity ECM",
  description: "Design, preview, issue and manage CareVerity ECM training certificates."
};

export default async function TrainingCertificateGeneratorPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  return <CareVerityPrototype initialModule="trainingacademy" initialTrainingAcademyPath={`certificates/${slug?.join("/") || ""}`} />;
}
