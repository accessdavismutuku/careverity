import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "HRIS & AI Staff Communication Assistant | CareVerity ECM",
  description: "CareVerity HRIS module for staff records, HR communications, AI-assisted draft templates, approval workflow and audit trail."
};

export default function CareVerityHrisAiAssistantPage() {
  return <CareVerityPrototype initialModule="hris" />;
}
