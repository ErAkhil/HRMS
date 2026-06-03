"use client";

import Link from "next/link";
import { NotificationSettings } from "@/components/settings/notification-settings";
import type { SecuritySettings } from "@/lib/actions/admin";

type OrgAdminSettingsClientProps = {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  totalWorkflows: number;
  enabledWorkflows: number;
  auditEventsThisMonth: number;
  security: SecuritySettings;
};

type AdminModule = {
  title: string;
  description: string;
  href: string;
  badgeClass: string;
  badgeLabel: string;
};

const adminModules: AdminModule[] = [
  {
    title: "Users & Roles",
    description: "Maintain user status, role assignments, and workforce access controls.",
    href: "/admin/users",
    badgeClass: "badge-ai",
    badgeLabel: "Access",
  },
  {
    title: "Workflows",
    description: "Manage organization automations for approvals, onboarding, and reminders.",
    href: "/admin/workflows",
    badgeClass: "badge-warning",
    badgeLabel: "Automation",
  },
  {
    title: "Security",
    description: "Configure password and session policies for your organization.",
    href: "/admin/security",
    badgeClass: "badge-error",
    badgeLabel: "Security",
  },
  {
    title: "Audit Logs",
    description: "Track security-sensitive actions and compliance events in your org.",
    href: "/admin/audit",
    badgeClass: "badge-info",
    badgeLabel: "Compliance",
  },
];

function formatRelativeDate(value: string | null) {
  if (!value) return "Never";

  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();

  if (diffMs < 60_000) return "Just now";

  const diffMinutes = Math.floor(diffMs / 60_000);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatCard({ label, value, hint }: Readonly<{ label: string; value: string; hint: string }>) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="text-muted mt-1">{hint}</p>
    </div>
  );
}

export function OrgAdminSettingsClient({
  totalUsers,
  activeUsers,
  inactiveUsers,
  totalWorkflows,
  enabledWorkflows,
  auditEventsThisMonth,
  security,
}: Readonly<OrgAdminSettingsClientProps>) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Organization" value={security.org.name} hint={`Plan: ${security.org.plan.replace("_", " ")}`} />
        <StatCard label="Users" value={String(totalUsers)} hint={`${activeUsers} active · ${inactiveUsers} inactive`} />
        <StatCard label="Workflows" value={String(totalWorkflows)} hint={`${enabledWorkflows} currently enabled`} />
        <StatCard label="Audit Events" value={String(auditEventsThisMonth)} hint="Captured in current month" />
      </section>

      <section className="card-p">
        <h2 className="section-title">Organization Administration</h2>
        <p className="text-muted mt-1">Manage your organization-level settings and operations.</p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {adminModules.map((module) => (
            <article key={module.href} className="card border border-gray-2 p-4 dark:border-dark-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-body-medium">{module.title}</h3>
                <span className={`badge ${module.badgeClass}`}>{module.badgeLabel}</span>
              </div>
              <p className="text-muted mt-2 min-h-10">{module.description}</p>
              <Link href={module.href} className="btn-primary mt-4 w-full justify-center">
                Open Module
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="card-p">
        <h2 className="section-title">Recent Login Activity</h2>
        <p className="text-muted mt-1">Latest authenticated users in your organization.</p>

        <div className="mt-4 space-y-3">
          {security.recentLogins.length === 0 && (
            <p className="text-muted rounded-lg border border-dashed border-gray-3 p-3 dark:border-dark-3">
              No login activity has been recorded yet.
            </p>
          )}
          {security.recentLogins.slice(0, 5).map((login) => (
            <div
              key={`${login.email}-${login.lastLoginAt ?? "never"}`}
              className="rounded-lg border border-gray-2 p-3 dark:border-dark-3"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-body-medium">{login.email}</p>
                <span className="badge badge-gray">{login.role.replace("_", " ")}</span>
              </div>
              <p className="text-muted mt-1">Last login: {formatRelativeDate(login.lastLoginAt)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="card-p">
        <h2 className="section-title">Notification Preferences</h2>
        <p className="text-muted mt-1">
          Configure browser push notifications for approvals, security alerts, and workflow updates.
        </p>
        <div className="mt-4">
          <NotificationSettings />
        </div>
      </section>
    </div>
  );
}
