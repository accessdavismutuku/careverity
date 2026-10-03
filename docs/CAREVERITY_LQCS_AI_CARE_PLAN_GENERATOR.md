# CareVerity LQCS AI Care Plan Generator

Reference: `LQCS-AI-CARE-PLAN-REVIEW-001`

Module: `AI Face-to-Face Assessment, Care Plan Review and Risk Assessment Generator`

This module is designed to help London Quality Care Services Ltd and future CareVerity providers produce reviewable, person-centred care-plan and risk-assessment drafts from existing service-user records. It is not an autonomous decision-maker and must never publish live records, alter risk ratings, send referrals or expose unapproved draft content to care staff without human approval.

## Preserved LQCS Reviewed Care Plan Structure

The generator preserves the LQCS reviewed care-plan format:

- Reviewed Care Plan front page
- Individual Needs Assessment Care Plan
- Mental capacity and best-interest decision record
- Contacts, next of kin, professionals and advocacy details
- Background, personal history and important life story
- Brief medical history
- About My Needs
- Repeated care-domain tables using:
  - Current situation with regard to my needs in this area
  - What assistance is required
  - Equipment or aids required
  - Care plan required?
  - My specific preferences, wishes and choices
  - Review note
- Body chart and skin integrity
- Daily routine
- Culture, religion, sexuality and gender preference
- End-of-life wishes and emergency planning where applicable
- Access to home, key safe and security arrangements
- Support schedule and visit package
- Agreement, signature and review approval

## Outstanding-Style Assessment Inputs

The CareVerity assessment layer adds stronger review inputs:

- What Matters to Me
- Likes, Dislikes and Preferences
- Equality, Diversity and Reasonable Adjustments
- Decision-Specific Capacity
- Goals and Outcomes
- What Staff Must Report
- Professional Involvement and Referral Tracker
- Review Triggers
- Source Evidence and Reliability
- CQC Evidence Mapping

## Demo Test Case: Mary Johnson

The dummy test case uses Mary Johnson only, with fake demo records.

Source comparison example:

- Historic local-authority background says Mary uses a walking stick indoors.
- Current face-to-face review says Mary uses a wheeled walking frame.
- Daughter reports two near misses.
- Assessor observed unsteadiness when Mary stood from the armchair.
- Grab rails are present but there is no shower chair.
- A loose rug was noted as an environmental hazard.
- Mary prefers female carers for personal care and wants independence preserved.

Expected result:

- Mobility draft uses the current wheeled walking frame evidence.
- Historic walking-stick evidence is marked as superseded or requiring confirmation.
- Falls risk and moving/handling review are flagged.
- OT referral draft is suggested but not sent automatically.
- Missing medication list, skin/body chart, capacity, emergency plan, GP details and next review date are flagged.

## AI Review Checker

The review checker must return:

- `Ready for Review`
- `Needs Attention`
- `Not Ready`

Each issue must show:

- Section
- Issue
- Why it matters
- Suggested correction
- Priority
- Status

Critical missing medication/capacity evidence blocks final approval unless an authorised manager records an override reason.

## Approval Controls

Available actions:

- Accept
- Edit
- Reject
- Request More Information
- Escalate
- Create Professional Referral Draft

Drafts are always marked:

`AI-assisted draft - professional review and approval required.`

Rejected drafts require a reason. Request-for-information tasks block final approval unless overridden by an authorised manager with a recorded reason.

## Professional Referral Drafts

The module can create draft-only communications for:

- OT referral/request
- GP email
- District nurse notification
- Social worker/local authority update
- Mental health referral/update
- Pharmacy query
- Safeguarding referral/update
- Family/next of kin update

No referral or email is sent automatically.

## Emergency Safeguard

If information suggests immediate danger, the UI must show:

`This may require immediate emergency action. Do not rely only on email. Follow emergency procedure and call 999 if required.`

## Mobile Staff Rule

Normal care staff and mobile users can only see approved final care-plan content. Unapproved AI drafts, referral drafts, source conflict notes and restricted key-safe/access details remain hidden unless specifically authorised.

Mobile users can only see approved final care-plan content.

## Database Readiness

Schema tables added:

- `lqcs_assessment_sources`
- `lqcs_face_to_face_assessments`
- `lqcs_care_plan_drafts`
- `lqcs_care_domain_drafts`
- `lqcs_review_checker_issues`
- `lqcs_professional_referral_drafts`
- `lqcs_draft_audit_events`

All production queries must include `company_id` and `provider_id`, with `service_user_id` where applicable. RLS must enforce provider isolation before launch.

## Readiness Gate

Do not mark production ready until:

- `npm run lint` passes
- `npm run build` passes
- review checker test passes
- source comparison test passes
- tenant isolation test passes
- audit log is append-only
- AI drafts are hidden from mobile until approval
- professional referral/email send path requires human approval
- no real service-user or staff data is used in demo mode
