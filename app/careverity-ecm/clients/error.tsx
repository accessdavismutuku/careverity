"use client";

import { CareVerityBackendSetupMessage } from "@/components/careverity-backend-setup-message";

export default function CareVerityClientsError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <>
      <CareVerityBackendSetupMessage
        appEnv="runtime-error"
        configStatus={[
          { key: "NEXT_PUBLIC_SUPABASE_URL", present: false },
          { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", present: false },
          { key: "DATABASE_URL", present: false },
          { key: "SUPABASE_SERVICE_ROLE_KEY", present: false },
          { key: "JWT_SECRET", present: false }
        ]}
        message={`The Service Users / Client Files page could not load safely. ${error.message || "Please retry or return to the dashboard."}`}
        missingConfig={[]}
        routeName="Service Users / Client Files"
      />
      <button className="fixed bottom-4 right-4 rounded-md bg-teal-600 px-4 py-3 text-sm font-black text-white shadow-lg" onClick={reset} type="button">
        Retry page render
      </button>
    </>
  );
}
