"use server";

import { requireAuth } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { api } from "@/lib/api-client";

export type MeetingEmployee = {
  id: string;
  name: string;
  avatarUrl: string | null;
  title: string;
  department: string | null;
};

export type SerializedMeeting = {
  id: string;
  title: string;
  type: string;
  scheduledAt: string;
  durationMins: number;
  platform: string;
  meetingUrl: string | null;
  agenda: string | null;
  participants: { id: string; name: string; avatarUrl: string | null }[];
  isLive: boolean;
  isPast: boolean;
};

const createMeetingSchema = z.object({
  title: z.string().min(1, "Title required"),
  type: z.string().min(1),
  date: z.string().min(1, "Date required"),
  time: z.string().min(1, "Time required"),
  durationMins: z.coerce.number().int().positive(),
  platform: z.string().min(1),
  meetingUrl: z.string().url().optional().or(z.literal("")),
  agenda: z.string().optional(),
  participantIds: z.array(z.string()).min(1, "Add at least one participant"),
});

export async function getMeetingEmployees(): Promise<MeetingEmployee[]> {
  await requireAuth();
  return api.get<MeetingEmployee[]>("/meetings/employees");
}

export async function getMeetings(): Promise<SerializedMeeting[]> {
  await requireAuth();
  return api.get<SerializedMeeting[]>("/meetings");
}

export async function createMeeting(data: {
  title: string;
  type: string;
  date: string;
  time: string;
  durationMins: number;
  platform: string;
  meetingUrl?: string;
  agenda?: string;
  participantIds: string[];
}) {
  await requireAuth();

  const parsed = createMeetingSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");

  await api.post<unknown>("/meetings", parsed.data);
  revalidatePath("/collaboration/meetings");
}

/**
 * Add notes to meeting
 */
export async function addMeetingNote(
  meetingId: string,
  content: string,
): Promise<{ readonly id: string; readonly content: string }> {
  const user = await requireAuth();

  if (!content.trim()) {
    throw new Error("Note content cannot be empty");
  }

  try {
    return await api.post<{ id: string; content: string }>(`/meetings/${meetingId}/notes`, {
      content,
    });
  } catch (error) {
    console.error("Failed to add meeting note:", error);
    throw new Error("Failed to add meeting note");
  }
}

/**
 * Get meeting notes
 */
export async function getMeetingNotes(
  meetingId: string,
): Promise<Array<{ id: string; content: string; createdAt: string; createdBy: string }>> {
  await requireAuth();

  try {
    return await api.get(`/meetings/${meetingId}/notes`);
  } catch (error) {
    console.error("Failed to fetch meeting notes:", error);
    return [];
  }
}

/**
 * Generate AI summary for meeting notes
 */
export async function generateMeetingSummary(
  meetingId: string,
  notes: string,
): Promise<{
  readonly summary: string;
  readonly keyPoints: string[];
  readonly actionItems: Array<{ task: string; owner?: string }>;
}> {
  const user = await requireAuth();

  if (!notes.trim()) {
    throw new Error("Notes required for summary");
  }

  try {
    return await api.post(`/meetings/${meetingId}/summarize`, { notes });
  } catch (error) {
    console.error("Failed to generate summary:", error);
    throw new Error("Failed to generate meeting summary");
  }
}

/**
 * Record meeting attendance
 */
export async function recordAttendance(
  meetingId: string,
  userId: string,
  joinedAt: Date,
): Promise<void> {
  await requireAuth();

  try {
    await api.post(`/meetings/${meetingId}/attendance`, {
      userId,
      joinedAt,
    });
    revalidatePath(`/meetings/${meetingId}`);
  } catch (error) {
    console.error("Failed to record attendance:", error);
    throw new Error("Failed to record attendance");
  }
}
