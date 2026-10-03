import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Client File | CareVerity ECM",
  description: "Private individual service user file with care plan, risk, call package, documents, notes, rota and audit tabs."
};

export default async function CareVerityClientFilePage({ params }: { params: Promise<{ clientId: string }> }) {
  const { clientId } = await params;
  return <CareVerityPrototype initialModule="clients" initialClientPath={clientId} />;
}
