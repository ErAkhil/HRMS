import Image from "next/image";
import Link from "next/link";
import type { DepartmentRow } from "@/lib/actions/departments";
import { AvatarStack } from "./avatar-stack";

export function DeptCard({
  dept,
  onEdit,
  onDelete,
}: Readonly<{
  dept: DepartmentRow;
  onEdit: (d: DepartmentRow) => void;
  onDelete: (d: DepartmentRow) => void;
}>) {
  return (
    <div className="card flex flex-col overflow-hidden">
      <div className="h-1.5 w-full flex-shrink-0" style={{ backgroundColor: dept.color }} />

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="mt-0.5 h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: dept.color }} />
            <h3 className="section-title truncate">{dept.name}</h3>
          </div>
          <div className="flex flex-shrink-0 items-center gap-1">
            <button
              onClick={() => onEdit(dept)}
              title="Edit department"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-dark-5 transition-colors hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(dept)}
              title="Delete department"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-dark-5 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:text-dark-6 dark:hover:bg-rose-dark/10 dark:hover:text-rose"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <p className="mt-2 text-xs text-dark-5 dark:text-dark-6 line-clamp-2 min-h-[2.5rem]">
          {dept.description ?? "No description provided."}
        </p>

        <div className="mt-4 flex items-center gap-2.5">
          {dept.head ? (
            <>
              <Image
                src={dept.head.avatarUrl ?? "/images/user/user-03.png"}
                alt={`${dept.head.firstName} ${dept.head.lastName}`}
                width={32}
                height={32}
                className="h-8 w-8 flex-shrink-0 rounded-full object-cover ring-2 ring-white dark:ring-dark-2"
                style={{ "--tw-ring-color": dept.color } as React.CSSProperties}
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-dark dark:text-white">
                  {dept.head.firstName} {dept.head.lastName}
                </p>
                <p className="truncate text-[10px] text-dark-5 dark:text-dark-6">{dept.head.title}</p>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-3 dark:border-dark-3">
                <svg className="h-3.5 w-3.5 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <button onClick={() => onEdit(dept)} className="text-xs text-amber-600 hover:underline dark:text-amber">
                Set department head →
              </button>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-gray-2 pt-3.5 dark:border-dark-3">
          {dept.employeeCount > 0 ? (
            <AvatarStack employees={dept.sampleEmployees} total={dept.employeeCount} />
          ) : (
            <span className="text-xs text-dark-5 dark:text-dark-6">No employees yet</span>
          )}
          <Link href={`/employees?dept=${dept.id}`} className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">
            View →
          </Link>
        </div>
      </div>
    </div>
  );
}
