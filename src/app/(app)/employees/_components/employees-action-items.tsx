import { actionItems } from "../_data/employees-data";

export function EmployeesActionItems() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 md:col-span-7">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-dark dark:text-white">HR Action Items</h2>
        <span className="rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark dark:bg-rose-dark/20 dark:text-rose">
          {actionItems.length} pending
        </span>
      </div>
      <div className="space-y-3">
        {actionItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50 dark:hover:bg-dark-3">
            <div className="shrink-0">{item.icon}</div>
            <p className="flex-1 text-sm text-dark dark:text-white">{item.description}</p>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${item.badgeClass}`}>{item.badge}</span>
            <button className="shrink-0 rounded-lg border border-gray-3 bg-white px-3 py-1 text-xs font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
              {item.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
