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
  agenda?: string;
  participantIds: string[];
}) {
  await requireAuth();

  const parsed = createMeetingSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Invalid data");

  await api.post<unknown>("/meetings", parsed.data);
  revalidatePath("/collaboration/meetings");
}
