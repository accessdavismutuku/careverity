import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "NHS Invoices | CareVerity ECM",
  description: "NHS/ICB invoicing dashboard, workflow, invoice preview, batches and settings for CareVerity ECM."
};

export default function NhsInvoicesPage() {
  return <CareVerityPrototype initialModule="finance" />;
}
