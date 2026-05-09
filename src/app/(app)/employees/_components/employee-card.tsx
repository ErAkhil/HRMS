import Image from "next/image";
import Link from "next/link";
import {
  DEPARTMENT_COLORS,
  STATUS_COLORS,
  type Employee,
  type EmployeeDisplay,
} from "./employee-data";

interface EmployeeCardProps {
  employee: Employee | EmployeeDisplay;
}

export function EmployeeCard({ employee }: EmployeeCardProps) {
  const deptColor =
    DEPARTMENT_COLORS[employee.department as keyof typeof DEPARTMENT_COLORS] ??
    "rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-dark-5";
  const statusColor = STATUS_COLORS[employee.status as keyof typeof STATUS_COLORS] ?? "bg-gray-400";
  const skills = "skills" in employee ? (employee as Employee).skills : [];

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 flex flex-col">
      {/* Avatar + status */}
      <div className="flex items-start justify-between">
        <div className="relative">
          <Image
            src={employee.avatar}
            width={52}
            height={52}
            alt={employee.name}
            className="rounded-full object-cover"
          />
          <span
            className={`absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white dark:border-dark-2 ${statusColor}`}
            title={employee.status}
          />
        </div>
        <span className={deptColor}>
          {employee.department}
        </span>
      </div>

      {/* Name + Title */}
      <div className="mt-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          {employee.name}
        </h3>
        <p className="text-xs text-dark-5 dark:text-dark-6">{employee.title}</p>
      </div>

      {/* Email */}
      <p className="mt-2 truncate text-xs text-dark-5 dark:text-dark-6">
        {employee.email}
      </p>

      {/* Skills (only for legacy Employee shape) */}
      {skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-gray-2 px-2 py-0.5 text-[10px] font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 border-t border-gray-3 pt-3 dark:border-dark-3">
        <Link
          href="/employees/profile"
          className="flex w-full items-center justify-center rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}
