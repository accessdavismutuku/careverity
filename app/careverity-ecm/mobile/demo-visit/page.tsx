import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Demo Staff Visit View | CareVerity ECM",
  description: "Fake staff mobile visit view for demo check-in, check-out, visit notes and evidence workflow."
};

export default function CareVerityDemoVisitPage() {
  return <CareVerityPrototype initialMobilePath="demo-visit" initialModule="mobile" />;
}
