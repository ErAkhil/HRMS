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

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up in reverse dependency order
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

  // Organization
  const org = await db.organization.create({
    data: {
      name: "Unikove Technologies",
      slug: "unikove",
      plan: "PRO_MAX",
      address: "123 Tech Park, Bangalore, India 560001",
      taxId: "GSTIN: 29AABCU1234B1Z5",
    },
  });

  const passwordHash = await bcrypt.hash("password123", 12);

  // Departments
  const [engineering, product, , hr, ,] = await Promise.all([
    db.department.create({ data: { name: "Engineering", orgId: org.id } }),
    db.department.create({ data: { name: "Product", orgId: org.id } }),
    db.department.create({ data: { name: "Sales", orgId: org.id } }),
    db.department.create({ data: { name: "HR", orgId: org.id } }),
    db.department.create({ data: { name: "Finance", orgId: org.id } }),
    db.department.create({ data: { name: "Marketing", orgId: org.id } }),
  ]);

  // Users + Employees
  const usersData = [
    { email: "admin@unikove.com", role: "SUPER_ADMIN" as const, employee: { firstName: "Sarah", lastName: "Johnson", title: "HR Director", departmentId: hr.id, salary: 180000, employeeCode: "EMP-0001", startDate: new Date("2022-01-15") } },
    { email: "james.williams@unikove.com", role: "MANAGER" as const, employee: { firstName: "James", lastName: "Williams", title: "Engineering Manager", departmentId: engineering.id, salary: 200000, employeeCode: "EMP-0002", startDate: new Date("2021-06-01") } },
    { email: "sarah.mitchell@unikove.com", role: "EMPLOYEE" as const, employee: { firstName: "Sarah", lastName: "Mitchell", title: "Senior Software Engineer", departmentId: engineering.id, salary: 150000, employeeCode: "EMP-0003", startDate: new Date("2023-03-10") } },
    { email: "daniel.park@unikove.com", role: "EMPLOYEE" as const, employee: { firstName: "Daniel", lastName: "Park", title: "Frontend Engineer", departmentId: engineering.id, salary: 130000, employeeCode: "EMP-0004", startDate: new Date("2023-07-01") } },
    { email: "priya.sharma@unikove.com", role: "EMPLOYEE" as const, employee: { firstName: "Priya", lastName: "Sharma", title: "Product Designer", departmentId: product.id, salary: 140000, employeeCode: "EMP-0005", startDate: new Date("2022-11-15") } },
    { email: "arjun.mehta@unikove.com", role: "EMPLOYEE" as const, employee: { firstName: "Arjun", lastName: "Mehta", title: "Backend Engineer", departmentId: engineering.id, salary: 125000, employeeCode: "EMP-0006", startDate: new Date("2024-01-08") } },
    { email: "elena.torres@unikove.com", role: "EMPLOYEE" as const, employee: { firstName: "Elena", lastName: "Torres", title: "QA Engineer", departmentId: engineering.id, salary: 110000, employeeCode: "EMP-0007", startDate: new Date("2023-09-01") } },
    { email: "marcus.chen@unikove.com", role: "EMPLOYEE" as const, employee: { firstName: "Marcus", lastName: "Chen", title: "DevOps Engineer", departmentId: engineering.id, salary: 145000, employeeCode: "EMP-0008", startDate: new Date("2022-08-20") } },
  ];

  const createdUsers: { user: { id: string }; employee: { id: string; salary: number | { toString(): string } } }[] = [];
  for (const u of usersData) {
    const user = await db.user.create({ data: { email: u.email, passwordHash, role: u.role, orgId: org.id } });
    const employee = await db.employee.create({ data: { ...u.employee, userId: user.id, orgId: org.id, email: u.email } });
    createdUsers.push({ user, employee });
  }

  // Manager relationships
  const manager = createdUsers[1].employee;
  await db.employee.updateMany({
    where: { orgId: org.id, departmentId: engineering.id, id: { not: manager.id } },
    data: { managerId: manager.id },
  });

  // Leave balances
  const leaveTypes = ["ANNUAL", "SICK", "CASUAL"] as const;
  const totals = { ANNUAL: 24, SICK: 12, CASUAL: 6 };
  for (const { employee } of createdUsers) {
    for (const lt of leaveTypes) {
      await db.leaveBalance.create({ data: { employeeId: employee.id, leaveType: lt, year: new Date().getFullYear(), total: totals[lt], used: Math.floor(Math.random() * 4) } });
    }
  }

  // Leave requests spread across months (for calendar display)
  const leaveData = [
    { idx: 2, leaveType: "ANNUAL", start: "2026-04-07", end: "2026-04-09", days: 3, reason: "Family vacation", status: "APPROVED" },
    { idx: 3, leaveType: "SICK", start: "2026-04-14", end: "2026-04-15", days: 2, reason: "Not feeling well", status: "APPROVED" },
    { idx: 4, leaveType: "CASUAL", start: "2026-04-22", end: "2026-04-22", days: 1, reason: "Personal work", status: "APPROVED" },
    { idx: 5, leaveType: "SICK", start: "2026-04-28", end: "2026-04-29", days: 2, reason: "Medical appointment", status: "APPROVED" },
    { idx: 6, leaveType: "ANNUAL", start: "2026-05-05", end: "2026-05-07", days: 3, reason: "Trip to Goa", status: "APPROVED" },
    { idx: 2, leaveType: "SICK", start: "2026-05-12", end: "2026-05-12", days: 1, reason: "Doctor visit", status: "PENDING" },
    { idx: 7, leaveType: "CASUAL", start: "2026-05-19", end: "2026-05-20", days: 2, reason: "Personal errands", status: "PENDING" },
    { idx: 4, leaveType: "ANNUAL", start: "2026-05-26", end: "2026-05-30", days: 5, reason: "Summer vacation", status: "PENDING" },
    { idx: 3, leaveType: "ANNUAL", start: "2026-06-02", end: "2026-06-05", days: 4, reason: "Wedding", status: "APPROVED" },
    { idx: 1, leaveType: "CASUAL", start: "2026-06-15", end: "2026-06-15", days: 1, reason: "Conference", status: "APPROVED" },
  ] as const;

  for (const lr of leaveData) {
    await db.leaveRequest.create({
      data: {
        employeeId: createdUsers[lr.idx].employee.id,
        leaveType: lr.leaveType,
        startDate: new Date(lr.start),
        endDate: new Date(lr.end),
        days: lr.days,
        reason: lr.reason,
        status: lr.status,
      },
    });
  }

  // Attendance records (past 21 calendar days, weekdays only)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let daysAgo = 0; daysAgo < 21; daysAgo++) {
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    const dow = date.getDay();
    if (dow === 0 || dow === 6) continue;
    for (let i = 0; i < createdUsers.length; i++) {
      const { employee } = createdUsers[i];
      let status = "PRESENT";
      if (daysAgo > 0 && Math.random() < 0.08) status = "ABSENT";
      else if (daysAgo > 0 && Math.random() < 0.12) status = "LATE";
      try {
        await db.attendanceRecord.create({
          data: {
            employeeId: employee.id,
            date,
            checkIn: status !== "ABSENT" ? new Date(date.getTime() + (status === "LATE" ? 10.5 : 9) * 3600000) : null,
            checkOut: status !== "ABSENT" ? new Date(date.getTime() + 18 * 3600000) : null,
            status: status as "PRESENT" | "ABSENT" | "LATE",
            hoursWorked: status !== "ABSENT" ? (status === "LATE" ? 7.5 : 9) : null,
          },
        });
      } catch {
        // skip duplicate
      }
    }
  }

  // Payroll runs — 6 months of history
  const payrollMonths = [
    { month: 11, year: 2025 },
    { month: 12, year: 2025 },
    { month: 1, year: 2026 },
    { month: 2, year: 2026 },
    { month: 3, year: 2026 },
    { month: 4, year: 2026 },
  ];

  for (const { month, year } of payrollMonths) {
    let totalGross = 0;
    let totalDeductions = 0;
    const slipsData = createdUsers.map(({ employee }) => {
      const basic = Number(employee.salary);
      const hra = basic * 0.4;
      const allowances = basic * 0.1;
      const gross = basic + hra + allowances;
      const tax = gross * 0.1;
      const pf = basic * 0.12;
      totalGross += gross;
      totalDeductions += tax + pf;
      return { employeeId: employee.id, basicSalary: basic, hra, allowances, grossPay: gross, taxDeduction: tax, pfDeduction: pf, otherDeductions: 0, netPay: gross - tax - pf };
    });
    const run = await db.payrollRun.create({
      data: { orgId: org.id, month, year, status: "PROCESSED", totalGross, totalNet: totalGross - totalDeductions, totalDeductions, processedAt: new Date(year, month - 1, 28) },
    });
    await db.payslip.createMany({ data: slipsData.map((s) => ({ ...s, payrollRunId: run.id })) });
  }

  // Courses
  const [courseReact, courseAws, courseTs, courseMgmt, courseDb, courseDesign] = await Promise.all([
    db.course.create({ data: { orgId: org.id, title: "React & Next.js Mastery", description: "Complete guide to React and Next.js", category: "Frontend", duration: "40 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "AWS Solutions Architect", description: "Prepare for AWS SAA-C03 certification", category: "Cloud", duration: "60 hours", level: "Advanced" } }),
    db.course.create({ data: { orgId: org.id, title: "TypeScript Fundamentals", description: "Master TypeScript for production apps", category: "Backend", duration: "20 hours", level: "Beginner" } }),
    db.course.create({ data: { orgId: org.id, title: "Leadership & Management", description: "Effective team leadership skills", category: "Management", duration: "15 hours", level: "Intermediate" } }),
    db.course.create({ data: { orgId: org.id, title: "PostgreSQL & Database Design", description: "Advanced database concepts", category: "Backend", duration: "30 hours", level: "Advanced" } }),
    db.course.create({ data: { orgId: org.id, title: "Product Design Principles", description: "UX/UI best practices and design systems", category: "Design", duration: "25 hours", level: "Beginner" } }),
  ]);

  // Course enrollments
  const sarahEmp = createdUsers[2].employee;
  await db.courseEnrollment.createMany({
    data: [
      { courseId: courseReact.id, employeeId: sarahEmp.id, progress: 75, enrolledAt: new Date("2026-03-01") },
      { courseId: courseAws.id, employeeId: sarahEmp.id, progress: 40, enrolledAt: new Date("2026-04-01") },
      { courseId: courseTs.id, employeeId: sarahEmp.id, progress: 100, completedAt: new Date("2026-03-15"), enrolledAt: new Date("2026-02-01") },
      { courseId: courseReact.id, employeeId: createdUsers[3].employee.id, progress: 60, enrolledAt: new Date("2026-03-15") },
      { courseId: courseMgmt.id, employeeId: createdUsers[1].employee.id, progress: 90, enrolledAt: new Date("2026-02-01") },
      { courseId: courseDb.id, employeeId: createdUsers[7].employee.id, progress: 50, enrolledAt: new Date("2026-04-01") },
      { courseId: courseDesign.id, employeeId: createdUsers[4].employee.id, progress: 100, completedAt: new Date("2026-04-20"), enrolledAt: new Date("2026-03-01") },
      { courseId: courseTs.id, employeeId: createdUsers[5].employee.id, progress: 85, enrolledAt: new Date("2026-04-10") },
    ],
  });

  // Certifications
  await db.employeeCertification.createMany({
    data: [
      { employeeId: sarahEmp.id, name: "TypeScript Developer", issuer: "Microsoft", credential: "MSFT-TS-2025", earnedAt: new Date("2025-08-15") },
      { employeeId: sarahEmp.id, name: "React Certified Developer", issuer: "Meta", credential: "META-RCD-2025", earnedAt: new Date("2025-12-10"), expiresAt: new Date("2027-12-10") },
      { employeeId: createdUsers[7].employee.id, name: "AWS Solutions Architect Associate", issuer: "Amazon", credential: "AWS-SAA-2025", earnedAt: new Date("2025-11-20"), expiresAt: new Date("2028-11-20") },
      { employeeId: createdUsers[1].employee.id, name: "Certified Scrum Master", issuer: "Scrum Alliance", credential: "CSM-2025-007", earnedAt: new Date("2025-06-01") },
    ],
  });

  // Goals
  await db.goal.createMany({
    data: [
      { employeeId: sarahEmp.id, title: "Complete Platform v2.0 Auth Module", description: "Implement JWT-based auth with refresh tokens", progress: 65, status: "IN_PROGRESS", dueDate: new Date("2026-06-30") },
      { employeeId: sarahEmp.id, title: "Reduce API Response Time to <100ms", description: "Optimize database queries and add caching", progress: 40, status: "IN_PROGRESS", dueDate: new Date("2026-07-31") },
      { employeeId: sarahEmp.id, title: "Complete AWS Solutions Architect Certification", progress: 80, status: "IN_PROGRESS", dueDate: new Date("2026-08-15") },
      { employeeId: createdUsers[3].employee.id, title: "Build Design System v2", description: "Component library for all apps", progress: 55, status: "IN_PROGRESS", dueDate: new Date("2026-07-15") },
      { employeeId: createdUsers[7].employee.id, title: "Migrate Services to Kubernetes", description: "Full cluster migration", progress: 30, status: "IN_PROGRESS", dueDate: new Date("2026-09-30") },
      { employeeId: createdUsers[5].employee.id, title: "Complete TypeScript Fundamentals Course", progress: 100, status: "COMPLETED", dueDate: new Date("2026-04-30") },
    ],
  });

  // Projects & Tasks
  const [project1, project2] = await Promise.all([
    db.project.create({ data: { orgId: org.id, name: "Platform Redesign v2.0", description: "Full redesign of the core platform", status: "ACTIVE", progress: 68, dueDate: new Date("2026-08-31") } }),
    db.project.create({ data: { orgId: org.id, name: "Mobile App MVP", description: "Cross-platform mobile application", status: "ACTIVE", progress: 35, dueDate: new Date("2026-10-31") } }),
  ]);

  await db.task.createMany({
    data: [
      { orgId: org.id, projectId: project1.id, title: "Design new authentication flow", status: "IN_PROGRESS", priority: "HIGH", assigneeId: sarahEmp.id, createdById: sarahEmp.id, dueDate: new Date("2026-05-15") },
      { orgId: org.id, title: "Code review: API rate limiting PR", status: "TODO", priority: "HIGH", assigneeId: sarahEmp.id, createdById: manager.id, dueDate: new Date("2026-05-10") },
      { orgId: org.id, title: "Update onboarding documentation", status: "TODO", priority: "MEDIUM", assigneeId: sarahEmp.id, createdById: sarahEmp.id, dueDate: new Date("2026-05-20") },
      { orgId: org.id, projectId: project1.id, title: "Implement dark mode toggle", status: "DONE", priority: "LOW", assigneeId: createdUsers[3].employee.id, createdById: manager.id, dueDate: new Date("2026-05-01") },
      { orgId: org.id, projectId: project2.id, title: "Setup React Native project", status: "DONE", priority: "HIGH", assigneeId: createdUsers[3].employee.id, createdById: createdUsers[3].employee.id, dueDate: new Date("2026-04-20") },
      { orgId: org.id, projectId: project1.id, title: "Performance optimization audit", status: "IN_REVIEW", priority: "HIGH", assigneeId: createdUsers[7].employee.id, createdById: manager.id, dueDate: new Date("2026-05-12") },
      { orgId: org.id, title: "Write unit tests for auth module", status: "TODO", priority: "MEDIUM", assigneeId: createdUsers[6].employee.id, createdById: sarahEmp.id, dueDate: new Date("2026-05-18") },
      { orgId: org.id, projectId: project2.id, title: "Design mobile UI wireframes", status: "IN_PROGRESS", priority: "HIGH", assigneeId: createdUsers[4].employee.id, createdById: manager.id, dueDate: new Date("2026-05-22") },
    ],
  });

  // Performance reviews
  await db.performanceReview.createMany({
    data: [
      { revieweeId: sarahEmp.id, reviewerId: manager.id, period: "Q1 2026", type: "Quarterly", score: 88, comments: "Excellent technical work, great collaboration", status: "COMPLETED", completedAt: new Date("2026-04-05") },
      { revieweeId: createdUsers[3].employee.id, reviewerId: manager.id, period: "Q1 2026", type: "Quarterly", score: 82, comments: "Good progress on frontend tasks", status: "COMPLETED", completedAt: new Date("2026-04-06") },
      { revieweeId: createdUsers[5].employee.id, reviewerId: manager.id, period: "Q1 2026", type: "Quarterly", score: 79, comments: "Growing quickly, needs more backend experience", status: "COMPLETED", completedAt: new Date("2026-04-07") },
      { revieweeId: sarahEmp.id, reviewerId: manager.id, period: "Q2 2026", type: "Quarterly", status: "PENDING" },
      { revieweeId: createdUsers[6].employee.id, reviewerId: manager.id, period: "Q2 2026", type: "Quarterly", status: "PENDING" },
      { revieweeId: createdUsers[7].employee.id, reviewerId: manager.id, period: "Q2 2026", type: "Quarterly", status: "PENDING" },
    ],
  });

  // Job postings & candidates
  const [job1, job2] = await Promise.all([
    db.jobPosting.create({ data: { orgId: org.id, title: "Senior React Engineer", department: "Engineering", location: "Bangalore (Hybrid)", type: "Full-time", description: "We are looking for a Senior React Engineer..." } }),
    db.jobPosting.create({ data: { orgId: org.id, title: "Product Manager", department: "Product", location: "Remote", type: "Full-time", description: "Drive product strategy and roadmap..." } }),
  ]);

  await db.candidate.createMany({
    data: [
      { jobId: job1.id, name: "Rahul Kumar", email: "rahul.k@gmail.com", stage: "INTERVIEW", source: "LinkedIn" },
      { jobId: job1.id, name: "Anjali Singh", email: "anjali.s@gmail.com", stage: "SCREENING", source: "Referral" },
      { jobId: job1.id, name: "Vikram Nair", email: "v.nair@gmail.com", stage: "OFFER", source: "Indeed" },
      { jobId: job2.id, name: "Sneha Gupta", email: "sneha.g@gmail.com", stage: "APPLIED", source: "LinkedIn" },
      { jobId: job2.id, name: "Kunal Agarwal", email: "kunal.a@gmail.com", stage: "INTERVIEW", source: "Referral" },
    ],
  });

  // Onboarding records
  await db.onboardingRecord.createMany({
    data: [
      {
        employeeId: createdUsers[5].employee.id,
        status: "IN_PROGRESS",
        startDate: new Date("2026-04-01"),
        dueDate: new Date("2026-05-30"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork", done: true },
          { id: "2", title: "Setup development environment", done: true },
          { id: "3", title: "Meet the team", done: true },
          { id: "4", title: "Complete security training", done: false },
          { id: "5", title: "First code review", done: false },
        ]),
      },
      {
        employeeId: createdUsers[6].employee.id,
        status: "IN_PROGRESS",
        startDate: new Date("2026-04-15"),
        dueDate: new Date("2026-06-15"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork", done: true },
          { id: "2", title: "Setup QA environment", done: true },
          { id: "3", title: "Review test case library", done: false },
          { id: "4", title: "Complete compliance training", done: false },
        ]),
      },
      {
        employeeId: createdUsers[3].employee.id,
        status: "IN_PROGRESS",
        startDate: new Date("2026-03-01"),
        dueDate: new Date("2026-05-01"),
        tasks: JSON.stringify([
          { id: "1", title: "Complete HR paperwork", done: true },
          { id: "2", title: "Setup frontend dev environment", done: true },
          { id: "3", title: "Review design system", done: true },
          { id: "4", title: "Complete accessibility training", done: true },
          { id: "5", title: "First PR merged", done: false },
        ]),
      },
    ],
  });

  // Channels & Messages
  const [chanGeneral, chanEng, chanProduct, chanRandom] = await Promise.all([
    db.channel.create({ data: { orgId: org.id, name: "general", isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "engineering", isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "product", isPrivate: false } }),
    db.channel.create({ data: { orgId: org.id, name: "random", isPrivate: false } }),
  ]);

  const uids = createdUsers.map(({ user }) => user.id);
  await db.message.createMany({
    data: [
      { channelId: chanGeneral.id, senderId: uids[0], content: "Good morning everyone! Hope you all had a great weekend.", createdAt: new Date("2026-05-04T09:00:00") },
      { channelId: chanGeneral.id, senderId: uids[1], content: "Morning! Ready for sprint planning today?", createdAt: new Date("2026-05-04T09:05:00") },
      { channelId: chanGeneral.id, senderId: uids[2], content: "Sprint planning at 10 AM, right? I'll be there.", createdAt: new Date("2026-05-04T09:10:00") },
      { channelId: chanGeneral.id, senderId: uids[0], content: "Reminder: Q2 performance reviews are due by May 15th.", createdAt: new Date("2026-05-05T10:00:00") },
      { channelId: chanGeneral.id, senderId: uids[4], content: "Thanks for the reminder! Will submit mine by end of week.", createdAt: new Date("2026-05-05T10:15:00") },
      { channelId: chanGeneral.id, senderId: uids[1], content: "Platform v2.0 is on track for Q3 release. Great work team!", createdAt: new Date("2026-05-06T11:00:00") },
      { channelId: chanGeneral.id, senderId: uids[2], content: "Auth module is 65% done, should be ready by next sprint.", createdAt: new Date("2026-05-07T09:30:00") },
      { channelId: chanGeneral.id, senderId: uids[3], content: "Dark mode is finally live! Pushed to staging yesterday.", createdAt: new Date("2026-05-08T14:00:00") },
      { channelId: chanGeneral.id, senderId: uids[0], content: "Excellent work Daniel! Let's test it in tomorrow's demo.", createdAt: new Date("2026-05-08T14:30:00") },
      { channelId: chanEng.id, senderId: uids[1], content: "Team, code review session at 3 PM today for the rate limiting PR.", createdAt: new Date("2026-05-07T09:00:00") },
      { channelId: chanEng.id, senderId: uids[2], content: "I'll have my comments ready. The approach looks solid.", createdAt: new Date("2026-05-07T09:15:00") },
      { channelId: chanEng.id, senderId: uids[7], content: "K8s migration progressing well — 3 services migrated so far.", createdAt: new Date("2026-05-07T10:00:00") },
      { channelId: chanEng.id, senderId: uids[5], content: "Backend notifications API is merged. Ready for QA.", createdAt: new Date("2026-05-08T11:00:00") },
      { channelId: chanEng.id, senderId: uids[6], content: "Will start testing notifications tomorrow morning.", createdAt: new Date("2026-05-08T11:15:00") },
      { channelId: chanProduct.id, senderId: uids[4], content: "New wireframes for mobile app are ready. Please review the Figma link.", createdAt: new Date("2026-05-07T13:00:00") },
      { channelId: chanProduct.id, senderId: uids[1], content: "Looks great Priya! The onboarding flow is much cleaner.", createdAt: new Date("2026-05-07T13:30:00") },
      { channelId: chanProduct.id, senderId: uids[4], content: "Thanks! Updated based on user testing feedback last week.", createdAt: new Date("2026-05-07T14:00:00") },
      { channelId: chanRandom.id, senderId: uids[3], content: "Anyone for lunch at the new Thai place on 5th street?", createdAt: new Date("2026-05-08T12:00:00") },
      { channelId: chanRandom.id, senderId: uids[2], content: "I'm in! Meet at 1 PM?", createdAt: new Date("2026-05-08T12:10:00") },
      { channelId: chanRandom.id, senderId: uids[5], content: "Count me in too!", createdAt: new Date("2026-05-08T12:15:00") },
    ],
  });

  // Workflows
  await db.workflow.createMany({
    data: [
      { orgId: org.id, name: "Leave Approval Workflow", description: "Auto-notify manager when leave is requested", trigger: "leave.requested", isEnabled: true, runsCount: 47, lastRunAt: new Date("2026-05-08T10:00:00") },
      { orgId: org.id, name: "New Employee Onboarding", description: "Create onboarding checklist for new hires", trigger: "employee.created", isEnabled: true, runsCount: 12, lastRunAt: new Date("2026-04-15T09:00:00") },
      { orgId: org.id, name: "Payroll Processing", description: "Run payroll on the last business day of month", trigger: "payroll.scheduled", isEnabled: true, runsCount: 6, lastRunAt: new Date("2026-04-28T08:00:00") },
      { orgId: org.id, name: "Performance Review Reminder", description: "Remind employees about pending reviews", trigger: "review.pending", isEnabled: false, runsCount: 3, lastRunAt: new Date("2026-04-01T09:00:00") },
      { orgId: org.id, name: "Task Overdue Alert", description: "Alert assignee when task is overdue", trigger: "task.overdue", isEnabled: true, runsCount: 18, lastRunAt: new Date("2026-05-07T09:00:00") },
    ],
  });

  // Reimbursement claims
  await db.claim.createMany({
    data: [
      { employeeId: sarahEmp.id, category: "TRAVEL", amount: 4500, date: new Date("2026-04-10"), description: "Client meeting travel to Mumbai", status: "APPROVED", reviewedAt: new Date("2026-04-12") },
      { employeeId: sarahEmp.id, category: "TRAINING", amount: 12000, date: new Date("2026-04-20"), description: "AWS certification exam fee", status: "PENDING" },
      { employeeId: createdUsers[3].employee.id, category: "EQUIPMENT", amount: 8000, date: new Date("2026-04-25"), description: "External monitor for home office", status: "PENDING" },
      { employeeId: createdUsers[7].employee.id, category: "TRAVEL", amount: 3200, date: new Date("2026-05-02"), description: "Conference transport", status: "APPROVED", reviewedAt: new Date("2026-05-05") },
    ],
  });

  // Subscription
  await db.subscription.create({
    data: { orgId: org.id, plan: "PRO_MAX", status: "active", currentPeriodEnd: new Date("2026-12-31") },
  });

  console.log("✅ Seed complete");
  console.log("\n📋 Demo accounts:");
  console.log("  Admin:    admin@unikove.com / password123");
  console.log("  Manager:  james.williams@unikove.com / password123");
  console.log("  Employee: sarah.mitchell@unikove.com / password123");
}

main()
  .catch(console.error)
  .finally(() => db.$disconnect());
