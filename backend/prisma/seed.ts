import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as fs from "node:fs";
import * as path from "node:path";

(function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = /^([^=]+)=(.*)$/.exec(line);
    if (m && !process.env[m[1].trim()])
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
  }
})();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

type OrgUserRole = "SUPER_ADMIN" | "MANAGER" | "EMPLOYEE";

// â”€â”€â”€ Shared helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const PAYROLL_MONTHS = [
  { month: 11, year: 2025 }, { month: 12, year: 2025 },
  { month: 1,  year: 2026 }, { month: 2,  year: 2026 },
  { month: 3,  year: 2026 }, { month: 4,  year: 2026 },
];

async function seedLeaveBalances(empIds: string[]) {
  const year = new Date().getFullYear();
  const types = [
    { type: "ANNUAL" as const, total: 24 },
    { type: "SICK"   as const, total: 12 },
    { type: "CASUAL" as const, total: 6  },
  ];
  const records = empIds.flatMap((id) =>
    types.map((lt) => ({ employeeId: id, leaveType: lt.type, year, total: lt.total, used: Math.floor(Math.random() * 5) }))
  );
  await db.leaveBalance.createMany({ data: records, skipDuplicates: true });
}

type AttendanceStatusValue = "PRESENT" | "ABSENT" | "LATE" | "REMOTE" | "HALF_DAY";

function pickStatus(d: number, r: number): AttendanceStatusValue {
  if (d === 0) return "PRESENT";
  if (r < 0.05) return "ABSENT";
  if (r < 0.12) return "LATE";
  if (r < 0.18) return "REMOTE";
  if (r < 0.2)  return "HALF_DAY";
  return "PRESENT";
}

function attendanceCheckIn(date: Date, status: AttendanceStatusValue): Date | null {
  if (status === "ABSENT") return null;
  const offsetHours = status === "LATE" ? 10.5 : 9;
  return new Date(date.getTime() + offsetHours * 3600000);
}

function attendanceCheckOut(date: Date, status: AttendanceStatusValue): Date | null {
  if (status === "ABSENT") return null;
  if (status === "HALF_DAY") return new Date(date.getTime() + 13 * 3600000);
  return new Date(date.getTime() + 18 * 3600000);
}

function attendanceHours(status: AttendanceStatusValue): number | null {
  if (status === "ABSENT") return null;
  if (status === "HALF_DAY") return 4;
  if (status === "LATE") return 7.5;
  return 9;
}

async function seedAttendance(empIds: string[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const records: { employeeId: string; date: Date; checkIn: Date | null; checkOut: Date | null; status: AttendanceStatusValue; hoursWorked: number | null }[] = [];
  for (let d = 0; d < 30; d++) {
    const date = new Date(today);
    date.setDate(date.getDate() - d);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    for (const id of empIds) {
      const status = pickStatus(d, Math.random());
      records.push({ employeeId: id, date, checkIn: attendanceCheckIn(date, status), checkOut: attendanceCheckOut(date, status), status, hoursWorked: attendanceHours(status) });
    }
  }
  await db.attendanceRecord.createMany({ data: records, skipDuplicates: true });
}

async function seedPayroll(orgId: string, emps: { empId: string; salary: number }[]) {
  for (const { month, year } of PAYROLL_MONTHS) {
    let totalGross = 0, totalDed = 0;
    const slips = emps.map(({ empId, salary }) => {
      const hra = salary * 0.4, allow = salary * 0.1, gross = salary + hra + allow;
      const tax = gross * 0.1, pf = salary * 0.12;
      totalGross += gross; totalDed += tax + pf;
      return { employeeId: empId, basicSalary: salary, hra, allowances: allow, grossPay: gross, taxDeduction: tax, pfDeduction: pf, otherDeductions: 0, netPay: gross - tax - pf };
    });
    const run = await db.payrollRun.create({
      data: { orgId, month, year, status: "PROCESSED", totalGross, totalNet: totalGross - totalDed, totalDeductions: totalDed, processedAt: new Date(year, month - 1, 28) },
    });
    await db.payslip.createMany({ data: slips.map((s) => ({ ...s, payrollRunId: run.id })) });
  }
}

// â”€â”€â”€ Org 1: Monja Technologies â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const UNI_DEPTS = [
  { name: "Engineering",      color: "#6366F1", description: "Software development, platform infrastructure, and DevOps" },
  { name: "Product",          color: "#8B5CF6", description: "Product strategy, design, and user research" },
  { name: "Sales",            color: "#10B981", description: "Revenue generation, enterprise accounts, and business development" },
  { name: "Marketing",        color: "#F59E0B", description: "Brand, content marketing, and growth initiatives" },
  { name: "Finance",          color: "#EF4444", description: "Financial planning, accounting, budgeting, and compliance" },
  { name: "HR",               color: "#EC4899", description: "People operations, talent management, and culture" },
  { name: "Operations",       color: "#14B8A6", description: "Process management, logistics, and internal operations" },
  { name: "Customer Success", color: "#F97316", description: "Client onboarding, retention, and support" },
];

// [email, role, dept, first, last, title, salary, avatar, startDate, isHead]
const UNI_EMPS = [
  ["admin@Monja.com",           "SUPER_ADMIN", "HR",              "Sarah",   "Johnson",  "HR Director",               180000, "/images/user/user-01.png", "2022-01-15", true ],
  ["chris.walker@Monja.com",    "EMPLOYEE",    "HR",              "Chris",   "Walker",   "HR Specialist",              85000, "/images/user/user-02.png", "2023-06-01", false],
  ["james.williams@Monja.com",  "MANAGER",     "Engineering",     "James",   "Williams", "VP of Engineering",         200000, "/images/user/user-03.png", "2021-06-01", true ],
  ["sarah.mitchell@Monja.com",  "EMPLOYEE",    "Engineering",     "Sarah",   "Mitchell", "Senior Software Engineer",  150000, "/images/user/user-15.png", "2023-03-10", false],
  ["daniel.park@Monja.com",     "EMPLOYEE",    "Engineering",     "Daniel",  "Park",     "Frontend Engineer",         130000, "/images/user/user-04.png", "2023-07-01", false],
  ["arjun.mehta@Monja.com",     "EMPLOYEE",    "Engineering",     "Arjun",   "Mehta",    "Backend Engineer",          125000, "/images/user/user-05.png", "2024-01-08", false],
  ["elena.torres@Monja.com",    "EMPLOYEE",    "Engineering",     "Elena",   "Torres",   "QA Engineer",               110000, "/images/user/user-06.png", "2023-09-01", false],
  ["marcus.chen@Monja.com",     "EMPLOYEE",    "Engineering",     "Marcus",  "Chen",     "DevOps Engineer",           145000, "/images/user/user-07.png", "2022-08-20", false],
  ["priya.sharma@Monja.com",    "EMPLOYEE",    "Product",         "Priya",   "Sharma",   "Product Designer",          130000, "/images/user/user-26.png", "2022-11-15", true ],
  ["lisa.chen@Monja.com",       "EMPLOYEE",    "Product",         "Lisa",    "Chen",     "Product Manager",           145000, "/images/user/user-08.png", "2023-02-01", false],
  ["alex.kumar@Monja.com",      "EMPLOYEE",    "Product",         "Alex",    "Kumar",    "UX Researcher",             105000, "/images/user/user-09.png", "2024-03-01", false],
  ["michael.brown@Monja.com",   "MANAGER",     "Sales",           "Michael", "Brown",    "Head of Sales",             160000, "/images/user/user-10.png", "2021-09-01", true ],
  ["jessica.davis@Monja.com",   "EMPLOYEE",    "Sales",           "Jessica", "Davis",    "Account Executive",          95000, "/images/user/user-11.png", "2022-11-01", false],
  ["ryan.wilson@Monja.com",     "EMPLOYEE",    "Sales",           "Ryan",    "Wilson",   "Sales Development Rep",      75000, "/images/user/user-12.png", "2024-02-01", false],
  ["amanda.taylor@Monja.com",   "EMPLOYEE",    "Sales",           "Amanda",  "Taylor",   "Senior Account Executive",  115000, "/images/user/user-13.png", "2023-01-15", false],
  ["sophia.martinez@Monja.com", "EMPLOYEE",    "Marketing",       "Sophia",  "Martinez", "Marketing Director",        148000, "/images/user/user-14.png", "2022-04-01", true ],
  ["thomas.lee@Monja.com",      "EMPLOYEE",    "Marketing",       "Thomas",  "Lee",      "Growth Marketer",            95000, "/images/user/user-16.png", "2023-08-01", false],
  ["nicole.white@Monja.com",    "EMPLOYEE",    "Marketing",       "Nicole",  "White",    "Content Strategist",         90000, "/images/user/user-17.png", "2024-01-15", false],
  ["rachel.harris@Monja.com",   "EMPLOYEE",    "Finance",         "Rachel",  "Harris",   "Finance Manager",           135000, "/images/user/user-18.png", "2022-07-01", true ],
  ["david.clark@Monja.com",     "EMPLOYEE",    "Finance",         "David",   "Clark",    "Financial Analyst",         102000, "/images/user/user-19.png", "2023-04-01", false],
  ["emma.robinson@Monja.com",   "EMPLOYEE",    "Finance",         "Emma",    "Robinson", "Accountant",                 85000, "/images/user/user-20.png", "2024-06-01", false],
  ["brandon.allen@Monja.com",   "EMPLOYEE",    "Operations",      "Brandon", "Allen",    "Operations Manager",        128000, "/images/user/user-21.png", "2022-03-01", true ],
  ["megan.young@Monja.com",     "EMPLOYEE",    "Operations",      "Megan",   "Young",    "Process Coordinator",        82000, "/images/user/user-22.png", "2023-05-01", false],
  ["tyler.king@Monja.com",      "EMPLOYEE",    "Operations",      "Tyler",   "King",     "Operations Analyst",         90000, "/images/user/user-23.png", "2024-04-01", false],
  ["ashley.wright@Monja.com",   "EMPLOYEE",    "Customer Success","Ashley",  "Wright",   "Customer Success Lead",     112000, "/images/user/user-24.png", "2022-09-01", true ],
  ["jordan.scott@Monja.com",    "EMPLOYEE",    "Customer Success","Jordan",  "Scott",    "Customer Success Manager",   95000, "/images/user/user-25.png", "2023-07-01", false],
  ["maya.patel@Monja.com",      "EMPLOYEE",    "Customer Success","Maya",    "Patel",    "Support Specialist",         75000, "/images/user/user-27.png", "2024-05-01", false],
] as const;

