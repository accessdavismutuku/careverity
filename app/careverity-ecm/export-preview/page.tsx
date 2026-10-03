import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Export Demo Records Preview | CareVerity ECM",
  description: "Preview fake CareVerity ECM demo service user, staff, visit, rota and audit export records before JSON, CSV or print output."
};

export default function CareVerityExportPreviewPage() {
  return <CareVerityPrototype initialModule="exportpreview" />;
}
