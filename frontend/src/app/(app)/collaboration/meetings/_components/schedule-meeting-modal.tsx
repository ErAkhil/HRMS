"use client";

import { useState, useTransition, useMemo } from "react";
import Image from "next/image";
import { createMeeting } from "@/lib/actions/meetings";
import type { MeetingEmployee } from "@/lib/actions/meetings";

const DURATION_OPTIONS = [
  { label: "15 min", value: 15 },
  { label: "30 min", value: 30 },
  { label: "45 min", value: 45 },
  { label: "1 hour", value: 60 },
  { label: "1.5 hours", value: 90 },
  { label: "2 hours", value: 120 },
];

const MEETING_TYPES = ["Team", "All-Hands", "1:1", "Interview", "Review"];
const PLATFORMS = ["Zoom", "Google Meet", "Microsoft Teams", "In-person"];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

interface Props {
  employees: MeetingEmployee[];
  onClose: () => void;
  onSchedule: () => void;
}

export function ScheduleMeetingModal({ employees, onClose, onSchedule }: Readonly<Props>) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Team");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [durationMins, setDurationMins] = useState(30);
  const [platform, setPlatform] = useState("Zoom");
  const [agenda, setAgenda] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredEmployees = useMemo(
    () => employees.filter((e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      (e.department?.toLowerCase().includes(search.toLowerCase()) ?? false)
    ),
    [employees, search]
  );

  function toggleEmployee(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleSubmit() {
    if (!title.trim()) { setError("Meeting title is required."); return; }
    if (!date) { setError("Please select a date."); return; }
    if (!time) { setError("Please select a time."); return; }
    if (selectedIds.size === 0) { setError("Add at least one participant."); return; }
    setError("");

    startTransition(async () => {
      try {
        await createMeeting({
          title: title.trim(),
          type,
          date,
          time,
          durationMins,
          platform,
          agenda: agenda.trim() || undefined,
          participantIds: Array.from(selectedIds),
        });
        onSchedule();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to schedule meeting");
      }
    });
  }

  const selectedEmployees = employees.filter((e) => selectedIds.has(e.id));

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-panel w-full max-w-2xl p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="section-title">Schedule Meeting</h2>
          <button onClick={onClose} className="flex size-7 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Left — Meeting details */}
          <div className="space-y-4">
            <div>
              <label className="label-field">Title <span className="text-rose-dark">*</span></label>
              <input type="text" placeholder="e.g. Team Sync, 1:1 with Sarah..." value={title} onChange={(e) => setTitle(e.target.value)} className="input-field" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="input-field">
                  {MEETING_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="label-field">Platform</label>
                <select value={platform} onChange={(e) => setPlatform(e.target.value)} className="input-field">
                  {PLATFORMS.map((p) => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-field">Date <span className="text-rose-dark">*</span></label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-field" />
              </div>
              <div>
                <label className="label-field">Time <span className="text-rose-dark">*</span></label>
                <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="input-field" />
              </div>
            </div>

            <div>
              <label className="label-field">Duration</label>
              <select value={durationMins} onChange={(e) => setDurationMins(Number(e.target.value))} className="input-field">
                {DURATION_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>

            <div>
              <label className="label-field">Agenda <span className="font-normal text-muted">(optional)</span></label>
              <textarea rows={3} placeholder="What will be discussed?" value={agenda} onChange={(e) => setAgenda(e.target.value)} className="input-field resize-none" />
            </div>
          </div>

          {/* Right — Participants */}
          <div className="flex flex-col gap-3">
            <div>
              <label className="label-field">Participants <span className="text-rose-dark">*</span></label>
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-dark-5" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-8"
                />
              </div>
            </div>

            <div className="h-52 overflow-y-auto rounded-lg border border-gray-3 dark:border-dark-3">
              {filteredEmployees.length === 0 ? (
                <p className="py-4 text-center text-xs text-dark-5 dark:text-dark-6">No employees found.</p>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = selectedIds.has(emp.id);
                  return (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => toggleEmployee(emp.id)}
                      className={`flex w-full items-center gap-3 px-3 py-2 text-left transition-colors ${isSelected ? "bg-primary-50 dark:bg-primary-900/20" : "hover:bg-gray-1 dark:hover:bg-dark-3"}`}
                    >
                      {emp.avatarUrl ? (
                        <Image src={emp.avatarUrl} alt={emp.name} width={28} height={28} className="size-7 shrink-0 rounded-full object-cover" />
                      ) : (
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          {getInitials(emp.name)}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className={`truncate text-xs font-medium ${isSelected ? "text-primary-600 dark:text-primary-300" : "text-dark dark:text-white"}`}>{emp.name}</p>
                        <p className="truncate text-[11px] text-dark-5 dark:text-dark-6">{emp.title}{emp.department ? ` · ${emp.department}` : ""}</p>
                      </div>
                      {isSelected && (
                        <svg className="size-4 shrink-0 text-primary-600 dark:text-primary-300" viewBox="0 0 24 24" fill="none">
                          <path d="M4.5 12.75l6 6 9-13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  );
                })
              )}
            </div>

            {selectedEmployees.length > 0 && (
              <div>
                <p className="mb-1.5 text-xs font-medium text-dark-5 dark:text-dark-6">{selectedEmployees.length} selected</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedEmployees.map((e) => (
                    <span key={e.id} className="flex items-center gap-1 rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                      {e.name.split(" ")[0]}
                      <button type="button" onClick={() => toggleEmployee(e.id)} className="ml-0.5 text-primary-400 hover:text-primary-600">×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {error && <p className="mt-3 text-xs text-rose-600 dark:text-rose">{error}</p>}

        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary" disabled={isPending}>Cancel</button>
          <button onClick={handleSubmit} disabled={isPending} className="btn-primary disabled:opacity-60">
            {isPending ? "Scheduling…" : "Schedule Meeting"}
          </button>
        </div>
      </div>
    </div>
  );
}
