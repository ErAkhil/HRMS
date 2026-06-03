import { PageHeader } from "@/components/ui/page-header";
import { getAuditLogs } from "@/lib/actions/audit";
import {
  getOrgUsers,
  getSecuritySettings,
  getWorkflows,
} from "@/lib/actions/admin";
import { getOrganizations } from "@/lib/actions/organizations";
import { requireRole } from "@/lib/session";
import { OrgAdminSettingsClient } from "./_components/org-admin-settings-client";
import { SuperAdminSettingsClient } from "./_components/super-admin-settings-client";

export const metadata = {
  title: "Settings | Monja HRMS",
  description: "Administration controls based on your role scope",
};

function getCurrentMonthDateRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const format = (date: Date) => date.toISOString().slice(0, 10);

  return {
    from: format(start),
    to: format(now),
  };
}

export default async function SuperAdminSettingsPage() {
  const user = await requireRole("SUPER_ADMIN", "HR_ADMIN");

  const { from, to } = getCurrentMonthDateRange();

  if (user.role === "SUPER_ADMIN") {
    const [organizations, users, workflows, security, auditLogs] = await Promise.all([
      getOrganizations(),
      getOrgUsers(),
      getWorkflows(),
      getSecuritySettings(),
      getAuditLogs({ from, to, type: "All" }),
    ]);

    const enabledWorkflows = workflows.filter((workflow) => workflow.isEnabled).length;
    const inactiveUsers = Math.max(users.length - security.activeCount, 0);

    return (
      <div className="page-container">
        <PageHeader
          title="Super Admin Settings"
          subtitle="Platform-level controls across all organizations and system governance"
          badge={<span className="badge badge-error">Platform Scope</span>}
        />

        <SuperAdminSettingsClient
          organizations={organizations}
          totalUsers={users.length}
          activeUsers={security.activeCount}
          inactiveUsers={inactiveUsers}
          totalWorkflows={workflows.length}
          enabledWorkflows={enabledWorkflows}
          auditEventsThisMonth={auditLogs.length}
          security={security}
        />
      </div>
    );
  }

  const [users, workflows, security, auditLogs] = await Promise.all([
    getOrgUsers(),
    getWorkflows(),
    getSecuritySettings(),
    getAuditLogs({ from, to, type: "All" }),
  ]);

  const enabledWorkflows = workflows.filter((workflow) => workflow.isEnabled).length;
  const inactiveUsers = Math.max(users.length - security.activeCount, 0);

  return (
    <div className="page-container">
      <PageHeader
        title="Organization Admin Settings"
        subtitle="Organization-level controls for users, workflows, security, and compliance"
        badge={<span className="badge badge-ai">Organization Scope</span>}
      />

      <OrgAdminSettingsClient
        totalUsers={users.length}
        activeUsers={security.activeCount}
        inactiveUsers={inactiveUsers}
        totalWorkflows={workflows.length}
        enabledWorkflows={enabledWorkflows}
        auditEventsThisMonth={auditLogs.length}
        security={security}
      />
    </div>
  );
}
