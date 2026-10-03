# CareVerity Staff Support & Recognition Intelligence

Reference: `CAREVERITY-STAFF-SUPPORT-RECOGNITION-001`

This module is a management-only HRIS and quality improvement feature. It suggests recognition, coaching, supervision, medication competency review, geofence/clock-in review and senior review actions from recorded care delivery evidence.

## Core Rule

The system can suggest. Managers decide.

The module must not:

- Make automatic disciplinary decisions.
- Label staff as bad, guilty, unsafe or non-compliant people.
- Show public negative rankings.
- Send formal warnings, investigation invites or recognition announcements without human approval.

## Routes

- `/hr/staff-support-recognition`
- `/hr/staff-support-recognition/dashboard`
- `/hr/staff-support-recognition/staff/:staffId`
- `/hr/staff-support-recognition/green-list`
- `/hr/staff-support-recognition/support-list`
- `/hr/staff-support-recognition/red-review-list`
- `/hr/staff-support-recognition/actions`
- `/hr/staff-support-recognition/reports`
- `/hr/staff-support-recognition/settings`

## AI Endpoints

- `POST /api/ai/hr/staff-support-summary`
- `POST /api/ai/hr/recognition-draft`
- `POST /api/ai/hr/supervision-agenda`
- `POST /api/ai/hr/support-action-plan`
- `POST /api/ai/hr/manager-review-summary`

Every AI output is marked `AI-assisted draft - manager review required`.

## Database Tables

- `staff_support_indicators`
- `staff_support_actions`
- `staff_support_evidence_links`
- `staff_support_ai_drafts`

All records are tenant scoped by `company_id` and `provider_id`.

## Launch Gate

Do not mark ready until:

- Build passes.
- RAG indicator works.
- Permission control works.
- No public negative ranking exists.
- Complaint fairness review works.
- Medication support triggers work.
- Geofence support triggers work.
- AI approval workflow works.
- Audit trail works.
- Tenant separation works.
- CQC workforce evidence report works.
