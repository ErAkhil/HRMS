import Link from "next/link";
import { LearningDashboard } from "./_components/learning-dashboard";

export const metadata = { title: "Learning & Development | Unikove" };

const kpis = [
  {
    label: "Enrolled Courses",
    value: "6",
    sub: "2 in progress",
    valueColor: "text-indigo-600 dark:text-indigo-300",
  },
  {
    label: "Hours This Month",
    value: "14.5h",
    sub: "↑ 3h more than last month",
    valueColor: "text-emerald-dark dark:text-emerald",
  },
  {
    label: "Certifications",
    value: "3 earned",
    sub: "1 in progress",
    valueColor: "text-violet-dark dark:text-violet-300",
  },
  {
    label: "Team Completion Rate",
    value: "74%",
    sub: "↑ 8% this quarter",
    valueColor: "text-amber-dark dark:text-amber",
  },
];

const inProgressCourses = [
  {
    title: "React Advanced Patterns",
    track: "Engineering",
    trackClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    pct: 68,
    bar: "bg-indigo-600",
    initial: "R",
    initialBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    btnLabel: "Resume",
    btnClass: "rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700",
  },
  {
    title: "AWS Solutions Architect",
    track: "Cloud",
    trackClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    pct: 45,
    bar: "bg-amber-500",
    initial: "A",
    initialBg: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    btnLabel: "Resume",
    btnClass: "rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700",
  },
  {
    title: "Product Strategy 101",
    track: "Leadership",
    trackClass: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    pct: 20,
    bar: "bg-violet-500",
    initial: "P",
    initialBg: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    btnLabel: "Resume",
    btnClass: "rounded-lg bg-indigo-600 px-3 py-1 text-xs font-semibold text-white hover:bg-indigo-700",
  },
  {
    title: "SQL & Data Analytics",
    track: "Data",
    trackClass: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    pct: 89,
    bar: "bg-emerald-500",
    initial: "S",
    initialBg: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    btnLabel: "Finish",
    btnClass: "rounded-lg bg-emerald-500 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-600",
  },
];

const completedCourses = [
  { title: "TypeScript Deep Dive", date: "Completed Apr 2026", hours: "8h total" },
  { title: "System Design Fundamentals", date: "Completed Feb 2026", hours: "12h" },
  { title: "Python for Data Science", date: "Completed Jan 2026", hours: "10h" },
];

const skills = [
  { name: "React", pct: 85, bar: "bg-indigo-500" },
  { name: "AWS", pct: 55, bar: "bg-amber-500" },
  { name: "TypeScript", pct: 90, bar: "bg-violet-500" },
  { name: "SQL", pct: 75, bar: "bg-sky-500" },
  { name: "System Design", pct: 60, bar: "bg-rose-500" },
  { name: "Leadership", pct: 45, bar: "bg-emerald-500" },
];

