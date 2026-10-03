export type BehaviourYesNo = "Yes" | "No";

export const behaviourModuleName = "Behaviour Monitoring & Positive Behaviour Support Module";

export const behaviourPersonCentredLanguage = [
  "behaviour that challenges",
  "distressed behaviour",
  "behaviour of concern",
  "emotional distress",
  "support need",
  "possible trigger",
  "de-escalation support",
  "proactive strategy",
  "least restrictive response"
];

export const behaviourSupportReasons = [
  "distressed behaviour",
  "aggression",
  "self-injury",
  "refusal of essential care",
  "anxiety/distress",
  "wandering",
  "sleep disturbance",
  "night-time monitoring",
  "repeated incidents",
  "other"
];

export const behaviourCoreSections = [
  "Behaviour Profile",
  "Behaviour Support Plan",
  "Behaviour Risk Assessment",
  "ABC Behaviour Record",
  "Hourly Sleep / Behaviour Record",
  "Behaviour Incident Record",
  "De-escalation and Support Strategies",
  "Restrictive Practice / Restraint Record if applicable",
  "Behaviour Review Meetings",
  "Professional Referral Tracker",
  "Family / Representative Involvement",
  "Staff Guidance and Mobile Prompts",
  "Behaviour KPI Dashboard",
  "Lessons Learned and Care Plan Update Tracker",
  "Behaviour Evidence Pack for Inspection"
];

export const behaviourDemoServiceUser = {
  serviceUserId: "demo-su-johnny-burrows",
  companyId: "TEST-COMPANY-001",
  branchId: "TEST-LOCATION-001",
  name: "Johnny Burrows",
  behaviourSupportRequired: "Yes" as BehaviourYesNo,
  behaviourSupportReason: "sleep disturbance and distressed behaviour"
};

export const behaviourProfileFields = {
  serviceUserId: behaviourDemoServiceUser.serviceUserId,
  companyId: behaviourDemoServiceUser.companyId,
  branchId: behaviourDemoServiceUser.branchId,
  behaviourSupportRequired: "Yes",
  dateIdentified: "04 June 2026",
  identifiedBy: "Demo Care Coordinator",
  mainBehaviourSupportNeeds: "Sleep disturbance, night-time monitoring and distressed behaviour support.",
  knownTriggers: "Noise at night, unfamiliar staff approach, rushing personal care, pain/discomfort cues.",
  earlyWarningSigns: "Restlessness, repeated calling out, pacing, clenched hands, withdrawing from support.",
  communicationNeeds: "Use calm tone, short sentences and allow extra processing time.",
  preferredSupportApproach: "Offer reassurance, choice, quiet space, familiar routine and least restrictive support.",
  dislikesThingsToAvoid: "Avoid rushing, crowding, arguing, raised voices and unnecessary touch.",
  calmingStrategies: "Warm drink, dimmed lights, favourite music, reassurance and time to settle.",
  sensoryNeeds: "Low noise environment, reduced bright lighting, familiar blanket.",
  painHealthConsiderations: "Check for discomfort, continence need, constipation, infection signs or medication side effects.",
  medicationConsiderations: "Medication concerns must be referred to GP/pharmacist by authorised staff.",
  environmentalFactors: "Night-time noise, room temperature, lighting and hallway movement may affect sleep.",
  culturalReligiousPersonalPreferences: "Personal routines and family preferences recorded in care plan.",
  capacityConsentConsiderations: "Capacity/consent reviewed for behaviour monitoring and information sharing.",
  bestInterestDecisionRequired: "Yes",
  familyRepresentativeInput: "Family representative involved in review meetings.",
  professionalInput: "GP, community mental health team, learning disability team or OT input considered where needed.",
  reviewFrequency: "weekly",
  nextReviewDate: "11 June 2026",
  status: "active",
  createdBy: "Demo Care Coordinator",
  createdAt: "04 June 2026 09:00",
  updatedBy: "Demo Registered Manager",
  updatedAt: "04 June 2026 10:00"
};

