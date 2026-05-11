import Image from "next/image";
import type { EmployeeProfile } from "@/lib/actions/employees";

function tenure(startDate: string) {
  const start = new Date(startDate);
  const now = new Date();
  const months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (years === 0) return `${rem}mo`;
  return rem === 0 ? `${years}yr` : `${years}yr ${rem}mo`;
}

interface Props {
  employee: EmployeeProfile;
}

export function ProfileHeroCard({ employee }: Readonly<Props>) {
  const totalLeave = employee.leaveBalances.reduce((s, b) => s + b.total, 0);
  const activeGoals = employee.goals.length;

  return (
    <div className="rounded-xl bg-white p-6 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex flex-wrap items-start gap-6">
        <div className="relative shrink-0">
          <Image
            src={employee.avatarUrl ?? "/images/user/user-01.png"}
            alt={`${employee.firstName} ${employee.lastName}`}
            width={80}
            height={80}
            className="rounded-full object-cover"
          />
          {employee.isActive && (
            <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
          )}
        </div>

        <div className="min-w-[160px]">
          <h1 className="text-xl font-bold text-dark dark:text-white">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">{employee.title}</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">
            Joined {new Date(employee.startDate).toLocaleDateString("en-US", { month: "long", year: "numeric" })} &middot; {tenure(employee.startDate)}
          </p>
        </div>

        <div className="min-w-[200px] flex-1 space-y-2.5">
          {employee.department && (
            <div>
              <span className="inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium"
                style={{ backgroundColor: employee.department.color + "20", color: employee.department.color }}>
                {employee.department.name}
              </span>
            </div>
          )}
          <p className="text-sm text-dark-5 dark:text-dark-6">
            {employee.employmentType} · {employee.employeeCode}
          </p>
          {employee.manager && (
            <p className="text-sm text-dark-5 dark:text-dark-6">
              Reports to{" "}
              <span className="font-medium text-dark dark:text-white">
                {employee.manager.firstName} {employee.manager.lastName}
              </span>
              , {employee.manager.title}
            </p>
          )}
          {employee.email && (
            <p className="truncate text-sm text-dark-5 dark:text-dark-6">{employee.email}</p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-x-8 gap-y-3 text-center">
          <div>
            <p className="text-2xl font-bold text-dark dark:text-white">{totalLeave}</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Leave Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-dark dark:text-white">{activeGoals}</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Active Goals</p>
          </div>
          <div>
            <p className={`text-sm font-semibold leading-tight ${employee.isActive ? "text-emerald-dark" : "text-rose-600"}`}>
              {employee.isActive ? "Active" : "Inactive"}
            </p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Status</p>
          </div>
        </div>
      </div>
    </div>
  );
}
