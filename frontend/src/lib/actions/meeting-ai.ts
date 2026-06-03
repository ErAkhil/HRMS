"use server";

import { requireAuth } from "@/lib/session";
import { api } from "@/lib/api-client";

export interface MeetingSummary {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly keyPoints: string[];
  readonly actionItems: Array<{ readonly task: string; readonly owner: string }>;
  readonly generatedAt: Date;
}

/**
 * Generate AI meeting summary from notes
 */
export async function generateMeetingSummary(
  meetingId: string,
  notes: string,
  attendees: Array<{ readonly name: string; readonly email: string }>,
): Promise<MeetingSummary> {
  const user = await requireAuth();

  if (!notes || notes.trim().length < 10) {
    throw new Error("Meeting notes must be at least 10 characters");
  }

  try {
    const response = await api.post<MeetingSummary>(
      "/meetings/summarize",
      {
        meetingId,
        notes,
        attendees,
      },
    );

    return response;
  } catch (error) {
    throw new Error("Failed to generate meeting summary");
  }
}

/**
 * Create tasks from meeting action items
 */
export async function createTasksFromMeetingSummary(
  summary: MeetingSummary,
): Promise<string[]> {
  const user = await requireAuth();

  if (!summary.actionItems || summary.actionItems.length === 0) {
    return [];
  }

  try {
    const taskIds = await api.post<string[]>(
      "/meetings/create-tasks",
      {
        meetingSummary: summary,
        createdBy: user.id,
      },
    );

    return taskIds;
  } catch (error) {
    throw new Error("Failed to create tasks from meeting");
  }
}

/**
 * Extract action items from meeting transcript
 */
export async function extractActionItems(
  transcript: string,
): Promise<Array<{ readonly task: string; readonly owner: string }>> {
  const user = await requireAuth();

  if (!transcript || transcript.trim().length < 10) {
    throw new Error("Transcript must be at least 10 characters");
  }

  try {
    const actionItems = await api.post<
      Array<{ readonly task: string; readonly owner: string }>
    >("/meetings/extract-actions", {
      transcript,
    });

    return actionItems;
  } catch (error) {
    throw new Error("Failed to extract action items");
  }
}
