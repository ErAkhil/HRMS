import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "MAIN",
    items: [
      {
        title: "Dashboard",
        icon: Icons.HomeIcon,
        items: [
          { title: "Employee Dashboard", url: "/" },
          { title: "Manager Dashboard", url: "/dashboard/manager" },
          { title: "HR Dashboard", url: "/dashboard/hr" },
          { title: "Leadership", url: "/dashboard/leadership" },
        ],
      },
      {
        title: "Employees",
        icon: Icons.UsersIcon,
        items: [
          { title: "Directory", url: "/employees" },
          { title: "Profiles", url: "/employees/profile" },
          { title: "Org Chart", url: "/employees/org-chart" },
        ],
      },
      {
        title: "Attendance",
        icon: Icons.ClockIcon,
        items: [
          { title: "Overview", url: "/attendance" },
          { title: "Scheduling", url: "/attendance/scheduling" },
          { title: "Reports", url: "/attendance/reports" },
        ],
      },
      {
        title: "Leave",
        icon: Icons.LeaveIcon,
        items: [
          { title: "My Leave", url: "/leave" },
          { title: "Team Calendar", url: "/leave/calendar" },
          { title: "Approvals", url: "/leave/approvals" },
        ],
      },
      {
        title: "Payroll",
        icon: Icons.PayrollIcon,
        items: [
          { title: "Overview", url: "/payroll" },
          { title: "Payslips", url: "/payroll/payslips" },
          { title: "Reimbursements", url: "/payroll/reimbursements" },
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
        items: [
          { title: "Pipeline", url: "/recruitment" },
          { title: "Candidates", url: "/recruitment/candidates" },
          { title: "Job Postings", url: "/recruitment/jobs" },
        ],
      },
      {
        title: "Onboarding",
        icon: Icons.OnboardingIcon,
        items: [
          { title: "Active", url: "/onboarding" },
          { title: "Offboarding", url: "/onboarding/offboarding" },
        ],
      },
      {
        title: "Collaboration",
        icon: Icons.CollaborationIcon,
        items: [
          { title: "Channels", url: "/collaboration" },
          { title: "Direct Messages", url: "/collaboration/messages" },
          { title: "Meetings", url: "/collaboration/meetings" },
        ],
      },
      {
        title: "Tasks & Projects",
        icon: Icons.TasksIcon,
        items: [
          { title: "My Tasks", url: "/tasks" },
          { title: "Projects", url: "/tasks/projects" },
          { title: "Kanban", url: "/tasks/kanban" },
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
        items: [
          { title: "KPIs & Goals", url: "/performance" },
          { title: "Reviews", url: "/performance/reviews" },
          { title: "Analytics", url: "/performance/analytics" },
        ],
      },
      {
        title: "Learning",
        icon: Icons.LearningIcon,
        items: [
          { title: "Dashboard", url: "/learning" },
          { title: "Courses", url: "/learning/courses" },
          { title: "Certifications", url: "/learning/certifications" },
        ],
      },
      {
        title: "Reports",
        icon: Icons.ReportsIcon,
        items: [
          { title: "Workforce", url: "/reports" },
          { title: "Payroll Insights", url: "/reports/payroll" },
          { title: "Analytics", url: "/reports/analytics" },
        ],
      },
      {
        title: "AI Assistant",
        icon: Icons.AIAssistantIcon,
        url: "/ai",
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
        items: [
          { title: "Users & Roles", url: "/admin/users" },
          { title: "Workflows", url: "/admin/workflows" },
          { title: "Security", url: "/admin/security" },
          { title: "Audit Logs", url: "/admin/audit" },
        ],
      },
    ],
  },
];
