import { NextResponse, type NextRequest } from "next/server";
import {
  generateStaffSupportAiDraft,
  type StaffSupportAiDraftRequest,
  type StaffSupportAiOutputType
} from "@/lib/careverity-staff-support-recognition";

const allowedStaffSupportAiRoles = [
  "System Owner",
  "Registered Manager",
  "Senior Manager",
  "HR Manager",
  "HR Administrator",
  "Supervisor",
  "Care Coordinator",
  "Compliance Manager",
  "Quality / Compliance Officer"
];

function roleCanGenerateStaffSupportDraft(role = "Registered Manager") {
  return allowedStaffSupportAiRoles.some((allowedRole) => role.toLowerCase().includes(allowedRole.toLowerCase()));
}

export function makeStaffSupportAiRoute(defaultOutputType: StaffSupportAiOutputType) {
  return async function POST(request: NextRequest) {
    const featureEnabled = process.env.ENABLE_AI_HR_STAFF_SUPPORT_ASSISTANT !== "false";

    if (!featureEnabled) {
      return NextResponse.json({ error: "AI Staff Support Assistant feature flag is disabled." }, { status: 403 });
    }

    let payload: StaffSupportAiDraftRequest;

    try {
      payload = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
    }

    const missing = ["companyId", "staffId", "indicatorId"].filter((field) => !payload[field as keyof StaffSupportAiDraftRequest]);

    if (missing.length) {
      return NextResponse.json({ error: "Missing required staff support AI draft fields.", missing }, { status: 400 });
    }

    if (!roleCanGenerateStaffSupportDraft(payload.userRole)) {
      return NextResponse.json(
        {
          error: "Role not permitted to generate staff support AI drafts.",
          approvalRequired: true,
          audit: {
            companyId: payload.companyId,
            staffId: payload.staffId,
            indicatorId: payload.indicatorId,
            action: "AI staff support draft generation denied",
            generatedAt: new Date().toISOString()
          }
        },
        { status: 403 }
      );
    }

    const draft = generateStaffSupportAiDraft({
      ...payload,
      selectedEvidenceIds: payload.selectedEvidenceIds ?? [],
      outputType: payload.outputType ?? defaultOutputType,
      anonymiseServiceUserDetails: payload.anonymiseServiceUserDetails !== false,
      tone: payload.tone ?? "professional"
    });

    return NextResponse.json({
      ...draft,
      audit: {
        companyId: payload.companyId,
        staffId: payload.staffId,
        indicatorId: payload.indicatorId,
        userId: payload.userId,
        userRole: payload.userRole ?? "Registered Manager",
        action: "AI staff support draft generated",
        module: "Staff Support & Recognition Intelligence",
        approvalRequired: true,
        noAutomaticHrAction: true,
        noAutomaticDisciplinaryDecision: true,
        noAutomaticEmailSending: true,
        selectedEvidenceIds: payload.selectedEvidenceIds ?? [],
        generatedAt: new Date().toISOString()
      }
    });
  };
}
