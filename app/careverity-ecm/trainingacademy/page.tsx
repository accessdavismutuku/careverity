import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Training Academy | CareVerity ECM",
  description: "CareVerity ECM Training Academy with course library, videos, materials, quizzes and certificates."
};

export default function CareVerityTrainingAcademyPage() {
  return <CareVerityPrototype initialModule="trainingacademy" />;
}
