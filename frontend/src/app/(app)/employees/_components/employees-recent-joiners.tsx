import Image from "next/image";
import Link from "next/link";

interface Joiner {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
  title: string;
  startDate: string | Date;
  department?: { name: string } | null;
}

interface Props {
  newJoiners: Joiner[];
  deptBadgeColor: Record<string, string>;
}

const today = new Date();

function daysAgo(date: string | Date) {
  return Math.floor((today.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
}

export function EmployeesRecentJoiners({ newJoiners, deptBadgeColor }: Readonly<Props>) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-dark dark:text-white">Recent Joiners</h2>
        <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">{newJoiners.length}</span>
      </div>
      {newJoiners.length === 0 ? (
        <p className="text-sm text-dark-5 dark:text-dark-6">No employees yet.</p>
      ) : (
        <div className="space-y-3">
          {newJoiners.map((emp) => {
            const fullName = `${emp.firstName} ${emp.lastName}`;
            const dept = emp.department?.name ?? "—";
            const da = daysAgo(emp.startDate);
            const badgeColor = deptBadgeColor[dept] ?? "bg-primary-50 text-primary-600";
            return (
              <div key={emp.id} className="flex items-center gap-3">
                <Image src={emp.avatarUrl ?? "/images/user/user-03.png"} alt={fullName} width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-dark dark:text-white">{fullName}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${badgeColor}`}>{dept}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="truncate text-xs text-dark-5 dark:text-dark-6">{emp.title}</p>
                    <span className="text-xs text-dark-5 dark:text-dark-6">· {da}d ago</span>
                  </div>
                </div>
                <Link href="/employees/profile" className="shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                  View
                </Link>
              </div>
            );
          })}
        </div>
      )}
      <div className="mt-4 border-t border-gray-100 pt-3 dark:border-dark-3">
        <Link href="/employees?filter=new" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
          View all new joiners →
        </Link>
      </div>
    </div>
  );
}
