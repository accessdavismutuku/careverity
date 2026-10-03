import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "Mobile Carer App | CareVerity ECM",
  description: "CareVerity mobile carer visit tasks, observations, care plan quick view and shift calendar."
};

export default async function MobileCarerAppRoute({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  return <CareVerityPrototype initialMobilePath={slug?.join("/") || ""} initialModule="mobile" />;
}
