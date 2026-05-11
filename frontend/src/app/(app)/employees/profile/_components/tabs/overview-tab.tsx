import type { EmployeeProfile } from "@/lib/actions/employees";

const LEAVE_BAR_COLORS: Record<string, string> = {
  ANNUAL: "bg-primary-600",
  SICK: "bg-amber",
  CASUAL: "bg-violet-500",
  MATERNITY: "bg-emerald",
  PATERNITY: "bg-sky-dark",
  UNPAID: "bg-dark-4",
  OTHER: "bg-rose-600",
};

interface Props {
  employee: EmployeeProfile;
  onGoToPerformance: () => void;
  onGoToLeave: () => void;
}

export function OverviewTab({ employee, onGoToPerformance, onGoToLeave }: Readonly<Props>) {
  const joinDate = new Date(employee.startDate);

  const personalFields = [
    { label: "Full Name", value: `${employee.firstName} ${employee.lastName}` },
    { label: "Email", value: employee.email },
    { label: "Phone", value: employee.phone ?? "—" },
    { label: "Employee ID", value: employee.employeeCode },
  ];

  const employmentFields = [
    { label: "Department", value: employee.department?.name ?? "—" },
    { label: "Designation", value: employee.title },
    { label: "Employment Type", value: employee.employmentType },
    { label: "Start Date", value: joinDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
    { label: "Reports To", value: employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : "—" },
    { label: "Status", value: employee.isActive ? "Active" : "Inactive" },
  ];

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <div className="space-y-5 md:col-span-8">
          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Personal Information</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {personalFields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{label}</p>
                  <p className="mt-1 text-sm font-medium text-dark dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Employment Details</h2>
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
              {employmentFields.map(({ label, value }) => (
                <div key={label}>
                  <p className="text-xs font-medium uppercase tracking-wide text-dark-5 dark:text-dark-6">{label}</p>
                  <p className="mt-1 text-sm font-medium text-dark dark:text-white">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {employee.goals.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Active Goals</h2>
              <div className="space-y-2">
                {employee.goals.map((goal) => (
                  <div key={goal.id} className="flex items-center justify-between rounded-lg bg-gray-2 px-3 py-2.5 dark:bg-dark-3">
                    <p className="text-sm font-medium text-dark dark:text-white">{goal.title}</p>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
                      {goal.status.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
              <button onClick={onGoToPerformance} className="mt-3 text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">
                View Performance &rarr;
              </button>
            </div>
          )}
        </div>

        <div className="space-y-5 md:col-span-4">
          {employee.leaveBalances.length > 0 && (
            <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Leave Balance</h2>
              <div className="space-y-3">
                {employee.leaveBalances.map((lb) => {
                  const pct = lb.total > 0 ? Math.round((lb.used / lb.total) * 100) : 0;
                  const color = LEAVE_BAR_COLORS[lb.leaveType] ?? "bg-primary-600";
                  return (
                    <div key={lb.id}>
                      <div className="mb-1 flex justify-between text-xs">
                        <span className="text-dark-5 dark:text-dark-6 capitalize">{lb.leaveType.toLowerCase()} Leave</span>
                        <span className="font-semibold text-dark dark:text-white">{lb.used} / {lb.total} days</span>
                      </div>
                      <div className="relative h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                        <div className={`absolute inset-y-0 left-0 rounded-full ${color}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button onClick={onGoToLeave} className="mt-4 w-full rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                View Leave History
              </button>
            </div>
          )}

          <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
            <h2 className="mb-3 text-base font-semibold text-dark dark:text-white">Quick Info</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-dark-5 dark:text-dark-6">Salary</dt>
                <dd className="font-semibold text-dark dark:text-white">₹{employee.salary.toLocaleString("en-IN")}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark-5 dark:text-dark-6">Active Goals</dt>
                <dd className="font-semibold text-dark dark:text-white">{employee.goals.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-dark-5 dark:text-dark-6">Leave Days (Total)</dt>
                <dd className="font-semibold text-dark dark:text-white">{employee.leaveBalances.reduce((s, b) => s + b.total, 0)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
