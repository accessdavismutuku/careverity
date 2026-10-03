"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { TrainingAcademyLogo } from "@/components/training-academy-logo";
import { cx } from "@/lib/format";
import { canAccessRoute, getDefaultRouteForRole, isProtectedPath } from "@/lib/rbac";
import type { UserRole } from "@/lib/types";

const demoRoles: UserRole[] = ["Super Admin", "Manager", "HR / Training Coordinator", "Staff / Learner"];
const demoRoleStorageKey = "lqcs-demo-role";

const navSections = [
  {
    title: "Dashboard",
    items: [
      { label: "Manager Dashboard", href: "/manager-dashboard", mark: "MD" },
      { label: "Learner Dashboard", href: "/learner-dashboard", mark: "LD" }
    ]
  },
  {
    title: "Certificates",
    items: [
      { label: "View Certificates", href: "/certificates", mark: "CT" },
      { label: "Archived Certificates", href: "/certificates#archived", mark: "AC" },
      { label: "Webinar Certificates", href: "/webinars", mark: "WC" }
    ]
  },
  {
    title: "E-Learning Course Management",
    items: [
      { label: "Enrol Courses", href: "/course-library", mark: "EN" },
      { label: "Course Library", href: "/course-library", mark: "CL" },
      { label: "Quiz Review", href: "/quiz-admin", mark: "QR" },
      { label: "Course Reports", href: "/reports", mark: "CR" },
      { label: "Course Groups", href: "/course-library#groups", mark: "CG" }
    ]
  },
  {
    title: "User Management",
    items: [
      { label: "Add User", href: "/users#add", mark: "AU" },
      { label: "Browse Users", href: "/users", mark: "BU" },
      { label: "User Reports", href: "/reports#users", mark: "UR" },
      { label: "Deactivated Users", href: "/users#inactive", mark: "DU" }
    ]
  },
  {
    title: "Compliance Management",
    items: [
      { label: "Training Matrix", href: "/training-matrix", mark: "TM" },
      { label: "Expired Training", href: "/reports#expired", mark: "ET" },
      { label: "Training Due Soon", href: "/reports#due", mark: "DS" },
      { label: "Policy Acknowledgements", href: "/policies", mark: "PA" },
      { label: "Competency Records", href: "/competency-records", mark: "CO" },
      { label: "CQC Evidence Pack", href: "/reports#cqc", mark: "CQ" }
    ]
  },
  {
    title: "Webinar Management",
    items: [
      { label: "Book Webinars", href: "/webinars", mark: "BW" },
      { label: "Webinar Reports", href: "/webinars#reports", mark: "WR" }
    ]
  },
  {
    title: "Settings",
    items: [
      { label: "Accreditation Wording", href: "/settings/accreditation", mark: "AW" },
      { label: "Company Profile", href: "/settings/accreditation#company-profile", mark: "CP" }
    ]
  }
];

interface PortalShellProps {
  children: ReactNode;
}

