import * as Icons from "../icons";

// roles: which roles can see this item (undefined = all roles)
// minPlan: minimum plan required (undefined = all plans)

export const NAV_DATA = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          { title: "My Dashboard",       url: "/",                       roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"] },
          { title: "Manager View",        url: "/dashboard/manager",      roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
          { title: "Leadership View",     url: "/dashboard/leadership",   roles: ["SUPER_ADMIN","HR_ADMIN"] },
        ],
      },
      {
        title: "Employees",
        icon: Icons.UsersIcon,
        roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"],
        items: [
          { title: "Directory",  url: "/employees",          roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
          { title: "Profiles",   url: "/employees/profile",  roles: ["SUPER_ADMIN","HR_ADMIN"] },
          { title: "Org Chart",  url: "/employees/org-chart",roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
        ],
      },
      {
        title: "Attendance",
        icon: Icons.ClockIcon,
        items: [
          { title: "Overview",    url: "/attendance",             roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"] },
          { title: "Scheduling",  url: "/attendance/scheduling",  roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
          { title: "Reports",     url: "/attendance/reports",     roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
        ],
      },
      {
        title: "Leave",
        icon: Icons.LeaveIcon,
        items: [
          { title: "My Leave",       url: "/leave",           roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"] },
          { title: "Team Calendar",  url: "/leave/calendar",  roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
          { title: "Approvals",      url: "/leave/approvals", roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"] },
        ],
      },
      {
        title: "Payroll",
        icon: Icons.PayrollIcon,
        minPlan: "PRO",
        items: [
          { title: "Overview",          url: "/payroll",                roles: ["SUPER_ADMIN","HR_ADMIN"],            minPlan: "PRO" },
          { title: "Payslips",          url: "/payroll/payslips",       roles: ["SUPER_ADMIN","HR_ADMIN","EMPLOYEE"], minPlan: "PRO" },
          { title: "Reimbursements",    url: "/payroll/reimbursements", roles: ["SUPER_ADMIN","HR_ADMIN","EMPLOYEE"], minPlan: "PRO" },
        ],
      },
    ],
  },
  {
    label: "WORKSPACE",
    items: [
      {
        title: "Recruitment",
        icon: Icons.RecruitmentIcon,
        roles: ["SUPER_ADMIN","HR_ADMIN"],
        minPlan: "PRO_PLUS",
        items: [
          { title: "Pipeline",      url: "/recruitment",            roles: ["SUPER_ADMIN","HR_ADMIN"], minPlan: "PRO_PLUS" },
          { title: "Candidates",    url: "/recruitment/candidates", roles: ["SUPER_ADMIN","HR_ADMIN"], minPlan: "PRO_PLUS" },
          { title: "Job Postings",  url: "/recruitment/jobs",       roles: ["SUPER_ADMIN","HR_ADMIN"], minPlan: "PRO_PLUS" },
        ],
      },
      {
        title: "Onboarding",
        icon: Icons.OnboardingIcon,
        roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"],
        minPlan: "PRO_MAX",
        items: [
          { title: "Active",        url: "/onboarding",             roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"], minPlan: "PRO_MAX" },
          { title: "Offboarding",   url: "/onboarding/offboarding", roles: ["SUPER_ADMIN","HR_ADMIN"],          minPlan: "PRO_MAX" },
        ],
      },
      {
        title: "Collaboration",
        icon: Icons.CollaborationIcon,
        minPlan: "PRO_MAX",
        items: [
          { title: "Channels",         url: "/collaboration",          roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO_MAX" },
          { title: "Direct Messages",  url: "/collaboration/messages", roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO_MAX" },
          { title: "Meetings",         url: "/collaboration/meetings", roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO_MAX" },
        ],
      },
      {
        title: "Tasks & Projects",
        icon: Icons.TasksIcon,
        minPlan: "PRO",
        items: [
          { title: "My Tasks",   url: "/tasks",          roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO" },
          { title: "Projects",   url: "/tasks/projects", roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"],           minPlan: "PRO" },
          { title: "Kanban",     url: "/tasks/kanban",   roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"],minPlan: "PRO" },
        ],
      },
    ],
  },
  {
    label: "INSIGHTS",
    items: [
      {
        title: "Performance",
        icon: Icons.PerformanceIcon,
        minPlan: "PRO",
        items: [
          { title: "KPIs & Goals", url: "/performance",            roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO" },
          { title: "Reviews",      url: "/performance/reviews",    roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"],           minPlan: "PRO" },
          { title: "Analytics",    url: "/performance/analytics",  roles: ["SUPER_ADMIN","HR_ADMIN"],                    minPlan: "PRO_PLUS" },
        ],
      },
      {
        title: "Learning",
        icon: Icons.LearningIcon,
        minPlan: "PRO_PLUS",
        items: [
          { title: "Dashboard",       url: "/learning",               roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO_PLUS" },
          { title: "Courses",         url: "/learning/courses",       roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO_PLUS" },
          { title: "Certifications",  url: "/learning/certifications",roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER","EMPLOYEE"], minPlan: "PRO_PLUS" },
        ],
      },
      {
        title: "Reports",
        icon: Icons.ReportsIcon,
        roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"],
        minPlan: "PRO_PLUS",
        items: [
          { title: "Workforce",        url: "/reports",           roles: ["SUPER_ADMIN","HR_ADMIN","MANAGER"], minPlan: "PRO_PLUS" },
          { title: "Payroll Insights", url: "/reports/payroll",   roles: ["SUPER_ADMIN","HR_ADMIN"],           minPlan: "PRO_PLUS" },
          { title: "Analytics",        url: "/reports/analytics", roles: ["SUPER_ADMIN","HR_ADMIN"],           minPlan: "PRO_PLUS" },
        ],
      },
      {
        title: "AI Assistant",
        icon: Icons.AIAssistantIcon,
        url: "/ai",
        minPlan: "PRO_MAX",
        items: [],
      },
    ],
  },
  {
    label: "SYSTEM",
    items: [
      {
        title: "Admin",
        icon: Icons.AdminIcon,
        roles: ["SUPER_ADMIN","HR_ADMIN"],
        items: [
          { title: "Organizations",  url: "/admin/organizations", roles: ["SUPER_ADMIN"] },
          { title: "Users & Roles",  url: "/admin/users",         roles: ["SUPER_ADMIN","HR_ADMIN"] },
          { title: "Workflows",      url: "/admin/workflows",     roles: ["SUPER_ADMIN","HR_ADMIN"] },
          { title: "Security",       url: "/admin/security",      roles: ["SUPER_ADMIN"] },
          { title: "Audit Logs",     url: "/admin/audit",         roles: ["SUPER_ADMIN","HR_ADMIN"] },
        ],
      },
    ],
  },
];

export type NavItemRole = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";
export type NavItemPlan = "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX";
