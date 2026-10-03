import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-prototype";

export const metadata: Metadata = {
  title: "Client Journal | CareVerity ECM",
  description: "Locked service user journal and communication log with addendums, actions, attachments and audit trail."
};

export default async function CareVerityClientJournalPage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <CareVerityPrototype initialModule="clients" initialClientPath={`${clientId}/journal`} />;
}
