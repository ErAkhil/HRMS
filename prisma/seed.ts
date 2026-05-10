import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

// Load .env.local so tsx can find DATABASE_URL
(function loadEnv() {
  const envPath = path.resolve(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const m = line.match(/^([^=]+)=(.*)$/);
    if (m && !process.env[m[1].trim()]) {
      process.env[m[1].trim()] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
})();

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const db = new PrismaClient({ adapter });

// ─── Seed Data Definitions ───────────────────────────────────────────────────

const DEPT_DATA = [
  { name: "Engineering",       color: "#6366F1", description: "Software development, platform infrastructure, and DevOps" },
  { name: "Product",           color: "#8B5CF6", description: "Product strategy, design, and user research" },
  { name: "Sales",             color: "#10B981", description: "Revenue generation, enterprise accounts, and business development" },
  { name: "Marketing",         color: "#F59E0B", description: "Brand, content marketing, and growth initiatives" },
  { name: "Finance",           color: "#EF4444", description: "Financial planning, accounting, budgeting, and compliance" },
  { name: "HR",                color: "#EC4899", description: "People operations, talent management, and culture" },
  { name: "Operations",        color: "#14B8A6", description: "Process management, logistics, and internal operations" },
  { name: "Customer Success",  color: "#F97316", description: "Client onboarding, retention, and support" },
];

// [email, role, deptName, firstName, lastName, title, salary, avatar, startDate, isHead]
const EMPLOYEE_DATA = [
  // HR (head: Sarah Johnson)
  ["admin@unikove.com",            "SUPER_ADMIN", "HR",              "Sarah",   "Johnson",   "HR Director",                  180000, "/images/user/user-01.png", "2022-01-15", true ],
  ["chris.walker@unikove.com",     "EMPLOYEE",    "HR",              "Chris",   "Walker",    "HR Specialist",                 85000, "/images/user/user-02.png", "2023-06-01", false],

  // Engineering (head: James Williams)
  ["james.williams@unikove.com",   "MANAGER",     "Engineering",     "James",   "Williams",  "VP of Engineering",            200000, "/images/user/user-03.png", "2021-06-01", true ],
  ["sarah.mitchell@unikove.com",   "EMPLOYEE",    "Engineering",     "Sarah",   "Mitchell",  "Senior Software Engineer",     150000, "/images/user/user-15.png", "2023-03-10", false],
  ["daniel.park@unikove.com",      "EMPLOYEE",    "Engineering",     "Daniel",  "Park",      "Frontend Engineer",            130000, "/images/user/user-04.png", "2023-07-01", false],
  ["arjun.mehta@unikove.com",      "EMPLOYEE",    "Engineering",     "Arjun",   "Mehta",     "Backend Engineer",             125000, "/images/user/user-05.png", "2024-01-08", false],
  ["elena.torres@unikove.com",     "EMPLOYEE",    "Engineering",     "Elena",   "Torres",    "QA Engineer",                  110000, "/images/user/user-06.png", "2023-09-01", false],
  ["marcus.chen@unikove.com",      "EMPLOYEE",    "Engineering",     "Marcus",  "Chen",      "DevOps Engineer",              145000, "/images/user/user-07.png", "2022-08-20", false],

  // Product (head: Priya Sharma)
  ["priya.sharma@unikove.com",     "EMPLOYEE",    "Product",         "Priya",   "Sharma",    "Product Designer",             130000, "/images/user/user-26.png", "2022-11-15", true ],
  ["lisa.chen@unikove.com",        "EMPLOYEE",    "Product",         "Lisa",    "Chen",      "Product Manager",              145000, "/images/user/user-08.png", "2023-02-01", false],
  ["alex.kumar@unikove.com",       "EMPLOYEE",    "Product",         "Alex",    "Kumar",     "UX Researcher",                105000, "/images/user/user-09.png", "2024-03-01", false],

  // Sales (head: Michael Brown)
  ["michael.brown@unikove.com",    "MANAGER",     "Sales",           "Michael", "Brown",     "Head of Sales",                160000, "/images/user/user-10.png", "2021-09-01", true ],
  ["jessica.davis@unikove.com",    "EMPLOYEE",    "Sales",           "Jessica", "Davis",     "Account Executive",             95000, "/images/user/user-11.png", "2022-11-01", false],
  ["ryan.wilson@unikove.com",      "EMPLOYEE",    "Sales",           "Ryan",    "Wilson",    "Sales Development Rep",         75000, "/images/user/user-12.png", "2024-02-01", false],
  ["amanda.taylor@unikove.com",    "EMPLOYEE",    "Sales",           "Amanda",  "Taylor",    "Senior Account Executive",     115000, "/images/user/user-13.png", "2023-01-15", false],

  // Marketing (head: Sophia Martinez)
  ["sophia.martinez@unikove.com",  "EMPLOYEE",    "Marketing",       "Sophia",  "Martinez",  "Marketing Director",           148000, "/images/user/user-14.png", "2022-04-01", true ],
  ["thomas.lee@unikove.com",       "EMPLOYEE",    "Marketing",       "Thomas",  "Lee",       "Growth Marketer",               95000, "/images/user/user-16.png", "2023-08-01", false],
  ["nicole.white@unikove.com",     "EMPLOYEE",    "Marketing",       "Nicole",  "White",     "Content Strategist",            90000, "/images/user/user-17.png", "2024-01-15", false],

  // Finance (head: Rachel Harris)
  ["rachel.harris@unikove.com",    "EMPLOYEE",    "Finance",         "Rachel",  "Harris",    "Finance Manager",              135000, "/images/user/user-18.png", "2022-07-01", true ],
  ["david.clark@unikove.com",      "EMPLOYEE",    "Finance",         "David",   "Clark",     "Financial Analyst",            102000, "/images/user/user-19.png", "2023-04-01", false],
  ["emma.robinson@unikove.com",    "EMPLOYEE",    "Finance",         "Emma",    "Robinson",  "Accountant",                    85000, "/images/user/user-20.png", "2024-06-01", false],

  // Operations (head: Brandon Allen)
  ["brandon.allen@unikove.com",    "EMPLOYEE",    "Operations",      "Brandon", "Allen",     "Operations Manager",           128000, "/images/user/user-21.png", "2022-03-01", true ],
  ["megan.young@unikove.com",      "EMPLOYEE",    "Operations",      "Megan",   "Young",     "Process Coordinator",           82000, "/images/user/user-22.png", "2023-05-01", false],
  ["tyler.king@unikove.com",       "EMPLOYEE",    "Operations",      "Tyler",   "King",      "Operations Analyst",            90000, "/images/user/user-23.png", "2024-04-01", false],

  // Customer Success (head: Ashley Wright)
  ["ashley.wright@unikove.com",    "EMPLOYEE",    "Customer Success","Ashley",  "Wright",    "Customer Success Lead",        112000, "/images/user/user-24.png", "2022-09-01", true ],
  ["jordan.scott@unikove.com",     "EMPLOYEE",    "Customer Success","Jordan",  "Scott",     "Customer Success Manager",      95000, "/images/user/user-25.png", "2023-07-01", false],
  ["maya.patel@unikove.com",       "EMPLOYEE",    "Customer Success","Maya",    "Patel",     "Support Specialist",            75000, "/images/user/user-27.png", "2024-05-01", false],
] as const;

async function main() {
  console.log("🌱 Seeding database…");

  // ── 1. Wipe all data in reverse dependency order ──────────────────────────
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

  // ── 2. Organisation ───────────────────────────────────────────────────────
  const org = await db.organization.create({
    data: {
      name: "Unikove Technologies",
      slug: "unikove",
      plan: "PRO_MAX",
      address: "12th Floor, Prestige Tower, MG Road, Bangalore 560001, India",
      taxId: "GSTIN: 29AABCU1234B1Z5",
    },
  });

  // ── 3. Departments (without headId — set after employees) ─────────────────
  const deptMap = new Map<string, string>(); // name → id
  for (const d of DEPT_DATA) {
    const dept = await db.department.create({
      data: { name: d.name, description: d.description, color: d.color, orgId: org.id },
    });
    deptMap.set(d.name, dept.id);
  }

  // ── 4. Users + Employees ──────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash("password123", 12);
  type CreatedPair = { userId: string; empId: string; empCode: string; deptName: string; isHead: boolean };
  const created: CreatedPair[] = [];

  for (let i = 0; i < EMPLOYEE_DATA.length; i++) {
    const [email, role, deptName, firstName, lastName, title, salary, avatar, startDate, isHead] = EMPLOYEE_DATA[i];
    const empCode = `EMP-${String(i + 1).padStart(4, "0")}`;
    const deptId = deptMap.get(deptName)!;

    const user = await db.user.create({
      data: { email, passwordHash, role: role as "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE", orgId: org.id },
    });
    const emp = await db.employee.create({
      data: {
        userId: user.id,
        orgId: org.id,
        employeeCode: empCode,
        firstName,
        lastName,
        email,
        title,
        departmentId: deptId,
        salary,
        avatarUrl: avatar,
        startDate: new Date(startDate),
        employmentType: "Full-time",
      },
    });
    created.push({ userId: user.id, empId: emp.id, empCode, deptName, isHead });
  }

  // Helper: find employee by email index
  const byEmail = (email: string) => {
    const idx = EMPLOYEE_DATA.findIndex((e) => e[0] === email);
    return created[idx];
  };

  // ── 5. Set department heads ───────────────────────────────────────────────
  for (const c of created) {
    if (c.isHead) {
      await db.department.update({
        where: { name_orgId: { name: c.deptName, orgId: org.id } },
        data: { headId: c.empId },
      });
    }
  }

  // ── 6. Manager relationships ──────────────────────────────────────────────
  const jamesId  = byEmail("james.williams@unikove.com").empId;
  const michaelId = byEmail("michael.brown@unikove.com").empId;

  // Engineering reports to James
  const engReports = ["sarah.mitchell", "daniel.park", "arjun.mehta", "elena.torres", "marcus.chen"].map(
    (n) => byEmail(`${n}@unikove.com`).empId
  );
  await db.employee.updateMany({ where: { id: { in: engReports } }, data: { managerId: jamesId } });

  // Sales reports to Michael
  const salesReports = ["jessica.davis", "ryan.wilson", "amanda.taylor"].map(
    (n) => byEmail(`${n}@unikove.com`).empId
  );
  await db.employee.updateMany({ where: { id: { in: salesReports } }, data: { managerId: michaelId } });

  // ── 7. Leave balances for all employees ───────────────────────────────────
  const year = new Date().getFullYear();
  const leaveTypes = [
    { type: "ANNUAL" as const, total: 24 },
    { type: "SICK"   as const, total: 12 },
    { type: "CASUAL" as const, total: 6  },
  ];
  for (const c of created) {
    for (const lt of leaveTypes) {
      await db.leaveBalance.create({
        data: {
          employeeId: c.empId,
          leaveType: lt.type,
          year,
          total: lt.total,
          used: Math.floor(Math.random() * 5),
        },
      });
    }
  }

  // ── 8. Leave requests ─────────────────────────────────────────────────────
  const leaveRequests = [
    { email: "sarah.mitchell@unikove.com", type: "ANNUAL",  start: "2026-04-07", end: "2026-04-09", days: 3, reason: "Family vacation",       status: "APPROVED" },
    { email: "daniel.park@unikove.com",    type: "SICK",    start: "2026-04-14", end: "2026-04-15", days: 2, reason: "Not feeling well",       status: "APPROVED" },
    { email: "priya.sharma@unikove.com",   type: "CASUAL",  start: "2026-04-22", end: "2026-04-22", days: 1, reason: "Personal work",          status: "APPROVED" },
    { email: "arjun.mehta@unikove.com",    type: "SICK",    start: "2026-04-28", end: "2026-04-29", days: 2, reason: "Medical appointment",    status: "APPROVED" },
    { email: "jessica.davis@unikove.com",  type: "ANNUAL",  start: "2026-05-05", end: "2026-05-07", days: 3, reason: "Trip to Goa",            status: "APPROVED" },
    { email: "sarah.mitchell@unikove.com", type: "SICK",    start: "2026-05-12", end: "2026-05-12", days: 1, reason: "Doctor visit",           status: "PENDING"  },
    { email: "marcus.chen@unikove.com",    type: "CASUAL",  start: "2026-05-19", end: "2026-05-20", days: 2, reason: "Personal errands",       status: "PENDING"  },
    { email: "daniel.park@unikove.com",    type: "ANNUAL",  start: "2026-05-26", end: "2026-05-30", days: 5, reason: "Summer vacation",        status: "PENDING"  },
    { email: "sarah.mitchell@unikove.com", type: "ANNUAL",  start: "2026-06-02", end: "2026-06-05", days: 4, reason: "Wedding",                status: "APPROVED" },
    { email: "james.williams@unikove.com", type: "CASUAL",  start: "2026-06-15", end: "2026-06-15", days: 1, reason: "Conference",             status: "APPROVED" },
    { email: "priya.sharma@unikove.com",   type: "ANNUAL",  start: "2026-07-01", end: "2026-07-04", days: 4, reason: "Holiday travel",         status: "PENDING"  },
    { email: "amanda.taylor@unikove.com",  type: "SICK",    start: "2026-05-08", end: "2026-05-09", days: 2, reason: "Flu",                    status: "APPROVED" },
    { email: "rachel.harris@unikove.com",  type: "CASUAL",  start: "2026-05-21", end: "2026-05-21", days: 1, reason: "Personal appointment",   status: "PENDING"  },
    { email: "brandon.allen@unikove.com",  type: "ANNUAL",  start: "2026-06-10", end: "2026-06-13", days: 4, reason: "Family trip",            status: "APPROVED" },
    { email: "ashley.wright@unikove.com",  type: "SICK",    start: "2026-05-15", end: "2026-05-15", days: 1, reason: "Medical checkup",        status: "APPROVED" },
  ] as const;

  for (const lr of leaveRequests) {
    const emp = byEmail(lr.email);
    await db.leaveRequest.create({
      data: {
        employeeId: emp.empId,
        leaveType: lr.type,
        startDate: new Date(lr.start),
        endDate: new Date(lr.end),
        days: lr.days,
        reason: lr.reason,
        status: lr.status,
      },
    });
  }

  // ── 9. Attendance — past 30 calendar days (weekdays only) ─────────────────
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let daysAgo = 0; daysAgo < 30; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;

    for (const c of created) {
      const rand = Math.random();
      let status: "PRESENT" | "ABSENT" | "LATE" | "REMOTE" | "HALF_DAY" = "PRESENT";
      if (daysAgo > 0) {
        if      (rand < 0.05) status = "ABSENT";
        else if (rand < 0.12) status = "LATE";
        else if (rand < 0.18) status = "REMOTE";
        else if (rand < 0.20) status = "HALF_DAY";
      }

      const checkIn  = status !== "ABSENT" ? new Date(date.getTime() + (status === "LATE" ? 10.5 : 9) * 3600000) : null;
      const checkOut = status !== "ABSENT" && status !== "HALF_DAY" ? new Date(date.getTime() + 18 * 3600000) : status === "HALF_DAY" ? new Date(date.getTime() + 13 * 3600000) : null;
      const hours    = status === "ABSENT" ? null : status === "HALF_DAY" ? 4 : status === "LATE" ? 7.5 : 9;

      try {
        await db.attendanceRecord.create({
          data: { employeeId: c.empId, date, checkIn, checkOut, status, hoursWorked: hours },
        });
      } catch { /* skip duplicate */ }
    }
  }

  // ── 10. Payroll runs — 6 months of history ────────────────────────────────
  const payrollMonths = [
    { month: 11, year: 2025 }, { month: 12, year: 2025 },
    { month: 1,  year: 2026 }, { month: 2,  year: 2026 },
    { month: 3,  year: 2026 }, { month: 4,  year: 2026 },
  ];

  for (const { month, year: yr } of payrollMonths) {
    let totalGross = 0;
    let totalDeductions = 0;
    const slips = created.map(({ empId }) => {
      const basic       = Number(EMPLOYEE_DATA[created.findIndex((c) => c.empId === empId)][6]);
      const hra         = basic * 0.4;
      const allowances  = basic * 0.1;
      const gross       = basic + hra + allowances;
      const tax         = gross * 0.1;
      const pf          = basic * 0.12;
      totalGross       += gross;
      totalDeductions  += tax + pf;
      return { employeeId: empId, basicSalary: basic, hra, allowances, grossPay: gross, taxDeduction: tax, pfDeduction: pf, otherDeductions: 0, netPay: gross - tax - pf };
    });

    const run = await db.payrollRun.create({
      data: {
        orgId: org.id, month, year: yr, status: "PROCESSED",
        totalGross, totalNet: totalGross - totalDeductions, totalDeductions,
        processedAt: new Date(yr, month - 1, 28),
      },
    });
    await db.payslip.createMany({ data: slips.map((s) => ({ ...s, payrollRunId: run.id })) });
  }

  // ── 11. Reimbursement claims ───────────────────────────────────────────────
  const claims = [
    { email: "sarah.mitchell@unikove.com",  cat: "TRAVEL",    amount: 4500,  date: "2026-04-10", desc: "Client meeting travel to Mumbai",        status: "APPROVED" },
    { email: "sarah.mitchell@unikove.com",  cat: "TRAINING",  amount: 12000, date: "2026-04-20", desc: "AWS certification exam fee",              status: "PENDING"  },
    { email: "daniel.park@unikove.com",     cat: "EQUIPMENT", amount: 8000,  date: "2026-04-25", desc: "External monitor for home office",        status: "PENDING"  },
    { email: "marcus.chen@unikove.com",     cat: "TRAVEL",    amount: 3200,  date: "2026-05-02", desc: "Conference transport to Delhi",           status: "APPROVED" },
    { email: "james.williams@unikove.com",  cat: "MEALS",     amount: 1800,  date: "2026-05-03", desc: "Team lunch — sprint retrospective",       status: "APPROVED" },
    { email: "priya.sharma@unikove.com",    cat: "TRAINING",  amount: 9500,  date: "2026-04-30", desc: "Figma Advanced certification",            status: "APPROVED" },
    { email: "michael.brown@unikove.com",   cat: "TRAVEL",    amount: 15000, date: "2026-04-18", desc: "Enterprise client visit — Hyderabad",     status: "APPROVED" },
    { email: "rachel.harris@unikove.com",   cat: "TRAINING",  amount: 7500,  date: "2026-05-01", desc: "CPA continuing education credits",        status: "PENDING"  },
    { email: "arjun.mehta@unikove.com",     cat: "EQUIPMENT", amount: 5500,  date: "2026-04-22", desc: "Mechanical keyboard for development",     status: "REJECTED" },
    { email: "amanda.taylor@unikove.com",   cat: "TRAVEL",    amount: 6200,  date: "2026-05-06", desc: "Sales conference — Mumbai",               status: "PENDING"  },
  ] as const;

  for (const c of claims) {
    const emp = byEmail(c.email);
    await db.claim.create({
      data: {
        employeeId: emp.empId,
        category: c.cat,
        amount: c.amount,
        date: new Date(c.date),
        description: c.desc,
        status: c.status,
        reviewedAt: c.status !== "PENDING" ? new Date(c.date) : null,
      },
    });
  }

  // ── 12. Courses ───────────────────────────────────────────────────────────
  const [courseReact, courseAws, courseTs, courseMgmt, courseDb, courseDesign, courseSales, courseFinance] = await Promise.all([
    db.course.create({ data: { orgId: org.id, title: "React & Next.js Mastery",        description: "Complete guide to React and Next.js",          category: "Frontend",    duration: "40 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "AWS Solutions Architect",         description: "Prepare for AWS SAA-C03 certification",         category: "Cloud",       duration: "60 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "TypeScript Fundamentals",         description: "Master TypeScript for production apps",          category: "Backend",     duration: "20 hours", level: "Beginner"     } }),
    db.course.create({ data: { orgId: org.id, title: "Leadership & Management",         description: "Effective team leadership skills",              category: "Management",  duration: "15 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "PostgreSQL & Database Design",    description: "Advanced database concepts and optimisation",    category: "Backend",     duration: "30 hours", level: "Advanced"     } }),
    db.course.create({ data: { orgId: org.id, title: "Product Design Principles",       description: "UX/UI best practices and design systems",        category: "Design",      duration: "25 hours", level: "Beginner"     } }),
    db.course.create({ data: { orgId: org.id, title: "B2B Sales Mastery",               description: "Enterprise sales techniques and negotiation",    category: "Sales",       duration: "18 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "Financial Modelling in Excel",    description: "Build robust financial models from scratch",     category: "Finance",     duration: "22 hours", level: "Intermediate" } }),
  ]);

  await db.courseEnrollment.createMany({
    data: [
      { courseId: courseReact.id,   employeeId: byEmail("sarah.mitchell@unikove.com").empId, progress: 75, enrolledAt: new Date("2026-03-01") },
      { courseId: courseAws.id,     employeeId: byEmail("sarah.mitchell@unikove.com").empId, progress: 40, enrolledAt: new Date("2026-04-01") },
      { courseId: courseTs.id,      employeeId: byEmail("sarah.mitchell@unikove.com").empId, progress: 100, completedAt: new Date("2026-03-15"), enrolledAt: new Date("2026-02-01") },
      { courseId: courseReact.id,   employeeId: byEmail("daniel.park@unikove.com").empId,    progress: 60, enrolledAt: new Date("2026-03-15") },
      { courseId: courseTs.id,      employeeId: byEmail("arjun.mehta@unikove.com").empId,    progress: 85, enrolledAt: new Date("2026-04-10") },
      { courseId: courseDb.id,      employeeId: byEmail("marcus.chen@unikove.com").empId,    progress: 50, enrolledAt: new Date("2026-04-01") },
      { courseId: courseMgmt.id,    employeeId: byEmail("james.williams@unikove.com").empId, progress: 90, enrolledAt: new Date("2026-02-01") },
      { courseId: courseDesign.id,  employeeId: byEmail("priya.sharma@unikove.com").empId,   progress: 100, completedAt: new Date("2026-04-20"), enrolledAt: new Date("2026-03-01") },
      { courseId: courseDesign.id,  employeeId: byEmail("lisa.chen@unikove.com").empId,      progress: 65, enrolledAt: new Date("2026-04-15") },
      { courseId: courseSales.id,   employeeId: byEmail("michael.brown@unikove.com").empId,  progress: 100, completedAt: new Date("2026-03-30"), enrolledAt: new Date("2026-02-15") },
      { courseId: courseSales.id,   employeeId: byEmail("jessica.davis@unikove.com").empId,  progress: 80, enrolledAt: new Date("2026-04-05") },
      { courseId: courseSales.id,   employeeId: byEmail("amanda.taylor@unikove.com").empId,  progress: 55, enrolledAt: new Date("2026-04-20") },
      { courseId: courseFinance.id, employeeId: byEmail("rachel.harris@unikove.com").empId,  progress: 70, enrolledAt: new Date("2026-03-20") },
      { courseId: courseFinance.id, employeeId: byEmail("david.clark@unikove.com").empId,    progress: 45, enrolledAt: new Date("2026-04-25") },
    ],
  });

  // ── 13. Certifications ────────────────────────────────────────────────────
  await db.employeeCertification.createMany({
    data: [
      { employeeId: byEmail("sarah.mitchell@unikove.com").empId, name: "TypeScript Developer",               issuer: "Microsoft",    credential: "MSFT-TS-2025",   earnedAt: new Date("2025-08-15") },
      { employeeId: byEmail("sarah.mitchell@unikove.com").empId, name: "React Certified Developer",          issuer: "Meta",         credential: "META-RCD-2025",  earnedAt: new Date("2025-12-10"), expiresAt: new Date("2027-12-10") },
      { employeeId: byEmail("marcus.chen@unikove.com").empId,    name: "AWS Solutions Architect Associate",  issuer: "Amazon",       credential: "AWS-SAA-2025",   earnedAt: new Date("2025-11-20"), expiresAt: new Date("2028-11-20") },
      { employeeId: byEmail("james.williams@unikove.com").empId, name: "Certified Scrum Master",             issuer: "Scrum Alliance",credential: "CSM-2025-007",  earnedAt: new Date("2025-06-01") },
      { employeeId: byEmail("priya.sharma@unikove.com").empId,   name: "Google UX Design Certificate",       issuer: "Google",       credential: "GOOG-UX-2025",   earnedAt: new Date("2025-09-15"), expiresAt: new Date("2028-09-15") },
      { employeeId: byEmail("michael.brown@unikove.com").empId,  name: "Certified Sales Professional",       issuer: "NASP",         credential: "CSP-2024-112",   earnedAt: new Date("2024-11-01") },
      { employeeId: byEmail("rachel.harris@unikove.com").empId,  name: "CPA — Chartered Public Accountant",  issuer: "ICAI",         credential: "CPA-2023-556",   earnedAt: new Date("2023-05-20") },
      { employeeId: byEmail("arjun.mehta@unikove.com").empId,    name: "Node.js Application Developer",      issuer: "OpenJS",       credential: "OADN-2026-009",  earnedAt: new Date("2026-01-15") },
    ],
  });

  // ── 14. Goals ─────────────────────────────────────────────────────────────
  await db.goal.createMany({
    data: [
      { employeeId: byEmail("sarah.mitchell@unikove.com").empId,  title: "Complete Platform v2.0 Auth Module",       description: "JWT-based auth with refresh tokens",      progress: 65, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
      { employeeId: byEmail("sarah.mitchell@unikove.com").empId,  title: "Reduce API Response Time to <100ms",        description: "Optimise DB queries and add caching",     progress: 40, status: "IN_PROGRESS", dueDate: new Date("2026-07-31") },
      { employeeId: byEmail("sarah.mitchell@unikove.com").empId,  title: "Complete AWS Solutions Architect Cert",     description: "Pass AWS SAA-C03 exam",                    progress: 80, status: "IN_PROGRESS", dueDate: new Date("2026-08-15") },
      { employeeId: byEmail("sarah.mitchell@unikove.com").empId,  title: "Lead Q2 Sprint Planning",                   description: "Take ownership of sprint ceremonies",      progress: 100, status: "COMPLETED",   dueDate: new Date("2026-04-30") },
      { employeeId: byEmail("daniel.park@unikove.com").empId,     title: "Build Design System v2",                    description: "Component library across all apps",       progress: 55, status: "IN_PROGRESS", dueDate: new Date("2026-07-15") },
      { employeeId: byEmail("daniel.park@unikove.com").empId,     title: "Implement dark mode across all pages",      description: "Consistent dark theme",                   progress: 100, status: "COMPLETED",   dueDate: new Date("2026-05-01") },
      { employeeId: byEmail("marcus.chen@unikove.com").empId,     title: "Migrate Services to Kubernetes",            description: "Full cluster migration by Q3",            progress: 30, status: "IN_PROGRESS", dueDate: new Date("2026-09-30") },
      { employeeId: byEmail("arjun.mehta@unikove.com").empId,     title: "Complete TypeScript Fundamentals Course",   description: "Finish online course",                    progress: 100, status: "COMPLETED",   dueDate: new Date("2026-04-30") },
      { employeeId: byEmail("priya.sharma@unikove.com").empId,    title: "Deliver Mobile App Wireframes v1",          description: "All major flows in Figma",                progress: 88, status: "IN_PROGRESS", dueDate: new Date("2026-05-22") },
      { employeeId: byEmail("priya.sharma@unikove.com").empId,    title: "Conduct 5 user testing sessions",           description: "Validate mobile onboarding flow",         progress: 60, status: "IN_PROGRESS", dueDate: new Date("2026-06-15") },
      { employeeId: byEmail("michael.brown@unikove.com").empId,   title: "Close 3 Enterprise Accounts Q2",            description: "Target: $500k ARR from new enterprise",  progress: 66, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
      { employeeId: byEmail("jessica.davis@unikove.com").empId,   title: "Achieve 120% of Q2 Sales Quota",            description: "Quota: $150k ARR",                        progress: 50, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
      { employeeId: byEmail("james.williams@unikove.com").empId,  title: "Complete Certified Scrum Master Renewal",   description: "Recertification by June",                 progress: 100, status: "COMPLETED",   dueDate: new Date("2026-05-31") },
      { employeeId: byEmail("james.williams@unikove.com").empId,  title: "Hire 2 Senior Engineers in Q2",             description: "Fill open FE and BE roles",               progress: 50, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
      { employeeId: byEmail("rachel.harris@unikove.com").empId,   title: "Close FY2026 Books by June 30",             description: "Annual close with auditor sign-off",      progress: 20, status: "NOT_STARTED",  dueDate: new Date("2026-06-30") },
    ],
  });

  // ── 15. Projects & Tasks ──────────────────────────────────────────────────
  const sarahEmp   = byEmail("sarah.mitchell@unikove.com").empId;
  const jamesEmp   = jamesId;
  const danielEmp  = byEmail("daniel.park@unikove.com").empId;
  const marcusEmp  = byEmail("marcus.chen@unikove.com").empId;
  const arjunEmp   = byEmail("arjun.mehta@unikove.com").empId;
  const elenaEmp   = byEmail("elena.torres@unikove.com").empId;
  const priyaEmp   = byEmail("priya.sharma@unikove.com").empId;

  const [p1, p2, p3] = await Promise.all([
    db.project.create({ data: { orgId: org.id, name: "Platform Redesign v2.0",  description: "Full redesign of the core platform",          status: "ACTIVE",    progress: 68, dueDate: new Date("2026-08-31") } }),
    db.project.create({ data: { orgId: org.id, name: "Mobile App MVP",          description: "Cross-platform mobile application",            status: "ACTIVE",    progress: 35, dueDate: new Date("2026-10-31") } }),
    db.project.create({ data: { orgId: org.id, name: "Internal DevOps Upgrade", description: "Kubernetes migration and CI/CD improvements",  status: "ACTIVE",    progress: 30, dueDate: new Date("2026-09-30") } }),
  ]);

  await db.task.createMany({
    data: [
      { orgId: org.id, projectId: p1.id, title: "Design new authentication flow",           status: "IN_PROGRESS", priority: "HIGH",   assigneeId: sarahEmp,  createdById: sarahEmp,  dueDate: new Date("2026-05-15") },
      { orgId: org.id,                    title: "Code review: API rate limiting PR",         status: "TODO",        priority: "HIGH",   assigneeId: sarahEmp,  createdById: jamesEmp,  dueDate: new Date("2026-05-10") },
      { orgId: org.id,                    title: "Update onboarding documentation",           status: "TODO",        priority: "MEDIUM", assigneeId: sarahEmp,  createdById: sarahEmp,  dueDate: new Date("2026-05-20") },
      { orgId: org.id, projectId: p1.id, title: "Implement dark mode toggle",               status: "DONE",        priority: "LOW",    assigneeId: danielEmp, createdById: jamesEmp,  dueDate: new Date("2026-05-01") },
      { orgId: org.id, projectId: p2.id, title: "Setup React Native project scaffolding",   status: "DONE",        priority: "HIGH",   assigneeId: danielEmp, createdById: danielEmp, dueDate: new Date("2026-04-20") },
      { orgId: org.id, projectId: p1.id, title: "Performance optimisation audit",           status: "IN_REVIEW",   priority: "HIGH",   assigneeId: marcusEmp, createdById: jamesEmp,  dueDate: new Date("2026-05-12") },
      { orgId: org.id,                    title: "Write unit tests for auth module",          status: "TODO",        priority: "MEDIUM", assigneeId: elenaEmp,  createdById: sarahEmp,  dueDate: new Date("2026-05-18") },
      { orgId: org.id, projectId: p2.id, title: "Design mobile UI wireframes",              status: "IN_PROGRESS", priority: "HIGH",   assigneeId: priyaEmp,  createdById: jamesEmp,  dueDate: new Date("2026-05-22") },
      { orgId: org.id, projectId: p3.id, title: "Migrate auth service to K8s",             status: "IN_PROGRESS", priority: "HIGH",   assigneeId: marcusEmp, createdById: marcusEmp, dueDate: new Date("2026-06-10") },
      { orgId: org.id, projectId: p3.id, title: "Set up GitHub Actions CI/CD pipeline",    status: "TODO",        priority: "MEDIUM", assigneeId: marcusEmp, createdById: jamesEmp,  dueDate: new Date("2026-06-15") },
      { orgId: org.id, projectId: p1.id, title: "Integrate Stripe payment gateway",         status: "TODO",        priority: "HIGH",   assigneeId: arjunEmp,  createdById: jamesEmp,  dueDate: new Date("2026-06-01") },
      { orgId: org.id,                    title: "Refactor employee API endpoints",          status: "IN_PROGRESS", priority: "MEDIUM", assigneeId: arjunEmp,  createdById: arjunEmp,  dueDate: new Date("2026-05-25") },
    ],
  });

  // ── 16. Performance reviews ───────────────────────────────────────────────
  await db.performanceReview.createMany({
    data: [
      { revieweeId: sarahEmp,  reviewerId: jamesEmp,  period: "Q1 2026", type: "Quarterly",     score: 88, comments: "Excellent technical work, great collaboration",         status: "COMPLETED", completedAt: new Date("2026-04-05") },
      { revieweeId: danielEmp, reviewerId: jamesEmp,  period: "Q1 2026", type: "Quarterly",     score: 82, comments: "Good progress on frontend tasks, strong ownership",     status: "COMPLETED", completedAt: new Date("2026-04-06") },
      { revieweeId: arjunEmp,  reviewerId: jamesEmp,  period: "Q1 2026", type: "Quarterly",     score: 79, comments: "Growing quickly, needs more production experience",     status: "COMPLETED", completedAt: new Date("2026-04-07") },
      { revieweeId: marcusEmp, reviewerId: jamesEmp,  period: "Q1 2026", type: "Quarterly",     score: 91, comments: "Outstanding infra work, K8s migration ahead of plan",  status: "COMPLETED", completedAt: new Date("2026-04-08") },
      { revieweeId: elenaEmp,  reviewerId: jamesEmp,  period: "Q1 2026", type: "Quarterly",     score: 85, comments: "Thorough QA process, caught several critical bugs",     status: "COMPLETED", completedAt: new Date("2026-04-09") },
      { revieweeId: sarahEmp,  reviewerId: jamesEmp,  period: "Q2 2026", type: "Quarterly",     status: "PENDING" },
      { revieweeId: danielEmp, reviewerId: jamesEmp,  period: "Q2 2026", type: "Quarterly",     status: "PENDING" },
      { revieweeId: marcusEmp, reviewerId: jamesEmp,  period: "Q2 2026", type: "Quarterly",     status: "PENDING" },
      { revieweeId: elenaEmp,  reviewerId: jamesEmp,  period: "Q2 2026", type: "Quarterly",     status: "PENDING" },
      { revieweeId: sarahEmp,  reviewerId: jamesEmp,  period: "FY 2025", type: "Annual Review", score: 87, comments: "Consistent high performance across the year",           status: "COMPLETED", completedAt: new Date("2026-01-10") },
    ],
  });

  // ── 17. Job postings & candidates ─────────────────────────────────────────
  const [job1, job2, job3] = await Promise.all([
    db.jobPosting.create({ data: { orgId: org.id, title: "Senior React Engineer",   department: "Engineering",     location: "Bangalore (Hybrid)", type: "Full-time",  description: "We are looking for a Senior React Engineer to lead frontend development." } }),
    db.jobPosting.create({ data: { orgId: org.id, title: "Product Manager",         department: "Product",         location: "Remote",             type: "Full-time",  description: "Drive product strategy and roadmap for our core platform." } }),
    db.jobPosting.create({ data: { orgId: org.id, title: "Enterprise Account Exec", department: "Sales",           location: "Mumbai",             type: "Full-time",  description: "Own the full sales cycle for enterprise accounts." } }),
  ]);

  await db.candidate.createMany({
    data: [
      { jobId: job1.id, name: "Rahul Kumar",    email: "rahul.k@gmail.com",    stage: "INTERVIEW",  source: "LinkedIn",  notes: "Strong React + Next.js experience, 5 years" },
      { jobId: job1.id, name: "Anjali Singh",   email: "anjali.s@gmail.com",   stage: "SCREENING",  source: "Referral",  notes: "Recommended by Sarah Mitchell" },
      { jobId: job1.id, name: "Vikram Nair",    email: "v.nair@gmail.com",     stage: "OFFER",      source: "Indeed",    notes: "Offer sent: ₹140k package" },
      { jobId: job1.id, name: "Neha Kapoor",    email: "neha.k@gmail.com",     stage: "REJECTED",   source: "LinkedIn",  notes: "Not enough system design experience" },
      { jobId: job2.id, name: "Sneha Gupta",    email: "sneha.g@gmail.com",    stage: "APPLIED",    source: "LinkedIn" },
      { jobId: job2.id, name: "Kunal Agarwal",  email: "kunal.a@gmail.com",    stage: "INTERVIEW",  source: "Referral",  notes: "Strong PM background at Flipkart" },
      { jobId: job3.id, name: "Ravi Menon",     email: "ravi.m@gmail.com",     stage: "SCREENING",  source: "LinkedIn" },
      { jobId: job3.id, name: "Pooja Verma",    email: "pooja.v@gmail.com",    stage: "INTERVIEW",  source: "Naukri",    notes: "7 years enterprise SaaS sales" },
    ],
  });

  // ── 18. Onboarding records ────────────────────────────────────────────────
  await db.onboardingRecord.createMany({
    data: [
      {
        employeeId: byEmail("arjun.mehta@unikove.com").empId,
        status: "IN_PROGRESS", startDate: new Date("2026-04-01"), dueDate: new Date("2026-05-30"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork",           done: true  },
          { id: "2", title: "Setup development environment",   done: true  },
          { id: "3", title: "Meet the team",                   done: true  },
          { id: "4", title: "Complete security training",      done: false },
          { id: "5", title: "First code review",               done: false },
        ]),
      },
      {
        employeeId: byEmail("elena.torres@unikove.com").empId,
        status: "IN_PROGRESS", startDate: new Date("2026-04-15"), dueDate: new Date("2026-06-15"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork",           done: true  },
          { id: "2", title: "Setup QA environment",            done: true  },
          { id: "3", title: "Review test case library",        done: false },
          { id: "4", title: "Complete compliance training",    done: false },
          { id: "5", title: "First test cycle run",            done: false },
        ]),
      },
      {
        employeeId: byEmail("ryan.wilson@unikove.com").empId,
        status: "IN_PROGRESS", startDate: new Date("2026-03-01"), dueDate: new Date("2026-05-01"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork",           done: true  },
          { id: "2", title: "CRM setup and training",          done: true  },
          { id: "3", title: "Shadow 5 sales calls",            done: true  },
          { id: "4", title: "Complete sales methodology course",done: true  },
          { id: "5", title: "First independent demo",          done: false },
        ]),
      },
      {
        employeeId: byEmail("tyler.king@unikove.com").empId,
        status: "NOT_STARTED", startDate: new Date("2026-05-01"), dueDate: new Date("2026-06-30"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork",           done: false },
          { id: "2", title: "Operations system walkthrough",   done: false },
          { id: "3", title: "Meet stakeholders",               done: false },
        ]),
      },
      {
        employeeId: byEmail("maya.patel@unikove.com").empId,
        status: "NOT_STARTED", startDate: new Date("2026-05-15"), dueDate: new Date("2026-07-15"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork",           done: false },
          { id: "2", title: "Zendesk training",                done: false },
          { id: "3", title: "Shadow senior CS rep for 1 week", done: false },
          { id: "4", title: "Handle first 5 tickets solo",     done: false },
        ]),
      },
    ],
  });

  // ── 19. Channels & messages ───────────────────────────────────────────────
  const uids = EMPLOYEE_DATA.map((_, i) => created[i].userId);
  const getUid = (email: string) => {
    const idx = EMPLOYEE_DATA.findIndex((e) => e[0] === email);
    return uids[idx];
  };

  const [chanGeneral, chanEng, chanProduct, chanSales, chanRandom] = await Promise.all([
    db.channel.create({ data: { orgId: org.id, name: "general",  isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "engineering", isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "product",  isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "sales",    isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "random",   isPrivate: false } }),
  ]);

  await db.message.createMany({
    data: [
      { channelId: chanGeneral.id, senderId: getUid("admin@unikove.com"),           content: "Good morning everyone! Hope you had a great weekend.",                    createdAt: new Date("2026-05-04T09:00:00") },
      { channelId: chanGeneral.id, senderId: getUid("james.williams@unikove.com"),  content: "Morning! Ready for sprint planning today?",                               createdAt: new Date("2026-05-04T09:05:00") },
      { channelId: chanGeneral.id, senderId: getUid("sarah.mitchell@unikove.com"),  content: "Sprint planning at 10 AM, right? I'll be there.",                         createdAt: new Date("2026-05-04T09:10:00") },
      { channelId: chanGeneral.id, senderId: getUid("admin@unikove.com"),           content: "Reminder: Q2 performance reviews are due by May 15th. Please don't miss!",createdAt: new Date("2026-05-05T10:00:00") },
      { channelId: chanGeneral.id, senderId: getUid("priya.sharma@unikove.com"),    content: "Thanks for the heads-up! Will submit mine by end of week.",               createdAt: new Date("2026-05-05T10:15:00") },
      { channelId: chanGeneral.id, senderId: getUid("james.williams@unikove.com"),  content: "Platform v2.0 is on track for Q3. Great work everyone! 🚀",              createdAt: new Date("2026-05-06T11:00:00") },
      { channelId: chanGeneral.id, senderId: getUid("sarah.mitchell@unikove.com"),  content: "Auth module is 65% done, should be ready by next sprint.",                createdAt: new Date("2026-05-07T09:30:00") },
      { channelId: chanGeneral.id, senderId: getUid("daniel.park@unikove.com"),     content: "Dark mode is live on staging! Feel free to test it out.",                 createdAt: new Date("2026-05-08T14:00:00") },
      { channelId: chanGeneral.id, senderId: getUid("admin@unikove.com"),           content: "Excellent work Daniel! Let's demo it in tomorrow's all-hands.",           createdAt: new Date("2026-05-08T14:30:00") },
      { channelId: chanGeneral.id, senderId: getUid("michael.brown@unikove.com"),   content: "Sales team closed 2 enterprise deals this week. Big win! 🎉",           createdAt: new Date("2026-05-09T09:00:00") },
      { channelId: chanEng.id,     senderId: getUid("james.williams@unikove.com"),  content: "Code review session at 3 PM for the rate limiting PR.",                   createdAt: new Date("2026-05-07T09:00:00") },
      { channelId: chanEng.id,     senderId: getUid("sarah.mitchell@unikove.com"),  content: "I'll have my comments ready. The approach looks solid.",                  createdAt: new Date("2026-05-07T09:15:00") },
      { channelId: chanEng.id,     senderId: getUid("marcus.chen@unikove.com"),     content: "K8s migration going well — auth and user services migrated. 3 more to go.",createdAt: new Date("2026-05-07T10:00:00") },
      { channelId: chanEng.id,     senderId: getUid("arjun.mehta@unikove.com"),     content: "Backend notifications API is merged. Passing to QA now.",                 createdAt: new Date("2026-05-08T11:00:00") },
      { channelId: chanEng.id,     senderId: getUid("elena.torres@unikove.com"),    content: "Will start testing the notifications module tomorrow morning.",            createdAt: new Date("2026-05-08T11:15:00") },
      { channelId: chanProduct.id, senderId: getUid("priya.sharma@unikove.com"),    content: "New wireframes for the mobile app are in Figma. Please review!",          createdAt: new Date("2026-05-07T13:00:00") },
      { channelId: chanProduct.id, senderId: getUid("james.williams@unikove.com"),  content: "Looks great Priya! The onboarding flow is much cleaner now.",             createdAt: new Date("2026-05-07T13:30:00") },
      { channelId: chanProduct.id, senderId: getUid("lisa.chen@unikove.com"),       content: "Updated user journey based on last week's testing feedback too.",          createdAt: new Date("2026-05-07T14:00:00") },
      { channelId: chanSales.id,   senderId: getUid("michael.brown@unikove.com"),   content: "Team, great pipeline this week. Vikram's offer is out — fingers crossed!", createdAt: new Date("2026-05-08T09:00:00") },
      { channelId: chanSales.id,   senderId: getUid("jessica.davis@unikove.com"),   content: "TechCorp demo went well — they want a follow-up call next Tuesday.",      createdAt: new Date("2026-05-08T09:30:00") },
      { channelId: chanSales.id,   senderId: getUid("amanda.taylor@unikove.com"),   content: "GlobalBank renewal signed! $180k ARR. Big quarter! 💪",                  createdAt: new Date("2026-05-09T10:00:00") },
      { channelId: chanRandom.id,  senderId: getUid("daniel.park@unikove.com"),     content: "Anyone for lunch at the new Thai place near the office?",                 createdAt: new Date("2026-05-08T12:00:00") },
      { channelId: chanRandom.id,  senderId: getUid("sarah.mitchell@unikove.com"),  content: "I'm in! See you at 1 PM?",                                               createdAt: new Date("2026-05-08T12:10:00") },
      { channelId: chanRandom.id,  senderId: getUid("arjun.mehta@unikove.com"),     content: "Count me in!",                                                            createdAt: new Date("2026-05-08T12:15:00") },
    ],
  });

  // ── 20. Workflows ─────────────────────────────────────────────────────────
  await db.workflow.createMany({
    data: [
      { orgId: org.id, name: "Leave Approval",           description: "Auto-notify manager when leave is requested",          trigger: "leave.requested",  isEnabled: true,  runsCount: 47, lastRunAt: new Date("2026-05-08T10:00:00") },
      { orgId: org.id, name: "New Employee Onboarding",  description: "Create onboarding checklist for new hires",           trigger: "employee.created", isEnabled: true,  runsCount: 12, lastRunAt: new Date("2026-04-15T09:00:00") },
      { orgId: org.id, name: "Monthly Payroll Run",      description: "Process payroll on the last business day of month",   trigger: "payroll.scheduled",isEnabled: true,  runsCount: 6,  lastRunAt: new Date("2026-04-28T08:00:00") },
      { orgId: org.id, name: "Performance Review Alerts",description: "Remind employees and managers about pending reviews", trigger: "review.pending",   isEnabled: false, runsCount: 3,  lastRunAt: new Date("2026-04-01T09:00:00") },
      { orgId: org.id, name: "Task Overdue Alert",       description: "Alert assignee when a task passes its due date",      trigger: "task.overdue",     isEnabled: true,  runsCount: 18, lastRunAt: new Date("2026-05-07T09:00:00") },
      { orgId: org.id, name: "Birthday Reminder",        description: "Send birthday wishes to employees automatically",     trigger: "employee.birthday",isEnabled: true,  runsCount: 8,  lastRunAt: new Date("2026-05-04T08:00:00") },
    ],
  });

  // ── 21. Subscription ──────────────────────────────────────────────────────
  await db.subscription.create({
    data: { orgId: org.id, plan: "PRO_MAX", status: "active", currentPeriodEnd: new Date("2026-12-31") },
  });

  // ── Done ─────────────────────────────────────────────────────────────────
  const empCount = await db.employee.count({ where: { orgId: org.id } });
  const deptCount = await db.department.count({ where: { orgId: org.id } });
  console.log(`\n✅ Seed complete — ${empCount} employees across ${deptCount} departments`);
  console.log("\n📋 Demo accounts (all passwords: password123)");
  console.log("  Super Admin : admin@unikove.com");
  console.log("  Manager     : james.williams@unikove.com");
  console.log("  Employee    : sarah.mitchell@unikove.com");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
