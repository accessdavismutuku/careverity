"use client";

export const ecmAiModuleStatus = {
  module: "CareVerity ECM AI Assistants",
  currentImplementation: "AI care plan, referral, HR and KPI assistant surfaces are unified through their route handlers and ECM module integrations.",
  canonicalFolder: "components/ecm/AI",
  activeRoutes: [
    "/careverity-ecm/clients/[clientId]/ai-care-review",
    "/careverity-ecm/hris-ai-assistant",
    "/api/ai/hr-draft",
    "/api/ai/kpi/management-insight"
  ],
  extractionStatus: "Ready for deeper component extraction after the remaining legacy-backed module surfaces are split."
} as const;
