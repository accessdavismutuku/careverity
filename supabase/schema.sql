-- LQCS Training Academy - Supabase/Postgres starter schema
-- Demo scaffold only. Review security, retention and UK GDPR requirements before production use.

create extension if not exists "pgcrypto";

create table if not exists public.roles (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role_id uuid references public.roles(id),
  email text not null unique,
  first_name text not null,
  last_name text not null,
  access_code text unique,
  avatar_url text,
  two_factor_enabled boolean not null default false,
  active boolean not null default true,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.staff_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  staff_id text not null unique,
  job_title text not null,
  employment_start_date date,
  employment_status text not null default 'Active',
  mobile_number text,
  branch text,
  role_type text not null,
  line_manager_profile_id uuid references public.profiles(id),
  dbs_date date,
  right_to_work_date date,
  induction_date date,
  probation_review_date date,
  training_group text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  provider text not null default 'LQCS Training Academy',
  access_level text not null,
  duration_minutes integer,
  certificate_valid_months integer,
  status text not null default 'Active',
  pass_mark_percent integer not null default 80,
  allowed_attempts integer not null default 2,
  manager_approval_required boolean not null default false,
  retake_allowed boolean not null default true,
  mandatory boolean not null default false,
  target_staff_group text,
  owner_profile_id uuid references public.profiles(id),
  version_number text not null default 'v1.0',
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  lesson_type text not null,
  content text,
  media_url text,
  requires_declaration boolean not null default false,
  declaration_text text,
  sort_order integer not null default 0,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.course_assignments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  staff_profile_id uuid not null references public.staff_profiles(id) on delete cascade,
  assigned_by_profile_id uuid references public.profiles(id),
  status text not null default 'Not Started',
  enrolled_at timestamptz not null default now(),
  due_date date,
  completed_at timestamptz,
  expires_at date,
  manager_approval_status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (course_id, staff_profile_id)
);

