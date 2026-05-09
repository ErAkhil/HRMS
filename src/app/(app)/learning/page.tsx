import { getLearningData, getOrgLearningStats } from "@/lib/actions/learning";
import { LearningPageClient } from "./_components/learning-page-client";

export const metadata = { title: "Learning & Development" };

export default async function LearningPage() {
  const [{ enrollments, certifications, allCourses }, stats] = await Promise.all([
    getLearningData(),
    getOrgLearningStats(),
  ]);

  return (
    <LearningPageClient
      enrollments={enrollments.map((e) => ({
        id: e.id,
        courseId: e.courseId,
        title: e.course.title,
        category: e.course.category,
        duration: e.course.duration,
        progress: e.progress,
        completedAt: e.completedAt?.toISOString() ?? null,
        enrolledAt: e.enrolledAt.toISOString(),
      }))}
      certifications={certifications.map((c) => ({
        id: c.id,
        name: c.name,
        issuer: c.issuer,
        earnedAt: c.earnedAt.toISOString(),
        expiresAt: c.expiresAt?.toISOString() ?? null,
      }))}
      allCourses={allCourses.map((c) => ({
        id: c.id,
        title: c.title,
        category: c.category,
        duration: c.duration,
        level: c.level,
        enrollmentCount: c._count.enrollments,
      }))}
      stats={stats}
    />
  );
}