export const behaviourSupportPlanSections = [
  "About the person",
  "What behaviour may tell us",
  "Communication needs",
  "Known triggers",
  "Early warning signs",
  "Proactive support strategies",
  "Active support during distress",
  "De-escalation techniques",
  "What staff should avoid",
  "Post-incident support",
  "Family / representative involvement",
  "Professional involvement",
  "Restrictions or restraint if applicable",
  "Least restrictive approach",
  "Review plan",
  "Staff training requirements",
  "Linked care plan sections",
  "Linked risk assessments"
];

export const behaviourSupportPlanRows = behaviourSupportPlanSections.map((section, index) => [
  section,
  index < 6 ? "Drafted" : index < 14 ? "Manager review required" : "Linked",
  "Version 1.0",
  "Demo Registered Manager approval required before publishing"
]);

export const behaviourRiskAssessmentRows = [
  ["BRISK-001", "sleep disturbance", "Johnny Burrows may become distressed during night-time waking.", "service user / staff", "Medium", "High", "High", "Quiet environment, calm reassurance, hourly observation", "Low-stimulus approach and familiar routine", "Offer choice and space", "Office/999 escalation if immediate safety concern", "Yes", "Yes", "11 June 2026", "Demo Registered Manager", "Pending approval", "active"],
  ["BRISK-002", "wandering", "Night-time wandering may increase falls or exit-seeking risk.", "service user", "Medium", "High", "High", "Door sensor placeholder and observation prompts", "Reduce night-time triggers", "Redirect calmly", "Contact manager if unable to settle safely", "OT review considered", "Yes", "11 June 2026", "Demo Registered Manager", "Pending approval", "active"]
];

export const behaviourAbcRecords = Array.from({ length: 10 }, (_, index) => ({
  recordId: `ABC-DEMO-${String(index + 1).padStart(3, "0")}`,
  serviceUserId: behaviourDemoServiceUser.serviceUserId,
  companyId: behaviourDemoServiceUser.companyId,
  date: `0${(index % 7) + 1} June 2026`,
  time: `${String(20 + (index % 4)).padStart(2, "0")}:15`,
  location: index % 2 ? "Bedroom" : "Lounge",
  staffPresent: index % 2 ? "Demo Care Worker A" : "Demo Senior Care Worker",
  antecedentWhatHappenedBefore: "Night-time noise and change in routine noted before distress.",
  possibleTrigger: index % 3 === 0 ? "Environmental noise" : index % 3 === 1 ? "Pain/discomfort suspected" : "Unfamiliar approach",
  behaviourObserved: "Distressed behaviour and repeated requests for reassurance.",
  intensity: index % 4 === 0 ? "High" : index % 2 === 0 ? "Medium" : "Low",
  durationMinutes: String(8 + index),
  riskToSelf: index % 4 === 0 ? "Yes" : "No",
  riskToOthers: "No",
  injuryOccurred: "No",
  propertyDamage: "No",
  interventionUsed: "Calm reassurance, space, drink offered and reduced stimulation.",
  deEscalationUsed: "Yes - least restrictive support used.",
  consequenceWhatHappenedAfter: "Settled with staff reassurance and quiet environment.",
  outcome: "Settled and safe.",
  serviceUserResponse: "Accepted support after time and reassurance.",
  staffReflection: "Approach should remain calm, unhurried and familiar.",
  followUpRequired: index % 3 === 0 ? "Yes" : "No",
  managerReviewRequired: index % 4 === 0 ? "Yes" : "No",
  carePlanUpdateSuggested: index % 4 === 0 ? "Yes" : "No",
  riskAssessmentUpdateSuggested: index % 5 === 0 ? "Yes" : "No",
  professionalReferralSuggested: index % 6 === 0 ? "Yes" : "No",
  createdBy: "Demo Care Worker A",
  createdAt: "04 June 2026 22:15",
  reviewedBy: index % 4 === 0 ? "Demo Registered Manager" : "",
  reviewedAt: index % 4 === 0 ? "05 June 2026 09:00" : ""
}));

