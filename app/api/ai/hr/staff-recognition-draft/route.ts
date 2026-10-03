import { NextResponse, type NextRequest } from "next/server";
import { generateStaffRecognitionDraft, type StaffRecognitionDraftRequest } from "@/lib/careverity-staff-recognition";

const allowedRecognitionDraftRoles = [
  "System Owner",
  "Registered Manager",
  "Senior Manager",
  "HR Manager",
  "HR Administrator",
  "Care Coordinator",
  "Supervisor",
  "Quality / Compliance Officer"
];

function roleCanGenerateRecognitionDraft(role = "HR Manager") {
  return allowedRecognitionDraftRoles.some((allowedRole) => role.toLowerCase().includes(allowedRole.toLowerCase()));
}

export async function POST(request: NextRequest) {
  const featureEnabled = process.env.ENABLE_AI_HR_RECOGNITION_ASSISTANT !== "false";

  if (!featureEnabled) {
    return NextResponse.json({ error: "AI Staff Recognition Assistant feature flag is disabled." }, { status: 403 });
  }

  let payload: StaffRecognitionDraftRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const missing = ["companyId", "userId", "staffId", "nominationId", "awardCategory", "outputType"].filter((field) => !payload[field as keyof StaffRecognitionDraftRequest]);

  if (missing.length) {
    return NextResponse.json({ error: "Missing required staff recognition draft fields.", missing }, { status: 400 });
  }

  if (!roleCanGenerateRecognitionDraft(payload.userRole)) {
    return NextResponse.json(
      {
        error: "Role not permitted to generate staff recognition drafts.",
        approvalRequired: true,
        audit: {
          companyId: payload.companyId,
          staffId: payload.staffId,
          nominationId: payload.nominationId,
          action: "AI staff recognition draft generation denied",
          generatedAt: new Date().toISOString()
        }
      },
      { status: 403 }
    );
  }

  const draft = generateStaffRecognitionDraft({
    ...payload,
    selectedEvidenceIds: payload.selectedEvidenceIds ?? [],
    anonymiseServiceUserDetails: payload.anonymiseServiceUserDetails !== false,
    tone: payload.tone ?? "professional"
  });

  return NextResponse.json({
    ...draft,
    audit: {
      companyId: payload.companyId,
      staffId: payload.staffId,
      nominationId: payload.nominationId,
      userId: payload.userId,
      userRole: payload.userRole ?? "HR Manager",
      action: "AI staff recognition draft generated",
      module: "Staff Recognition & Good Practice Evidence Module",
      endpoint: "/api/ai/hr/staff-recognition-draft",
      approvalRequired: true,
      noAutomaticPublishing: true,
      noAutomaticEmailSending: true,
      selectedEvidenceIds: payload.selectedEvidenceIds ?? [],
      generatedAt: new Date().toISOString()
    }
  });
}
