export type DepartmentKey =
  | "Engineering"
  | "Product"
  | "Sales"
  | "HR"
  | "Finance"
  | "Marketing";

export type StatusKey = "online" | "offline" | "away";

export interface Employee {
  id: number;
  name: string;
  title: string;
  department: DepartmentKey;
  email: string;
  phone: string;
  location: string;
  status: StatusKey;
  skills: string[];
  avatar: string;
  joinDate: string;
  manager: string;
  managerAvatar: string;
}

/** Employee shape returned by getEmployees() server action */
export interface EmployeeWithDept {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  title: string;
  employeeCode: string;
  employmentType: string;
  avatarUrl: string | null;
  isActive: boolean;
  startDate: string;
  department: { name: string } | null;
}

/** Normalised display shape used by card/row components */
export interface EmployeeDisplay {
  id: string;
  name: string;
  title: string;
  department: string;
  email: string;
  avatar: string;
  status: StatusKey;
}

export function toEmployeeDisplay(e: EmployeeWithDept): EmployeeDisplay {
  return {
    id: e.id,
    name: `${e.firstName} ${e.lastName}`,
    title: e.title,
    department: e.department?.name ?? "—",
    email: e.email,
    avatar: e.avatarUrl ?? "/images/user/user-03.png",
    status: "offline" as StatusKey,
  };
}

export const DEPARTMENT_COLORS: Record<DepartmentKey, string> = {
  Engineering:
    "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Product:
    "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Sales:
    "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  HR: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Finance:
    "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Marketing:
    "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
};

export const STATUS_COLORS: Record<StatusKey, string> = {
  online: "bg-emerald",
  away: "bg-amber",
  offline: "bg-gray-400 dark:bg-dark-5",
};

