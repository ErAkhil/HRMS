"use client";

import { getRecommendedCourses, enrollInCourse } from "@/lib/actions/learning";
import { useEffect, useState } from "react";
import Link from "next/link";

export interface Course {
  readonly id: string;
  readonly title: string;
  readonly category: string;
  readonly duration: string;
  readonly level: string;
  readonly _count?: { enrollments: number };
}

interface CourseGridProps {
  readonly courses: Course[];
  readonly onEnroll?: (courseId: string) => void;
}

export function CourseGrid({
  courses,
  onEnroll,
}: Readonly<CourseGridProps>) {
  const levelColors = {
    beginner: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    intermediate: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    advanced: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  };

  const categoryIcons: Record<string, string> = {
    "soft-skills": "🎯",
    management: "👔",
    technical: "💻",
    compliance: "📋",
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <div
          key={course.id}
          className="rounded-lg border border-gray-3 bg-white p-5 transition-shadow hover:shadow-md dark:border-dark-3 dark:bg-dark-2"
        >
          {/* Header */}
          <div className="mb-3 flex items-start justify-between">
            <span className="text-2xl">
              {categoryIcons[course.category] || "📚"}
            </span>
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium capitalize ${levelColors[course.level as keyof typeof levelColors] || "bg-gray-100"}`}
            >
              {course.level}
            </span>
          </div>

          {/* Content */}
          <h3 className="font-semibold text-dark dark:text-white">
            {course.title}
          </h3>

          <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
            Category: <span className="font-medium capitalize">{course.category}</span>
          </p>

          <p className="text-sm text-dark-5 dark:text-dark-6">
            Duration: <span className="font-medium">{course.duration}</span>
          </p>

          {course._count && (
            <p className="mt-1 text-xs text-dark-6 dark:text-dark-5">
              {course._count.enrollments} enrollments
            </p>
          )}

          {/* Action */}
          <button
            onClick={() => onEnroll?.(course.id)}
            className="mt-4 w-full rounded-lg bg-primary-600 px-3 py-2 text-sm font-medium text-white hover:bg-primary-700 active:scale-95"
          >
            Enroll Now
          </button>
        </div>
      ))}
    </div>
  );
}

/**
 * Course recommendations component
 */
export function RecommendedCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const recommended = await getRecommendedCourses();
        setCourses(recommended as Course[]);
      } catch (error) {
        console.error("Failed to fetch recommendations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetch();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-32 rounded-lg bg-gray-2 dark:bg-dark-3" />
      ))}
    </div>;
  }

  if (courses.length === 0) {
    return (
      <div className="rounded-lg border border-gray-3 bg-white p-4 text-center dark:border-dark-3 dark:bg-dark-2">
        <p className="text-sm text-dark-5 dark:text-dark-6">No recommendations yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="font-medium text-dark dark:text-white">Recommended For You</h3>
      <CourseGrid courses={courses} />
    </div>
  );
}

/**
 * Certification cards
 */
export function CertificationCards() {
  const certifications = [
    {
      id: "1",
      name: "Communication Master",
      description: "Master workplace communication",
      icon: "💬",
      progress: 65,
    },
    {
      id: "2",
      name: "Leadership Excellence",
      description: "Complete leadership path",
      icon: "👑",
      progress: 30,
    },
    {
      id: "3",
      name: "Technical Skills Pro",
      description: "Advanced technical knowledge",
      icon: "⚙️",
      progress: 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {certifications.map((cert) => (
        <div
          key={cert.id}
          className="rounded-lg border border-gray-3 bg-white p-5 dark:border-dark-3 dark:bg-dark-2"
        >
          <div className="text-4xl">{cert.icon}</div>
          <h3 className="mt-3 font-semibold text-dark dark:text-white">
            {cert.name}
          </h3>
          <p className="mt-1 text-sm text-dark-5 dark:text-dark-6">
            {cert.description}
          </p>

          {/* Progress */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between text-xs text-dark-5 dark:text-dark-6">
              <span>Progress</span>
              <span className="font-medium">{cert.progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
              <div
                className="h-full bg-primary-600 transition-all"
                style={{ width: `${cert.progress}%` }}
              />
            </div>
          </div>

          {/* Action */}
          <Link
            href={`/learning/certifications/${cert.id}`}
            className="mt-4 inline-block text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            View Path →
          </Link>
        </div>
      ))}
    </div>
  );
}