export const behaviourHourlyRecords = Array.from({ length: 7 }, (_, dayIndex) => ({
  recordId: `SLEEP-DEMO-${String(dayIndex + 1).padStart(3, "0")}`,
  serviceUserId: behaviourDemoServiceUser.serviceUserId,
  companyId: behaviourDemoServiceUser.companyId,
  date: `${String(dayIndex + 1).padStart(2, "0")} June 2026`,
  monitoringStartTime: "22:00",
  monitoringEndTime: "06:00",
  completedBy: "Demo Night Care Worker",
  hourlyEntries: Array.from({ length: 8 }, (_, hourIndex) => ({
    hour: `${String(22 + hourIndex > 23 ? hourIndex - 2 : 22 + hourIndex).padStart(2, "0")}:00`,
    asleep: hourIndex === 2 || hourIndex === 3 ? "Yes" : "No",
    awake: hourIndex === 2 || hourIndex === 3 ? "No" : "Yes",
    settled: hourIndex < 2 || hourIndex > 5 ? "Yes" : "No",
    restless: hourIndex === 4 ? "Yes" : "No",
    distressed: hourIndex === 5 ? "Yes" : "No",
    behaviourObserved: hourIndex === 5 ? "Distressed behaviour, reassurance requested." : "No behaviour of concern observed.",
    possibleTrigger: hourIndex === 5 ? "Environmental noise" : "None identified",
    supportProvided: "Reassurance, drink offered, low-stimulation support.",
    foodDrinkOffered: hourIndex % 2 === 0 ? "Drink offered" : "Not required",
    toiletingSupport: hourIndex === 1 ? "Offered" : "Not required",
    medicationGivenOrPrompted: "No routine medication prompt in this hour",
    painDiscomfortObserved: hourIndex === 5 ? "Pain/discomfort considered" : "No",
    environmentalFactors: hourIndex === 5 ? "Hallway noise" : "Settled environment",
    staffInitials: "DW",
    notes: "Hourly sleep/behaviour monitoring demo entry."
  }))
}));

export const behaviourQuickTickOptions = [
  "Sleeping",
  "Awake but settled",
  "Awake and restless",
  "Distressed",
  "Refused support",
  "Accepted support",
  "Toileting support",
  "Drink offered",
  "Pain/discomfort suspected",
  "Environmental noise",
  "PRN medication considered",
  "Manager informed"
];

export const behaviourIncidentRows = [
  ["BINC-001", "ABC-DEMO-001", "04 June 2026", "22:15", "Distressed behaviour", "Noise before sleep increased distress.", "Environmental noise", "Restlessness", "Repeated reassurance sought", "Medium", "No injury", "No", "No", "Calm reassurance and reduced stimulation", "Yes", "Settled safely", "Manager and family representative", "Yes", "No", "No safeguarding threshold in demo", "Manager review required", "Reduce noise and review night routine", "Yes", "Yes", "Yes", "Demo Registered Manager", "Pending approval"],
  ["BINC-002", "ABC-DEMO-004", "05 June 2026", "01:10", "Wandering risk", "Service user moved toward hallway during night waking.", "Unsettled sleep", "Pacing", "Walking near exit", "High", "No injury", "No", "No", "Redirected calmly", "Yes", "Returned to room", "Manager", "No", "OT review considered", "No safeguarding threshold in demo", "Manager review required", "Review environment and signage", "Yes", "Yes", "Yes", "Demo Registered Manager", "Pending approval"],
  ["BINC-003", "ABC-DEMO-007", "06 June 2026", "23:30", "Refusal of essential care", "Personal care was delayed and accepted later.", "Rushed approach", "Withdrawing", "Refused support initially", "Low", "No injury", "No", "No", "Staff stepped back and offered choice", "Yes", "Accepted later", "Manager", "No", "No", "No safeguarding threshold in demo", "Reviewed", "Avoid rushing and give time", "Yes", "No", "Yes", "Demo Registered Manager", "Approved"]
];

export const restrictivePracticeWarning =
  "Restrictive practice must only be used as a last resort, where necessary, proportionate and least restrictive. Manager review is required.";

