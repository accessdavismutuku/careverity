import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-prototype";

export const metadata: Metadata = {
  title: "AI Care Review & Referral Assistant | CareVerity ECM",
  description: "AI-assisted draft care review, referral and professional communication workflow with mandatory human approval."
};

export default async function CareVerityClientAiCareReviewPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <CareVerityPrototype initialModule="clients" initialClientPath={`${clientId}/ai-care-review`} />;
}
