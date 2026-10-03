import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessSeniorManagementKpi,
  generateKpiManagementInsightDraft,
  type KpiManagementInsightRequest
} from "@/lib/careverity-kpi-dashboard";

export async function POST(request: NextRequest) {
  let payload: KpiManagementInsightRequest;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON request body." }, { status: 400 });
  }

  const missing = ["companyId", "dateFrom", "dateTo", "includedModules", "outputType", "sourceRecordIds"].filter((field) => !payload[field as keyof KpiManagementInsightRequest]);
  if (missing.length) {
    return NextResponse.json({ error: "Missing required KPI management insight fields.", missing }, { status: 400 });
  }

  if (payload.humanApprovalRequired !== true) {
    return NextResponse.json({ error: "KPI AI insight requests must set humanApprovalRequired: true.", approvalRequired: true }, { status: 400 });
  }

  if (!canAccessSeniorManagementKpi(payload.userRole ?? "")) {
    return NextResponse.json(
      {
        error: "Role not permitted to generate senior management KPI insights.",
        approvalRequired: true,
        noAutomaticDisciplinaryDecision: true,
        audit: {
          companyId: payload.companyId,
          action: "KPI AI management insight denied",
          generatedAt: new Date().toISOString()
        }
      },
      { status: 403 }
    );
  }

  const draft = generateKpiManagementInsightDraft(payload);

  return NextResponse.json({
    ...draft,
    status: "Draft - manager approval required",
    approvalRequired: true,
    noAutomaticPublishing: true,
    noAutomaticDisciplinaryDecision: true,
    saveDestination: "Quality Intelligence Hub after manager approval",
    audit: {
      companyId: payload.companyId,
      branchId: payload.branchId ?? "All authorised branches",
      action: "KPI AI management insight draft generated",
      module: "Senior Management KPI & Performance Intelligence Dashboard",
      sourceRecordIds: draft.sourceRecordsUsed,
      generatedAt: new Date().toISOString()
    }
  });
}