export function PortalShell({ children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [demoRole, setDemoRole] = useState<UserRole>("Super Admin");
  const [roleLoaded, setRoleLoaded] = useState(false);
  const visibleNavSections = useMemo(
    () =>
      navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => canAccessRoute(demoRole, item.href.split("#")[0]))
        }))
        .filter((section) => section.items.length > 0),
    [demoRole]
  );
  const flatVisibleItems = visibleNavSections.flatMap((section) => section.items.map((item) => ({ ...item, section: section.title })));
  const mobileNavValue = flatVisibleItems.find((item) => item.href.split("#")[0] === pathname)?.href ?? "";
  const homeHref = getDefaultRouteForRole(demoRole);

  useEffect(() => {
    const storedRole = window.localStorage.getItem(demoRoleStorageKey) as UserRole | null;
    if (storedRole && demoRoles.includes(storedRole)) {
      setDemoRole(storedRole);
    }
    setRoleLoaded(true);
  }, []);

  useEffect(() => {
    if (!roleLoaded || !isProtectedPath(pathname) || canAccessRoute(demoRole, pathname)) {
      return;
    }

    router.replace(getDefaultRouteForRole(demoRole));
  }, [demoRole, pathname, roleLoaded, router]);

  function handleDemoRoleChange(role: UserRole) {
    setDemoRole(role);
    window.localStorage.setItem(demoRoleStorageKey, role);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="print-hide fixed inset-y-0 left-0 z-20 hidden w-72 overflow-y-auto bg-navy p-4 text-white lg:block">
        <Link className="focus-ring flex items-center gap-3 rounded-lg p-2" href={homeHref}>
          <div className="flex h-16 w-44 shrink-0 items-center justify-center rounded-md bg-white p-1.5">
            <TrainingAcademyLogo imageClassName="max-h-14" priority width={260} height={80} showFallbackSubtitle={false} />
          </div>
          <div>
            <p className="text-sm font-bold">CareVerity Training Academy</p>
            <p className="text-xs text-white/60">Compliance evidence portal</p>
          </div>
        </Link>
        <label className="mt-4 block px-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">Demo role</span>
          <select
            className="focus-ring mt-2 w-full rounded-md border border-white/10 bg-white/10 px-2 py-2 text-sm font-semibold text-white"
            onChange={(event) => handleDemoRoleChange(event.target.value as UserRole)}
            value={demoRole}
          >
            {demoRoles.map((role) => (
              <option className="text-ink" key={role}>
                {role}
              </option>
            ))}
          </select>
        </label>
        <nav aria-label="Role-based primary navigation" className="mt-6 space-y-5">
          {visibleNavSections.map((section) => (
            <div key={section.title}>
              <p className="px-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white/50">{section.title}</p>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const baseHref = item.href.split("#")[0];
                  const active = pathname === baseHref || pathname.startsWith(`${baseHref}/`);

                  return (
                    <Link
                      className={cx(
                        "focus-ring flex items-center gap-3 rounded-md px-2 py-2 text-sm font-semibold text-white/80",
                        active && "bg-white/10 text-white"
                      )}
                      href={item.href}
                      key={`${section.title}-${item.label}`}
                    >
                      <span className="grid h-7 w-7 place-items-center rounded-md bg-white/10 text-[10px] font-black">{item.mark}</span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="print-hide sticky top-0 z-10 border-b border-lqcs-line bg-white/95 px-4 py-3 backdrop-blur md:px-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link className="focus-ring flex items-center gap-3 rounded-md lg:hidden" href={homeHref}>
              <span className="flex h-12 w-40 shrink-0 items-center justify-center rounded-md border border-lqcs-line bg-white p-1.5">
                <TrainingAcademyLogo imageClassName="max-h-10" priority width={230} height={72} showFallbackSubtitle={false} />
              </span>
              <span className="font-bold text-ink">CareVerity Training Academy</span>
            </Link>
            <div className="hidden items-center gap-3 lg:flex">
              <div className="flex h-12 w-44 items-center justify-center rounded-md border border-lqcs-line bg-white p-1.5">
                <TrainingAcademyLogo imageClassName="max-h-10" priority width={250} height={78} showFallbackSubtitle={false} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">London Quality Care Services Ltd</p>
                <p className="text-sm font-bold text-ink">Version 1 demo workspace</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <label className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Demo role</span>
                <select
                  className="focus-ring rounded-md border border-lqcs-line bg-white px-2 py-2 text-sm font-semibold text-ink"
                  aria-label="Select demo role for role-based navigation"
                  onChange={(event) => handleDemoRoleChange(event.target.value as UserRole)}
                  value={demoRole}
                >
                  {demoRoles.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </label>
              <Link className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm font-semibold text-ink" href="/profile">
                My profile
              </Link>
              <Link className="focus-ring rounded-md bg-lqcs-blue px-3 py-2 text-sm font-semibold text-white" href="/login">
                Logout
              </Link>
            </div>
          </div>
        </header>
        <nav className="print-hide border-b border-lqcs-line bg-white px-4 py-3 lg:hidden" aria-label="Mobile role-based navigation">
          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">Go to page</span>
            <select
              className="focus-ring mt-2 w-full rounded-md border border-lqcs-line bg-white px-3 py-2 text-sm font-semibold text-ink"
              onChange={(event) => router.push(event.target.value)}
              value={mobileNavValue}
            >
              <option value="" disabled>
                Select page
              </option>
              {flatVisibleItems.map((item) => (
                <option key={`${item.section}-${item.label}`} value={item.href}>
                  {item.section} - {item.label}
                </option>
              ))}
            </select>
          </label>
        </nav>
        <main className="px-4 py-6 md:px-6 lg:px-8">
          <div className="mb-4 rounded-lg border border-lqcs-line bg-white px-4 py-3 text-sm leading-6 text-slate-600 shadow-soft">
            <span className="font-bold text-ink">{demoRole}</span> demo view. Navigation is filtered to the role; Supabase RLS must enforce the same rules on live data.
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
