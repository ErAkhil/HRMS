import { getLearningData, getOrgLearningStats } from "@/lib/actions/learning";
import { CoursesClient } from "./_components/courses-client";

export const metadata = { title: "Course Catalog" };

export default async function CoursesPage() {
  const [{ allCourses, enrollments }, stats] = await Promise.all([
    getLearningData().catch(() => ({ allCourses: [], enrollments: [], certifications: [] })),
    getOrgLearningStats().catch(() => ({ totalEnrollments: 0, completedEnrollments: 0, certCount: 0, completionRate: 0 })),
  ]);

  const enrolledMap = new Map(enrollments.map((e) => [e.courseId, { progress: e.progress, enrollmentId: e.id }]));

  const courses = allCourses.map((c) => ({
    id: c.id,
    title: c.title,
    category: c.category,
    duration: c.duration,
    level: c.level,
    enrolledCount: c._count.enrollments,
    isEnrolled: enrolledMap.has(c.id),
    progress: enrolledMap.get(c.id)?.progress ?? 0,
    enrollmentId: enrolledMap.get(c.id)?.enrollmentId ?? null,
  }));

  return <CoursesClient courses={courses} stats={stats} />;
}
