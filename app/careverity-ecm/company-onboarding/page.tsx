import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Company Onboarding / Import Companies | CareVerity ECM",
  description: "Multi-company provider onboarding, Excel import, validation, duplicate review, audit log and tenant separation."
};

export default function CareVerityCompanyOnboardingPage() {
  return <CareVerityPrototype initialModule="company" />;
}
