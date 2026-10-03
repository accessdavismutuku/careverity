"use client";

export const ecmDocumentsModuleStatus = {
  module: "CareVerity ECM Documents",
  currentImplementation: "Client document upload UI is currently rendered from the consolidated CareVerity ECM legacy-backed client file module.",
  canonicalFolder: "components/ecm/Documents",
  activeRoutes: ["/careverity-ecm/clients/[clientId]", "/api/client-documents/upload", "/api/client-documents/[documentId]/signed-url"],
  extractionStatus: "Ready for extraction from CareVerityPrototypeLegacy when the client file module is split further."
} as const;
