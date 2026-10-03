import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Existing Service Users | CareVerity ECM",
  description: "Search and select existing service users before opening a private client file."
};

export default function CareVerityExistingClientsPage() {
  return <CareVerityPrototype initialModule="clients" initialClientPath="existing" />;
}
