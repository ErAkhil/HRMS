"use server";

import { requireAuth } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

export type Enrollment = {
  id: string;
  courseId: string;
  progress: number;
  completedAt: string | null;
  enrolledAt: string;
  course: { title: string; category: string; duration: string };
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  earnedAt: string;
  expiresAt: string | null;
};

export type Course = {
  id: string;
  title: string;
  category: string;
  duration: string;
  level: string;
  _count: { enrollments: number };
};

export type LearningData = {
  enrollments: Enrollment[];
  certifications: Certification[];
  allCourses: Course[];
};

export async function getLearningData(): Promise<LearningData> {
  await requireAuth();
  return api.get<LearningData>("/learning");
}

export async function getOrgLearningStats() {
  await requireAuth();
  return api.get<{
    totalEnrollments: number;
    completedEnrollments: number;
    certCount: number;
    completionRate: number;
  }>("/learning/stats");
}

export async function enrollInCourse(courseId: string) {
  await requireAuth();
  await api.post<unknown>("/learning/enroll", { courseId });
  revalidatePath("/learning");
  revalidatePath("/learning/courses");
}

export async function updateCourseProgress(enrollmentId: string, progress: number) {
  await requireAuth();
  await api.patch<unknown>(`/learning/progress/${enrollmentId}`, { progress });
  revalidatePath("/learning");
}

function canManageLearningPaths(userRole: string) {
  return ["SUPER_ADMIN", "HR_ADMIN", "MANAGER"].includes(userRole);
}

/**
 * Get AI-powered course recommendations based on user profile
 */
export async function getRecommendedCourses(): Promise<Course[]> {
  await requireAuth();
  
  try {
    return await api.get<Course[]>("/learning/recommendations");
  } catch {
    return [];
  }
}

/**
 * Create a learning path (team learning program)
 */
export async function createLearningPath(
  name: string,
  description: string,
  courseIds: string[],
): Promise<{ readonly id: string }> {
  const user = await requireAuth();
  
  // Only HR/Managers can create learning paths
  const userRole = user.role || "EMPLOYEE";
  if (!canManageLearningPaths(userRole)) {
    throw new Error("Insufficient permissions");
  }
  
  try {
    const result = await api.post<{ id: string }>("/learning/paths", {
      name,
      description,
      courseIds,
    });
    
    revalidatePath("/learning");
    return result;
  } catch {
    throw new Error("Failed to create learning path");
  }
}

/**
 * Assign learning path to team members
 */
export async function assignLearningPath(
  pathId: string,
  employeeIds: string[],
  dueDate: Date,
): Promise<void> {
  const user = await requireAuth();
  
  const userRole = user.role || "EMPLOYEE";
  if (!canManageLearningPaths(userRole)) {
    throw new Error("Insufficient permissions");
  }
  
  try {
    await api.post<unknown>("/learning/paths/assign", {
      pathId,
      employeeIds,
      dueDate,
    });
    
    revalidatePath("/learning");
  } catch {
    throw new Error("Failed to assign learning path");
  }
}
