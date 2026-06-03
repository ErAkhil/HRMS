"use client";

import Link from "next/link";
import { NotificationSettings } from "@/components/settings/notification-settings";
import type { SecuritySettings } from "@/lib/actions/admin";
import type { Org } from "@/lib/actions/organizations";

type SuperAdminSettingsClientProps = {
  organizations: Org[];
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
    title: "Organizations",
    description: "Create organizations, assign plans, and govern tenant-level subscriptions.",
    href: "/admin/organizations",
    badgeClass: "badge-pro",
    badgeLabel: "Platform",
  },
  {
    title: "Users & Roles",
    description: "Manage role elevation, deactivation, and department access controls.",
    href: "/admin/users",
    badgeClass: "badge-ai",
    badgeLabel: "Access",
  },
  {
    title: "Workflows",
    description: "Enable or disable automations for onboarding, approvals, and reminders.",
    href: "/admin/workflows",
    badgeClass: "badge-warning",
    badgeLabel: "Automation",
  },
  {
    title: "Security",
    description: "Review policy settings, active sessions, and authentication hardening.",
    href: "/admin/security",
    badgeClass: "badge-error",
    badgeLabel: "Risk",
  },
  {
    title: "Audit Logs",
    description: "Investigate user actions with searchable and filterable event history.",
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

function getPlanBadgeClass(plan: string) {
  if (plan === "PRO_MAX") return "badge-pro-max";
  if (plan === "PRO_PLUS") return "badge-pro-plus";
  if (plan === "PRO") return "badge-pro";
  return "badge-gray";
}

function StatCard({
  label,
  value,
  hint,
}: Readonly<{ label: string; value: string; hint: string }>) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className="text-muted mt-1">{hint}</p>
    </div>
  );
}

export function SuperAdminSettingsClient({
  organizations,
  totalUsers,
  activeUsers,
  inactiveUsers,
  totalWorkflows,
  enabledWorkflows,
  auditEventsThisMonth,
  security,
}: Readonly<SuperAdminSettingsClientProps>) {
  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Organizations"
          value={String(security.orgCount)}
          hint="Active tenant workspaces"
        />
        <StatCard
          label="Users"
          value={String(totalUsers)}
          hint={`${activeUsers} active · ${inactiveUsers} inactive`}
        />
        <StatCard
          label="Workflows"
          value={String(totalWorkflows)}
          hint={`${enabledWorkflows} currently enabled`}
        />
        <StatCard
          label="Audit Events"
          value={String(auditEventsThisMonth)}
          hint="Captured in current month"
        />
      </section>

      <section className="card-p">
        <div className="page-header">
          <div>
            <h2 className="section-title">Administration Modules</h2>
            <p className="text-muted mt-1">Open each module to configure full super admin controls.</p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-p">
          <h2 className="section-title">Organization Plans</h2>
          <p className="text-muted mt-1">Monitor workspace scale and subscription tiers across tenants.</p>

          <div className="mt-4 space-y-3">
            {organizations.length === 0 && (
              <p className="text-muted rounded-lg border border-dashed border-gray-3 p-3 dark:border-dark-3">
                No organizations found.
              </p>
            )}
            {organizations.slice(0, 6).map((org) => (
              <div
                key={org.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-2 p-3 dark:border-dark-3"
              >
                <div>
                  <p className="text-body-medium">{org.name}</p>
                  <p className="text-muted mt-0.5">
                    {org.userCount} users · {org.employeeCount} employees
                  </p>
                </div>
                <span className={`badge ${getPlanBadgeClass(org.plan)}`}>{org.plan.replace("_", " ")}</span>
              </div>
            ))}
          </div>

          <Link href="/admin/organizations" className="btn-secondary mt-4 w-full justify-center">
            Manage Organizations
          </Link>
        </section>

        <section className="card-p">
          <h2 className="section-title">Security Activity Snapshot</h2>
          <p className="text-muted mt-1">Recent authenticated sessions across the entire platform.</p>

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
                <p className="text-muted mt-1">{login.orgName} · Last login: {formatRelativeDate(login.lastLoginAt)}</p>
              </div>
            ))}
          </div>

          <Link href="/admin/security" className="btn-secondary mt-4 w-full justify-center">
            Open Security Settings
          </Link>
        </section>
      </div>

      <section className="card-p">
        <h2 className="section-title">Notification Preferences</h2>
        <p className="text-muted mt-1">
          Configure browser push notifications for urgent admin tasks, approvals, and workflow alerts.
        </p>
        <div className="mt-4">
          <NotificationSettings />
        </div>
      </section>
    </div>
  );
}
