interface DeptEntry { name: string; count: number; color: string }
interface EtEntry { label: string; dot: string; count: number; pct: number }

interface Props {
  totalEmployees: number;
  deptBreakdown: DeptEntry[];
  etBreakdown: EtEntry[];
}

export function EmployeesDeptBreakdown({ totalEmployees, deptBreakdown, etBreakdown }: Readonly<Props>) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-dark dark:text-white">Headcount by Department</h2>
          <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">{totalEmployees}</span>
        </div>
        {deptBreakdown.length === 0 ? (
          <p className="text-sm text-dark-5 dark:text-dark-6">No department data yet.</p>
        ) : (
          <div className="space-y-3">
            {deptBreakdown.map((dept) => {
              const pct = totalEmployees > 0 ? Math.round((dept.count / totalEmployees) * 100) : 0;
              return (
                <div key={dept.name} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm font-medium text-dark dark:text-white">{dept.name}</span>
                  <div className="flex-1">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-dark-3">
                      <div className={`h-2 rounded-full ${dept.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <span className="w-8 shrink-0 text-right text-sm font-semibold text-dark dark:text-white">{dept.count}</span>
                  <span className="w-10 shrink-0 text-right text-xs text-dark-5 dark:text-dark-6">{pct}%</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-4">
        <h2 className="mb-4 text-base font-semibold text-dark dark:text-white">Employment Type</h2>
        <div className="space-y-3">
          {etBreakdown.map((et) => (
            <div key={et.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${et.dot}`} />
                <span className="text-sm text-dark dark:text-white">{et.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-dark dark:text-white">{et.count}</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">{et.pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
