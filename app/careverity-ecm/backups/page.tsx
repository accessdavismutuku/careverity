import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Backups | CareVerity ECM",
  description: "Backup, export, import, reset and migration controls inside the CareVerity ECM prototype."
};

export default function CareVerityBackupsPage() {
  return <CareVerityPrototype initialModule="backup" />;
}
