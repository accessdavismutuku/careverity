import type { Metadata } from "next";
import { CareVerityBackendSetupMessage, CareVerityDemoModeBanner } from "@/components/careverity-backend-setup-message";
import { getCareVerityRuntimeMode } from "@/lib/careverity-runtime-mode";
import { CareVerityPrototype } from "../careverity-prototype";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Service Users / Client Files | CareVerity ECM",
  description: "Add, search and manage individual service user records, care plans, risk assessments, call packages, documents and communications."
};

export default function CareVerityClientsPage() {
  const runtimeMode = getCareVerityRuntimeMode();

  if (runtimeMode.productionBackendEnabled && !runtimeMode.backendConfigured) {
    return (
      <CareVerityBackendSetupMessage
        appEnv={runtimeMode.appEnv}
        configStatus={runtimeMode.configStatus}
        missingConfig={runtimeMode.missingConfig}
        routeName="Service Users / Client Files"
      />
    );
  }

  return (
    <>
      {runtimeMode.demoMode ? <CareVerityDemoModeBanner /> : null}
      <CareVerityPrototype initialModule="clients" />
    </>
  );
}