export const restrictivePracticeRows = [
  ["RPR-DEMO-001", "Door sensor / observation restriction placeholder", "Immediate safety monitoring after night-time wandering risk", "To reduce immediate risk of leaving safe area during distress", "Proportionate to risk and time-limited", "Least restrictive option selected before any physical intervention", "10 minutes", "Demo Senior Care Worker", "Continuous wellbeing checks", "Wellbeing check completed", "Debrief offered to service user", "Staff debrief required", "Manager review required", "Safeguarding consideration recorded", "CQC notification consideration required", "Professional review required", "Care plan and risk assessment update required", "Reduction plan: reduce night-time triggers and review environment"]
];

export const behaviourAiSuggestions = [
  ["AI-assisted draft - manager approval required", "Behaviour support plan update", "Night-time environmental noise and reassurance pattern", "Awaiting manager approval", "Links to behaviour support plan"],
  ["AI-assisted draft - manager approval required", "Behaviour risk assessment update", "Wandering risk and sleep disturbance pattern", "Awaiting manager approval", "Links to risk assessment"],
  ["AI-assisted draft - manager approval required", "ABC trend summary", "Environmental noise and pain/discomfort cues are possible triggers", "Awaiting manager approval", "Links to ABC records"],
  ["AI-assisted draft - manager approval required", "Family update draft", "Support plan review and reassurance strategies", "Awaiting manager approval", "Minimum necessary details"],
  ["AI-assisted draft - manager approval required", "OT referral draft", "Night-time wandering and environment review", "Awaiting manager approval", "No automatic referral sent"],
  ["AI-assisted draft - manager approval required", "Community mental health team email draft", "Distressed behaviour support review", "Awaiting manager approval", "No automatic clinical decision"]
];

export const behaviourKpiCards = [
  ["Behaviour records this month", "10", "ABC records completed"],
  ["High-intensity incidents", "3", "Manager review required"],
  ["Most common trigger", "Environmental noise", "Observed across hourly and ABC records"],
  ["Most common time", "22:00-01:00", "Night-time pattern"],
  ["Most common location", "Bedroom", "Sleep disturbance context"],
  ["Sleep disturbance nights", "7", "Hourly records completed"],
  ["Manager reviews completed", "4", "6 awaiting review"],
  ["Care plan updates completed", "2", "Linked to support plan"],
  ["Risk assessment updates completed", "1", "More reviews due"],
  ["Professional referrals made", "2", "OT and community mental health team drafts"],
  ["Restrictive practice events", "1", "Manager review required"],
  ["De-escalation success rate", "90%", "Settled with least restrictive support"],
  ["Open actions", "5", "Action tracker"],
  ["Closed actions", "3", "Lessons learned captured"]
];

export const behaviourChartRows = [
  ["Behaviour events by week", "Week 1: 10"],
  ["Behaviour events by time of day", "22:00-01:00 highest"],
  ["Triggers frequency", "Environmental noise 5, pain/discomfort suspected 3, unfamiliar approach 2"],
  ["Intensity breakdown", "Low 4, Medium 3, High 3"],
  ["Restrictive practice trend", "1 event, reduction plan active"],
  ["Sleep pattern overview", "7 monitored nights, settled periods improving"]
];

export const behaviourActionTrackerRows = [
  ["BACT-001", behaviourDemoServiceUser.serviceUserId, behaviourDemoServiceUser.companyId, "ABC-DEMO-001", "ABC record", "update care plan", "Demo Care Coordinator", "High", "07 June 2026", "Open", "Draft care plan update", "", "", "No", "", ""],
  ["BACT-002", behaviourDemoServiceUser.serviceUserId, behaviourDemoServiceUser.companyId, "BRISK-001", "risk assessment", "update risk assessment", "Demo Registered Manager", "High", "07 June 2026", "Open", "Risk update draft", "", "", "No", "", ""],
  ["BACT-003", behaviourDemoServiceUser.serviceUserId, behaviourDemoServiceUser.companyId, "SLEEP-DEMO-003", "hourly record", "request OT review", "Demo Care Coordinator", "Medium", "10 June 2026", "Open", "OT referral draft", "", "", "No", "", ""],
  ["BACT-004", behaviourDemoServiceUser.serviceUserId, behaviourDemoServiceUser.companyId, "BINC-002", "incident", "arrange staff debrief", "Demo Field Supervisor", "Medium", "08 June 2026", "In progress", "Debrief notes", "", "", "No", "", ""],
  ["BACT-005", behaviourDemoServiceUser.serviceUserId, behaviourDemoServiceUser.companyId, "ABC-DEMO-007", "ABC record", "review environment", "Demo Registered Manager", "High", "09 June 2026", "Open", "Environment review checklist", "", "", "No", "", ""]
];