create table if not exists public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  question_text text not null,
  question_type text not null default 'single_choice',
  explanation text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_answers (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  answer_text text not null,
  is_correct boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  course_assignment_id uuid not null references public.course_assignments(id) on delete cascade,
  attempt_number integer not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score_percent integer,
  passed boolean,
  answers jsonb not null default '[]'::jsonb,
  ip_address inet,
  user_agent text,
  certificate_issued boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certificates (
  id uuid primary key default gen_random_uuid(),
  course_assignment_id uuid not null references public.course_assignments(id) on delete cascade,
  certificate_number text not null unique,
  staff_name text not null,
  course_title text not null,
  issued_at timestamptz not null default now(),
  expires_at date,
  score_percent integer,
  verification_code text not null unique,
  certificate_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  version_number text not null,
  issue_date date not null,
  review_date date,
  document_url text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (title, version_number)
);

create table if not exists public.policy_acknowledgements (
  id uuid primary key default gen_random_uuid(),
  policy_id uuid not null references public.policies(id) on delete cascade,
  staff_profile_id uuid not null references public.staff_profiles(id) on delete cascade,
  declaration_text text not null,
  acknowledged_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (policy_id, staff_profile_id)
);

create table if not exists public.competency_records (
  id uuid primary key default gen_random_uuid(),
  staff_profile_id uuid not null references public.staff_profiles(id) on delete cascade,
  assessor_profile_id uuid references public.profiles(id),
  observed_at date not null,
  location text,
  competency_area text not null,
  evidence_observed text,
  outcome text not null,
  action_required text,
  reassessment_date date,
  digital_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supervision_links (
  id uuid primary key default gen_random_uuid(),
  staff_profile_id uuid not null references public.staff_profiles(id) on delete cascade,
  course_assignment_id uuid references public.course_assignments(id) on delete set null,
  competency_record_id uuid references public.competency_records(id) on delete set null,
  supervision_date date,
  action_plan text,
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webinar_sessions (
  id uuid primary key default gen_random_uuid(),
  webinar_code text not null unique,
  course_subject text not null,
  starts_at timestamptz not null,
  meeting_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webinar_attendance (
  id uuid primary key default gen_random_uuid(),
  webinar_session_id uuid not null references public.webinar_sessions(id) on delete cascade,
  staff_profile_id uuid not null references public.staff_profiles(id) on delete cascade,
  attendance_status text not null default 'Booked',
  certificate_status text not null default 'Not issued',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (webinar_session_id, staff_profile_id)
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  body text not null,
  notification_type text not null,
  delivery_method text not null default 'email',
  due_at timestamptz,
  sent_at timestamptz,
  read_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_profile_id uuid references public.profiles(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id uuid,
  metadata jsonb not null default '{}'::jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_roles_updated_at on public.roles;
create trigger set_roles_updated_at before update on public.roles for each row execute function public.set_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();

drop trigger if exists set_staff_profiles_updated_at on public.staff_profiles;
create trigger set_staff_profiles_updated_at before update on public.staff_profiles for each row execute function public.set_updated_at();

drop trigger if exists set_courses_updated_at on public.courses;
create trigger set_courses_updated_at before update on public.courses for each row execute function public.set_updated_at();

drop trigger if exists set_course_lessons_updated_at on public.course_lessons;
create trigger set_course_lessons_updated_at before update on public.course_lessons for each row execute function public.set_updated_at();

drop trigger if exists set_course_assignments_updated_at on public.course_assignments;
create trigger set_course_assignments_updated_at before update on public.course_assignments for each row execute function public.set_updated_at();

drop trigger if exists set_quiz_questions_updated_at on public.quiz_questions;
create trigger set_quiz_questions_updated_at before update on public.quiz_questions for each row execute function public.set_updated_at();

drop trigger if exists set_quiz_answers_updated_at on public.quiz_answers;
create trigger set_quiz_answers_updated_at before update on public.quiz_answers for each row execute function public.set_updated_at();

drop trigger if exists set_quiz_attempts_updated_at on public.quiz_attempts;
create trigger set_quiz_attempts_updated_at before update on public.quiz_attempts for each row execute function public.set_updated_at();

drop trigger if exists set_certificates_updated_at on public.certificates;
create trigger set_certificates_updated_at before update on public.certificates for each row execute function public.set_updated_at();

drop trigger if exists set_policies_updated_at on public.policies;
create trigger set_policies_updated_at before update on public.policies for each row execute function public.set_updated_at();

drop trigger if exists set_policy_acknowledgements_updated_at on public.policy_acknowledgements;
create trigger set_policy_acknowledgements_updated_at before update on public.policy_acknowledgements for each row execute function public.set_updated_at();

drop trigger if exists set_competency_records_updated_at on public.competency_records;
create trigger set_competency_records_updated_at before update on public.competency_records for each row execute function public.set_updated_at();

drop trigger if exists set_supervision_links_updated_at on public.supervision_links;
create trigger set_supervision_links_updated_at before update on public.supervision_links for each row execute function public.set_updated_at();

drop trigger if exists set_webinar_sessions_updated_at on public.webinar_sessions;
create trigger set_webinar_sessions_updated_at before update on public.webinar_sessions for each row execute function public.set_updated_at();

drop trigger if exists set_webinar_attendance_updated_at on public.webinar_attendance;
create trigger set_webinar_attendance_updated_at before update on public.webinar_attendance for each row execute function public.set_updated_at();

drop trigger if exists set_notifications_updated_at on public.notifications;
create trigger set_notifications_updated_at before update on public.notifications for each row execute function public.set_updated_at();

drop trigger if exists set_audit_logs_updated_at on public.audit_logs;
create trigger set_audit_logs_updated_at before update on public.audit_logs for each row execute function public.set_updated_at();

insert into public.roles (name, description)
values
  ('Super Admin', 'Can administer all LQCS Training Academy records.'),
  ('Manager', 'Can review assigned staff training evidence.'),
  ('HR / Training Coordinator', 'Can coordinate staff profiles, training assignments and reports.'),
  ('Staff / Learner', 'Can access their own learner dashboard, certificates and policy records.')
on conflict (name) do nothing;

create index if not exists idx_profiles_role_id on public.profiles(role_id);
create index if not exists idx_staff_profiles_profile_id on public.staff_profiles(profile_id);
create index if not exists idx_staff_profiles_line_manager on public.staff_profiles(line_manager_profile_id);
create index if not exists idx_course_lessons_course_id on public.course_lessons(course_id);
create index if not exists idx_course_assignments_staff on public.course_assignments(staff_profile_id);
create index if not exists idx_course_assignments_course on public.course_assignments(course_id);
create index if not exists idx_quiz_questions_course on public.quiz_questions(course_id);
create index if not exists idx_quiz_answers_question on public.quiz_answers(question_id);
create index if not exists idx_quiz_attempts_assignment on public.quiz_attempts(course_assignment_id);
create index if not exists idx_certificates_assignment on public.certificates(course_assignment_id);
create index if not exists idx_policy_acknowledgements_staff on public.policy_acknowledgements(staff_profile_id);
create index if not exists idx_competency_records_staff on public.competency_records(staff_profile_id);
create index if not exists idx_webinar_attendance_staff on public.webinar_attendance(staff_profile_id);
create index if not exists idx_notifications_profile on public.notifications(profile_id);
create index if not exists idx_audit_logs_actor on public.audit_logs(actor_profile_id);

alter table public.roles enable row level security;
alter table public.profiles enable row level security;
alter table public.staff_profiles enable row level security;
alter table public.courses enable row level security;
alter table public.course_lessons enable row level security;
alter table public.course_assignments enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_answers enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.certificates enable row level security;
alter table public.policies enable row level security;
alter table public.policy_acknowledgements enable row level security;
alter table public.competency_records enable row level security;
alter table public.supervision_links enable row level security;
alter table public.webinar_sessions enable row level security;
alter table public.webinar_attendance enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- RLS policy placeholders:
-- Keep RLS enabled before importing real staff data. Replace this comment block
-- with tested create policy statements in a Supabase migration.
--
-- Suggested helper pattern:
--   create function public.current_role_name()
--   returns text
--   language sql
--   security definer
--   stable
--   as $$
--     select r.name
--     from public.profiles p
--     join public.roles r on r.id = p.role_id
--     where p.id = auth.uid()
--   $$;
--
-- Suggested ownership helper:
--   create function public.current_staff_profile_id()
--   returns uuid
--   language sql
--   security definer
--   stable
--   as $$
--     select id from public.staff_profiles where profile_id = auth.uid()
--   $$;
--
-- Suggested manager helper:
--   create function public.is_manager_for_staff(target_staff_profile_id uuid)
--   returns boolean
--   language sql
--   security definer
--   stable
--   as $$
--     select exists (
--       select 1
--       from public.staff_profiles target
--       where target.id = target_staff_profile_id
--       and target.line_manager_profile_id = auth.uid()
--     )
--   $$;
--
-- Suggested policy coverage:
-- 1. Super Admin can select/insert/update all records.
-- 2. HR / Training Coordinator can manage staff profiles, course assignments, reports and certificates.
-- 3. Managers can select assigned staff and related training evidence only, using staff_profiles.line_manager_profile_id or a future manager_staff_assignments table.
-- 4. Staff / Learners can select only their own profile, course assignments, quiz attempts, certificates, policy acknowledgements and webinar attendance.
-- 5. Staff / Learners should not update quiz scores, certificate records or audit logs directly.
-- 6. Audit logs should be append-only for service role writes and read-only for authorised admins.
-- 7. Storage buckets for videos, policy documents, logos and generated certificates need matching storage.objects RLS policies.
-- 8. Test every policy with Supabase auth.uid() fixtures before importing real data.
--
-- Example select policy shapes to adapt:
--   create policy "staff read own profile"
--   on public.profiles for select
--   using (id = auth.uid() or public.current_role_name() in ('Super Admin', 'HR / Training Coordinator'));
--
--   create policy "staff read own assignments"
--   on public.course_assignments for select
--   using (
--     staff_profile_id = public.current_staff_profile_id()
--     or public.current_role_name() in ('Super Admin', 'HR / Training Coordinator')
--     or public.is_manager_for_staff(staff_profile_id)
--   );
--
--   create policy "staff read own certificates"
--   on public.certificates for select
--   using (
--     exists (
--       select 1
--       from public.course_assignments ca
--       where ca.id = certificates.course_assignment_id
--       and (
--         ca.staff_profile_id = public.current_staff_profile_id()
--         or public.current_role_name() in ('Super Admin', 'HR / Training Coordinator')
--         or public.is_manager_for_staff(ca.staff_profile_id)
--       )
--     )
--   );
--
--   create policy "service role writes audit logs"
--   on public.audit_logs for insert
--   with check (auth.role() = 'service_role');

-- ---------------------------------------------------------------------------
-- CareVerity ECM multi-company SaaS schema
-- ---------------------------------------------------------------------------
-- Database-ready scaffold only. Do not import real personal data until
-- authentication, RLS policies, storage policies, backup/restore, retention,
-- encryption, incident response and UK GDPR Article 32 controls are tested.
--
-- Developer warning:
-- Never query staff, service users, MAR, rota, documents, journal, invoices,
-- reports or audit logs without filtering by company_id/provider_id.

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default gen_random_uuid(),
  company_name text not null,
  trading_name text,
  company_status text not null default 'Onboarding',
  subscription_status text not null default 'trial',
  staging_test_company boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (company_id)
);

create table if not exists public.providers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null default gen_random_uuid(),
  provider_id uuid not null default gen_random_uuid(),
  location_id uuid,
  company_name text not null,
  trading_name text,
  registration_number text,
  cqc_provider_id text,
  main_telephone text,
  main_email text,
  website text,
  registered_manager_name text,
  registered_manager_email text,
  nominated_individual_name text,
  service_types text[] not null default '{}',
  status text not null default 'Draft',
  migration_status text not null default 'Data import pending',
  go_live_date date,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (company_id),
  unique (provider_id)
);

create table if not exists public.provider_locations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid not null default gen_random_uuid(),
  location_name text not null,
  cqc_location_id text,
  address_line_1 text,
  address_line_2 text,
  town_city text,
  postcode text,
  telephone text,
  email text,
  manager_name text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (location_id)
);

alter table public.roles add column if not exists company_id uuid;
alter table public.roles add column if not exists provider_id uuid;
alter table public.roles add column if not exists location_id uuid;
alter table public.roles add column if not exists role_scope text not null default 'global';
alter table public.roles add column if not exists created_by uuid;
alter table public.roles add column if not exists updated_by uuid;
alter table public.roles add column if not exists archived_at timestamptz;

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  role_id uuid references public.roles(id),
  email text not null unique,
  display_name text not null,
  user_role text not null,
  employment_status text not null default 'Active',
  mfa_enabled boolean not null default false,
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.role_permissions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  role_id uuid not null references public.roles(id) on delete cascade,
  module text not null,
  permission text not null,
  access_level text not null default 'none',
  restricted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (role_id, module, permission)
);

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  staff_reference text not null,
  first_name text not null,
  surname text not null,
  date_of_birth date,
  email text,
  mobile_number text,
  telephone_number text,
  address jsonb not null default '{}'::jsonb,
  job_role text,
  employment_start_date date,
  employment_status text not null default 'Active',
  right_to_work_status text,
  dbs_status text,
  training_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (company_id, staff_reference)
);

create table if not exists public.staff_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  staff_id uuid references public.staff(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  restricted boolean not null default false,
  retention_date date,
  access_logged boolean not null default true,
  encrypted_placeholder boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.service_users (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_reference text not null,
  first_name text not null,
  surname text not null,
  date_of_birth date,
  telephone_number text,
  address jsonb not null default '{}'::jsonb,
  funding_source text,
  package_type text,
  risk_level text,
  care_plan_status text,
  risk_assessment_status text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (company_id, service_user_reference)
);

create table if not exists public.service_user_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  restricted boolean not null default false,
  retention_date date,
  access_logged boolean not null default true,
  encrypted_placeholder boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.client_documents (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  document_category text not null,
  document_title text not null,
  document_description text,
  original_file_name text not null,
  safe_file_name text not null,
  stored_file_name text,
  file_type text not null,
  mime_type text not null,
  file_size_bytes bigint not null,
  storage_bucket text not null default 'provider-documents',
  storage_path text not null,
  version integer not null default 1,
  version_number integer not null default 1,
  replaced_document_id uuid references public.client_documents(id),
  restricted boolean not null default false,
  mobile_visible boolean not null default false,
  uploaded_by uuid,
  uploaded_by_user_id uuid,
  uploaded_by_name text,
  uploaded_by_role text,
  uploaded_at timestamptz not null default now(),
  status text not null default 'Active',
  archive_reason text,
  archived_by uuid,
  archived_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  unique (company_id, service_user_id, storage_path)
);

create table if not exists public.client_document_audit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  client_document_id uuid references public.client_documents(id),
  action text not null,
  user_id uuid,
  user_role text,
  old_value jsonb,
  new_value jsonb,
  reason text,
  ip_address text,
  device text,
  audit_reference text not null default ('CDOC-AUD-' || gen_random_uuid()::text),
  created_at timestamptz not null default now()
);

drop trigger if exists protect_client_document_audit_events on public.client_document_audit_events;
create trigger protect_client_document_audit_events
before update or delete on public.client_document_audit_events
for each row execute function public.prevent_audit_log_mutation();

create table if not exists public.care_plans (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  version_number text not null default 'v1.0',
  status text not null default 'Draft',
  plan_data jsonb not null default '{}'::jsonb,
  approved_at timestamptz,
  approved_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.risk_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  assessment_type text not null,
  risk_level text not null default 'Medium',
  status text not null default 'Draft',
  assessment_data jsonb not null default '{}'::jsonb,
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.call_packages (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  package_name text not null,
  funding_source text,
  package_type text,
  schedule jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.shifts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  call_package_id uuid references public.call_packages(id) on delete set null,
  service_user_id uuid references public.service_users(id) on delete set null,
  planned_start_at timestamptz not null,
  planned_end_at timestamptz,
  status text not null default 'Planned',
  shift_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.rota_allocations (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  shift_id uuid not null references public.shifts(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete set null,
  allocation_status text not null default 'Allocated',
  allocation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.live_ecm_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  shift_id uuid references public.shifts(id) on delete set null,
  service_user_id uuid references public.service_users(id) on delete set null,
  staff_id uuid references public.staff(id) on delete set null,
  check_in_at timestamptz,
  check_out_at timestamptz,
  ecm_status text not null default 'Scheduled',
  exception_reason text,
  evidence jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.medication_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  medication_name text not null,
  support_required boolean not null default false,
  record_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.normal_mar_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  medication_record_id uuid references public.medication_records(id) on delete cascade,
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete set null,
  administration_at timestamptz,
  mar_status text not null default 'Scheduled',
  mar_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.controlled_drugs_mar_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  medication_record_id uuid references public.medication_records(id) on delete cascade,
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  staff_id uuid references public.staff(id) on delete set null,
  witness_staff_id uuid references public.staff(id) on delete set null,
  administration_at timestamptz,
  stock_balance numeric(10, 2),
  mar_status text not null default 'Scheduled',
  restricted_access boolean not null default true,
  mar_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.medication_audit (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  medication_record_id uuid references public.medication_records(id) on delete set null,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.client_journal (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  journal_type text not null,
  entry_text text not null,
  restricted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.staff_journal (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  staff_id uuid references public.staff(id) on delete cascade,
  journal_type text not null,
  entry_text text not null,
  restricted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.tagged_tasks (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  task_title text not null,
  module text not null,
  record_type text,
  record_id text,
  assigned_to uuid,
  due_at timestamptz,
  status text not null default 'Open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.training_courses (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  course_title text not null,
  category text,
  mandatory boolean not null default false,
  renewal_months integer,
  course_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.training_assignments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  staff_id uuid not null references public.staff(id) on delete cascade,
  training_course_id uuid not null references public.training_courses(id) on delete cascade,
  status text not null default 'Not Started',
  due_date date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

alter table public.certificates add column if not exists company_id uuid;
alter table public.certificates add column if not exists provider_id uuid;
alter table public.certificates add column if not exists location_id uuid;
alter table public.certificates add column if not exists staff_id uuid;
alter table public.certificates add column if not exists created_by uuid;
alter table public.certificates add column if not exists updated_by uuid;
alter table public.certificates add column if not exists archived_at timestamptz;

create table if not exists public.company_import_batches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  import_type text not null,
  uploaded_file_name text not null,
  uploaded_by uuid,
  total_records integer not null default 0,
  successful_records integer not null default 0,
  failed_records integer not null default 0,
  duplicate_records integer not null default 0,
  status text not null default 'Uploaded',
  report jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.import_validation_rows (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  import_batch_id uuid not null references public.company_import_batches(id) on delete cascade,
  row_number integer not null,
  record_type text not null,
  validation_status text not null,
  issues jsonb not null default '[]'::jsonb,
  duplicate_reasons jsonb not null default '[]'::jsonb,
  source_row jsonb not null default '{}'::jsonb,
  mapped_row jsonb not null default '{}'::jsonb,
  approved boolean not null default false,
  ignored boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete set null,
  invoice_number text not null,
  funding_source text,
  invoice_status text not null default 'Draft',
  amount numeric(12, 2) not null default 0,
  invoice_data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (company_id, invoice_number)
);

create table if not exists public.family_portal_access (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid not null references public.service_users(id) on delete cascade,
  family_user_id uuid references public.users(id) on delete cascade,
  access_status text not null default 'Invited',
  permission_scope jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

alter table public.audit_logs add column if not exists audit_id text;
alter table public.audit_logs add column if not exists company_id uuid;
alter table public.audit_logs add column if not exists provider_id uuid;
alter table public.audit_logs add column if not exists location_id uuid;
alter table public.audit_logs add column if not exists user_id uuid;
alter table public.audit_logs add column if not exists user_role text;
alter table public.audit_logs add column if not exists module text;
alter table public.audit_logs add column if not exists record_type text;
alter table public.audit_logs add column if not exists record_id text;
alter table public.audit_logs add column if not exists old_value jsonb;
alter table public.audit_logs add column if not exists new_value jsonb;
alter table public.audit_logs add column if not exists reason text;
alter table public.audit_logs add column if not exists device text;
alter table public.audit_logs add column if not exists created_by uuid;
alter table public.audit_logs add column if not exists updated_by uuid;
alter table public.audit_logs add column if not exists archived_at timestamptz;

create table if not exists public.system_settings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  setting_key text not null,
  setting_value jsonb not null default '{}'::jsonb,
  restricted boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz,
  unique (company_id, provider_id, setting_key)
);

create table if not exists public.backup_export_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  export_type text not null,
  export_scope text not null,
  file_name text,
  status text not null default 'Created',
  role_controlled boolean not null default true,
  audit_logged boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create index if not exists idx_companies_company on public.companies(company_id, archived_at);
create index if not exists idx_providers_company_provider on public.providers(company_id, provider_id);
create index if not exists idx_provider_locations_tenant on public.provider_locations(company_id, provider_id, location_id);
create index if not exists idx_users_tenant on public.users(company_id, provider_id, location_id);
create index if not exists idx_staff_tenant on public.staff(company_id, provider_id, location_id);
create index if not exists idx_service_users_tenant on public.service_users(company_id, provider_id, location_id);
create index if not exists idx_client_documents_tenant on public.client_documents(company_id, provider_id, location_id, service_user_id, status);
create index if not exists idx_client_documents_storage_path on public.client_documents(company_id, storage_path);
create index if not exists idx_client_document_audit_tenant on public.client_document_audit_events(company_id, provider_id, service_user_id, client_document_id, created_at desc);
create index if not exists idx_call_packages_tenant on public.call_packages(company_id, provider_id, location_id);
create index if not exists idx_shifts_tenant on public.shifts(company_id, provider_id, location_id);
create index if not exists idx_rota_allocations_tenant on public.rota_allocations(company_id, provider_id, location_id);
create index if not exists idx_live_ecm_tenant on public.live_ecm_records(company_id, provider_id, location_id);
create index if not exists idx_medication_records_tenant on public.medication_records(company_id, provider_id, location_id);
create index if not exists idx_audit_logs_tenant on public.audit_logs(company_id, provider_id, location_id);
create index if not exists idx_import_batches_tenant on public.company_import_batches(company_id, provider_id, location_id);

do $$
declare
  careverity_table text;
begin
  foreach careverity_table in array array[
    'companies',
    'providers',
    'provider_locations',
    'users',
    'role_permissions',
    'staff',
    'staff_documents',
    'service_users',
    'service_user_documents',
    'client_documents',
    'client_document_audit_events',
    'care_plans',
    'risk_assessments',
    'call_packages',
    'shifts',
    'rota_allocations',
    'live_ecm_records',
    'normal_mar_records',
    'controlled_drugs_mar_records',
    'medication_records',
    'medication_audit',
    'client_journal',
    'staff_journal',
    'tagged_tasks',
    'training_courses',
    'training_assignments',
    'company_import_batches',
    'import_validation_rows',
    'invoices',
    'family_portal_access',
    'system_settings',
    'backup_export_logs'
  ]
  loop
    execute format('drop trigger if exists %I on public.%I', 'set_' || careverity_table || '_updated_at', careverity_table);
    execute format('create trigger %I before update on public.%I for each row execute function public.set_updated_at()', 'set_' || careverity_table || '_updated_at', careverity_table);
  end loop;
end $$;

alter table public.companies enable row level security;
alter table public.providers enable row level security;
alter table public.provider_locations enable row level security;
alter table public.users enable row level security;
alter table public.role_permissions enable row level security;
alter table public.staff enable row level security;
alter table public.staff_documents enable row level security;
alter table public.service_users enable row level security;
alter table public.service_user_documents enable row level security;
alter table public.client_documents enable row level security;
alter table public.client_document_audit_events enable row level security;
alter table public.care_plans enable row level security;
alter table public.risk_assessments enable row level security;
alter table public.call_packages enable row level security;
alter table public.shifts enable row level security;
alter table public.rota_allocations enable row level security;
alter table public.live_ecm_records enable row level security;
alter table public.normal_mar_records enable row level security;
alter table public.controlled_drugs_mar_records enable row level security;
alter table public.medication_records enable row level security;
alter table public.medication_audit enable row level security;
alter table public.client_journal enable row level security;
alter table public.staff_journal enable row level security;
alter table public.tagged_tasks enable row level security;
alter table public.training_courses enable row level security;
alter table public.training_assignments enable row level security;
alter table public.company_import_batches enable row level security;
alter table public.import_validation_rows enable row level security;
alter table public.invoices enable row level security;
alter table public.family_portal_access enable row level security;
alter table public.system_settings enable row level security;
alter table public.backup_export_logs enable row level security;

create or replace function public.current_careverity_user_role()
returns text
language sql
security definer
stable
as $$
  select u.user_role
  from public.users u
  where u.id = auth.uid()
$$;

create or replace function public.current_careverity_company_id()
returns uuid
language sql
security definer
stable
as $$
  select u.company_id
  from public.users u
  where u.id = auth.uid()
$$;

create or replace function public.current_careverity_provider_id()
returns uuid
language sql
security definer
stable
as $$
  select u.provider_id
  from public.users u
  where u.id = auth.uid()
$$;

create or replace function public.current_careverity_location_id()
returns uuid
language sql
security definer
stable
as $$
  select u.location_id
  from public.users u
  where u.id = auth.uid()
$$;

-- Placeholder policy pattern to apply to every tenant table after testing:
-- System Owner can access all providers.
-- Provider Admin can access their own provider only.
-- Registered Manager can access their own provider/location.
-- HR can access staff records only where permitted.
-- Care Coordinator can access service user, rota and journal records for their provider.
-- Care Worker can access assigned visits/service users only.
-- Auditor has read-only access where authorised.
--
-- Example:
-- create policy "tenant read staff"
-- on public.staff for select
-- using (
--   public.current_careverity_user_role() = 'System Owner'
--   or (
--     company_id = public.current_careverity_company_id()
--     and provider_id = public.current_careverity_provider_id()
--     and public.current_careverity_user_role() in ('Provider Admin', 'Registered Manager', 'HR Administrator', 'Auditor / Inspector Read-Only')
--   )
-- );
--
-- create policy "care worker assigned live ecm only"
-- on public.live_ecm_records for select
-- using (
--   public.current_careverity_user_role() = 'System Owner'
--   or exists (
--     select 1
--     from public.rota_allocations ra
--     join public.staff s on s.id = ra.staff_id
--     where ra.shift_id = live_ecm_records.shift_id
--     and s.profile_id = auth.uid()
--     and ra.company_id = live_ecm_records.company_id
--     and ra.provider_id = live_ecm_records.provider_id
--   )
-- );
--
-- Storage plan:
-- provider-documents/
--   company_id/
--     staff/
--     service-users/
--     care-plans/
--     risk-assessments/
--     mar/
--     controlled-drugs/
--     training/
--     certificates/
--     invoices/
--     imports/
--
-- Storage rules plan:
-- 1. Provider users only access paths under their own company_id/provider_id.
-- 2. Restricted documents require role permission.
-- 3. Key-safe details and controlled drugs documents are restricted.
-- 4. Every file read/write/export is inserted into public.audit_logs.

-- UK launch security readiness additions.
-- These tables are evidence/control scaffolds for production authentication,
-- monitoring, backup restore, retention, breach response and security testing.

alter table public.audit_logs add column if not exists previous_event_hash text;
alter table public.audit_logs add column if not exists event_hash text;
alter table public.audit_logs add column if not exists locked_at timestamptz not null default now();
alter table public.audit_logs add column if not exists integrity_status text not null default 'Append-only';

create or replace function public.prevent_audit_log_mutation()
returns trigger
language plpgsql
as $$
begin
  raise exception 'CareVerity audit logs are append-only. Use a corrective/addendum audit entry instead.';
end;
$$;

drop trigger if exists block_audit_log_update on public.audit_logs;
create trigger block_audit_log_update
before update or delete on public.audit_logs
for each row execute function public.prevent_audit_log_mutation();

create table if not exists public.auth_mfa_enrolments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  user_id uuid references public.users(id) on delete cascade,
  required_role text not null,
  mfa_method text not null default 'totp',
  enrolment_status text not null default 'Required',
  verified_at timestamptz,
  last_challenge_at timestamptz,
  recovery_codes_rotated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.login_attempts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  email text not null,
  user_id uuid references public.users(id) on delete set null,
  success boolean not null default false,
  failure_reason text,
  ip_address inet,
  user_agent text,
  locked_until timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.password_reset_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  user_id uuid references public.users(id) on delete cascade,
  email text not null,
  token_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.rate_limit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  user_id uuid references public.users(id) on delete set null,
  route text not null,
  event_key text not null,
  limit_name text not null,
  request_count integer not null default 1,
  window_started_at timestamptz not null default now(),
  blocked boolean not null default false,
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.security_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  user_id uuid references public.users(id) on delete set null,
  severity text not null default 'Info',
  event_type text not null,
  module text not null,
  description text not null,
  metadata jsonb not null default '{}'::jsonb,
  status text not null default 'Open',
  assigned_to uuid references public.users(id) on delete set null,
  resolved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.security_alerts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  security_event_id uuid references public.security_events(id) on delete cascade,
  alert_channel text not null,
  alert_status text not null default 'Queued',
  recipient text,
  sent_at timestamptz,
  acknowledgement_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.backup_restore_tests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  backup_type text not null,
  backup_location text not null,
  encrypted boolean not null default true,
  restore_environment text not null,
  rpo_minutes integer,
  rto_minutes integer,
  records_checked integer not null default 0,
  integrity_result text not null default 'Pending',
  test_result text not null default 'Pending',
  issues_found text,
  corrective_action text,
  tested_by uuid references public.users(id) on delete set null,
  tested_at timestamptz,
  signed_off_by uuid references public.users(id) on delete set null,
  signed_off_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.data_retention_rules (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  record_type text not null,
  retention_period text not null,
  lawful_basis text not null,
  deletion_action text not null,
  review_date date not null,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.data_deletion_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  requester_name text not null,
  requester_relationship text not null,
  data_subject_type text not null,
  data_subject_id text,
  request_type text not null,
  status text not null default 'Received',
  decision text,
  decision_reason text,
  due_date date not null,
  completed_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.export_approval_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  requested_by uuid references public.users(id) on delete set null,
  export_type text not null,
  export_scope text not null,
  purpose text not null,
  status text not null default 'Pending approval',
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  downloaded_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.breach_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  breach_reference text not null unique,
  severity text not null default 'Triage',
  discovered_at timestamptz not null,
  reported_by uuid references public.users(id) on delete set null,
  personal_data_involved boolean not null default true,
  special_category_data_involved boolean not null default false,
  medication_or_safeguarding_impact boolean not null default false,
  affected_records integer,
  containment_action text,
  ico_notification_required boolean,
  ico_notified_at timestamptz,
  individuals_notified_at timestamptz,
  commissioner_notified_at timestamptz,
  lessons_learned text,
  status text not null default 'Open',
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.vulnerability_scan_runs (
  id uuid primary key default gen_random_uuid(),
  scan_reference text not null unique,
  scan_type text not null,
  tool_name text not null,
  target_environment text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  critical_findings integer not null default 0,
  high_findings integer not null default 0,
  medium_findings integer not null default 0,
  low_findings integer not null default 0,
  report_url text,
  status text not null default 'Pending',
  owner uuid references public.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.penetration_test_findings (
  id uuid primary key default gen_random_uuid(),
  test_reference text not null,
  finding_reference text not null,
  severity text not null,
  title text not null,
  affected_area text not null,
  owasp_category text,
  tenant_isolation_related boolean not null default false,
  medication_safety_related boolean not null default false,
  remediation_status text not null default 'Open',
  remediation_due_date date,
  retested_at timestamptz,
  closed_at timestamptz,
  evidence_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (test_reference, finding_reference)
);

create table if not exists public.dpia_records (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  dpia_reference text not null unique,
  processing_activity text not null,
  lawful_basis text not null,
  special_category_condition text,
  risk_summary text not null,
  mitigations text not null,
  residual_risk text not null,
  dpo_advice text,
  ico_consultation_required boolean not null default false,
  approval_status text not null default 'Draft',
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  review_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid,
  updated_by uuid,
  archived_at timestamptz
);

create table if not exists public.privacy_notice_versions (
  id uuid primary key default gen_random_uuid(),
  notice_reference text not null unique,
  audience text not null,
  version_number text not null,
  effective_date date not null,
  document_url text,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.processor_agreements (
  id uuid primary key default gen_random_uuid(),
  supplier_name text not null,
  agreement_reference text not null unique,
  service_description text not null,
  hosting_location text,
  subprocessors jsonb not null default '[]'::jsonb,
  security_measures jsonb not null default '{}'::jsonb,
  signed_at date,
  review_date date not null,
  status text not null default 'Draft',
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.auth_mfa_enrolments enable row level security;
alter table public.login_attempts enable row level security;
alter table public.password_reset_requests enable row level security;
alter table public.rate_limit_events enable row level security;
alter table public.security_events enable row level security;
alter table public.security_alerts enable row level security;
alter table public.backup_restore_tests enable row level security;
alter table public.data_retention_rules enable row level security;
alter table public.data_deletion_requests enable row level security;
alter table public.export_approval_requests enable row level security;
alter table public.breach_reports enable row level security;
alter table public.vulnerability_scan_runs enable row level security;
alter table public.penetration_test_findings enable row level security;
alter table public.dpia_records enable row level security;
alter table public.privacy_notice_versions enable row level security;
alter table public.processor_agreements enable row level security;

create index if not exists idx_login_attempts_email_created on public.login_attempts(email, created_at desc);
create index if not exists idx_rate_limit_events_key_window on public.rate_limit_events(event_key, window_started_at desc);
create index if not exists idx_security_events_tenant on public.security_events(company_id, provider_id, severity, status);
create index if not exists idx_backup_restore_tests_tenant on public.backup_restore_tests(company_id, provider_id, test_result);
create index if not exists idx_export_approvals_tenant on public.export_approval_requests(company_id, provider_id, status);
create index if not exists idx_breach_reports_tenant on public.breach_reports(company_id, provider_id, severity, status);

-- AI Care Review & Referral Assistant
-- AI output is draft/support only. Production code must not update live care records,
-- send emails or publish referrals until an authorised human has approved the final version.
-- Never query AI drafts, referrals or audit events without filtering by company_id/provider_id.

create table if not exists public.ai_care_review_cases (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete set null,
  case_reference text not null unique,
  case_title text not null,
  source_modules text[] not null default '{}',
  source_record_ids jsonb not null default '[]'::jsonb,
  source_summary text not null,
  emergency_flag boolean not null default false,
  emergency_warning_acknowledged_at timestamptz,
  status text not null default 'Review required',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.ai_care_review_suggestions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  case_id uuid not null references public.ai_care_review_cases(id) on delete cascade,
  suggestion_type text not null,
  recommendation text not null,
  reason text not null,
  missing_information jsonb not null default '[]'::jsonb,
  source_record_ids jsonb not null default '[]'::jsonb,
  selected_by uuid references public.users(id) on delete set null,
  selected_at timestamptz,
  rejected_by uuid references public.users(id) on delete set null,
  rejected_at timestamptz,
  rejection_reason text,
  status text not null default 'Suggested',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.ai_draft_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  case_id uuid not null references public.ai_care_review_cases(id) on delete cascade,
  suggestion_id uuid references public.ai_care_review_suggestions(id) on delete set null,
  service_user_id uuid references public.service_users(id) on delete set null,
  draft_type text not null,
  draft_title text not null,
  draft_body text not null,
  minimum_necessary_summary text,
  source_record_ids jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  version_number integer not null default 1,
  status text not null default 'AI-assisted draft - approval required',
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  recipient_name text,
  recipient_organisation text,
  sent_at timestamptz,
  saved_to_client_file_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.ai_draft_audit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  case_id uuid references public.ai_care_review_cases(id) on delete set null,
  draft_id uuid references public.ai_draft_documents(id) on delete set null,
  service_user_id uuid references public.service_users(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  user_role text,
  action text not null,
  source_record_ids jsonb not null default '[]'::jsonb,
  old_value jsonb,
  new_value jsonb,
  reason text,
  recipient_name text,
  ip_address inet,
  device text,
  previous_event_hash text,
  event_hash text,
  locked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.ai_care_review_cases enable row level security;
alter table public.ai_care_review_suggestions enable row level security;
alter table public.ai_draft_documents enable row level security;
alter table public.ai_draft_audit_events enable row level security;

create index if not exists idx_ai_care_review_cases_tenant on public.ai_care_review_cases(company_id, provider_id, service_user_id, status);
create index if not exists idx_ai_care_review_suggestions_tenant on public.ai_care_review_suggestions(company_id, provider_id, case_id, status);
create index if not exists idx_ai_draft_documents_tenant on public.ai_draft_documents(company_id, provider_id, service_user_id, status);
create index if not exists idx_ai_draft_audit_events_tenant on public.ai_draft_audit_events(company_id, provider_id, case_id, draft_id, created_at desc);

drop trigger if exists protect_ai_draft_audit_events on public.ai_draft_audit_events;
create trigger protect_ai_draft_audit_events
before update or delete on public.ai_draft_audit_events
for each row execute function public.prevent_audit_log_mutation();

-- Example RLS pattern to apply during Supabase migration:
-- create policy ai_drafts_provider_isolation on public.ai_draft_documents
--   using (
--     public.current_user_is_system_owner()
--     or (company_id = public.current_careverity_company_id() and provider_id = public.current_careverity_provider_id())
--   )
--   with check (
--     public.current_user_is_system_owner()
--     or (company_id = public.current_careverity_company_id() and provider_id = public.current_careverity_provider_id())
--   );

-- ---------------------------------------------------------------------------
-- Production tenant RLS and private storage hardening
-- ---------------------------------------------------------------------------
-- API RBAC remains mandatory. These database policies provide a second tenant
-- isolation layer so Company A records cannot be selected/inserted/updated by
-- Company B sessions even if an API bug is introduced.

create or replace function public.current_user_is_system_owner()
returns boolean
language sql
security definer
stable
as $$
  select coalesce(public.current_careverity_user_role(), '') in ('System Owner', 'Super Admin')
$$;

do $$
declare
  tenant_table text;
begin
  foreach tenant_table in array array[
    'companies',
    'providers',
    'provider_locations',
    'users',
    'role_permissions',
    'staff',
    'staff_documents',
    'service_users',
    'service_user_documents',
    'client_documents',
    'client_document_audit_events',
    'care_plans',
    'risk_assessments',
    'call_packages',
    'shifts',
    'rota_allocations',
    'live_ecm_records',
    'normal_mar_records',
    'controlled_drugs_mar_records',
    'medication_records',
    'medication_audit',
    'client_journal',
    'staff_journal',
    'tagged_tasks',
    'training_courses',
    'training_assignments',
    'certificates',
    'company_import_batches',
    'import_validation_rows',
    'invoices',
    'family_portal_access',
    'system_settings',
    'backup_export_logs',
    'ai_care_review_cases',
    'ai_care_review_suggestions',
    'ai_draft_documents',
    'ai_draft_audit_events',
    'quality_kpi_snapshots',
    'quality_lessons_learned',
    'quality_evidence_items',
    'quality_reports',
    'inspection_evidence_packs',
    'quality_hub_audit_events',
    'company_subscriptions',
    'company_feature_flags',
    'ai_usage_events',
    'performance_events',
    'tenant_access_test_runs',
    'saas_load_test_runs'
  ]
  loop
    if to_regclass(format('public.%I', tenant_table)) is not null then
      execute format('drop policy if exists careverity_tenant_select on public.%I', tenant_table);
      execute format(
        'create policy careverity_tenant_select on public.%I for select using (
          public.current_user_is_system_owner()
          or (
            company_id = public.current_careverity_company_id()
            and (
              provider_id is null
              or public.current_careverity_provider_id() is null
              or provider_id = public.current_careverity_provider_id()
            )
          )
        )',
        tenant_table
      );

      execute format('drop policy if exists careverity_tenant_insert on public.%I', tenant_table);
      execute format(
        'create policy careverity_tenant_insert on public.%I for insert with check (
          public.current_user_is_system_owner()
          or (
            company_id = public.current_careverity_company_id()
            and (
              provider_id is null
              or public.current_careverity_provider_id() is null
              or provider_id = public.current_careverity_provider_id()
            )
          )
        )',
        tenant_table
      );

      execute format('drop policy if exists careverity_tenant_update on public.%I', tenant_table);
      execute format(
        'create policy careverity_tenant_update on public.%I for update using (
          public.current_user_is_system_owner()
          or (
            company_id = public.current_careverity_company_id()
            and (
              provider_id is null
              or public.current_careverity_provider_id() is null
              or provider_id = public.current_careverity_provider_id()
            )
          )
        )
        with check (
          public.current_user_is_system_owner()
          or (
            company_id = public.current_careverity_company_id()
            and (
              provider_id is null
              or public.current_careverity_provider_id() is null
              or provider_id = public.current_careverity_provider_id()
            )
          )
        )',
        tenant_table
      );
    end if;
  end loop;
end $$;

create table if not exists public.private_file_objects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  bucket_name text not null default 'provider-documents',
  object_path text not null,
  file_category text not null,
  file_name text not null,
  content_type text,
  file_size_bytes bigint,
  restricted boolean not null default true,
  encrypted boolean not null default true,
  retention_date date,
  virus_scan_status text not null default 'Pending',
  access_logged boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (bucket_name, object_path)
);

create table if not exists public.private_file_access_logs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  file_object_id uuid references public.private_file_objects(id) on delete cascade,
  user_id uuid references public.users(id) on delete set null,
  user_role text,
  action text not null,
  access_reason text,
  ip_address inet,
  user_agent text,
  previous_event_hash text,
  event_hash text,
  locked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.private_file_objects enable row level security;
alter table public.private_file_access_logs enable row level security;

create index if not exists idx_private_file_objects_tenant on public.private_file_objects(company_id, provider_id, file_category, archived_at);
create index if not exists idx_private_file_access_logs_tenant on public.private_file_access_logs(company_id, provider_id, file_object_id, created_at desc);

drop trigger if exists protect_private_file_access_logs on public.private_file_access_logs;
create trigger protect_private_file_access_logs
before update or delete on public.private_file_access_logs
for each row execute function public.prevent_audit_log_mutation();

drop policy if exists careverity_private_file_select on public.private_file_objects;
create policy careverity_private_file_select
on public.private_file_objects for select
using (
  public.current_user_is_system_owner()
  or company_id = public.current_careverity_company_id()
);

drop policy if exists careverity_private_file_insert on public.private_file_objects;
create policy careverity_private_file_insert
on public.private_file_objects for insert
with check (
  public.current_user_is_system_owner()
  or company_id = public.current_careverity_company_id()
);

drop policy if exists careverity_private_file_access_select on public.private_file_access_logs;
create policy careverity_private_file_access_select
on public.private_file_access_logs for select
using (
  public.current_user_is_system_owner()
  or company_id = public.current_careverity_company_id()
);

drop policy if exists careverity_private_file_access_insert on public.private_file_access_logs;
create policy careverity_private_file_access_insert
on public.private_file_access_logs for insert
with check (
  public.current_user_is_system_owner()
  or company_id = public.current_careverity_company_id()
);

do $$
begin
  if to_regclass('storage.buckets') is not null then
    insert into storage.buckets (id, name, public)
    values ('provider-documents', 'provider-documents', false)
    on conflict (id) do update set public = false;

    insert into storage.buckets (id, name, public)
    values ('client-documents', 'client-documents', false)
    on conflict (id) do update set public = false;
  end if;
end $$;

-- Supabase Storage object policies must be applied in the Supabase project:
-- provider-documents must remain public = false.
-- object paths must start company_id/provider_id/category/file-name.
-- storage.objects SELECT/INSERT/UPDATE/DELETE policies must validate the
-- company_id segment against public.current_careverity_company_id().
-- Every signed URL generation and object read/write must insert a row in
-- public.private_file_access_logs and public.audit_logs.
-- client-documents must remain public = false.
-- client document paths must use:
-- companies/{companyId}/service-users/{serviceUserId}/documents/{documentId}/{safeFileName}
-- Company A/B tenant tests must verify Company B cannot list, view, download,
-- replace, archive or request a signed URL for Company A client documents.

do $$
begin
  if to_regclass('storage.objects') is not null then
    execute 'drop policy if exists careverity_client_documents_storage_select on storage.objects';
    execute 'create policy careverity_client_documents_storage_select on storage.objects for select using (
      bucket_id = ''client-documents''
      and split_part(name, ''/'', 1) = ''companies''
      and (
        public.current_user_is_system_owner()
        or split_part(name, ''/'', 2) = public.current_careverity_company_id()::text
      )
    )';

    execute 'drop policy if exists careverity_client_documents_storage_insert on storage.objects';
    execute 'create policy careverity_client_documents_storage_insert on storage.objects for insert with check (
      bucket_id = ''client-documents''
      and split_part(name, ''/'', 1) = ''companies''
      and (
        public.current_user_is_system_owner()
        or split_part(name, ''/'', 2) = public.current_careverity_company_id()::text
      )
    )';

    execute 'drop policy if exists careverity_client_documents_storage_update on storage.objects';
    execute 'create policy careverity_client_documents_storage_update on storage.objects for update using (
      bucket_id = ''client-documents''
      and split_part(name, ''/'', 1) = ''companies''
      and (
        public.current_user_is_system_owner()
        or split_part(name, ''/'', 2) = public.current_careverity_company_id()::text
      )
    )
    with check (
      bucket_id = ''client-documents''
      and split_part(name, ''/'', 1) = ''companies''
      and (
        public.current_user_is_system_owner()
        or split_part(name, ''/'', 2) = public.current_careverity_company_id()::text
      )
    )';
  end if;
end $$;

-- Quality Intelligence & CQC Evidence Hub
-- Quality reports, lessons learned and evidence packs are draft until approved by
-- an authorised manager. Never query these tables without company_id/provider_id.

create table if not exists public.quality_kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  reporting_period text not null,
  source_record_ids jsonb not null default '[]'::jsonb,
  kpi_values jsonb not null default '{}'::jsonb,
  analysis_summary text,
  status text not null default 'Draft',
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, reporting_period)
);

create table if not exists public.quality_lessons_learned (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  source_type text not null,
  source_reference text not null,
  service_user_id uuid references public.service_users(id) on delete set null,
  event_date date not null,
  issue_event text not null,
  immediate_action_taken text,
  root_cause text,
  ai_suggested_lesson text,
  manager_approved_lesson text,
  action_required boolean not null default true,
  responsible_user_id uuid references public.users(id) on delete set null,
  target_date date,
  completion_date date,
  status text not null default 'Open',
  evidence_uploaded boolean not null default false,
  care_plan_update_required boolean not null default false,
  risk_assessment_update_required boolean not null default false,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.quality_evidence_items (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  evidence_reference text not null unique,
  evidence_type text not null,
  title text not null,
  source_record_ids jsonb not null default '[]'::jsonb,
  cqc_themes text[] not null default '{}',
  summary text not null,
  minimum_necessary_personal_data text,
  ai_suggested_summary text,
  manager_approved_summary text,
  status text not null default 'Draft - approval required',
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.quality_reports (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  report_reference text not null unique,
  report_type text not null,
  reporting_period text not null,
  source_record_ids jsonb not null default '[]'::jsonb,
  report_body text not null,
  cqc_theme_summary jsonb not null default '{}'::jsonb,
  outstanding_actions jsonb not null default '[]'::jsonb,
  version_number integer not null default 1,
  status text not null default 'AI-assisted draft - approval required',
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.inspection_evidence_packs (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  pack_reference text not null unique,
  date_from date not null,
  date_to date not null,
  cqc_theme_filter text not null default 'All themes',
  included_evidence_ids jsonb not null default '[]'::jsonb,
  status text not null default 'Draft - approval required',
  generated_by uuid references public.users(id) on delete set null,
  generated_at timestamptz not null default now(),
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.quality_hub_audit_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  user_id uuid references public.users(id) on delete set null,
  user_role text,
  module text not null default 'Quality Intelligence & CQC Evidence Hub',
  action text not null,
  record_type text not null,
  record_id uuid,
  source_record_ids jsonb not null default '[]'::jsonb,
  old_value jsonb,
  new_value jsonb,
  reason text,
  previous_event_hash text,
  event_hash text,
  locked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.quality_kpi_snapshots enable row level security;
alter table public.quality_lessons_learned enable row level security;
alter table public.quality_evidence_items enable row level security;
alter table public.quality_reports enable row level security;
alter table public.inspection_evidence_packs enable row level security;
alter table public.quality_hub_audit_events enable row level security;

create index if not exists idx_quality_kpi_snapshots_tenant on public.quality_kpi_snapshots(company_id, provider_id, reporting_period, status);
create index if not exists idx_quality_lessons_tenant on public.quality_lessons_learned(company_id, provider_id, status, target_date);
create index if not exists idx_quality_evidence_tenant on public.quality_evidence_items(company_id, provider_id, status);
create index if not exists idx_quality_reports_tenant on public.quality_reports(company_id, provider_id, reporting_period, status);
create index if not exists idx_inspection_evidence_packs_tenant on public.inspection_evidence_packs(company_id, provider_id, date_from, date_to, status);
create index if not exists idx_quality_hub_audit_tenant on public.quality_hub_audit_events(company_id, provider_id, record_type, created_at desc);

drop trigger if exists protect_quality_hub_audit_events on public.quality_hub_audit_events;
create trigger protect_quality_hub_audit_events
before update or delete on public.quality_hub_audit_events
for each row execute function public.prevent_audit_log_mutation();

-- ---------------------------------------------------------------------------
-- CareVerity SaaS scale operations
-- ---------------------------------------------------------------------------
-- Initial launch target: 100 active companies.
-- Architecture target: 500 active companies without major redesign.
-- Never query operational SaaS records without company_id/provider_id where the
-- table is tenant-scoped. Staging and production must use separate projects,
-- databases, storage buckets, auth settings, monitoring and secrets.

create table if not exists public.company_subscriptions (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  subscription_plan text not null,
  subscription_status text not null default 'trial',
  billing_contact_user_id uuid references public.users(id) on delete set null,
  billing_reference text,
  included_modules text[] not null default '{}',
  feature_limits jsonb not null default '{}'::jsonb,
  starts_at timestamptz not null default now(),
  renews_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id)
);

create table if not exists public.company_feature_flags (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  feature_key text not null,
  enabled boolean not null default false,
  rollout_status text not null default 'configured',
  configuration jsonb not null default '{}'::jsonb,
  enabled_by uuid references public.users(id) on delete set null,
  enabled_at timestamptz,
  disabled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, feature_key)
);

create table if not exists public.ai_usage_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  user_id uuid references public.users(id) on delete set null,
  user_role text,
  module text not null,
  action text not null,
  ai_provider text,
  ai_model text,
  prompt_template_id text,
  input_tokens integer not null default 0,
  output_tokens integer not null default 0,
  total_tokens integer generated always as (input_tokens + output_tokens) stored,
  estimated_cost_gbp numeric(12, 6),
  purpose text,
  source_record_ids jsonb not null default '[]'::jsonb,
  approval_required boolean not null default true,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null
);

create table if not exists public.performance_events (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references public.providers(company_id),
  provider_id uuid references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  environment_name text not null,
  route_path text not null,
  module text not null,
  metric_name text not null,
  duration_ms numeric(12, 3),
  status_code integer,
  success boolean not null default true,
  error_name text,
  user_role text,
  trace_id text,
  created_at timestamptz not null default now()
);

create table if not exists public.tenant_access_test_runs (
  id uuid primary key default gen_random_uuid(),
  test_reference text not null,
  environment_name text not null,
  company_a_id uuid not null references public.providers(company_id),
  company_b_id uuid not null references public.providers(company_id),
  attempted_action text not null,
  attempted_module text not null,
  expected_result text not null default 'deny cross-company access',
  actual_result text not null,
  passed boolean not null default false,
  evidence jsonb not null default '{}'::jsonb,
  tested_by uuid references public.users(id) on delete set null,
  tested_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.saas_load_test_runs (
  id uuid primary key default gen_random_uuid(),
  test_reference text not null,
  environment_name text not null,
  target_company_count integer not null check (target_company_count > 0),
  active_company_count integer not null check (active_company_count >= 0),
  virtual_users integer not null check (virtual_users >= 0),
  scenario_name text not null,
  p95_dashboard_ms numeric(12, 3),
  p95_mobile_ms numeric(12, 3),
  p95_mar_ms numeric(12, 3),
  error_rate numeric(8, 5),
  tenant_leakage_failures integer not null default 0,
  status text not null default 'Not run',
  evidence_url text,
  tested_by uuid references public.users(id) on delete set null,
  tested_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.company_subscriptions enable row level security;
alter table public.company_feature_flags enable row level security;
alter table public.ai_usage_events enable row level security;
alter table public.performance_events enable row level security;
alter table public.tenant_access_test_runs enable row level security;
alter table public.saas_load_test_runs enable row level security;

create index if not exists idx_company_subscriptions_tenant on public.company_subscriptions(company_id, provider_id, subscription_status);
create index if not exists idx_company_feature_flags_tenant on public.company_feature_flags(company_id, provider_id, feature_key, enabled);
create index if not exists idx_ai_usage_events_tenant on public.ai_usage_events(company_id, provider_id, module, created_at desc);
create index if not exists idx_ai_usage_events_cost on public.ai_usage_events(company_id, provider_id, ai_model, created_at desc);
create index if not exists idx_performance_events_route on public.performance_events(environment_name, route_path, module, created_at desc);
create index if not exists idx_performance_events_tenant on public.performance_events(company_id, provider_id, module, created_at desc);
create index if not exists idx_tenant_access_test_runs_reference on public.tenant_access_test_runs(test_reference, environment_name, passed, tested_at desc);
create index if not exists idx_saas_load_test_runs_scale on public.saas_load_test_runs(target_company_count, environment_name, status, tested_at desc);

-- ---------------------------------------------------------------------------
-- CareVerity Staff Support & Recognition Intelligence
-- ---------------------------------------------------------------------------
-- Support indicator only. This is not a disciplinary decision. Managers must
-- review evidence, context and fairness before taking action.
-- Every record is tenant scoped by company_id/provider_id. Do not show public
-- negative ranking and do not use RAG indicators as automatic HR decisions.

create table if not exists public.staff_support_indicators (
  id uuid primary key default gen_random_uuid(),
  indicator_id text not null,
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  branch_id text,
  staff_id uuid references public.staff(id) on delete set null,
  staff_reference text,
  staff_name text not null,
  staff_role text not null,
  reporting_period_start date not null,
  reporting_period_end date not null,
  rag_status text not null check (rag_status in ('Green', 'Amber', 'Red')),
  confidence_level text not null check (confidence_level in ('Low', 'Medium', 'High')),
  recognition_score integer not null default 0,
  support_score integer not null default 0,
  risk_alert_score integer not null default 0,
  positive_evidence_count integer not null default 0,
  concern_evidence_count integer not null default 0,
  unresolved_alert_count integer not null default 0,
  key_positive_reasons text[] not null default '{}',
  key_support_reasons text[] not null default '{}',
  key_risk_reasons text[] not null default '{}',
  recommended_actions text[] not null default '{}',
  training_suggested boolean not null default false,
  supervision_suggested boolean not null default false,
  spot_check_suggested boolean not null default false,
  recognition_suggested boolean not null default false,
  manager_review_suggested boolean not null default false,
  hr_review_suggested boolean not null default false,
  complaint_links_require_review boolean not null default false,
  medication_alert_present boolean not null default false,
  geofence_alert_present boolean not null default false,
  training_alert_present boolean not null default false,
  supervision_alert_present boolean not null default false,
  last_calculated_at timestamptz not null default now(),
  calculated_by text not null default 'System',
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  manager_decision text,
  action_plan_id text,
  status text not null default 'System Suggested',
  fairness_context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, indicator_id)
);

create table if not exists public.staff_support_actions (
  id uuid primary key default gen_random_uuid(),
  action_id text not null,
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  branch_id text,
  staff_id uuid references public.staff(id) on delete set null,
  staff_reference text,
  source_indicator_id text not null,
  action_type text not null,
  action_reason text not null,
  assigned_to_user_id uuid references public.users(id) on delete set null,
  assigned_to_name text not null,
  priority text not null check (priority in ('Low', 'Medium', 'High')),
  due_date date not null,
  status text not null default 'Open',
  outcome_notes text,
  evidence_file_id text,
  completed_by uuid references public.users(id) on delete set null,
  completed_at timestamptz,
  manager_approved_by uuid references public.users(id) on delete set null,
  manager_approved_at timestamptz,
  no_automatic_disciplinary_decision boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, action_id)
);

create table if not exists public.staff_support_evidence_links (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  indicator_id text not null,
  action_id text,
  staff_id uuid references public.staff(id) on delete set null,
  evidence_type text not null,
  source_module text not null,
  source_record_id text not null,
  source_record_date timestamptz,
  evidence_summary text not null,
  manager_review_required boolean not null default true,
  complaint_confirmed_staff_related text not null default 'Pending',
  approved_for_indicator boolean not null default false,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.staff_support_ai_drafts (
  id uuid primary key default gen_random_uuid(),
  draft_id text not null,
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  staff_id uuid references public.staff(id) on delete set null,
  indicator_id text not null,
  output_type text not null,
  title text not null,
  body text not null,
  key_findings jsonb not null default '[]'::jsonb,
  suggested_actions jsonb not null default '[]'::jsonb,
  risk_warnings jsonb not null default '[]'::jsonb,
  fairness_warnings jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  selected_evidence_ids jsonb not null default '[]'::jsonb,
  approval_required boolean not null default true,
  no_automatic_hr_action boolean not null default true,
  no_automatic_disciplinary_decision boolean not null default true,
  status text not null default 'Draft - approval required',
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, draft_id)
);

alter table public.staff_support_indicators enable row level security;
alter table public.staff_support_actions enable row level security;
alter table public.staff_support_evidence_links enable row level security;
alter table public.staff_support_ai_drafts enable row level security;

create index if not exists idx_staff_support_indicators_tenant on public.staff_support_indicators(company_id, provider_id, location_id, rag_status, reporting_period_end desc);
create index if not exists idx_staff_support_indicators_staff on public.staff_support_indicators(company_id, provider_id, staff_reference, status);
create index if not exists idx_staff_support_actions_tenant on public.staff_support_actions(company_id, provider_id, status, priority, due_date);
create index if not exists idx_staff_support_actions_staff on public.staff_support_actions(company_id, provider_id, staff_reference, action_type);
create index if not exists idx_staff_support_evidence_tenant on public.staff_support_evidence_links(company_id, provider_id, indicator_id, evidence_type);
create index if not exists idx_staff_support_ai_drafts_tenant on public.staff_support_ai_drafts(company_id, provider_id, staff_id, status, created_at desc);

-- Example policy shape for SaaS operational records:
-- create policy company_feature_flags_provider_isolation
--   on public.company_feature_flags
--   using (
--     public.current_user_is_system_owner()
--     or (company_id = public.current_careverity_company_id() and provider_id = public.current_careverity_provider_id())
--   )
--   with check (
--     public.current_user_is_system_owner()
--     or (company_id = public.current_careverity_company_id() and provider_id = public.current_careverity_provider_id())
--   );

-- ---------------------------------------------------------------------------
-- LQCS AI Face-to-Face Assessment, Care Plan Review and Risk Assessment
-- Generator
-- ---------------------------------------------------------------------------
-- AI-assisted draft only. The AI must not publish care plans, change risk
-- ratings, send referrals/emails or update mobile staff content without human
-- professional review and approval. Never query these records without
-- company_id/provider_id and service_user_id where applicable.

create table if not exists public.lqcs_assessment_sources (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  source_type text not null,
  source_reference text not null,
  source_date date,
  source_summary text not null,
  reliability_status text not null default 'Needs verification',
  conflict_summary text,
  resolved_by_source_id uuid references public.lqcs_assessment_sources(id) on delete set null,
  minimum_necessary_data_used boolean not null default true,
  status text not null default 'Recorded - source reliability visible',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, service_user_id, source_reference)
);

create table if not exists public.lqcs_face_to_face_assessments (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  assessment_reference text not null,
  assessed_by uuid references public.users(id) on delete set null,
  assessment_date date not null,
  what_matters_to_me text,
  likes_dislikes_preferences jsonb not null default '[]'::jsonb,
  equality_diversity_reasonable_adjustments jsonb not null default '[]'::jsonb,
  decision_specific_capacity jsonb not null default '[]'::jsonb,
  goals_outcomes jsonb not null default '[]'::jsonb,
  what_staff_must_report jsonb not null default '[]'::jsonb,
  professional_involvement_tracker jsonb not null default '[]'::jsonb,
  review_triggers jsonb not null default '[]'::jsonb,
  source_evidence_reliability jsonb not null default '[]'::jsonb,
  cqc_evidence_mapping jsonb not null default '[]'::jsonb,
  status text not null default 'Draft - professional review required',
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, assessment_reference)
);

create table if not exists public.lqcs_care_plan_drafts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  assessment_id uuid references public.lqcs_face_to_face_assessments(id) on delete set null,
  draft_reference text not null,
  template_name text not null default 'LQCS Reviewed Care Plan',
  draft_title text not null default 'AI-assisted reviewed care plan draft',
  draft_status text not null default 'AI-assisted draft - professional review and approval required.',
  review_checker_status text not null default 'Needs Attention',
  source_record_ids jsonb not null default '[]'::jsonb,
  reviewed_care_plan_structure jsonb not null default '[]'::jsonb,
  full_draft_body jsonb not null default '{}'::jsonb,
  mobile_visible boolean not null default false,
  approval_required boolean not null default true,
  approved_final_care_plan_id uuid references public.care_plans(id) on delete set null,
  version_number integer not null default 1,
  reviewed_by uuid references public.users(id) on delete set null,
  reviewed_at timestamptz,
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, draft_reference, version_number)
);

create table if not exists public.lqcs_care_domain_drafts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  draft_id uuid not null references public.lqcs_care_plan_drafts(id) on delete cascade,
  domain_name text not null,
  current_situation text not null,
  assistance_required text not null,
  equipment_or_aids_required text,
  care_plan_required text not null,
  preferences_wishes_choices text,
  review_note text,
  what_staff_must_report jsonb not null default '[]'::jsonb,
  source_evidence_ids jsonb not null default '[]'::jsonb,
  ai_draft_status text not null default 'AI-assisted draft - professional review and approval required.',
  approved_mobile_summary text,
  mobile_visible boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, draft_id, domain_name)
);

create table if not exists public.lqcs_review_checker_issues (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  draft_id uuid references public.lqcs_care_plan_drafts(id) on delete cascade,
  section_name text not null,
  issue text not null,
  why_it_matters text not null,
  suggested_correction text not null,
  priority text not null default 'Medium',
  status text not null default 'Needs Attention',
  blocks_final_approval boolean not null default false,
  override_reason text,
  overridden_by uuid references public.users(id) on delete set null,
  overridden_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz
);

create table if not exists public.lqcs_professional_referral_drafts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete cascade,
  draft_id uuid references public.lqcs_care_plan_drafts(id) on delete set null,
  referral_reference text not null default ('LQCS-REF-' || gen_random_uuid()::text),
  referral_type text not null,
  trigger_reason text not null,
  recipient_name text,
  recipient_type text,
  draft_body text not null,
  source_record_ids jsonb not null default '[]'::jsonb,
  missing_information jsonb not null default '[]'::jsonb,
  approval_status text not null default 'AI-assisted draft - professional review and approval required.',
  sent_status text not null default 'Not sent',
  approved_by uuid references public.users(id) on delete set null,
  approved_at timestamptz,
  sent_by uuid references public.users(id) on delete set null,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references public.users(id) on delete set null,
  updated_by uuid references public.users(id) on delete set null,
  archived_at timestamptz,
  unique (company_id, provider_id, referral_reference)
);

