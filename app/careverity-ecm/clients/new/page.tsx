import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Add New Service User | CareVerity ECM",
  description: "Guided service user setup with dropdowns, templates, call package setup and document placeholders."
};

export default function CareVerityAddClientPage() {
  return <CareVerityPrototype initialModule="clients" initialClientPath="new" />;
}