async function seedMonja(hash: string) {
  const org = await db.organization.create({
    data: { name: "Monja Technologies", slug: "Monja", plan: "PRO_MAX", address: "12th Floor, Prestige Tower, MG Road, Bangalore 560001, India", taxId: "GSTIN: 29AABCU1234B1Z5" },
  });

  const deptMap = new Map<string, string>();
  for (const d of UNI_DEPTS) {
    const dept = await db.department.create({ data: { name: d.name, description: d.description, color: d.color, orgId: org.id } });
    deptMap.set(d.name, dept.id);
  }

  type Pair = { userId: string; empId: string; deptName: string; isHead: boolean };
  const pairs: Pair[] = [];

  for (let i = 0; i < UNI_EMPS.length; i++) {
    const [email, role, deptName, firstName, lastName, title, salary, avatar, startDate, isHead] = UNI_EMPS[i];
    const user = await db.user.create({
      data: { email, passwordHash: hash, role: role, orgId: org.id },
    });
    const emp = await db.employee.create({
      data: { userId: user.id, orgId: org.id, employeeCode: `EMP-${String(i + 1).padStart(4, "0")}`, firstName, lastName, email, title, departmentId: deptMap.get(deptName)!, salary, avatarUrl: avatar, startDate: new Date(startDate), employmentType: "Full-time" },
    });
    pairs.push({ userId: user.id, empId: emp.id, deptName, isHead });
  }

  const byEmail = (e: string) => pairs[UNI_EMPS.findIndex((r) => r[0] === e)];

  for (const p of pairs)
    if (p.isHead)
      await db.department.update({ where: { name_orgId: { name: p.deptName, orgId: org.id } }, data: { headId: p.empId } });

  const jamesId   = byEmail("james.williams@Monja.com").empId;
  const michaelId = byEmail("michael.brown@Monja.com").empId;
  await db.employee.updateMany({ where: { id: { in: ["sarah.mitchell","daniel.park","arjun.mehta","elena.torres","marcus.chen"].map((n) => byEmail(`${n}@Monja.com`).empId) } }, data: { managerId: jamesId } });
  await db.employee.updateMany({ where: { id: { in: ["jessica.davis","ryan.wilson","amanda.taylor"].map((n) => byEmail(`${n}@Monja.com`).empId) } }, data: { managerId: michaelId } });

  const empIds = pairs.map((p) => p.empId);
  await seedLeaveBalances(empIds);
  await seedAttendance(empIds);
  await seedPayroll(org.id, pairs.map((p, i) => ({ empId: p.empId, salary: Number(UNI_EMPS[i][6]) })));

  // Leave requests
  await db.leaveRequest.createMany({ data: [
    { employeeId: byEmail("sarah.mitchell@Monja.com").empId, leaveType: "ANNUAL", startDate: new Date("2026-04-07"), endDate: new Date("2026-04-09"), days: 3, reason: "Family vacation", status: "APPROVED" },
    { employeeId: byEmail("daniel.park@Monja.com").empId,    leaveType: "SICK",   startDate: new Date("2026-04-14"), endDate: new Date("2026-04-15"), days: 2, reason: "Not feeling well", status: "APPROVED" },
    { employeeId: byEmail("priya.sharma@Monja.com").empId,   leaveType: "CASUAL", startDate: new Date("2026-04-22"), endDate: new Date("2026-04-22"), days: 1, reason: "Personal work", status: "APPROVED" },
    { employeeId: byEmail("arjun.mehta@Monja.com").empId,    leaveType: "SICK",   startDate: new Date("2026-04-28"), endDate: new Date("2026-04-29"), days: 2, reason: "Medical appointment", status: "APPROVED" },
    { employeeId: byEmail("jessica.davis@Monja.com").empId,  leaveType: "ANNUAL", startDate: new Date("2026-05-05"), endDate: new Date("2026-05-07"), days: 3, reason: "Trip to Goa", status: "APPROVED" },
    { employeeId: byEmail("sarah.mitchell@Monja.com").empId, leaveType: "SICK",   startDate: new Date("2026-05-12"), endDate: new Date("2026-05-12"), days: 1, reason: "Doctor visit", status: "PENDING" },
    { employeeId: byEmail("marcus.chen@Monja.com").empId,    leaveType: "CASUAL", startDate: new Date("2026-05-19"), endDate: new Date("2026-05-20"), days: 2, reason: "Personal errands", status: "PENDING" },
    { employeeId: byEmail("daniel.park@Monja.com").empId,    leaveType: "ANNUAL", startDate: new Date("2026-05-26"), endDate: new Date("2026-05-30"), days: 5, reason: "Summer vacation", status: "PENDING" },
    { employeeId: byEmail("amanda.taylor@Monja.com").empId,  leaveType: "SICK",   startDate: new Date("2026-05-08"), endDate: new Date("2026-05-09"), days: 2, reason: "Flu", status: "APPROVED" },
    { employeeId: byEmail("brandon.allen@Monja.com").empId,  leaveType: "ANNUAL", startDate: new Date("2026-06-10"), endDate: new Date("2026-06-13"), days: 4, reason: "Family trip", status: "APPROVED" },
  ]});

  // Claims
  await db.claim.createMany({ data: [
    { employeeId: byEmail("sarah.mitchell@Monja.com").empId, category: "TRAVEL",   amount: 4500,  date: new Date("2026-04-10"), description: "Client meeting travel to Mumbai", status: "APPROVED", reviewedAt: new Date("2026-04-10") },
    { employeeId: byEmail("sarah.mitchell@Monja.com").empId, category: "TRAINING", amount: 12000, date: new Date("2026-04-20"), description: "AWS certification exam fee", status: "PENDING" },
    { employeeId: byEmail("daniel.park@Monja.com").empId,    category: "EQUIPMENT",amount: 8000,  date: new Date("2026-04-25"), description: "External monitor for home office", status: "PENDING" },
    { employeeId: byEmail("marcus.chen@Monja.com").empId,    category: "TRAVEL",   amount: 3200,  date: new Date("2026-05-02"), description: "Conference transport to Delhi", status: "APPROVED", reviewedAt: new Date("2026-05-02") },
    { employeeId: byEmail("james.williams@Monja.com").empId, category: "MEALS",    amount: 1800,  date: new Date("2026-05-03"), description: "Team lunch â€” sprint retrospective", status: "APPROVED", reviewedAt: new Date("2026-05-03") },
    { employeeId: byEmail("priya.sharma@Monja.com").empId,   category: "TRAINING", amount: 9500,  date: new Date("2026-04-30"), description: "Figma Advanced certification", status: "APPROVED", reviewedAt: new Date("2026-04-30") },
    { employeeId: byEmail("michael.brown@Monja.com").empId,  category: "TRAVEL",   amount: 15000, date: new Date("2026-04-18"), description: "Enterprise client visit â€” Hyderabad", status: "APPROVED", reviewedAt: new Date("2026-04-18") },
    { employeeId: byEmail("rachel.harris@Monja.com").empId,  category: "TRAINING", amount: 7500,  date: new Date("2026-05-01"), description: "CPA continuing education credits", status: "PENDING" },
    { employeeId: byEmail("arjun.mehta@Monja.com").empId,    category: "EQUIPMENT",amount: 5500,  date: new Date("2026-04-22"), description: "Mechanical keyboard for development", status: "REJECTED", reviewedAt: new Date("2026-04-22") },
    { employeeId: byEmail("amanda.taylor@Monja.com").empId,  category: "TRAVEL",   amount: 6200,  date: new Date("2026-05-06"), description: "Sales conference â€” Mumbai", status: "PENDING" },
  ]});

  // Courses
  const [cReact, cAws, cTs, cMgmt, cDb, cDesign, cSales, cFin] = await Promise.all([
    db.course.create({ data: { orgId: org.id, title: "React & Next.js Mastery",     description: "Complete guide to React and Next.js",       category: "Frontend",   duration: "40 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "AWS Solutions Architect",      description: "Prepare for AWS SAA-C03 certification",      category: "Cloud",      duration: "60 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "TypeScript Fundamentals",      description: "Master TypeScript for production apps",       category: "Backend",    duration: "20 hours", level: "Beginner"     } }),
    db.course.create({ data: { orgId: org.id, title: "Leadership & Management",      description: "Effective team leadership skills",            category: "Management", duration: "15 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "PostgreSQL & Database Design", description: "Advanced database concepts and optimisation", category: "Backend",    duration: "30 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "Product Design Principles",    description: "UX/UI best practices and design systems",     category: "Design",     duration: "25 hours", level: "Beginner"     } }),
    db.course.create({ data: { orgId: org.id, title: "B2B Sales Mastery",            description: "Enterprise sales techniques and negotiation", category: "Sales",      duration: "18 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "Financial Modelling in Excel", description: "Build robust financial models from scratch",  category: "Finance",    duration: "22 hours", level: "Intermediate" } }),
  ]);

  await db.courseEnrollment.createMany({ data: [
    { courseId: cReact.id,  employeeId: byEmail("sarah.mitchell@Monja.com").empId, progress: 75, enrolledAt: new Date("2026-03-01") },
    { courseId: cAws.id,    employeeId: byEmail("sarah.mitchell@Monja.com").empId, progress: 40, enrolledAt: new Date("2026-04-01") },
    { courseId: cTs.id,     employeeId: byEmail("sarah.mitchell@Monja.com").empId, progress: 100, completedAt: new Date("2026-03-15"), enrolledAt: new Date("2026-02-01") },
    { courseId: cReact.id,  employeeId: byEmail("daniel.park@Monja.com").empId,    progress: 60, enrolledAt: new Date("2026-03-15") },
    { courseId: cTs.id,     employeeId: byEmail("arjun.mehta@Monja.com").empId,    progress: 85, enrolledAt: new Date("2026-04-10") },
    { courseId: cDb.id,     employeeId: byEmail("marcus.chen@Monja.com").empId,    progress: 50, enrolledAt: new Date("2026-04-01") },
    { courseId: cMgmt.id,   employeeId: byEmail("james.williams@Monja.com").empId, progress: 90, enrolledAt: new Date("2026-02-01") },
    { courseId: cDesign.id, employeeId: byEmail("priya.sharma@Monja.com").empId,   progress: 100, completedAt: new Date("2026-04-20"), enrolledAt: new Date("2026-03-01") },
    { courseId: cDesign.id, employeeId: byEmail("lisa.chen@Monja.com").empId,      progress: 65, enrolledAt: new Date("2026-04-15") },
    { courseId: cSales.id,  employeeId: byEmail("michael.brown@Monja.com").empId,  progress: 100, completedAt: new Date("2026-03-30"), enrolledAt: new Date("2026-02-15") },
    { courseId: cSales.id,  employeeId: byEmail("jessica.davis@Monja.com").empId,  progress: 80, enrolledAt: new Date("2026-04-05") },
    { courseId: cFin.id,    employeeId: byEmail("rachel.harris@Monja.com").empId,  progress: 70, enrolledAt: new Date("2026-03-20") },
  ]});

  await db.employeeCertification.createMany({ data: [
    { employeeId: byEmail("sarah.mitchell@Monja.com").empId, name: "TypeScript Developer",              issuer: "Microsoft",     credential: "MSFT-TS-2025",  earnedAt: new Date("2025-08-15") },
    { employeeId: byEmail("sarah.mitchell@Monja.com").empId, name: "React Certified Developer",         issuer: "Meta",          credential: "META-RCD-2025", earnedAt: new Date("2025-12-10"), expiresAt: new Date("2027-12-10") },
    { employeeId: byEmail("marcus.chen@Monja.com").empId,    name: "AWS Solutions Architect Associate", issuer: "Amazon",        credential: "AWS-SAA-2025",  earnedAt: new Date("2025-11-20"), expiresAt: new Date("2028-11-20") },
    { employeeId: byEmail("james.williams@Monja.com").empId, name: "Certified Scrum Master",            issuer: "Scrum Alliance", credential: "CSM-2025-007", earnedAt: new Date("2025-06-01") },
    { employeeId: byEmail("priya.sharma@Monja.com").empId,   name: "Google UX Design Certificate",      issuer: "Google",        credential: "GOOG-UX-2025",  earnedAt: new Date("2025-09-15"), expiresAt: new Date("2028-09-15") },
    { employeeId: byEmail("michael.brown@Monja.com").empId,  name: "Certified Sales Professional",      issuer: "NASP",          credential: "CSP-2024-112",  earnedAt: new Date("2024-11-01") },
    { employeeId: byEmail("rachel.harris@Monja.com").empId,  name: "CPA â€” Chartered Public Accountant", issuer: "ICAI",          credential: "CPA-2023-556",  earnedAt: new Date("2023-05-20") },
    { employeeId: byEmail("arjun.mehta@Monja.com").empId,    name: "Node.js Application Developer",     issuer: "OpenJS",        credential: "OADN-2026-009", earnedAt: new Date("2026-01-15") },
  ]});

  const sarahE = byEmail("sarah.mitchell@Monja.com").empId;
  const jamesE = jamesId;
  const danielE = byEmail("daniel.park@Monja.com").empId;
  const marcusE = byEmail("marcus.chen@Monja.com").empId;
  const arjunE  = byEmail("arjun.mehta@Monja.com").empId;
  const elenaE  = byEmail("elena.torres@Monja.com").empId;
  const priyaE  = byEmail("priya.sharma@Monja.com").empId;

  await db.goal.createMany({ data: [
    { employeeId: sarahE,  title: "Complete Platform v2.0 Auth Module",     progress: 65,  status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
    { employeeId: sarahE,  title: "Reduce API Response Time to <100ms",      progress: 40,  status: "IN_PROGRESS", dueDate: new Date("2026-07-31") },
    { employeeId: sarahE,  title: "Complete AWS Solutions Architect Cert",   progress: 80,  status: "IN_PROGRESS", dueDate: new Date("2026-08-15") },
    { employeeId: sarahE,  title: "Lead Q2 Sprint Planning",                  progress: 100, status: "COMPLETED",   dueDate: new Date("2026-04-30") },
    { employeeId: danielE, title: "Build Design System v2",                   progress: 55,  status: "IN_PROGRESS", dueDate: new Date("2026-07-15") },
    { employeeId: danielE, title: "Implement dark mode across all pages",     progress: 100, status: "COMPLETED",   dueDate: new Date("2026-05-01") },
    { employeeId: marcusE, title: "Migrate Services to Kubernetes",           progress: 30,  status: "IN_PROGRESS", dueDate: new Date("2026-09-30") },
    { employeeId: arjunE,  title: "Complete TypeScript Fundamentals Course",  progress: 100, status: "COMPLETED",   dueDate: new Date("2026-04-30") },
    { employeeId: priyaE,  title: "Deliver Mobile App Wireframes v1",         progress: 88,  status: "IN_PROGRESS", dueDate: new Date("2026-05-22") },
    { employeeId: jamesE,  title: "Hire 2 Senior Engineers in Q2",            progress: 50,  status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
    { employeeId: byEmail("michael.brown@Monja.com").empId, title: "Close 3 Enterprise Accounts Q2", progress: 66, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
    { employeeId: byEmail("rachel.harris@Monja.com").empId, title: "Close FY2026 Books by June 30",  progress: 20, status: "NOT_STARTED",  dueDate: new Date("2026-06-30") },
  ]});

  const [p1, p2, p3] = await Promise.all([
    db.project.create({ data: { orgId: org.id, name: "Platform Redesign v2.0",  description: "Full redesign of the core platform",         status: "ACTIVE", progress: 68, dueDate: new Date("2026-08-31") } }),
    db.project.create({ data: { orgId: org.id, name: "Mobile App MVP",          description: "Cross-platform mobile application",           status: "ACTIVE", progress: 35, dueDate: new Date("2026-10-31") } }),
    db.project.create({ data: { orgId: org.id, name: "Internal DevOps Upgrade", description: "Kubernetes migration and CI/CD improvements", status: "ACTIVE", progress: 30, dueDate: new Date("2026-09-30") } }),
  ]);

  await db.task.createMany({ data: [
    { orgId: org.id, projectId: p1.id, title: "Design new authentication flow",         status: "IN_PROGRESS", priority: "HIGH",   assigneeId: sarahE,  createdById: sarahE,  dueDate: new Date("2026-05-15") },
    { orgId: org.id,                   title: "Code review: API rate limiting PR",       status: "TODO",        priority: "HIGH",   assigneeId: sarahE,  createdById: jamesE,  dueDate: new Date("2026-05-10") },
    { orgId: org.id,                   title: "Update onboarding documentation",         status: "TODO",        priority: "MEDIUM", assigneeId: sarahE,  createdById: sarahE,  dueDate: new Date("2026-05-20") },
    { orgId: org.id, projectId: p1.id, title: "Implement dark mode toggle",             status: "DONE",        priority: "LOW",    assigneeId: danielE, createdById: jamesE,  dueDate: new Date("2026-05-01") },
    { orgId: org.id, projectId: p2.id, title: "Setup React Native project scaffolding", status: "DONE",        priority: "HIGH",   assigneeId: danielE, createdById: danielE, dueDate: new Date("2026-04-20") },
    { orgId: org.id, projectId: p1.id, title: "Performance optimisation audit",         status: "IN_REVIEW",   priority: "HIGH",   assigneeId: marcusE, createdById: jamesE,  dueDate: new Date("2026-05-12") },
    { orgId: org.id,                   title: "Write unit tests for auth module",        status: "TODO",        priority: "MEDIUM", assigneeId: elenaE,  createdById: sarahE,  dueDate: new Date("2026-05-18") },
    { orgId: org.id, projectId: p2.id, title: "Design mobile UI wireframes",            status: "IN_PROGRESS", priority: "HIGH",   assigneeId: priyaE,  createdById: jamesE,  dueDate: new Date("2026-05-22") },
    { orgId: org.id, projectId: p3.id, title: "Migrate auth service to K8s",           status: "IN_PROGRESS", priority: "HIGH",   assigneeId: marcusE, createdById: marcusE, dueDate: new Date("2026-06-10") },
    { orgId: org.id, projectId: p3.id, title: "Set up GitHub Actions CI/CD pipeline",  status: "TODO",        priority: "MEDIUM", assigneeId: marcusE, createdById: jamesE,  dueDate: new Date("2026-06-15") },
    { orgId: org.id, projectId: p1.id, title: "Integrate Stripe payment gateway",       status: "TODO",        priority: "HIGH",   assigneeId: arjunE,  createdById: jamesE,  dueDate: new Date("2026-06-01") },
    { orgId: org.id,                   title: "Refactor employee API endpoints",        status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: arjunE,  createdById: arjunE,  dueDate: new Date("2026-05-25") },
  ]});

  await db.performanceReview.createMany({ data: [
    { revieweeId: sarahE,  reviewerId: jamesE, period: "Q1 2026", type: "Quarterly",     score: 88, comments: "Excellent technical work, great collaboration",        status: "COMPLETED", completedAt: new Date("2026-04-05") },
    { revieweeId: danielE, reviewerId: jamesE, period: "Q1 2026", type: "Quarterly",     score: 82, comments: "Good progress on frontend tasks, strong ownership",    status: "COMPLETED", completedAt: new Date("2026-04-06") },
    { revieweeId: arjunE,  reviewerId: jamesE, period: "Q1 2026", type: "Quarterly",     score: 79, comments: "Growing quickly, needs more production experience",    status: "COMPLETED", completedAt: new Date("2026-04-07") },
    { revieweeId: marcusE, reviewerId: jamesE, period: "Q1 2026", type: "Quarterly",     score: 91, comments: "Outstanding infra work, K8s migration ahead of plan", status: "COMPLETED", completedAt: new Date("2026-04-08") },
    { revieweeId: elenaE,  reviewerId: jamesE, period: "Q1 2026", type: "Quarterly",     score: 85, comments: "Thorough QA process, caught several critical bugs",    status: "COMPLETED", completedAt: new Date("2026-04-09") },
    { revieweeId: sarahE,  reviewerId: jamesE, period: "Q2 2026", type: "Quarterly",     status: "PENDING" },
    { revieweeId: danielE, reviewerId: jamesE, period: "Q2 2026", type: "Quarterly",     status: "PENDING" },
    { revieweeId: sarahE,  reviewerId: jamesE, period: "FY 2025", type: "Annual Review", score: 87, comments: "Consistent high performance across the year", status: "COMPLETED", completedAt: new Date("2026-01-10") },
  ]});

  const [job1, job2, job3] = await Promise.all([
    db.jobPosting.create({ data: { orgId: org.id, title: "Senior React Engineer",   department: "Engineering", location: "Bangalore (Hybrid)", type: "Full-time", description: "Lead frontend development for our core platform." } }),
    db.jobPosting.create({ data: { orgId: org.id, title: "Product Manager",         department: "Product",     location: "Remote",             type: "Full-time", description: "Drive product strategy and roadmap." } }),
    db.jobPosting.create({ data: { orgId: org.id, title: "Enterprise Account Exec", department: "Sales",       location: "Mumbai",             type: "Full-time", description: "Own the full sales cycle for enterprise accounts." } }),
  ]);
  await db.candidate.createMany({ data: [
    { jobId: job1.id, name: "Rahul Kumar",   email: "rahul.k@gmail.com",   stage: "INTERVIEW", source: "LinkedIn", notes: "Strong React + Next.js experience, 5 years" },
    { jobId: job1.id, name: "Anjali Singh",  email: "anjali.s@gmail.com",  stage: "SCREENING", source: "Referral", notes: "Recommended by Sarah Mitchell" },
    { jobId: job1.id, name: "Vikram Nair",   email: "v.nair@gmail.com",    stage: "OFFER",     source: "Indeed",   notes: "Offer sent: â‚¹140k package" },
    { jobId: job2.id, name: "Kunal Agarwal", email: "kunal.a@gmail.com",   stage: "INTERVIEW", source: "Referral", notes: "Strong PM background at Flipkart" },
    { jobId: job3.id, name: "Pooja Verma",   email: "pooja.v@gmail.com",   stage: "INTERVIEW", source: "Naukri",   notes: "7 years enterprise SaaS sales" },
  ]});

  await db.onboardingRecord.createMany({ data: [
    { employeeId: arjunE,  status: "IN_PROGRESS", startDate: new Date("2026-04-01"), dueDate: new Date("2026-05-30"), tasks: JSON.stringify([{ id:"1", title:"Complete HR paperwork", done:true },{ id:"2", title:"Setup dev environment", done:true },{ id:"3", title:"Meet the team", done:true },{ id:"4", title:"Complete security training", done:false }]) },
    { employeeId: elenaE,  status: "IN_PROGRESS", startDate: new Date("2026-04-15"), dueDate: new Date("2026-06-15"), tasks: JSON.stringify([{ id:"1", title:"Complete HR paperwork", done:true },{ id:"2", title:"Setup QA environment", done:true },{ id:"3", title:"Review test case library", done:false }]) },
    { employeeId: byEmail("ryan.wilson@Monja.com").empId, status: "IN_PROGRESS", startDate: new Date("2026-03-01"), dueDate: new Date("2026-05-01"), tasks: JSON.stringify([{ id:"1", title:"HR paperwork", done:true },{ id:"2", title:"CRM training", done:true },{ id:"3", title:"Shadow 5 sales calls", done:true },{ id:"4", title:"First independent demo", done:false }]) },
    { employeeId: byEmail("tyler.king@Monja.com").empId,  status: "NOT_STARTED",  startDate: new Date("2026-05-01"), dueDate: new Date("2026-06-30"), tasks: JSON.stringify([{ id:"1", title:"HR paperwork", done:false },{ id:"2", title:"Operations walkthrough", done:false }]) },
  ]});

  const uids = pairs.map((p) => p.userId);
  const getUid = (e: string) => uids[UNI_EMPS.findIndex((r) => r[0] === e)];

  const adminUserId = getUid("admin@Monja.com");
  const [chGen, chEng, chProd, chSales, chRnd] = await Promise.all([
    db.channel.create({ data: { orgId: org.id, name: "general",     isPrivate: false, createdBy: adminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "engineering", isPrivate: false, createdBy: adminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "product",     isPrivate: false, createdBy: adminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "sales",       isPrivate: false, createdBy: adminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "random",      isPrivate: false, createdBy: adminUserId } }),
  ]);
  await db.message.createMany({ data: [
    { channelId: chGen.id,  senderId: getUid("admin@Monja.com"),           content: "Good morning everyone! Hope you had a great weekend.",                    createdAt: new Date("2026-05-04T09:00:00") },
    { channelId: chGen.id,  senderId: getUid("james.williams@Monja.com"),  content: "Morning! Ready for sprint planning today?",                               createdAt: new Date("2026-05-04T09:05:00") },
    { channelId: chGen.id,  senderId: getUid("sarah.mitchell@Monja.com"),  content: "Sprint planning at 10 AM, right? I'll be there.",                         createdAt: new Date("2026-05-04T09:10:00") },
    { channelId: chGen.id,  senderId: getUid("admin@Monja.com"),           content: "Reminder: Q2 performance reviews due by May 15th.",                       createdAt: new Date("2026-05-05T10:00:00") },
    { channelId: chGen.id,  senderId: getUid("james.williams@Monja.com"),  content: "Platform v2.0 is on track for Q3. Great work everyone!",                  createdAt: new Date("2026-05-06T11:00:00") },
    { channelId: chGen.id,  senderId: getUid("daniel.park@Monja.com"),     content: "Dark mode is live on staging! Feel free to test it out.",                 createdAt: new Date("2026-05-08T14:00:00") },
    { channelId: chGen.id,  senderId: getUid("michael.brown@Monja.com"),   content: "Sales team closed 2 enterprise deals this week. Big win!",               createdAt: new Date("2026-05-09T09:00:00") },
    { channelId: chEng.id,  senderId: getUid("james.williams@Monja.com"),  content: "Code review session at 3 PM for the rate limiting PR.",                   createdAt: new Date("2026-05-07T09:00:00") },
    { channelId: chEng.id,  senderId: getUid("marcus.chen@Monja.com"),     content: "K8s migration going well â€” auth and user services migrated.",             createdAt: new Date("2026-05-07T10:00:00") },
    { channelId: chEng.id,  senderId: getUid("arjun.mehta@Monja.com"),     content: "Backend notifications API is merged. Passing to QA now.",                 createdAt: new Date("2026-05-08T11:00:00") },
    { channelId: chProd.id, senderId: getUid("priya.sharma@Monja.com"),    content: "New wireframes for the mobile app are in Figma. Please review!",          createdAt: new Date("2026-05-07T13:00:00") },
    { channelId: chProd.id, senderId: getUid("james.williams@Monja.com"),  content: "Looks great Priya! The onboarding flow is much cleaner now.",             createdAt: new Date("2026-05-07T13:30:00") },
    { channelId: chSales.id,senderId: getUid("amanda.taylor@Monja.com"),   content: "GlobalBank renewal signed! $180k ARR. Big quarter!",                      createdAt: new Date("2026-05-09T10:00:00") },
    { channelId: chRnd.id,  senderId: getUid("daniel.park@Monja.com"),     content: "Anyone for lunch at the new Thai place near the office?",                 createdAt: new Date("2026-05-08T12:00:00") },
    { channelId: chRnd.id,  senderId: getUid("sarah.mitchell@Monja.com"),  content: "I'm in! See you at 1 PM?",                                               createdAt: new Date("2026-05-08T12:10:00") },
  ]});

  await db.workflow.createMany({ data: [
    { orgId: org.id, name: "Leave Approval",           description: "Auto-notify manager when leave is requested",        trigger: "leave.requested",   isEnabled: true,  runsCount: 47, lastRunAt: new Date("2026-05-08T10:00:00") },
    { orgId: org.id, name: "New Employee Onboarding",  description: "Create onboarding checklist for new hires",          trigger: "employee.created",  isEnabled: true,  runsCount: 12, lastRunAt: new Date("2026-04-15T09:00:00") },
    { orgId: org.id, name: "Monthly Payroll Run",      description: "Process payroll on the last business day of month",  trigger: "payroll.scheduled", isEnabled: true,  runsCount: 6,  lastRunAt: new Date("2026-04-28T08:00:00") },
    { orgId: org.id, name: "Performance Review Alerts",description: "Remind employees and managers about pending reviews", trigger: "review.pending",    isEnabled: false, runsCount: 3,  lastRunAt: new Date("2026-04-01T09:00:00") },
    { orgId: org.id, name: "Task Overdue Alert",       description: "Alert assignee when a task passes its due date",     trigger: "task.overdue",      isEnabled: true,  runsCount: 18, lastRunAt: new Date("2026-05-07T09:00:00") },
    { orgId: org.id, name: "Birthday Reminder",        description: "Send birthday wishes to employees automatically",    trigger: "employee.birthday", isEnabled: true,  runsCount: 8,  lastRunAt: new Date("2026-05-04T08:00:00") },
  ]});

  await db.subscription.create({ data: { orgId: org.id, plan: "PRO_MAX", status: "active", currentPeriodEnd: new Date("2026-12-31") } });
  return org.id;
}

// â”€â”€â”€ Org 2: Meridian Health Systems â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const MER_EMPS = [
  { email: "admin@meridian.com",     role: "SUPER_ADMIN", dept: "Administration", first: "Sarah",   last: "Thompson", title: "HR Director",            salary: 165000, avatar: "/images/user/user-01.png", start: "2021-03-01", isHead: true  },
  { email: "dr.kane@meridian.com",   role: "MANAGER",     dept: "Clinical",       first: "Robert",  last: "Kane",     title: "Chief Medical Officer",  salary: 290000, avatar: "/images/user/user-03.png", start: "2020-07-01", isHead: true  },
  { email: "dr.patel@meridian.com",  role: "EMPLOYEE",    dept: "Clinical",       first: "Lisa",    last: "Patel",    title: "Senior Physician",        salary: 230000, avatar: "/images/user/user-08.png", start: "2022-01-15", isHead: false },
  { email: "dr.james@meridian.com",  role: "EMPLOYEE",    dept: "Clinical",       first: "James",   last: "Okoye",    title: "General Practitioner",   salary: 195000, avatar: "/images/user/user-05.png", start: "2023-06-01", isHead: false },
  { email: "j.walsh@meridian.com",   role: "EMPLOYEE",    dept: "Nursing",        first: "Jennifer",last: "Walsh",    title: "Head Nurse",              salary: 98000,  avatar: "/images/user/user-11.png", start: "2021-09-01", isHead: true  },
  { email: "r.kim@meridian.com",     role: "EMPLOYEE",    dept: "Nursing",        first: "Rachel",  last: "Kim",      title: "Nurse Practitioner",      salary: 85000,  avatar: "/images/user/user-14.png", start: "2023-02-01", isHead: false },
  { email: "m.stevens@meridian.com", role: "MANAGER",     dept: "IT",             first: "Mark",    last: "Stevens",  title: "IT Manager",              salary: 128000, avatar: "/images/user/user-07.png", start: "2022-04-01", isHead: true  },
  { email: "d.chen@meridian.com",    role: "EMPLOYEE",    dept: "IT",             first: "David",   last: "Chen",     title: "Systems Administrator",   salary: 105000, avatar: "/images/user/user-09.png", start: "2023-08-01", isHead: false },
  { email: "e.brooks@meridian.com",  role: "EMPLOYEE",    dept: "Finance",        first: "Emma",    last: "Brooks",   title: "Finance Manager",         salary: 118000, avatar: "/images/user/user-18.png", start: "2022-06-01", isHead: true  },
  { email: "t.harris@meridian.com",  role: "EMPLOYEE",    dept: "Administration", first: "Tom",     last: "Harris",   title: "Admin Coordinator",       salary: 72000,  avatar: "/images/user/user-21.png", start: "2024-01-10", isHead: false },
];

const MER_DEPTS = [
  { name: "Clinical",        color: "#EF4444", description: "Physicians, specialists, and clinical care" },
  { name: "Nursing",         color: "#10B981", description: "Nursing staff and patient care coordination" },
  { name: "Administration",  color: "#6366F1", description: "Hospital administration and HR operations" },
  { name: "Finance",         color: "#F59E0B", description: "Financial management and reporting" },
  { name: "IT",              color: "#8B5CF6", description: "Hospital information systems and technology" },
];

async function seedMeridian(hash: string) {
  const org = await db.organization.create({
    data: { name: "Meridian Health Systems", slug: "meridian", plan: "PRO_PLUS", address: "45 Medical Centre Drive, Chennai 600034, India", taxId: "GSTIN: 33AABCM5678C1Z2" },
  });

  const deptMap = new Map<string, string>();
  for (const d of MER_DEPTS) {
    const dept = await db.department.create({ data: { name: d.name, description: d.description, color: d.color, orgId: org.id } });
    deptMap.set(d.name, dept.id);
  }

  const pairs = new Map<string, { empId: string; userId: string }>();
  for (let i = 0; i < MER_EMPS.length; i++) {
    const e = MER_EMPS[i];
    const user = await db.user.create({ data: { email: e.email, passwordHash: hash, role: e.role as OrgUserRole, orgId: org.id } });
    const emp  = await db.employee.create({ data: { userId: user.id, orgId: org.id, employeeCode: `EMP-${String(i + 1).padStart(4, "0")}`, firstName: e.first, lastName: e.last, email: e.email, title: e.title, departmentId: deptMap.get(e.dept)!, salary: e.salary, avatarUrl: e.avatar, startDate: new Date(e.start), employmentType: "Full-time" } });
    pairs.set(e.email, { empId: emp.id, userId: user.id });
    if (e.isHead) await db.department.update({ where: { name_orgId: { name: e.dept, orgId: org.id } }, data: { headId: emp.id } });
  }

  const g = (e: string) => pairs.get(e)!;
  const kaneId = g("dr.kane@meridian.com").empId;
  await db.employee.updateMany({ where: { id: { in: [g("dr.patel@meridian.com").empId, g("dr.james@meridian.com").empId] } }, data: { managerId: kaneId } });
  await db.employee.update({ where: { id: g("d.chen@meridian.com").empId }, data: { managerId: g("m.stevens@meridian.com").empId } });

  const empIds = MER_EMPS.map((e) => g(e.email).empId);
  await seedLeaveBalances(empIds);
  await seedAttendance(empIds);
  await seedPayroll(org.id, MER_EMPS.map((e) => ({ empId: g(e.email).empId, salary: e.salary })));

  await db.leaveRequest.createMany({ data: [
    { employeeId: g("dr.patel@meridian.com").empId,  leaveType: "ANNUAL", startDate: new Date("2026-04-10"), endDate: new Date("2026-04-12"), days: 3, reason: "Medical conference attendance", status: "APPROVED" },
    { employeeId: g("j.walsh@meridian.com").empId,   leaveType: "SICK",   startDate: new Date("2026-04-28"), endDate: new Date("2026-04-29"), days: 2, reason: "Flu symptoms", status: "APPROVED" },
    { employeeId: g("r.kim@meridian.com").empId,     leaveType: "CASUAL", startDate: new Date("2026-05-15"), endDate: new Date("2026-05-15"), days: 1, reason: "Personal appointment", status: "PENDING" },
    { employeeId: g("d.chen@meridian.com").empId,    leaveType: "ANNUAL", startDate: new Date("2026-06-02"), endDate: new Date("2026-06-06"), days: 5, reason: "Family vacation", status: "PENDING" },
    { employeeId: g("dr.james@meridian.com").empId,  leaveType: "SICK",   startDate: new Date("2026-05-20"), endDate: new Date("2026-05-21"), days: 2, reason: "Doctor follow-up", status: "APPROVED" },
  ]});

  await db.claim.createMany({ data: [
    { employeeId: g("dr.kane@meridian.com").empId,   category: "TRAVEL",   amount: 18500, date: new Date("2026-04-15"), description: "International medical conference â€” Singapore", status: "APPROVED", reviewedAt: new Date("2026-04-15") },
    { employeeId: g("dr.patel@meridian.com").empId,  category: "TRAINING", amount: 25000, date: new Date("2026-04-20"), description: "Advanced surgical techniques workshop", status: "APPROVED", reviewedAt: new Date("2026-04-20") },
    { employeeId: g("m.stevens@meridian.com").empId, category: "EQUIPMENT",amount: 12000, date: new Date("2026-05-01"), description: "Network security hardware upgrade", status: "PENDING" },
    { employeeId: g("j.walsh@meridian.com").empId,   category: "TRAINING", amount: 6500,  date: new Date("2026-04-25"), description: "Nursing leadership certification", status: "APPROVED", reviewedAt: new Date("2026-04-25") },
    { employeeId: g("e.brooks@meridian.com").empId,  category: "TRAINING", amount: 8000,  date: new Date("2026-05-03"), description: "Healthcare finance compliance course", status: "PENDING" },
  ]});

  const [cMed, cNurs, cIt, cLead] = await Promise.all([
    db.course.create({ data: { orgId: org.id, title: "Clinical Data Management",  description: "Electronic health records and data standards",  category: "Clinical",    duration: "30 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "Patient Care Excellence",   description: "Best practices in modern nursing care",          category: "Nursing",     duration: "20 hours", level: "Beginner"     } }),
    db.course.create({ data: { orgId: org.id, title: "Healthcare IT Security",    description: "HIPAA compliance and hospital cybersecurity",    category: "IT",          duration: "25 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "Healthcare Leadership",     description: "Managing clinical teams effectively",            category: "Management",  duration: "15 hours", level: "Intermediate" } }),
  ]);
  await db.courseEnrollment.createMany({ data: [
    { courseId: cMed.id,  employeeId: g("dr.patel@meridian.com").empId,  progress: 80, enrolledAt: new Date("2026-03-01") },
    { courseId: cMed.id,  employeeId: g("dr.james@meridian.com").empId,  progress: 55, enrolledAt: new Date("2026-04-01") },
    { courseId: cNurs.id, employeeId: g("r.kim@meridian.com").empId,     progress: 100, completedAt: new Date("2026-04-15"), enrolledAt: new Date("2026-03-01") },
    { courseId: cIt.id,   employeeId: g("d.chen@meridian.com").empId,    progress: 70, enrolledAt: new Date("2026-04-10") },
    { courseId: cLead.id, employeeId: g("dr.kane@meridian.com").empId,   progress: 90, enrolledAt: new Date("2026-02-15") },
    { courseId: cLead.id, employeeId: g("m.stevens@meridian.com").empId, progress: 60, enrolledAt: new Date("2026-03-20") },
  ]});

  await db.employeeCertification.createMany({ data: [
    { employeeId: g("dr.kane@meridian.com").empId,   name: "Fellow â€” Royal College of Physicians",  issuer: "RCP",   credential: "FRCP-2020-441", earnedAt: new Date("2020-05-15") },
    { employeeId: g("dr.patel@meridian.com").empId,  name: "Board Certified Internal Medicine",     issuer: "ABIM",  credential: "ABIM-2022-789", earnedAt: new Date("2022-06-01"), expiresAt: new Date("2032-06-01") },
    { employeeId: g("m.stevens@meridian.com").empId, name: "CompTIA Security+",                     issuer: "CompTIA", credential: "COMP-SEC-2024", earnedAt: new Date("2024-03-10"), expiresAt: new Date("2027-03-10") },
    { employeeId: g("j.walsh@meridian.com").empId,   name: "Registered Nurse â€” Advanced Practice",  issuer: "NMC",   credential: "NMC-RN-AP-2021", earnedAt: new Date("2021-01-20") },
  ]});

  await db.goal.createMany({ data: [
    { employeeId: g("dr.kane@meridian.com").empId,   title: "Launch Telemedicine Department",      description: "Full telehealth infrastructure by Q3", progress: 40, status: "IN_PROGRESS", dueDate: new Date("2026-09-30") },
    { employeeId: g("dr.patel@meridian.com").empId,  title: "Complete Advanced Cardiology Module", description: "CME credits for specialisation",        progress: 65, status: "IN_PROGRESS", dueDate: new Date("2026-07-31") },
    { employeeId: g("m.stevens@meridian.com").empId, title: "Upgrade Hospital EHR System",         description: "Migrate to new EHR platform",           progress: 25, status: "IN_PROGRESS", dueDate: new Date("2026-10-31") },
    { employeeId: g("j.walsh@meridian.com").empId,   title: "Reduce Patient Wait Time by 20%",     description: "Streamline intake and triage process",  progress: 50, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
    { employeeId: g("e.brooks@meridian.com").empId,  title: "Complete FY2026 Budget Review",       description: "Q2 financial reconciliation",            progress: 80, status: "IN_PROGRESS", dueDate: new Date("2026-05-31") },
  ]});

  const [mp1, mp2] = await Promise.all([
    db.project.create({ data: { orgId: org.id, name: "EHR System Upgrade",       description: "Migrate to NextGen EHR platform", status: "ACTIVE",    progress: 25, dueDate: new Date("2026-10-31") } }),
    db.project.create({ data: { orgId: org.id, name: "Telemedicine Launch",      description: "Remote consultation infrastructure", status: "ACTIVE",   progress: 40, dueDate: new Date("2026-09-30") } }),
  ]);
  await db.task.createMany({ data: [
    { orgId: org.id, projectId: mp1.id, title: "Vendor evaluation for EHR",         status: "DONE",        priority: "HIGH",   assigneeId: g("m.stevens@meridian.com").empId, createdById: g("m.stevens@meridian.com").empId, dueDate: new Date("2026-04-30") },
    { orgId: org.id, projectId: mp1.id, title: "Staff training schedule for EHR",   status: "IN_PROGRESS", priority: "HIGH",   assigneeId: g("m.stevens@meridian.com").empId, createdById: g("admin@meridian.com").empId,    dueDate: new Date("2026-06-15") },
    { orgId: org.id, projectId: mp2.id, title: "Telemedicine platform setup",        status: "IN_PROGRESS", priority: "HIGH",   assigneeId: g("d.chen@meridian.com").empId,    createdById: g("dr.kane@meridian.com").empId,  dueDate: new Date("2026-07-01") },
    { orgId: org.id, projectId: mp2.id, title: "Doctor onboarding for teleconsult",  status: "TODO",        priority: "MEDIUM", assigneeId: g("dr.patel@meridian.com").empId,  createdById: g("dr.kane@meridian.com").empId,  dueDate: new Date("2026-08-01") },
    { orgId: org.id,                    title: "Update patient data privacy policy",  status: "TODO",        priority: "HIGH",   assigneeId: g("e.brooks@meridian.com").empId,  createdById: g("admin@meridian.com").empId,    dueDate: new Date("2026-05-30") },
    { orgId: org.id,                    title: "Nursing shift schedule Q3",           status: "IN_REVIEW",   priority: "MEDIUM", assigneeId: g("j.walsh@meridian.com").empId,   createdById: g("admin@meridian.com").empId,    dueDate: new Date("2026-05-20") },
  ]});

  await db.performanceReview.createMany({ data: [
    { revieweeId: g("dr.patel@meridian.com").empId,  reviewerId: g("dr.kane@meridian.com").empId,   period: "Q1 2026", type: "Quarterly", score: 91, comments: "Excellent patient outcomes and peer collaboration", status: "COMPLETED", completedAt: new Date("2026-04-10") },
    { revieweeId: g("dr.james@meridian.com").empId,  reviewerId: g("dr.kane@meridian.com").empId,   period: "Q1 2026", type: "Quarterly", score: 84, comments: "Good clinical work, improving diagnostic speed",    status: "COMPLETED", completedAt: new Date("2026-04-11") },
    { revieweeId: g("d.chen@meridian.com").empId,    reviewerId: g("m.stevens@meridian.com").empId, period: "Q1 2026", type: "Quarterly", score: 79, comments: "Reliable infrastructure support, growing in security", status: "COMPLETED", completedAt: new Date("2026-04-12") },
    { revieweeId: g("dr.patel@meridian.com").empId,  reviewerId: g("dr.kane@meridian.com").empId,   period: "Q2 2026", type: "Quarterly", status: "PENDING" },
  ]});

  const mJob = await db.jobPosting.create({ data: { orgId: org.id, title: "Radiologist", department: "Clinical", location: "Chennai (On-site)", type: "Full-time", description: "Interpret medical imaging for diagnosis." } });
  await db.candidate.createMany({ data: [
    { jobId: mJob.id, name: "Dr. Arun Nair",    email: "arun.n@gmail.com",    stage: "INTERVIEW", source: "Medical Board",  notes: "10 years radiology experience, FRCR certified" },
    { jobId: mJob.id, name: "Dr. Priya Menon",  email: "priya.m@gmail.com",   stage: "SCREENING", source: "LinkedIn",       notes: "Strong academic background, fellowship at AIIMS" },
    { jobId: mJob.id, name: "Dr. Rohan Gupta",  email: "rohan.g@gmail.com",   stage: "APPLIED",   source: "Job Portal" },
  ]});

  await db.onboardingRecord.createMany({ data: [
    { employeeId: g("dr.james@meridian.com").empId, status: "IN_PROGRESS", startDate: new Date("2026-04-01"), dueDate: new Date("2026-05-31"), tasks: JSON.stringify([{ id:"1", title:"HR & credentialing paperwork", done:true },{ id:"2", title:"Hospital orientation", done:true },{ id:"3", title:"EHR system training", done:true },{ id:"4", title:"Supervised clinical rounds (2 weeks)", done:false }]) },
    { employeeId: g("t.harris@meridian.com").empId,  status: "COMPLETED",   startDate: new Date("2026-01-10"), dueDate: new Date("2026-02-28"), tasks: JSON.stringify([{ id:"1", title:"HR paperwork", done:true },{ id:"2", title:"Admin system training", done:true },{ id:"3", title:"Shadow admin team for 1 week", done:true }]) },
  ]});

  const mUids = new Map(MER_EMPS.map((e) => [e.email, g(e.email).userId]));
  const merAdminUserId = g("admin@meridian.com").userId;
  const [mGen, mClin, mAdmin] = await Promise.all([
    db.channel.create({ data: { orgId: org.id, name: "general",    isPrivate: false, createdBy: merAdminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "clinical",   isPrivate: false, createdBy: merAdminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "it-helpdesk",isPrivate: false, createdBy: merAdminUserId } }),
  ]);
  await db.message.createMany({ data: [
    { channelId: mGen.id,  senderId: mUids.get("admin@meridian.com")!,    content: "Good morning team! Busy week ahead â€” let's stay coordinated.",        createdAt: new Date("2026-05-04T08:30:00") },
    { channelId: mGen.id,  senderId: mUids.get("dr.kane@meridian.com")!,  content: "Reminder: all ward rounds start at 7 AM sharp this week.",            createdAt: new Date("2026-05-04T08:45:00") },
    { channelId: mGen.id,  senderId: mUids.get("j.walsh@meridian.com")!,  content: "Nursing rosters for Q3 have been updated. Please check your shifts.", createdAt: new Date("2026-05-05T09:00:00") },
    { channelId: mGen.id,  senderId: mUids.get("e.brooks@meridian.com")!, content: "Q1 financial report submitted. Numbers look healthy this quarter.",   createdAt: new Date("2026-05-06T10:00:00") },
    { channelId: mClin.id, senderId: mUids.get("dr.patel@meridian.com")!, content: "New clinical guidelines for hypertension management are out. Worth a read.", createdAt: new Date("2026-05-07T09:00:00") },
    { channelId: mClin.id, senderId: mUids.get("dr.kane@meridian.com")!,  content: "Agreed. We'll discuss in the next clinical meeting on Friday.",       createdAt: new Date("2026-05-07T09:20:00") },
    { channelId: mAdmin.id,senderId: mUids.get("d.chen@meridian.com")!,   content: "EHR server maintenance scheduled Sunday 2 AM - 4 AM. Plan accordingly.", createdAt: new Date("2026-05-08T14:00:00") },
  ]});

  await db.workflow.createMany({ data: [
    { orgId: org.id, name: "Leave Approval",          description: "Auto-notify HOD when leave requested", trigger: "leave.requested",  isEnabled: true,  runsCount: 31, lastRunAt: new Date("2026-05-07T10:00:00") },
    { orgId: org.id, name: "Payroll Processing",      description: "Process monthly payroll",               trigger: "payroll.scheduled",isEnabled: true,  runsCount: 6,  lastRunAt: new Date("2026-04-28T08:00:00") },
    { orgId: org.id, name: "Staff Credential Expiry", description: "Alert HR 60 days before certs expire", trigger: "cert.expiring",    isEnabled: true,  runsCount: 14, lastRunAt: new Date("2026-05-01T09:00:00") },
    { orgId: org.id, name: "Incident Report Alert",   description: "Escalate clinical incidents to CMO",   trigger: "incident.created", isEnabled: true,  runsCount: 4,  lastRunAt: new Date("2026-04-20T11:00:00") },
  ]});

  await db.subscription.create({ data: { orgId: org.id, plan: "PRO_PLUS", status: "active", currentPeriodEnd: new Date("2026-12-31") } });
  return org.id;
}

// â”€â”€â”€ Org 3: Apex Financial Group â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const APX_EMPS = [
  { email: "admin@apex.com",      role: "SUPER_ADMIN", dept: "HR",                 first: "Victoria", last: "Clarke",  title: "HR Director",            salary: 165000, avatar: "/images/user/user-01.png", start: "2020-09-01", isHead: true  },
  { email: "j.ford@apex.com",     role: "MANAGER",     dept: "Investment Banking", first: "James",    last: "Ford",    title: "Managing Director",       salary: 380000, avatar: "/images/user/user-03.png", start: "2019-03-01", isHead: true  },
  { email: "s.chen@apex.com",     role: "EMPLOYEE",    dept: "Investment Banking", first: "Sarah",    last: "Chen",    title: "Senior Analyst",          salary: 185000, avatar: "/images/user/user-08.png", start: "2021-07-01", isHead: false },
  { email: "p.kapoor@apex.com",   role: "EMPLOYEE",    dept: "Investment Banking", first: "Priya",    last: "Kapoor",  title: "Analyst",                 salary: 145000, avatar: "/images/user/user-14.png", start: "2023-06-01", isHead: false },
  { email: "m.ross@apex.com",     role: "MANAGER",     dept: "Risk Management",    first: "Michael",  last: "Ross",    title: "Chief Risk Officer",      salary: 260000, avatar: "/images/user/user-10.png", start: "2020-01-15", isHead: true  },
  { email: "e.zhang@apex.com",    role: "EMPLOYEE",    dept: "Compliance",         first: "Emily",    last: "Zhang",   title: "Compliance Officer",       salary: 148000, avatar: "/images/user/user-15.png", start: "2022-03-01", isHead: true  },
  { email: "l.morgan@apex.com",   role: "MANAGER",     dept: "Trading",            first: "Lisa",     last: "Morgan",  title: "Head of Trading",          salary: 285000, avatar: "/images/user/user-26.png", start: "2020-06-01", isHead: true  },
  { email: "d.wu@apex.com",       role: "EMPLOYEE",    dept: "Trading",            first: "David",    last: "Wu",      title: "Quantitative Analyst",     salary: 195000, avatar: "/images/user/user-07.png", start: "2022-08-01", isHead: false },
];

const APX_DEPTS = [
  { name: "Investment Banking", color: "#6366F1", description: "M&A advisory, capital markets, and deal structuring" },
  { name: "Risk Management",    color: "#EF4444", description: "Enterprise risk assessment and mitigation" },
  { name: "Compliance",         color: "#F59E0B", description: "Regulatory compliance and legal frameworks" },
  { name: "Trading",            color: "#10B981", description: "Equities, fixed income, and derivatives trading" },
  { name: "HR",                 color: "#EC4899", description: "Talent acquisition and people operations" },
];

async function seedApex(hash: string) {
  const org = await db.organization.create({
    data: { name: "Apex Financial Group", slug: "apex-financial", plan: "PRO", address: "Level 28, Bandra Kurla Complex, Mumbai 400051, India", taxId: "GSTIN: 27AABCA9012D1Z8" },
  });

  const deptMap = new Map<string, string>();
  for (const d of APX_DEPTS) {
    const dept = await db.department.create({ data: { name: d.name, description: d.description, color: d.color, orgId: org.id } });
    deptMap.set(d.name, dept.id);
  }

  const pairs = new Map<string, { empId: string; userId: string }>();
  for (let i = 0; i < APX_EMPS.length; i++) {
    const e = APX_EMPS[i];
    const user = await db.user.create({ data: { email: e.email, passwordHash: hash, role: e.role as OrgUserRole, orgId: org.id } });
    const emp  = await db.employee.create({ data: { userId: user.id, orgId: org.id, employeeCode: `EMP-${String(i + 1).padStart(4, "0")}`, firstName: e.first, lastName: e.last, email: e.email, title: e.title, departmentId: deptMap.get(e.dept)!, salary: e.salary, avatarUrl: e.avatar, startDate: new Date(e.start), employmentType: "Full-time" } });
    pairs.set(e.email, { empId: emp.id, userId: user.id });
    if (e.isHead) await db.department.update({ where: { name_orgId: { name: e.dept, orgId: org.id } }, data: { headId: emp.id } });
  }

  const g = (e: string) => pairs.get(e)!;
  const fordId = g("j.ford@apex.com").empId;
  await db.employee.updateMany({ where: { id: { in: [g("s.chen@apex.com").empId, g("p.kapoor@apex.com").empId] } }, data: { managerId: fordId } });
  await db.employee.update({ where: { id: g("d.wu@apex.com").empId }, data: { managerId: g("l.morgan@apex.com").empId } });

  const empIds = APX_EMPS.map((e) => g(e.email).empId);
  await seedLeaveBalances(empIds);
  await seedAttendance(empIds);
  await seedPayroll(org.id, APX_EMPS.map((e) => ({ empId: g(e.email).empId, salary: e.salary })));

  await db.leaveRequest.createMany({ data: [
    { employeeId: g("s.chen@apex.com").empId,   leaveType: "ANNUAL", startDate: new Date("2026-04-07"), endDate: new Date("2026-04-09"), days: 3, reason: "Family event",       status: "APPROVED" },
    { employeeId: g("p.kapoor@apex.com").empId,  leaveType: "SICK",   startDate: new Date("2026-04-21"), endDate: new Date("2026-04-22"), days: 2, reason: "Unwell",             status: "APPROVED" },
    { employeeId: g("e.zhang@apex.com").empId,   leaveType: "CASUAL", startDate: new Date("2026-05-16"), endDate: new Date("2026-05-16"), days: 1, reason: "Personal errand",    status: "PENDING" },
    { employeeId: g("d.wu@apex.com").empId,      leaveType: "ANNUAL", startDate: new Date("2026-06-03"), endDate: new Date("2026-06-07"), days: 5, reason: "Summer holiday",     status: "PENDING" },
  ]});

  await db.claim.createMany({ data: [
    { employeeId: g("j.ford@apex.com").empId,    category: "TRAVEL",   amount: 45000, date: new Date("2026-04-12"), description: "Client roadshow â€” London & New York",     status: "APPROVED", reviewedAt: new Date("2026-04-12") },
    { employeeId: g("s.chen@apex.com").empId,    category: "TRAINING", amount: 28000, date: new Date("2026-04-22"), description: "CFA Level 3 exam and study materials",     status: "APPROVED", reviewedAt: new Date("2026-04-22") },
    { employeeId: g("m.ross@apex.com").empId,    category: "TRAVEL",   amount: 22000, date: new Date("2026-05-02"), description: "Risk management summit â€” Singapore",       status: "PENDING" },
    { employeeId: g("l.morgan@apex.com").empId,  category: "EQUIPMENT",amount: 15000, date: new Date("2026-04-18"), description: "Bloomberg terminal subscription",          status: "APPROVED", reviewedAt: new Date("2026-04-18") },
    { employeeId: g("d.wu@apex.com").empId,      category: "TRAINING", amount: 18000, date: new Date("2026-05-05"), description: "Quantitative finance certification",       status: "PENDING" },
  ]});

  const [cFin, cRisk, cComp, cQuant] = await Promise.all([
    db.course.create({ data: { orgId: org.id, title: "CFA Exam Preparation",        description: "Chartered Financial Analyst prep course",      category: "Finance",     duration: "80 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "Enterprise Risk Management",  description: "ERM frameworks and Basel III compliance",       category: "Risk",        duration: "35 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "Regulatory Compliance 2026",  description: "SEBI, RBI, and IRDAI regulatory updates",       category: "Compliance",  duration: "20 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "Algorithmic Trading Basics",  description: "Quant strategies and algo implementation",      category: "Trading",     duration: "45 hours", level: "Advanced"     } }),
  ]);
  await db.courseEnrollment.createMany({ data: [
    { courseId: cFin.id,   employeeId: g("s.chen@apex.com").empId,   progress: 70, enrolledAt: new Date("2026-03-01") },
    { courseId: cFin.id,   employeeId: g("p.kapoor@apex.com").empId, progress: 45, enrolledAt: new Date("2026-04-01") },
    { courseId: cRisk.id,  employeeId: g("m.ross@apex.com").empId,   progress: 100, completedAt: new Date("2026-04-10"), enrolledAt: new Date("2026-02-15") },
    { courseId: cComp.id,  employeeId: g("e.zhang@apex.com").empId,  progress: 85, enrolledAt: new Date("2026-03-20") },
    { courseId: cQuant.id, employeeId: g("d.wu@apex.com").empId,     progress: 60, enrolledAt: new Date("2026-04-05") },
  ]});

  await db.employeeCertification.createMany({ data: [
    { employeeId: g("j.ford@apex.com").empId,   name: "CFA Charterholder",              issuer: "CFA Institute",  credential: "CFA-2015-3421", earnedAt: new Date("2015-09-01") },
    { employeeId: g("s.chen@apex.com").empId,   name: "CFA Level 2",                    issuer: "CFA Institute",  credential: "CFA-L2-2024",   earnedAt: new Date("2024-08-15") },
    { employeeId: g("m.ross@apex.com").empId,   name: "Financial Risk Manager (FRM)",   issuer: "GARP",           credential: "FRM-2019-887",  earnedAt: new Date("2019-05-20") },
    { employeeId: g("e.zhang@apex.com").empId,  name: "Certified Compliance Officer",   issuer: "ICA",            credential: "ICA-CCO-2022",  earnedAt: new Date("2022-11-01"), expiresAt: new Date("2025-11-01") },
    { employeeId: g("d.wu@apex.com").empId,     name: "Certificate in Quantitative Finance", issuer: "CQF Institute", credential: "CQF-2023-156", earnedAt: new Date("2023-07-15") },
  ]});

  await db.goal.createMany({ data: [
    { employeeId: g("j.ford@apex.com").empId,   title: "Close 2 IPO mandates in FY2026",       description: "Target revenue: $8M in fees",            progress: 50, status: "IN_PROGRESS", dueDate: new Date("2026-12-31") },
    { employeeId: g("s.chen@apex.com").empId,   title: "Pass CFA Level 3 Exam",                description: "Final CFA examination",                  progress: 70, status: "IN_PROGRESS", dueDate: new Date("2026-08-31") },
    { employeeId: g("m.ross@apex.com").empId,   title: "Implement FRTB Framework",             description: "Basel IV market risk requirements",       progress: 35, status: "IN_PROGRESS", dueDate: new Date("2026-09-30") },
    { employeeId: g("e.zhang@apex.com").empId,  title: "Complete SEBI Compliance Audit",       description: "Annual regulatory audit preparation",     progress: 60, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
    { employeeId: g("l.morgan@apex.com").empId, title: "Grow Trading Desk P&L by 15%",         description: "Expand to new asset classes",            progress: 45, status: "IN_PROGRESS", dueDate: new Date("2026-12-31") },
    { employeeId: g("d.wu@apex.com").empId,     title: "Build Momentum Factor Model",           description: "Quant strategy for equities portfolio",  progress: 55, status: "IN_PROGRESS", dueDate: new Date("2026-07-31") },
  ]});

  const [ap1, ap2] = await Promise.all([
    db.project.create({ data: { orgId: org.id, name: "FRTB Compliance Implementation", description: "Basel IV fundamental review of trading book", status: "ACTIVE",    progress: 35, dueDate: new Date("2026-09-30") } }),
    db.project.create({ data: { orgId: org.id, name: "Algo Trading Platform v2",       description: "Next-gen algorithmic trading infrastructure", status: "ACTIVE",    progress: 55, dueDate: new Date("2026-08-31") } }),
  ]);
  await db.task.createMany({ data: [
    { orgId: org.id, projectId: ap1.id, title: "FRTB gap analysis vs current framework",   status: "DONE",        priority: "HIGH",   assigneeId: g("m.ross@apex.com").empId,   createdById: g("m.ross@apex.com").empId,   dueDate: new Date("2026-04-30") },
    { orgId: org.id, projectId: ap1.id, title: "Regulatory capital model update",           status: "IN_PROGRESS", priority: "HIGH",   assigneeId: g("e.zhang@apex.com").empId,  createdById: g("m.ross@apex.com").empId,   dueDate: new Date("2026-06-30") },
    { orgId: org.id, projectId: ap2.id, title: "Backtesting framework for momentum model", status: "IN_PROGRESS", priority: "HIGH",   assigneeId: g("d.wu@apex.com").empId,     createdById: g("l.morgan@apex.com").empId, dueDate: new Date("2026-06-15") },
    { orgId: org.id, projectId: ap2.id, title: "Low-latency order management system",      status: "TODO",        priority: "HIGH",   assigneeId: g("d.wu@apex.com").empId,     createdById: g("l.morgan@apex.com").empId, dueDate: new Date("2026-07-31") },
    { orgId: org.id,                    title: "Q2 client portfolio review decks",          status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: g("s.chen@apex.com").empId,   createdById: g("j.ford@apex.com").empId,   dueDate: new Date("2026-05-20") },
    { orgId: org.id,                    title: "AML policy annual update",                  status: "TODO",        priority: "HIGH",   assigneeId: g("e.zhang@apex.com").empId,  createdById: g("admin@apex.com").empId,    dueDate: new Date("2026-05-31") },
  ]});

  await db.performanceReview.createMany({ data: [
    { revieweeId: g("s.chen@apex.com").empId,   reviewerId: g("j.ford@apex.com").empId,   period: "Q1 2026", type: "Quarterly", score: 90, comments: "Exceptional deal support, client-ready deliverables", status: "COMPLETED", completedAt: new Date("2026-04-08") },
    { revieweeId: g("p.kapoor@apex.com").empId,  reviewerId: g("j.ford@apex.com").empId,   period: "Q1 2026", type: "Quarterly", score: 81, comments: "Strong analytical skills, developing client presence", status: "COMPLETED", completedAt: new Date("2026-04-09") },
    { revieweeId: g("d.wu@apex.com").empId,      reviewerId: g("l.morgan@apex.com").empId, period: "Q1 2026", type: "Quarterly", score: 87, comments: "Excellent quant modelling, improving market intuition", status: "COMPLETED", completedAt: new Date("2026-04-10") },
    { revieweeId: g("s.chen@apex.com").empId,    reviewerId: g("j.ford@apex.com").empId,   period: "Q2 2026", type: "Quarterly", status: "PENDING" },
  ]});

  const aJob = await db.jobPosting.create({ data: { orgId: org.id, title: "Risk Analyst", department: "Risk Management", location: "Mumbai (On-site)", type: "Full-time", description: "Market and credit risk modelling for trading portfolios." } });
  await db.candidate.createMany({ data: [
    { jobId: aJob.id, name: "Arjun Mehta",    email: "arjun.fin@gmail.com",   stage: "OFFER",     source: "Campus Recruitment", notes: "IIT Bombay, top of class, strong FRM prep" },
    { jobId: aJob.id, name: "Neha Sharma",    email: "neha.risk@gmail.com",   stage: "INTERVIEW", source: "LinkedIn",           notes: "3 years at Deutsche Bank, risk desk" },
    { jobId: aJob.id, name: "Rahul Verma",    email: "rahul.v@gmail.com",     stage: "SCREENING", source: "Referral" },
  ]});

  await db.onboardingRecord.createMany({ data: [
    { employeeId: g("p.kapoor@apex.com").empId, status: "IN_PROGRESS", startDate: new Date("2026-03-01"), dueDate: new Date("2026-05-01"), tasks: JSON.stringify([{ id:"1", title:"Compliance & ethics training", done:true },{ id:"2", title:"Bloomberg terminal certification", done:true },{ id:"3", title:"Shadow senior analyst for 30 days", done:true },{ id:"4", title:"First independent deal memo", done:false }]) },
  ]});

  const aUids = new Map(APX_EMPS.map((e) => [e.email, g(e.email).userId]));
  const apxAdminUserId = g("admin@apex.com").userId;
  const [aGen, aTrade, aComp] = await Promise.all([
    db.channel.create({ data: { orgId: org.id, name: "general",    isPrivate: false, createdBy: apxAdminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "trading",    isPrivate: false, createdBy: apxAdminUserId } }),
    db.channel.create({ data: { orgId: org.id, name: "compliance", isPrivate: false, createdBy: apxAdminUserId } }),
  ]);
  await db.message.createMany({ data: [
    { channelId: aGen.id,   senderId: aUids.get("admin@apex.com")!,     content: "Q2 all-hands is Thursday at 5 PM. Attendance mandatory.",                  createdAt: new Date("2026-05-04T09:00:00") },
    { channelId: aGen.id,   senderId: aUids.get("j.ford@apex.com")!,    content: "Strong deal pipeline this month. Great work from the IB team.",           createdAt: new Date("2026-05-05T09:30:00") },
    { channelId: aGen.id,   senderId: aUids.get("m.ross@apex.com")!,    content: "FRTB implementation update: gap analysis complete, on track for Q3.",     createdAt: new Date("2026-05-06T10:00:00") },
    { channelId: aTrade.id, senderId: aUids.get("l.morgan@apex.com")!,  content: "Nifty futures showing interesting momentum. Watch the 23,000 level.",     createdAt: new Date("2026-05-07T09:00:00") },
    { channelId: aTrade.id, senderId: aUids.get("d.wu@apex.com")!,      content: "Momentum model backtest showing Sharpe of 1.4 on 5Y data.",               createdAt: new Date("2026-05-07T09:30:00") },
    { channelId: aComp.id,  senderId: aUids.get("e.zhang@apex.com")!,   content: "SEBI circular on algo trading published today. Reviewing implications.",  createdAt: new Date("2026-05-08T10:00:00") },
    { channelId: aComp.id,  senderId: aUids.get("m.ross@apex.com")!,    content: "Thanks Emily. Please prepare a brief summary for the risk committee.",    createdAt: new Date("2026-05-08T10:30:00") },
  ]});

  await db.workflow.createMany({ data: [
    { orgId: org.id, name: "Leave Approval",         description: "Notify line manager on leave request",          trigger: "leave.requested",  isEnabled: true,  runsCount: 22, lastRunAt: new Date("2026-05-06T10:00:00") },
    { orgId: org.id, name: "Payroll Processing",     description: "Monthly payroll and bonus computation",          trigger: "payroll.scheduled",isEnabled: true,  runsCount: 6,  lastRunAt: new Date("2026-04-28T08:00:00") },
    { orgId: org.id, name: "Trade Limit Alert",      description: "Alert risk desk when position limits breached",  trigger: "trade.limit",      isEnabled: true,  runsCount: 9,  lastRunAt: new Date("2026-05-09T14:00:00") },
    { orgId: org.id, name: "Compliance Review",      description: "Trigger compliance review on flagged activity",  trigger: "compliance.flag",  isEnabled: true,  runsCount: 3,  lastRunAt: new Date("2026-04-15T11:00:00") },
  ]});

  await db.subscription.create({ data: { orgId: org.id, plan: "PRO", status: "active", currentPeriodEnd: new Date("2026-12-31") } });
  return org.id;
}

// â”€â”€â”€ Main â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

async function main() {
  console.log("ðŸŒ± Seeding database â€” 3 organisationsâ€¦\n");

  // Wipe all data in reverse dependency order
  await db.auditLog.deleteMany();
  await db.message.deleteMany();
  await db.channel.deleteMany();
  await db.payslip.deleteMany();
  await db.payrollRun.deleteMany();
  await db.claim.deleteMany();
  await db.leaveRequest.deleteMany();
  await db.leaveBalance.deleteMany();
  await db.attendanceRecord.deleteMany();
  await db.goal.deleteMany();
  await db.performanceReview.deleteMany();
  await db.task.deleteMany();
  await db.project.deleteMany();
  await db.candidate.deleteMany();
  await db.jobPosting.deleteMany();
  await db.courseEnrollment.deleteMany();
  await db.employeeCertification.deleteMany();
  await db.course.deleteMany();
  await db.onboardingRecord.deleteMany();
  await db.workflow.deleteMany();
  await db.employee.deleteMany();
  await db.department.deleteMany();
  await db.session.deleteMany();
  await db.account.deleteMany();
  await db.user.deleteMany();
  await db.subscription.deleteMany();
  await db.organization.deleteMany();

  const hash = await bcrypt.hash("password123", 12);

  console.log("Seeding Org 1: Monja Technologiesâ€¦");
  await seedMonja(hash);
  console.log("  âœ… Monja Technologies â€” 27 employees");

  console.log("Seeding Org 2: Meridian Health Systemsâ€¦");
  await seedMeridian(hash);
  console.log("  âœ… Meridian Health Systems â€” 10 employees");

  console.log("Seeding Org 3: Apex Financial Groupâ€¦");
  await seedApex(hash);
  console.log("  âœ… Apex Financial Group â€” 8 employees");

  console.log("\nâœ… Seed complete â€” 3 organisations, 45 employees total\n");
  console.log("ðŸ“‹ Demo accounts (all passwords: password123)");
  console.log("  Monja    : admin@Monja.com      (Super Admin)");
  console.log("               james.williams@Monja.com  (Manager)");
  console.log("               sarah.mitchell@Monja.com  (Employee)");
  console.log("  Meridian   : admin@meridian.com     (Super Admin)");
  console.log("               dr.kane@meridian.com   (Manager / CMO)");
  console.log("  Apex       : admin@apex.com         (Super Admin)");
  console.log("               j.ford@apex.com        (Manager / MD)");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