create table if not exists public.lqcs_draft_audit_events (
  id uuid primary key default gen_random_uuid(),
  audit_reference text not null default ('LQCS-AUD-' || gen_random_uuid()::text),
  company_id uuid not null references public.providers(company_id),
  provider_id uuid not null references public.providers(provider_id),
  location_id uuid references public.provider_locations(location_id),
  service_user_id uuid references public.service_users(id) on delete set null,
  user_id uuid references public.users(id) on delete set null,
  user_role text,
  action text not null,
  record_type text not null,
  record_id uuid,
  source_record_ids jsonb not null default '[]'::jsonb,
  old_value jsonb,
  new_value jsonb,
  reason text,
  ai_suggestion_generated boolean not null default false,
  human_review_required boolean not null default true,
  recipient_if_sent text,
  ip_address text,
  device text,
  previous_event_hash text,
  event_hash text,
  locked_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.lqcs_assessment_sources enable row level security;
alter table public.lqcs_face_to_face_assessments enable row level security;
alter table public.lqcs_care_plan_drafts enable row level security;
alter table public.lqcs_care_domain_drafts enable row level security;
alter table public.lqcs_review_checker_issues enable row level security;
alter table public.lqcs_professional_referral_drafts enable row level security;
alter table public.lqcs_draft_audit_events enable row level security;

create index if not exists idx_lqcs_assessment_sources_tenant on public.lqcs_assessment_sources(company_id, provider_id, service_user_id, reliability_status);
create index if not exists idx_lqcs_face_to_face_assessments_tenant on public.lqcs_face_to_face_assessments(company_id, provider_id, service_user_id, assessment_date desc);
create index if not exists idx_lqcs_care_plan_drafts_tenant on public.lqcs_care_plan_drafts(company_id, provider_id, service_user_id, review_checker_status, draft_status);
create index if not exists idx_lqcs_care_domain_drafts_tenant on public.lqcs_care_domain_drafts(company_id, provider_id, service_user_id, draft_id, domain_name);
create index if not exists idx_lqcs_review_checker_issues_tenant on public.lqcs_review_checker_issues(company_id, provider_id, service_user_id, priority, status);
create index if not exists idx_lqcs_professional_referral_drafts_tenant on public.lqcs_professional_referral_drafts(company_id, provider_id, service_user_id, referral_type, approval_status);
create index if not exists idx_lqcs_draft_audit_events_tenant on public.lqcs_draft_audit_events(company_id, provider_id, service_user_id, record_type, created_at desc);

drop trigger if exists protect_lqcs_draft_audit_events on public.lqcs_draft_audit_events;
create trigger protect_lqcs_draft_audit_events
before update or delete on public.lqcs_draft_audit_events
for each row execute function public.prevent_audit_log_mutation();

-- Example RLS pattern for LQCS AI draft records:
-- create policy lqcs_care_plan_drafts_provider_isolation
--   on public.lqcs_care_plan_drafts
--   using (
--     public.current_user_is_system_owner()
--     or (company_id = public.current_careverity_company_id() and provider_id = public.current_careverity_provider_id())
--   )
--   with check (
--     public.current_user_is_system_owner()
--     or (company_id = public.current_careverity_company_id() and provider_id = public.current_careverity_provider_id())
--   );

-- ---------------------------------------------------------------------------
-- CareVerity production backend model scaffold
-- ---------------------------------------------------------------------------
-- This section creates a thin PostgreSQL scaffold for every requested
-- production module table. Existing rich tables above remain the preferred
-- module schemas where they already exist. These generic JSONB model tables are
-- a migration bridge so server-side API work can be wired without localStorage.
-- Follow-up migrations should replace payload fields with stricter typed
-- columns per module before go-live.

do $$
declare
  model_table text;
  model_tables text[] := array[
    'companies',
    'company_settings',
    'subscription_plans',
    'feature_flags',
    'staff_profiles',
    'staff_roles',
    'staff_permissions',
    'staff_documents',
    'staff_training',
    'staff_supervision',
    'staff_recognition',
    'staff_support_indicators',
    'staff_hr_records',
    'service_users',
    'service_user_contacts',
    'service_user_representatives',
    'service_user_professionals',
    'service_user_preferences',
    'capacity_assessments',
    'consent_records',
    'care_plans',
    'care_plan_sections',
    'care_plan_versions',
    'face_to_face_assessments',
    'local_authority_referral_info',
    'source_information',
    'ai_care_plan_drafts',
    'care_plan_approvals',
    'risk_assessments',
    'risk_assessment_sections',
    'risk_assessment_reviews',
    'risk_assessment_versions',
    'visits',
    'visit_schedules',
    'visit_allocations',
    'recurring_calls',
    'emergency_calls',
    'clock_in_out_records',
    'geofence_logs',
    'visit_notes',
    'visit_tasks',
    'medication_profiles',
    'medication_records',
    'mar_records',
    'emar_entries',
    'medication_administration',
    'medication_refusals',
    'missed_medication_records',
    'controlled_medication_records',
    'controlled_drug_stock_balance',
    'controlled_drug_witness_records',
    'incidents',
    'accidents',
    'near_misses',
    'safeguarding_concerns',
    'complaints',
    'compliments',
    'lessons_learned',
    'action_trackers',
    'quality_audits',
    'kpi_reports',
    'good_news_stories',
    'cqc_evidence_items',
    'behaviour_profiles',
    'behaviour_support_plans',
    'abc_behaviour_records',
    'hourly_sleep_behaviour_records',
    'restrictive_practice_records',
    'behaviour_review_actions',
    'inspector_access_requests',
    'inspector_access_sessions',
    'inspection_evidence_packs',
    'inspector_activity_logs',
    'ai_drafts',
    'ai_prompts',
    'ai_source_records',
    'ai_approvals',
    'ai_audit_logs',
    'ai_usage_logs',
    'uploaded_files',
    'file_access_logs',
    'audit_logs',
    'notifications',
    'messages',
    'tasks',
    'system_settings',
    'backup_logs'
  ];
begin
  foreach model_table in array model_tables loop
    execute format(
      'create table if not exists public.%I (
        id uuid primary key default gen_random_uuid(),
        company_id uuid not null,
        provider_id uuid,
        location_id uuid,
        record_reference text,
        payload jsonb not null default ''{}''::jsonb,
        status text not null default ''active'',
        created_by uuid,
        created_at timestamptz not null default now(),
        updated_by uuid,
        updated_at timestamptz not null default now(),
        deleted_at timestamptz
      )',
      model_table
    );

    execute format('alter table public.%I add column if not exists company_id uuid', model_table);
    execute format('alter table public.%I add column if not exists provider_id uuid', model_table);
    execute format('alter table public.%I add column if not exists location_id uuid', model_table);
    execute format('alter table public.%I add column if not exists record_reference text', model_table);
    execute format('alter table public.%I add column if not exists payload jsonb not null default ''{}''::jsonb', model_table);
    execute format('alter table public.%I add column if not exists status text not null default ''active''', model_table);
    execute format('alter table public.%I add column if not exists created_by uuid', model_table);
    execute format('alter table public.%I add column if not exists created_at timestamptz not null default now()', model_table);
    execute format('alter table public.%I add column if not exists updated_by uuid', model_table);
    execute format('alter table public.%I add column if not exists updated_at timestamptz not null default now()', model_table);
    execute format('alter table public.%I add column if not exists deleted_at timestamptz', model_table);
    execute format('alter table public.%I enable row level security', model_table);
    execute format('create index if not exists %I on public.%I(company_id, provider_id, location_id, deleted_at)', 'idx_pb_' || model_table || '_tenant', model_table);
  end loop;