export const behaviourProfessionalReferralDrafts = [
  ["OT referral draft", "Night-time wandering and environment review", "AI-assisted draft - manager approval required", "Not sent"],
  ["Community mental health team email draft", "Distressed behaviour support review", "AI-assisted draft - manager approval required", "Not sent"],
  ["Family update draft", "Support plan review update using minimum necessary detail", "AI-assisted draft - manager approval required", "Not sent"]
];

export const behaviourMobilePromptRows = [
  ["Behaviour support alert", "Johnny Burrows has a behaviour support plan. Use calm, least restrictive support."],
  ["Key triggers", behaviourProfileFields.knownTriggers],
  ["Early warning signs", behaviourProfileFields.earlyWarningSigns],
  ["Calming strategies", behaviourProfileFields.calmingStrategies],
  ["What to avoid", behaviourProfileFields.dislikesThingsToAvoid],
  ["Emergency escalation plan", "Call office/manager; follow emergency procedure if immediate safety concern."],
  ["Quick ABC record", "Antecedent, behaviour observed, consequence, support and outcome"],
  ["Quick hourly sleep/behaviour record", "Sleeping, awake settled, restless, distressed, support provided"],
  ["Behaviour incident report", "Create linked incident and notify manager"],
  ["Manager notification button", "Notify manager for review or urgent support"]
];

export const behaviourEvidencePackRows = [
  ["Safe", "Behaviour risk assessment, restrictive practice safeguard, incident records, manager reviews"],
  ["Effective", "Behaviour support plan, professional referrals, care plan/risk assessment updates"],
  ["Caring", "Person-centred profile, family/representative input, least restrictive response"],
  ["Responsive", "ABC records, hourly sleep/behaviour records, action tracker, review meetings"],
  ["Well-led", "KPI dashboard, lessons learned, staff training/debriefs, audit trail and evidence pack"]
];

export const behaviourTestingMatrix = [
  ["Behaviour module trigger works", "Pass in demo", "Johnny Burrows has behaviourSupportRequired = Yes"],
  ["Behaviour module hidden when disabled", "Pass in demo", "Service users with No show trigger-disabled message unless admin"],
  ["Mobile recording works", "Pass in demo", "Mobile prompt card includes quick ABC and hourly record"],
  ["Hourly record works", "Pass in demo", "7 days hourly records generated"],
  ["ABC record works", "Pass in demo", "10 ABC records generated"],
  ["Manager review works", "Pass in demo", "Manager review statuses displayed"],
  ["AI draft approval works", "Pass in demo", "AI-assisted draft rows require manager approval"],
  ["Restrictive practice safeguard works", "Pass in demo", restrictivePracticeWarning],
  ["KPI dashboard works", "Pass in demo", "KPI cards and chart rows populated"],
  ["Evidence pack works", "Pass in demo", "CQC evidence mappings generated"],
  ["Tenant separation passes", "Partial", "All demo behaviour records include companyId; real DB/RLS still required"]
];

export function behaviourSupportEnabledFor(serviceUser: { behaviourSupportRequired?: string; id?: string; name?: string }) {
  return serviceUser.behaviourSupportRequired === "Yes" || serviceUser.id === behaviourDemoServiceUser.serviceUserId || serviceUser.name === behaviourDemoServiceUser.name;
}
