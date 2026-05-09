"use client";

import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { enrollInCourse } from "@/lib/actions/learning";
import { useRouter } from "next/navigation";

type Enrollment = {
  id: string;
  courseId: string;
  title: string;
  category: string;
  duration: string;
  progress: number;
  completedAt: string | null;
  enrolledAt: string;
};

type Certification = {
  id: string;
  name: string;
  issuer: string;
  earnedAt: string;
  expiresAt: string | null;
};

type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  enrollmentCount: number;
};

type Stats = {
  totalEnrollments: number;
  completedEnrollments: number;
  certCount: number;
  completionRate: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Cloud: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  Leadership: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Data: "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  DevOps: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Sales: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  HR: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
};

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] ?? "bg-gray-100 text-gray-600 dark:bg-dark-3 dark:text-dark-6";
}

function getInitial(title: string) {
  return title.charAt(0).toUpperCase();
}

export function LearningPageClient({ enrollments, certifications, allCourses, stats }: Readonly<{
  enrollments: Enrollment[];
  certifications: Certification[];
  allCourses: Course[];
  stats: Stats;
}>) {
  const { toast, setToast } = useToast();
  const router = useRouter();

  const inProgress = enrollments.filter((e) => e.progress > 0 && !e.completedAt);
  const completed = enrollments.filter((e) => e.completedAt);

  async function handleEnroll(courseId: string) {
    try {
      await enrollInCourse(courseId);
      setToast("Enrolled successfully!");
      router.refresh();
    } catch {
      setToast("Failed to enroll. Please try again.");
    }
  }

  const unenrolledCourses = allCourses.filter(
    (c) => !enrollments.some((e) => e.courseId === c.id)
  );

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header */}
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
          <Link href="/learning/courses" className="rounded-lg border border-gray-3 bg-white px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
            Browse Courses
          </Link>
          <Link href="/learning/certifications" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            My Certificates
          </Link>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: "Enrolled Courses", value: `${enrollments.length}`, sub: `${inProgress.length} in progress`, color: "text-indigo-600 dark:text-indigo-300" },
          { label: "Completed", value: `${completed.length}`, sub: `${stats.completionRate}% completion rate`, color: "text-emerald-dark dark:text-emerald" },
          { label: "Certifications", value: `${certifications.length}`, sub: "earned certificates", color: "text-violet-dark dark:text-violet-300" },
          { label: "Org Completion", value: `${stats.completionRate}%`, sub: `${stats.totalEnrollments} total enrollments`, color: "text-amber-dark dark:text-amber" },
        ].map((kpi) => (
          <div key={kpi.label} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <p className="text-sm text-dark-5 dark:text-dark-6">{kpi.label}</p>
            <p className={`mt-1 text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Learning Progress + Certifications */}
      <div className="grid gap-4 md:grid-cols-12">
        <div className="md:col-span-8 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-dark dark:text-white">Learning Progress</h2>
            <Link href="/learning/courses" className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-300">
              View all →
            </Link>
          </div>

          {inProgress.length === 0 && completed.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-dark-5 dark:text-dark-6 mb-3">No courses enrolled yet.</p>
              <Link href="/learning/courses" className="text-sm font-medium text-indigo-600 hover:underline">
                Browse available courses →
              </Link>
            </div>
          ) : (
            <>
              {inProgress.length > 0 && (
                <div className="space-y-4">
                  {inProgress.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-3">
                      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${getCategoryColor(enrollment.category)}`}>
                        {getInitial(enrollment.title)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <p className="truncate text-sm font-medium text-dark dark:text-white">{enrollment.title}</p>
                          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryColor(enrollment.category)}`}>
                            {enrollment.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="relative h-1.5 flex-1 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                            <div className="absolute inset-y-0 left-0 rounded-full bg-indigo-500" style={{ width: `${enrollment.progress}%` }} />
                          </div>
                          <span className="shrink-0 text-xs font-semibold text-dark-5 dark:text-dark-6">{enrollment.progress}%</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setToast("Resuming course...")}
                        className="shrink-0 rounded-lg bg-primary-600 px-3 py-1 text-xs font-semibold text-white hover:bg-primary-700"
                      >
                        {enrollment.progress > 90 ? "Finish" : "Resume"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {completed.length > 0 && (
                <div className="mt-5 border-t border-gray-2 dark:border-dark-3 pt-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Completed Courses</p>
                  <div className="space-y-2.5">
                    {completed.map((e) => (
                      <div key={e.id} className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-light dark:bg-emerald-dark/20">
                          <svg className="h-3.5 w-3.5 text-emerald-dark dark:text-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-dark dark:text-white">{e.title}</p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">
                            Completed {new Date(e.completedAt!).toLocaleDateString("en-US", { month: "short", year: "numeric" })} · {e.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 font-semibold text-dark dark:text-white">Certifications Earned</h2>
            {certifications.length === 0 ? (
              <p className="text-xs text-dark-5 dark:text-dark-6">No certifications yet.</p>
            ) : (
              <div className="space-y-3">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start gap-2">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-light dark:bg-violet-dark/20">
                      <svg className="h-3 w-3 text-violet-dark" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M10 0a10 10 0 100 20A10 10 0 0010 0zm0 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-dark dark:text-white">{cert.name}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{cert.issuer}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6">
                        Earned {new Date(cert.earnedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Available Courses */}
      {unenrolledCourses.length > 0 && (
        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <h2 className="mb-4 font-semibold text-dark dark:text-white">Available Courses</h2>
          <div className="space-y-3">
            {unenrolledCourses.slice(0, 6).map((course) => (
              <div key={course.id} className="flex items-center gap-3 rounded-lg border border-gray-2 p-3 dark:border-dark-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${getCategoryColor(course.category)}`}>
                  {getInitial(course.title)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="text-sm font-medium text-dark dark:text-white">{course.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getCategoryColor(course.category)}`}>
                      {course.category}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
                    <span>{course.level}</span>
                    <span>·</span>
                    <span>{course.duration}</span>
                    <span>·</span>
                    <span>{course.enrollmentCount} enrolled</span>
                  </div>
                </div>
                <button
                  onClick={() => handleEnroll(course.id)}
                  className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1.5 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
                >
                  Enroll
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
