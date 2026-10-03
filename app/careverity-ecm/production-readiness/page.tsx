import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Production Readiness | CareVerity ECM",
  description: "Database, tenant separation, security, audit, storage and backup readiness checklist for CareVerity ECM."
};

export default function CareVerityProductionReadinessPage() {
  return <CareVerityPrototype initialModule="production" />;
}
