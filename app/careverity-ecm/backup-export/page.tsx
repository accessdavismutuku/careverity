import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Backup / Export / Import | CareVerity ECM",
  description: "Export, import, reset and migrate CareVerity ECM prototype demo data."
};

export default function CareVerityBackupExportPage() {
  return <CareVerityPrototype initialModule="backup" />;
}
