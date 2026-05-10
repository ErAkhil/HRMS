"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { toActionError } from "./utils";

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
  const user = await requireAuth();

  try {
    const employees = await db.employee.findMany({
      where: { orgId: user.orgId, isActive: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatarUrl: true,
        title: true,
        department: { select: { name: true } },
      },
      orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
    });

    return employees.map((e) => ({
      id: e.id,
      name: `${e.firstName} ${e.lastName}`,
      avatarUrl: e.avatarUrl,
      title: e.title,
      department: e.department?.name ?? null,
    }));
  } catch (err) {
    throw toActionError(err);
  }
}

export async function getMeetings(): Promise<SerializedMeeting[]> {
  const user = await requireAuth();

  try {
    const meetings = await db.meeting.findMany({
      where: { orgId: user.orgId },
      include: {
        participants: {
          include: {
            employee: { select: { id: true, firstName: true, lastName: true, avatarUrl: true } },
          },
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    const now = new Date();

    return meetings.map((m) => {
      const start = m.scheduledAt;
      const endMs = start.getTime() + m.durationMins * 60 * 1000;
      const isLive = now >= start && now.getTime() < endMs;
      const isPast = now.getTime() >= endMs;

      return {
        id: m.id,
        title: m.title,
        type: m.type,
        scheduledAt: m.scheduledAt.toISOString(),
        durationMins: m.durationMins,
        platform: m.platform,
        agenda: m.agenda,
        participants: m.participants.map((p) => ({
          id: p.employee.id,
          name: `${p.employee.firstName} ${p.employee.lastName}`,
          avatarUrl: p.employee.avatarUrl,
        })),
        isLive,
        isPast,
      };
    });
  } catch (err) {
    throw toActionError(err);
  }
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
  const user = await requireAuth();

  const parsed = createMeetingSchema.safeParse(data);
  if (!parsed.success) throw new Error(parsed.error.errors[0].message);

  try {
    const scheduledAt = new Date(`${parsed.data.date}T${parsed.data.time}`);
    if (isNaN(scheduledAt.getTime())) throw new Error("Invalid date or time");

    await db.meeting.create({
      data: {
        orgId: user.orgId,
        title: parsed.data.title,
        type: parsed.data.type,
        scheduledAt,
        durationMins: parsed.data.durationMins,
        platform: parsed.data.platform,
        agenda: parsed.data.agenda || null,
        createdById: user.id,
        participants: {
          create: parsed.data.participantIds.map((employeeId) => ({ employeeId })),
        },
      },
    });

    revalidatePath("/collaboration/meetings");
  } catch (err) {
    throw toActionError(err);
  }
}
