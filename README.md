# CareVerity ECM and LQCS Training Academy

Current primary preview: **CareVerity ECM**, an electronic call monitoring, rota, care-compliance and evidence-management prototype for London Quality Care Services Ltd.

This workspace also still contains the earlier **LQCS Training Academy** prototype routes for training, course completion, quizzes, certificates and matrix reporting.

This build uses demo data only. It does not include real staff personal data, real service-user records, external course content, protected provider branding, CPD accreditation claims, CQC approval claims or Skills for Care endorsement claims.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase/Postgres schema scaffold
- CareVerity ECM prototype in `app/careverity-ecm/`
- Demo data in `lib/demo-data.ts`
- Protected-route and RBAC scaffold in `middleware.ts` and `lib/rbac.ts`
- Demo lesson/quiz/certificate progress helpers in `lib/training-progress.ts`
- Reusable certificate and quiz-question components in `components/`

## Main Prototype Areas

- CareVerity ECM operating dashboard
- Live rota / ECM wallboard
- Service-user records and permanent care-worker allocation
- HR / staff files and recruitment compliance
- Rota creation, manual allocation and dispatch placeholders
- Medication / eMAR and medication database placeholders
- WorkBoard, communications, surveys, family portal and professional contacts
- Finance, reports, e-signature, CQC hub and system settings
- Secure login placeholder with role-based redirect intent
- Admin / manager dashboard
- Staff learner dashboard
- Left-side navigation
- Staff/user management
- Course library and course detail pages
- Course builder placeholder
- Course player / lesson viewer
- Quiz engine with scoring and pass/fail
- Certificate template and certificate list
- Training matrix
- Reports and CQC evidence pack placeholder
- Policy acknowledgements
- Competency records
- Webinar management
- Profile/account settings
- Supabase schema with RLS notes
- Nutrition and Wellbeing demo video course with declaration-gated quiz access
- Fake quiz-attempt records for failed assessment and audit reporting

## Folder Structure

```text
app/                  Next.js App Router pages and route groups
app/careverity-ecm/   CareVerity ECM single-page prototype shell
components/           Reusable cards, tables, layout, logo and UI helpers
lib/                  Demo data, types, formatting, RBAC and training progress helpers
public/images/        Logo and image assets
public/videos/        Demo training video assets
supabase/schema.sql   Supabase/Postgres schema and RLS placeholders
middleware.ts         Demo protected-route guard, ready for Supabase auth cookies
```

## Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

The homepage redirects to:

```text
http://localhost:3000/careverity-ecm
```

CareVerity module navigation is hash-based, so you can open or share:

```text
http://localhost:3000/careverity-ecm#live
http://localhost:3000/careverity-ecm#rota
http://localhost:3000/careverity-ecm#staff
http://localhost:3000/careverity-ecm#settings
```

Check the project before sharing a build:

```bash
npm run lint
npm run build
```

Useful local routes:

- `/careverity-ecm`
- `/manager-dashboard`
- `/learner-dashboard`
- `/course-library`
- `/course-player/batch-1-dementia-awareness`
- `/quiz/batch-1-dementia-awareness`
- `/certificates`
- `/training-matrix`
- `/reports`
- `/webinars`

## Demo Login

The login screen is a prototype. Use the visible demo credentials and continue into the app. Authentication is intentionally scaffolded only.

All visible people, quiz attempts, certificates and course assignments are fake demo records in `lib/demo-data.ts`.

## Route Protection Scaffold

The app runs in demo mode by default so preview routes remain accessible:

```bash
NEXT_PUBLIC_DEMO_MODE=true
```

To test protected-route behavior before connecting Supabase, set:

```bash
NEXT_PUBLIC_DEMO_MODE=false
```

Protected routes will redirect to `/login` unless a future Supabase auth cookie is present. Role helper functions live in `lib/rbac.ts` and document the intended access model:

- Staff / Learner: own learner dashboard, courses, quizzes, policies, webinars and certificates.
- Manager: assigned staff only, placeholder until manager/staff assignments are connected.
- HR / Training Coordinator: staff profiles, training assignments and reporting.
- Super Admin: all records.

The role selector in the app shell is for prototype navigation only. It filters navigation and redirects demo users away from pages their role should not access. Replace it with the authenticated user role from `profiles.role_id` when Supabase Auth is connected.

## Demo Progress Rules

The course player stores local demo progress in `localStorage`:

- All lesson screens viewed
- Required video declaration complete
- Quiz score and pass/fail result
- Quiz attempt count and local attempt history

The certificate action remains locked until all required lesson screens are viewed, the declaration is complete where required, and the quiz pass mark is met. In production, these values should be stored against `course_assignments`, `course_lessons`, `quiz_attempts` and `certificates` in Supabase.

## Replacing Demo Data

The training matrix is generated from `courseAssignments` in `lib/demo-data.ts`. That array intentionally follows the same relationship as the future database: staff profile, course, status, enrolled date, due date, expiry date, score and attempts. When Supabase is connected, replace the array with a query joining:

- `course_assignments`
- `staff_profiles`
- `profiles`
- `courses`

The quiz engine currently writes demo progress to `localStorage`. In production, create `quiz_attempts` rows on submission, store selected answers in `answers`, and create a `certificates` row only after lessons, declarations and the quiz pass rule are complete.

## Supabase Next Steps

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

4. Replace `lib/demo-data.ts` reads with Supabase queries.
5. Replace the demo role selector with the authenticated profile role.
6. Implement route protection and role-based access checks using Supabase session cookies.
7. Convert the RLS comments and example policy shapes in `supabase/schema.sql` into tested policies.
8. Add file storage buckets for course PDFs, videos, policy documents, profile images and certificates.
9. Store lesson completion, video declarations and quiz attempts against course assignments before certificate issue.

## Security Notes

- Staff should only see their own learner record, assignments, certificates and policy acknowledgement records.
- Managers should only see assigned staff unless authorised.
- Super Admin can see all records.
- Admin users should use multi-factor authentication.
- Audit logs should record important actions such as course assignment, quiz attempts, certificate issue, policy acknowledgement and competency sign-off.
- UK GDPR, retention, privacy notice and access control rules must be reviewed before production.
- Supabase RLS policies must be tested with separate learner, manager, HR and Super Admin users before importing real data.

## Suggested Build Order After Prototype

1. Connect Supabase authentication.
2. Add protected layouts and role checks.
3. Replace demo staff, courses and assignments with database records.
4. Save quiz attempts and certificate records.
5. Add certificate PDF generation and QR verification.
6. Add email reminders for due/overdue training.
7. Add manager approval and competency observation workflows.
8. Test mobile, tablet and desktop layouts.