export const EMPLOYEES: Employee[] = [
  {
    id: 1,
    name: "Sarah Mitchell",
    title: "Sr. Software Engineer",
    department: "Engineering",
    email: "sarah.mitchell@acme.com",
    phone: "+1 (555) 012-3456",
    location: "San Francisco, CA",
    status: "online",
    skills: ["React", "TypeScript", "Node.js"],
    avatar: "/images/user/user-01.png",
    joinDate: "Mar 14, 2022",
    manager: "David Kim",
    managerAvatar: "/images/user/user-13.png",
  },
  {
    id: 2,
    name: "Daniel Park",
    title: "Product Manager",
    department: "Product",
    email: "daniel.park@acme.com",
    phone: "+1 (555) 023-4567",
    location: "New York, NY",
    status: "online",
    skills: ["Roadmapping", "Agile", "Analytics"],
    avatar: "/images/user/user-02.png",
    joinDate: "Jun 3, 2021",
    manager: "Rachel Green",
    managerAvatar: "/images/user/user-14.png",
  },
  {
    id: 3,
    name: "Priya Sharma",
    title: "UX Designer",
    department: "Product",
    email: "priya.sharma@acme.com",
    phone: "+1 (555) 034-5678",
    location: "Austin, TX",
    status: "away",
    skills: ["Figma", "User Research", "Prototyping"],
    avatar: "/images/user/user-03.png",
    joinDate: "Nov 7, 2022",
    manager: "Rachel Green",
    managerAvatar: "/images/user/user-14.png",
  },
  {
    id: 4,
    name: "James Williams",
    title: "Sales Lead",
    department: "Sales",
    email: "james.williams@acme.com",
    phone: "+1 (555) 045-6789",
    location: "Chicago, IL",
    status: "offline",
    skills: ["CRM", "Negotiation", "Salesforce"],
    avatar: "/images/user/user-04.png",
    joinDate: "Jan 15, 2020",
    manager: "Michael Chen",
    managerAvatar: "/images/user/user-25.png",
  },
  {
    id: 5,
    name: "Elena Torres",
    title: "HR Manager",
    department: "HR",
    email: "elena.torres@acme.com",
    phone: "+1 (555) 056-7890",
    location: "Miami, FL",
    status: "online",
    skills: ["Recruiting", "Compliance", "HRIS"],
    avatar: "/images/user/user-05.png",
    joinDate: "Sep 2, 2019",
    manager: "Michael Chen",
    managerAvatar: "/images/user/user-25.png",
  },
  {
    id: 6,
    name: "Arjun Mehta",
    title: "Financial Analyst",
    department: "Finance",
    email: "arjun.mehta@acme.com",
    phone: "+1 (555) 067-8901",
    location: "Seattle, WA",
    status: "online",
    skills: ["Excel", "FP&A", "SQL"],
    avatar: "/images/user/user-06.png",
    joinDate: "Apr 19, 2023",
    manager: "Robert Stone",
    managerAvatar: "/images/user/user-16.png",
  },
  {
    id: 7,
    name: "Lisa Chen",
    title: "Marketing Head",
    department: "Marketing",
    email: "lisa.chen@acme.com",
    phone: "+1 (555) 078-9012",
    location: "Los Angeles, CA",
    status: "away",
    skills: ["SEO", "Content Strategy", "HubSpot"],
    avatar: "/images/user/user-07.png",
    joinDate: "Feb 10, 2021",
    manager: "Michael Chen",
    managerAvatar: "/images/user/user-25.png",
  },
  {
    id: 8,
    name: "Marcus Johnson",
    title: "Backend Engineer",
    department: "Engineering",
    email: "marcus.johnson@acme.com",
    phone: "+1 (555) 089-0123",
    location: "Boston, MA",
    status: "online",
    skills: ["Go", "Kubernetes", "PostgreSQL"],
    avatar: "/images/user/user-08.png",
    joinDate: "Jul 28, 2022",
    manager: "David Kim",
    managerAvatar: "/images/user/user-13.png",
  },
  {
    id: 9,
    name: "Zara Ahmed",
    title: "DevOps Engineer",
    department: "Engineering",
    email: "zara.ahmed@acme.com",
    phone: "+1 (555) 090-1234",
    location: "Denver, CO",
    status: "offline",
    skills: ["AWS", "Terraform", "CI/CD"],
    avatar: "/images/user/user-09.png",
    joinDate: "Oct 11, 2023",
    manager: "David Kim",
    managerAvatar: "/images/user/user-13.png",
  },
  {
    id: 10,
    name: "Tom Bradley",
    title: "Account Executive",
    department: "Sales",
    email: "tom.bradley@acme.com",
    phone: "+1 (555) 101-2345",
    location: "Atlanta, GA",
    status: "online",
    skills: ["B2B Sales", "Negotiation", "HubSpot"],
    avatar: "/images/user/user-10.png",
    joinDate: "Aug 5, 2022",
    manager: "James Williams",
    managerAvatar: "/images/user/user-04.png",
  },
  {
    id: 11,
    name: "Nina Patel",
    title: "Recruiter",
    department: "HR",
    email: "nina.patel@acme.com",
    phone: "+1 (555) 112-3456",
    location: "Phoenix, AZ",
    status: "online",
    skills: ["Sourcing", "LinkedIn", "ATS"],
    avatar: "/images/user/user-11.png",
    joinDate: "May 30, 2023",
    manager: "Elena Torres",
    managerAvatar: "/images/user/user-05.png",
  },
  {
    id: 12,
    name: "Kevin Lee",
    title: "Data Analyst",
    department: "Finance",
    email: "kevin.lee@acme.com",
    phone: "+1 (555) 123-4567",
    location: "Portland, OR",
    status: "away",
    skills: ["Python", "Tableau", "Data Modeling"],
    avatar: "/images/user/user-12.png",
    joinDate: "Dec 12, 2022",
    manager: "Robert Stone",
    managerAvatar: "/images/user/user-16.png",
  },
];