const learningDeadlines = [
  {
    title: "AWS Certification Exam",
    date: "May 25, 2026",
    left: "18 days left",
    badgeClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  },
  {
    title: "React Course: Module 7 Quiz",
    date: "May 10, 2026",
    left: "Urgent",
    badgeClass: "bg-rose-light text-rose-dark dark:bg-rose-dark/20 dark:text-rose",
  },
  {
    title: "Team Learning Goal",
    date: "May 31, 2026",
    left: "24 days left",
    badgeClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
];

const recommended = [
  {
    title: "Leadership Essentials",
    category: "HR & Management",
    catClass: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
    rating: "4.8",
    duration: "6h",
    enrolled: "342",
    initial: "L",
    initialBg: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  },
  {
    title: "Docker & Kubernetes",
    category: "DevOps",
    catClass: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
    rating: "4.9",
    duration: "8h",
    enrolled: "1,241",
    initial: "D",
    initialBg: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  },
  {
    title: "Communication Skills",
    category: "Soft Skills",
    catClass: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
    rating: "4.7",
    duration: "3h",
    enrolled: "891",
    initial: "C",
    initialBg: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  },
  {
    title: "Advanced SQL",
    category: "Data",
    catClass: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
    rating: "4.6",
    duration: "5h",
    enrolled: "456",
    initial: "A",
    initialBg: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  },
];

const liveSessions = [
  {
    title: "React Performance Workshop",
    when: "Today 3:00 PM",
    enrolled: 45,
    btnLabel: "Join",
    btnClass: "rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700",
  },
  {
    title: "Leadership AMA with CEO",
    when: "Tomorrow 11:00 AM",
    enrolled: 128,
    btnLabel: "Register",
    btnClass: "rounded-lg border border-gray-3 bg-white px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white",
  },
  {
    title: "DevOps Best Practices",
    when: "May 10, 2:00 PM",
    enrolled: 67,
    btnLabel: "Register",
    btnClass: "rounded-lg border border-gray-3 bg-white px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white",
  },
];

export default function LearningPage() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Section 1: Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-sm text-dark-5 dark:text-dark-6">
            <Link href="/" className="hover:text-indigo-600">Dashboard</Link>
            <span className="mx-1">/</span>
            <span>Learning &amp; Development</span>
          </p>
          <h1 className="text-2xl font-bold text-dark dark:text-white">Learning &amp; Development</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Grow your skills, advance your career</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/learning/courses"
            className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
          >
            Browse Courses
          </Link>
          <Link
            href="/learning/certifications"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            My Certificates
          </Link>
        </div>
      </div>

      {/* Section 2: KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-sm text-dark-5 dark:text-dark-6">{kpi.label}</p>
            <p className={`mt-1 text-2xl font-bold ${kpi.valueColor}`}>{kpi.value}</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Section 3: Learning Progress + Skills */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Left: My Courses */}
        <div className="md:col-span-8 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-dark dark:text-white">Learning Progress</h2>
            <Link href="/learning/courses" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300">
              View all →
            </Link>
          </div>

          {/* In-progress courses */}
          <div className="space-y-4">
            {inProgressCourses.map((course) => (
              <div key={course.title} className="flex items-center gap-3">
                <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${course.initialBg}`}>
                  {course.initial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-dark dark:text-white">{course.title}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${course.trackClass}`}>
                      {course.track}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative h-1.5 flex-1 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full ${course.bar}`}
                        style={{ width: `${course.pct}%` }}
                      />
                    </div>
                    <span className="shrink-0 text-xs font-semibold text-dark-5 dark:text-dark-6">{course.pct}%</span>
                  </div>
                </div>
                <button className={`shrink-0 ${course.btnClass}`}>{course.btnLabel}</button>
              </div>
            ))}
          </div>

          {/* Completed courses */}
          <div className="mt-5 border-t border-gray-2 dark:border-dark-3 pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">
              Completed Courses
            </p>
            <div className="space-y-2.5">
              {completedCourses.map((c) => (
                <div key={c.title} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-light dark:bg-emerald-dark/20">
                    <svg className="h-3.5 w-3.5 text-emerald-dark dark:text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-dark dark:text-white">{c.title}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">{c.date} · {c.hours}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column: Skills + Deadlines */}
        <div className="md:col-span-4 flex flex-col gap-4">
          {/* Skills Being Developed */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Skills Being Developed</h2>
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-dark dark:text-white">{skill.name}</span>
                    <span className="text-dark-5 dark:text-dark-6">{skill.pct}%</span>
                  </div>
                  <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-full ${skill.bar}`}
                      style={{ width: `${skill.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Upcoming Deadlines</h2>
            <div className="space-y-3">
              {learningDeadlines.map((d) => (
                <div key={d.title} className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-dark dark:text-white">{d.title}</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6">{d.date}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${d.badgeClass}`}>
                    {d.left}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Recommended + Live Sessions */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Recommended For You */}
        <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="mb-4 font-semibold text-dark dark:text-white">Recommended For You</h2>
          <div className="space-y-3">
            {recommended.map((course) => (
              <div key={course.title} className="flex items-center gap-3 rounded-lg border border-gray-2 p-3 dark:border-dark-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${course.initialBg}`}>
                  {course.initial}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium text-dark dark:text-white">{course.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${course.catClass}`}>
                      {course.category}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
                    <span className="text-amber-500">★</span>
                    <span>{course.rating}</span>
                    <span>·</span>
                    <span>{course.duration}</span>
                    <span>·</span>
                    <span>{course.enrolled} enrolled</span>
                  </div>
                </div>
                <button className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Live Sessions */}
        <div className="md:col-span-5 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="mb-4 font-semibold text-dark dark:text-white">Live Sessions This Week</h2>
          <div className="space-y-3">
            {liveSessions.map((session) => (
              <div key={session.title} className="rounded-lg border border-gray-2 p-3 dark:border-dark-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-dark dark:text-white">{session.title}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
                      <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{session.when}</span>
                      <span>·</span>
                      <span>{session.enrolled} enrolled</span>
                    </div>
                  </div>
                  <button className={`shrink-0 ${session.btnClass}`}>{session.btnLabel}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 5: Existing LearningDashboard Component */}
      <LearningDashboard />
    </div>
  );
}
