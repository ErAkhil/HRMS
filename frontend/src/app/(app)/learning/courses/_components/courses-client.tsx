"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { enrollInCourse, updateCourseProgress } from "@/lib/actions/learning";

type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  enrolledCount: number;
  isEnrolled: boolean;
  progress: number;
  enrollmentId: string | null;
};

type Stats = {
  totalEnrollments: number;
  completedEnrollments: number;
  certCount: number;
  completionRate: number;
};

const CATEGORY_GRADIENT: Record<string, string> = {
  Frontend:   "from-primary-500 to-purple-600",
  Backend:    "from-emerald-500 to-teal-600",
  Cloud:      "from-sky-500 to-blue-600",
  Management: "from-amber-500 to-orange-600",
  Design:     "from-violet-500 to-purple-600",
  Sales:      "from-rose-500 to-pink-600",
  Finance:    "from-lime-500 to-green-600",
  Clinical:   "from-red-500 to-rose-600",
  Nursing:    "from-pink-500 to-fuchsia-600",
  IT:         "from-cyan-500 to-sky-600",
  Risk:       "from-orange-500 to-amber-600",
  Compliance: "from-yellow-500 to-amber-600",
  Trading:    "from-teal-500 to-emerald-600",
};

const LEVEL_BADGE: Record<string, string> = {
  Beginner:     "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Intermediate: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Advanced:     "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

function getGradient(category: string) {
  return CATEGORY_GRADIENT[category] ?? "from-primary-500 to-violet-600";
}

export function CoursesClient({ courses, stats }: Readonly<{ courses: Course[]; stats: Stats }>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(courses.map((c) => c.category))).sort()];

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  function handleEnroll(courseId: string, title: string) {
    startTransition(async () => {
      try {
        await enrollInCourse(courseId);
        setToast(`Enrolled in "${title}"! Check My Learning for progress.`);
        router.refresh();
      } catch {
        setToast("Failed to enroll. Please try again.");
      }
    });
  }

  function handleContinue(course: Course) {
    if (!course.enrollmentId) return;
    startTransition(async () => {
      try {
        const newProgress = Math.min(100, course.progress + 10);
        await updateCourseProgress(course.enrollmentId!, newProgress);
        setToast(newProgress >= 100 ? `"${course.title}" marked as complete!` : `Progress updated to ${newProgress}%`);
        router.refresh();
      } catch {
        setToast("Failed to update progress");
      }
    });
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Course Catalog</h1>
          <p className="text-muted mt-0.5">{courses.length} courses · {stats.completionRate}% avg completion rate</p>
        </div>
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field h-9 w-64 pl-9"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Courses", value: courses.length, color: "text-primary-600 dark:text-primary-300", bg: "bg-primary-50 dark:bg-primary-900/20" },
          { label: "Enrolled",      value: stats.totalEnrollments, color: "text-emerald-dark dark:text-emerald", bg: "bg-emerald-light dark:bg-emerald-dark/20" },
          { label: "Completed",     value: stats.completedEnrollments, color: "text-amber-dark", bg: "bg-amber-light dark:bg-amber-dark/20" },
          { label: "Certifications",value: stats.certCount, color: "text-violet-dark dark:text-violet-300", bg: "bg-violet-light dark:bg-violet-dark/20" },
        ].map((s) => (
          <div key={s.label} className="card-p text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-muted mt-0.5 text-xs">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === cat ? "bg-primary-600 text-white" : "btn-secondary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="card flex h-40 items-center justify-center">
          <p className="text-muted">No courses found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <div key={course.id} className="card overflow-hidden">
              <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${getGradient(course.category)}`}>
                <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                    {course.category}
                  </span>
                  <span className={LEVEL_BADGE[course.level] ?? LEVEL_BADGE.Beginner}>{course.level}</span>
                </div>
                <p className="text-body-medium mb-2 line-clamp-2">{course.title}</p>
                <div className="mb-3 flex items-center justify-between text-xs text-muted">
                  <span>{course.duration}</span>
                  <span>{course.enrolledCount} enrolled</span>
                </div>
                {course.isEnrolled && course.progress > 0 && (
                  <div className="mb-3">
                    <div className="mb-1 flex justify-between text-xs text-muted">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-dark-3">
                      <div className="h-1.5 rounded-full bg-primary-600" style={{ width: `${course.progress}%` }} />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => course.isEnrolled ? handleContinue(course) : handleEnroll(course.id, course.title)}
                  disabled={course.progress >= 100}
                  className={`w-full py-1.5 ${course.isEnrolled ? "btn-primary disabled:opacity-60" : "btn-secondary"}`}
                >
                  {course.isEnrolled ? (course.progress >= 100 ? "Completed ✓" : "Continue") : "Enroll"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
