import { NextResponse, type NextRequest } from "next/server";
import { generateSafeHrDraft, hrisTemplateRules, type HrisAiDraftRequest } from "@/lib/careverity-hris-ai";

const allowedDraftRoles = [
  "System Owner",
  "Registered Manager",
  "Deputy Manager",
  "HR Manager",
  "HR Administrator",
  "Quality / Compliance Officer",
  "Care Coordinator",
  "Senior Administrator"
];

const elevatedSensitiveRoles = ["System Owner", "Registered Manager", "HR Manager", "HR Administrator"];

function roleAllowed(role = "HR Administrator", sensitivity = "routine") {
  const canDraft = allowedDraftRoles.some((allowedRole) => role.toLowerCase().includes(allowedRole.toLowerCase()));
  if (!canDraft) return false;
  if (sensitivity === "formal" || sensitivity === "concern") {
    return elevatedSensitiveRoles.some((allowedRole) => role.toLowerCase().includes(allowedRole.toLowerCase()));
  }
  return true;
}

export async function POST(request: NextRequest) {
  const featureEnabled = process.env.ENABLE_AI_HR_ASSISTANT !== "false";

  if (!featureEnabled) {
    return NextResponse.json({ error: "AI HR Assistant feature flag is disabled." }, { status: 403 });
  }

  let payload: HrisAiDraftRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const missing = ["companyId", "userId", "staffId", "communicationType", "communicationSensitivity"].filter((field) => !payload[field as keyof HrisAiDraftRequest]);

  if (missing.length) {
    return NextResponse.json({ error: "Missing required HR AI draft fields.", missing }, { status: 400 });
  }

  if (!roleAllowed(payload.userRole, payload.communicationSensitivity)) {
    return NextResponse.json(
      {
        error: "Role not permitted to generate this HR draft type.",
        approvalRequired: true,
        audit: {
          companyId: payload.companyId,
          staffId: payload.staffId,
          action: "AI HR draft generation denied",
          generatedAt: new Date().toISOString()
        }
      },
      { status: 403 }
    );
  }

  const draft = generateSafeHrDraft({
    ...payload,
    selectedSourceRecordIds: payload.selectedSourceRecordIds ?? [],
    templateRules: payload.templateRules?.length ? payload.templateRules : hrisTemplateRules,
    outputFormat: payload.outputFormat ?? "email",
    userProvidedFacts: payload.userProvidedFacts ?? {}
  });

  return NextResponse.json({
    ...draft,
    audit: {
      companyId: payload.companyId,
      staffId: payload.staffId,
      userId: payload.userId,
      userRole: payload.userRole ?? "HR Administrator",
      action: "AI HR draft generated",
      module: "CareVerity HRIS & AI Staff Communication Assistant",
      approvalRequired: true,
      noAutomaticSending: true,
      sourceRecordIds: payload.selectedSourceRecordIds ?? [],
      generatedAt: draft.generatedAt
    }
  });
}