end $$;

-- Compatibility note for TypeScript/API naming:
-- companyId -> company_id, createdBy -> created_by, createdAt -> created_at,
-- updatedBy -> updated_by, updatedAt -> updated_at, deletedAt -> deleted_at.

-- ---------------------------------------------------------------------------
-- Senior Management KPI & Performance Intelligence Dashboard
-- ---------------------------------------------------------------------------
-- These tables are tenant-scoped by company_id/provider_id/location_id. They
-- support dashboard snapshots, metric drill-downs, action tracking, AI draft
-- insights and care coordinator follow-up evidence. AI output remains draft
-- only until manager approval is recorded.

create table if not exists public.kpi_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_id text not null,
  company_id uuid not null,
  provider_id uuid,
  location_id uuid,
  branch_id uuid,
  period_start date not null,
  period_end date not null,
  generated_at timestamptz not null default now(),
  generated_by uuid,
  status text not null default 'Draft dashboard - manager review required',
  overall_rag text not null,
  executive_summary text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.kpi_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_id text not null,
  snapshot_id text not null,
  company_id uuid not null,
  provider_id uuid,
  location_id uuid,
  category text not null,
  metric_name text not null,
  metric_value text not null,
  metric_target text,
  rag_status text not null,
  trend_direction text,
  previous_period_value text,
  notes text,
  source_record_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.kpi_actions (
  id uuid primary key default gen_random_uuid(),
  action_id text not null,
  company_id uuid not null,
  provider_id uuid,
  location_id uuid,
  snapshot_id text not null,
  source_metric_id text not null,
  action_required text not null,
  assigned_to_user_id uuid,
  assigned_to_name text,
  priority text not null,
  due_date date,
  status text not null default 'Open',
  completed_at timestamptz,
  manager_approved boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.kpi_insights (
  id uuid primary key default gen_random_uuid(),
  insight_id text not null,
  company_id uuid not null,
  provider_id uuid,
  location_id uuid,
  snapshot_id text not null,
  insight_type text not null,
  insight_title text not null,
  insight_body text not null,
  source_record_ids jsonb not null default '[]'::jsonb,
  ai_generated boolean not null default false,
  approval_required boolean not null default true,
  reviewed_by uuid,
  approved_by uuid,
  status text not null default 'Draft - manager approval required',
  no_automatic_disciplinary_decision boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists public.coordinator_action_tracking (
  id uuid primary key default gen_random_uuid(),
  action_id text not null,
  company_id uuid not null,
  provider_id uuid,
  location_id uuid,
  coordinator_id uuid not null,
  source_type text not null,
  source_record_id text not null,
  assigned_at timestamptz not null,
  due_at timestamptz not null,
  completed_at timestamptz,
  status text not null default 'Open',
  priority text not null,
  impact_level text not null,
  rag_status text not null,
  escalation_required boolean not null default false,
  manager_reviewed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

alter table public.kpi_snapshots enable row level security;
alter table public.kpi_metrics enable row level security;
alter table public.kpi_actions enable row level security;
alter table public.kpi_insights enable row level security;
alter table public.coordinator_action_tracking enable row level security;

create index if not exists idx_kpi_snapshots_tenant on public.kpi_snapshots(company_id, provider_id, location_id, period_start, period_end, deleted_at);
create index if not exists idx_kpi_metrics_tenant on public.kpi_metrics(company_id, provider_id, location_id, snapshot_id, rag_status, deleted_at);
create index if not exists idx_kpi_actions_tenant on public.kpi_actions(company_id, provider_id, location_id, snapshot_id, status, due_date, deleted_at);
create index if not exists idx_kpi_insights_tenant on public.kpi_insights(company_id, provider_id, location_id, snapshot_id, status, deleted_at);
create index if not exists idx_coordinator_action_tracking_tenant on public.coordinator_action_tracking(company_id, provider_id, location_id, coordinator_id, status, due_at, deleted_at);

-- Required tenant-isolation test evidence table for production UAT:
create table if not exists public.production_backend_test_results (
  id uuid primary key default gen_random_uuid(),
  test_reference text not null,
  company_id uuid not null,
  tested_area text not null,
  expected_result text not null,
  actual_result text not null,
  passed boolean not null default false,
  evidence jsonb not null default '{}'::jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

alter table public.production_backend_test_results enable row level security;
create index if not exists idx_production_backend_test_results on public.production_backend_test_results(test_reference, company_id, tested_area, passed);
