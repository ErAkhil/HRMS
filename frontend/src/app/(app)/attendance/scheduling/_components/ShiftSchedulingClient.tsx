"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ShiftType } from "@/types/domain";
import {
  bulkAssignShifts,
  clearShiftAssignment,
  copyPreviousWeekSchedule,
  upsertShiftAssignment,
  type ShiftDay,
  type ShiftScheduleEmployee,
} from "@/lib/actions/attendance-shifts";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

type Props = {
  weekStart: string;
  weekEnd: string;
  days: ShiftDay[];
  employees: ShiftScheduleEmployee[];
  canEdit: boolean;
};

type ShiftCellValue = ShiftType | "NOT_SET";

const shiftStyles: Record<ShiftCellValue, string> = {
  MORNING: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  EVENING: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
  NIGHT: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  OFF: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
  NOT_SET: "rounded-full bg-gray-2 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

const shiftOptions: Array<{ value: ShiftType; label: string; time: string }> = [
  { value: "MORNING", label: "Morning", time: "8:00 AM - 4:00 PM" },
  { value: "EVENING", label: "Evening", time: "4:00 PM - 12:00 AM" },
  { value: "NIGHT", label: "Night", time: "12:00 AM - 8:00 AM" },
  { value: "OFF", label: "Off", time: "No shift assigned" },
];

function formatWeekLabel(weekStart: string, weekEnd: string) {
  const start = new Date(weekStart);
  const end = new Date(weekEnd);

  const startLabel = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endLabel = end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return `${startLabel} - ${endLabel}`;
}

function toDateOnly(value: string) {
  return value.split("T")[0];
}

function toShiftCellValue(value: ShiftType | undefined): ShiftCellValue {
  return value ?? "NOT_SET";
}

function resolveAvatar(value: string | null | undefined): { src: string; unoptimized: boolean } {
  if (!value || value.trim().length === 0) {
    return { src: "/images/user/user-01.png", unoptimized: false };
  }

  const src = value.trim();
  const isAbsolute = /^https?:\/\//i.test(src);

  return {
    src,
    unoptimized: isAbsolute,
  };
}

export function ShiftSchedulingClient({ weekStart, weekEnd, days, employees, canEdit }: Readonly<Props>) {
  const router = useRouter();
  const { toast, setToast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [rows, setRows] = useState<ShiftScheduleEmployee[]>(employees);
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [bulkDate, setBulkDate] = useState<string>(days[0]?.date ?? "");
  const [bulkShift, setBulkShift] = useState<ShiftType>("MORNING");
  const [bulkNotes, setBulkNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("ALL");

  const weekLabel = useMemo(() => formatWeekLabel(weekStart, weekEnd), [weekStart, weekEnd]);
  const departmentOptions = useMemo(
    () => Array.from(new Set(employees.map((employee) => employee.department?.name).filter(Boolean))) as string[],
    [employees],
  );
  const filteredRows = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return rows.filter((employee) => {
      const departmentName = employee.department?.name ?? "";
      const matchesDepartment = departmentFilter === "ALL" || departmentName === departmentFilter;
      const matchesSearch =
        term.length === 0 ||
        `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(term) ||
        employee.title.toLowerCase().includes(term) ||
        departmentName.toLowerCase().includes(term);

      return matchesDepartment && matchesSearch;
    });
  }, [departmentFilter, rows, searchTerm]);
  const visibleEmployeeIds = useMemo(() => filteredRows.map((employee) => employee.id), [filteredRows]);
  const allVisibleSelected =
    visibleEmployeeIds.length > 0 && visibleEmployeeIds.every((id) => selectedEmployeeIds.includes(id));
  const someVisibleSelected =
    visibleEmployeeIds.some((id) => selectedEmployeeIds.includes(id)) && !allVisibleSelected;

  useEffect(() => {
    setRows(employees);
    setSelectedEmployeeIds([]);
    setBulkDate(days[0]?.date ?? "");
  }, [days, employees]);

  function navigateWeek(offsetDays: number) {
    const base = new Date(weekStart);
    base.setDate(base.getDate() + offsetDays);
    const params = new URLSearchParams(globalThis.location.search);
    params.set("startDate", toDateOnly(base.toISOString()));
    router.push(`/attendance/scheduling?${params.toString()}`);
  }

  function updateCell(employeeId: string, date: string, shiftType?: ShiftType) {
    setRows((prev) =>
      prev.map((employee) => {
        if (employee.id !== employeeId) return employee;

        const nextAssignments = { ...employee.assignments };
        if (shiftType) {
          nextAssignments[date] = shiftType;
        } else {
          delete nextAssignments[date];
        }

        return { ...employee, assignments: nextAssignments };
      }),
    );
  }

  function onSelectEmployee(id: string, checked: boolean) {
    setSelectedEmployeeIds((prev) => {
      if (checked) return Array.from(new Set([...prev, id]));
      return prev.filter((employeeId) => employeeId !== id);
    });
  }

  function onSelectAllVisible(checked: boolean) {
    setSelectedEmployeeIds((prev) => {
      if (checked) {
        return Array.from(new Set([...prev, ...visibleEmployeeIds]));
      }
      const visibleSet = new Set(visibleEmployeeIds);
      return prev.filter((employeeId) => !visibleSet.has(employeeId));
    });
  }

  function applySingleShift(employeeId: string, date: string, value: ShiftCellValue) {
    if (!canEdit) return;

    startTransition(async () => {
      try {
        if (value === "NOT_SET") {
          await clearShiftAssignment({ employeeId, date });
          updateCell(employeeId, date);
          setToast("Shift cleared");
        } else {
          await upsertShiftAssignment({ employeeId, date, shiftType: value });
          updateCell(employeeId, date, value);
          setToast("Shift updated");
        }
      } catch (error) {
        setToast(error instanceof Error ? error.message : "Failed to update shift");
      }
    });
  }

  function applyBulkShift() {
    if (!canEdit) return;
    if (selectedEmployeeIds.length === 0) {
      setToast("Select at least one employee for bulk assignment");
      return;
    }
    if (!bulkDate) {
      setToast("Select a day for bulk assignment");
      return;
    }

    startTransition(async () => {
      try {
        const result = await bulkAssignShifts({
          employeeIds: selectedEmployeeIds,
          dates: [bulkDate],
          shiftType: bulkShift,
          notes: bulkNotes.trim() ? bulkNotes.trim() : undefined,
        });
        const summaryParts: string[] = [];
        summaryParts.push(`Updated ${result.updated} assignment(s)`);
        if (result.skippedConflicts > 0) {
          summaryParts.push(`skipped ${result.skippedConflicts} conflict(s)`);
        }
        setToast(summaryParts.join(", "));
        router.refresh();
      } catch (error) {
        setToast(error instanceof Error ? error.message : "Bulk assignment failed");
      }
    });
  }

  function handleCopyPreviousWeek() {
    if (!canEdit) return;

    startTransition(async () => {
      try {
        const result = await copyPreviousWeekSchedule(weekStart);
        const skipped = result.skippedConflicts > 0 ? `, skipped ${result.skippedConflicts} conflict(s)` : "";
        setToast(`Copied ${result.copied} shift(s) from previous week${skipped}`);
        router.refresh();
      } catch (error) {
        setToast(error instanceof Error ? error.message : "Copy previous week failed");
      }
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
            <Link href="/attendance" className="hover:text-primary-600">Attendance</Link>
            <span>/</span>
            <span>Scheduling</span>
          </div>
          <h1 className="text-heading-5 font-bold text-dark dark:text-white">Shift Scheduling</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            {canEdit ? "Assign and edit individual employee shifts" : "Your weekly shift schedule"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigateWeek(-7)}
            className="rounded-lg border border-gray-3 px-3 py-2 text-xs font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Previous Week
          </button>
          <button
            type="button"
            onClick={() => router.push("/attendance/scheduling")}
            className="rounded-lg border border-gray-3 px-3 py-2 text-xs font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Current Week
          </button>
          <button
            type="button"
            onClick={() => navigateWeek(7)}
            className="rounded-lg border border-gray-3 px-3 py-2 text-xs font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:text-white dark:hover:bg-dark-3"
          >
            Next Week
          </button>
          {canEdit && (
            <button
              type="button"
              onClick={handleCopyPreviousWeek}
              disabled={isPending}
              className="rounded-lg bg-primary-600 px-3 py-2 text-xs font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
            >
              {isPending ? "Copying..." : "Copy Previous Week"}
            </button>
          )}
          <span className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 dark:border-dark-3 dark:text-dark-6">
            {weekLabel}
          </span>
        </div>
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
        <h3 className="mb-3 text-sm font-semibold text-dark dark:text-white">Shift Types</h3>
        <div className="flex flex-wrap gap-4">
          {shiftOptions.map((item) => (
            <div key={item.value} className="flex items-center gap-2">
              <span className={shiftStyles[item.value]}>{item.label}</span>
              <span className="text-xs text-dark-5 dark:text-dark-6">{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {canEdit && (
        <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2 lg:grid-cols-5">
          <select value={bulkDate} onChange={(event) => setBulkDate(event.target.value)} className="rounded-lg border border-gray-3 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            {days.map((day) => (
              <option key={day.date} value={day.date}>{day.dayName} - {day.label}</option>
            ))}
          </select>
          <select value={bulkShift} onChange={(event) => setBulkShift(event.target.value as ShiftType)} className="rounded-lg border border-gray-3 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-3 dark:text-white">
            {shiftOptions.map((shift) => (
              <option key={shift.value} value={shift.value}>{shift.label}</option>
            ))}
          </select>
          <input
            value={bulkNotes}
            onChange={(event) => setBulkNotes(event.target.value)}
            maxLength={200}
            placeholder="Optional note for assignment"
            className="rounded-lg border border-gray-3 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          />
          <div className="flex items-center text-xs text-dark-5 dark:text-dark-6">
            {selectedEmployeeIds.length} selected
          </div>
          <button
            type="button"
            onClick={applyBulkShift}
            disabled={isPending}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {isPending ? "Applying..." : "Apply Bulk Shift"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-4 shadow-card dark:border dark:border-dark-3 dark:bg-dark-2 lg:grid-cols-3">
        <input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search employee, title, or department"
          className="rounded-lg border border-gray-3 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-3 dark:text-white"
        />
        <select
          value={departmentFilter}
          onChange={(event) => setDepartmentFilter(event.target.value)}
          className="rounded-lg border border-gray-3 px-3 py-2 text-sm dark:border-dark-3 dark:bg-dark-3 dark:text-white"
        >
          <option value="ALL">All Departments</option>
          {departmentOptions.map((department) => (
            <option key={department} value={department}>{department}</option>
          ))}
        </select>
        <div className="flex items-center text-xs text-dark-5 dark:text-dark-6">
          Showing {filteredRows.length} of {rows.length} employee{rows.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-card dark:border dark:border-dark-3 dark:bg-dark-2">
        <div className="flex items-center justify-between border-b border-gray-3 px-5 py-4 dark:border-dark-3">
          <h3 className="text-sm font-semibold text-dark dark:text-white">Weekly Schedule</h3>
          <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
            {rows.length} employee{rows.length === 1 ? "" : "s"}
          </span>
        </div>

        {filteredRows.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm font-medium text-dark dark:text-white">No employees found</p>
            <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Try a different search or department filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-3 dark:border-dark-3">
                  {canEdit && (
                    <th className="w-12 px-2 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        ref={(element) => {
                          if (element) {
                            element.indeterminate = someVisibleSelected;
                          }
                        }}
                        onChange={(event) => onSelectAllVisible(event.target.checked)}
                        aria-label="Select all visible employees"
                        className="h-4 w-4 accent-primary-600"
                      />
                    </th>
                  )}
                  <th className="w-64 px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
                  {days.map((day) => (
                    <th key={day.date} className="px-3 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">
                      <div>{day.dayName}</div>
                      <div className="mt-0.5 text-[11px] font-normal">{day.label}</div>
                    </th>
                  ))}
                  <th className="px-5 py-3 text-center text-xs font-semibold text-dark-5 dark:text-dark-6">Dept</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((employee) => {
                  const avatar = resolveAvatar(employee.avatarUrl);

                  return (
                  <tr key={employee.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                    {canEdit && (
                      <td className="px-2 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedEmployeeIds.includes(employee.id)}
                          onChange={(event) => onSelectEmployee(employee.id, event.target.checked)}
                          className="h-4 w-4 accent-primary-600"
                        />
                      </td>
                    )}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={avatar.src}
                          unoptimized={avatar.unoptimized}
                          alt={`${employee.firstName} ${employee.lastName}`}
                          width={32}
                          height={32}
                          className="rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-dark dark:text-white">{employee.firstName} {employee.lastName}</p>
                          <p className="text-xs text-dark-5 dark:text-dark-6">{employee.title}</p>
                        </div>
                      </div>
                    </td>

                    {days.map((day) => {
                      const current = toShiftCellValue(employee.assignments[day.date]);
                      return (
                        <td key={`${employee.id}_${day.date}`} className="px-3 py-3 text-center">
                          {canEdit ? (
                            <select
                              value={current}
                              onChange={(event) => applySingleShift(employee.id, day.date, event.target.value as ShiftCellValue)}
                              className="rounded-lg border border-gray-3 px-2 py-1 text-xs font-medium dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                            >
                              <option value="NOT_SET">Not Set</option>
                              {shiftOptions.map((shift) => (
                                <option key={shift.value} value={shift.value}>{shift.label}</option>
                              ))}
                            </select>
                          ) : (
                            <span className={shiftStyles[current]}>
                              {current === "NOT_SET" ? "Not Set" : current.charAt(0) + current.slice(1).toLowerCase()}
                            </span>
                          )}
                        </td>
                      );
                    })}

                    <td className="px-5 py-3 text-center text-xs text-dark-5 dark:text-dark-6">
                      {employee.department?.name ?? "-"}
                    </td>
                  </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Toast message={toast} />
    </div>
  );
}
