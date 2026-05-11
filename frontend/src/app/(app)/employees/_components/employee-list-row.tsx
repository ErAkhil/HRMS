import Image from "next/image";
import Link from "next/link";
import {
  DEPARTMENT_COLORS,
  STATUS_COLORS,
  type Employee,
  type EmployeeDisplay,
} from "./employee-data";

interface EmployeeListRowProps {
  employee: Employee | EmployeeDisplay;
}

export function EmployeeListRow({ employee }: EmployeeListRowProps) {
  const deptColor =
    DEPARTMENT_COLORS[employee.department as keyof typeof DEPARTMENT_COLORS] ??
    "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-dark-5";
  const statusColor = STATUS_COLORS[employee.status as keyof typeof STATUS_COLORS] ?? "bg-gray-400";
  const skills = "skills" in employee ? (employee as Employee).skills : [];

  return (
    <div className="flex items-center gap-4 rounded-xl bg-white px-5 py-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      {/* Avatar */}
      <div className="relative shrink-0">
        <Image
          src={employee.avatar}
          width={42}
          height={42}
          alt={employee.name}
          className="rounded-full object-cover"
        />
        <span
          className={`absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-dark-2 ${statusColor}`}
        />
      </div>

      {/* Name + Title */}
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-dark dark:text-white">
          {employee.name}
        </p>
        <p className="text-xs text-dark-5 dark:text-dark-6">{employee.title}</p>
      </div>

      {/* Department */}
      <span className={`hidden sm:inline-flex ${deptColor}`}>
        {employee.department}
      </span>

      {/* Email */}
      <p className="hidden w-48 truncate text-xs text-dark-5 dark:text-dark-6 lg:block">
        {employee.email}
      </p>

      {/* Skills (only for legacy Employee shape) */}
      {skills.length > 0 && (
        <div className="hidden gap-1.5 xl:flex">
          {skills.slice(0, 2).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-gray-2 px-2 py-0.5 text-[10px] font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Action */}
      <Link
        href="/employees/profile"
        className="shrink-0 rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
      >
        View
      </Link>
    </div>
  );
}
