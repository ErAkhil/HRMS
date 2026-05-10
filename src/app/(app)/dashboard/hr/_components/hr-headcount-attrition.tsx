import Image from "next/image";
import Link from "next/link";
import { badgeClass, headcountMonths, deptHeadcount, attritionRisk, exitReasons } from "../_data/hr-data";

export function HrHeadcountAttrition() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">

      {/* Headcount Trend */}
      <div className="md:col-span-7 rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-dark dark:text-white">Headcount · Last 6 Months</h2>
          <Link href="/reports" className="text-xs font-medium text-primary-600 hover:underline dark:text-primary-400">Export →</Link>
        </div>

        <div className="flex items-end gap-2 h-32 mb-3">
          {headcountMonths.map((m, i) => (
            <div key={m.label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] font-semibold text-dark-5 dark:text-dark-6">{m.count}</span>
              <div
                className={`w-full rounded-t-md ${i === headcountMonths.length - 1 ? "bg-primary-600" : "bg-primary-200 dark:bg-primary-900/40"}`}
                style={{ height: `${m.height}px` }}
              />
              <span className="text-[10px] text-dark-5 dark:text-dark-6 whitespace-nowrap">{m.label}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 py-3 border-t border-b border-gray-3 dark:border-dark-3 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-emerald-dark dark:text-emerald">+14</span>
            <span className="text-xs text-dark-5 dark:text-dark-6">New Hires (May)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-rose-dark dark:text-rose">-2</span>
            <span className="text-xs text-dark-5 dark:text-dark-6">Exits (May)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-primary-600 dark:text-primary-400">+12</span>
            <span className="text-xs text-dark-5 dark:text-dark-6">Net Growth</span>
          </div>
        </div>

        <h3 className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6 mb-2">Department Headcount</h3>
        <div className="divide-y divide-gray-3 dark:divide-dark-3">
          {deptHeadcount.map((row) => (
            <div key={row.dept} className="flex items-center justify-between py-1.5">
              <span className="text-xs font-medium text-dark dark:text-white">{row.dept}</span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-dark dark:text-white">{row.count}</span>
                <span className={`text-xs font-semibold ${row.deltaColor}`}>{row.delta}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Attrition Risk + Exit Summary */}
      <div className="md:col-span-5 flex flex-col gap-4">

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Attrition Watch</h2>
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeClass.amber}`}>4 at risk</span>
          </div>
          <div className="space-y-3">
            {attritionRisk.map((emp) => (
              <div key={emp.name} className="flex items-start gap-2.5 border-b border-gray-3 dark:border-dark-3 pb-3 last:border-0 last:pb-0">
                <Image src={emp.img} alt={emp.name} width={28} height={28} className="rounded-full object-cover shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-dark dark:text-white">{emp.name}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${badgeClass[emp.riskColor]}`}>{emp.risk}</span>
                  </div>
                  <p className="text-[10px] text-dark-5 dark:text-dark-6 mt-0.5">{emp.dept} · {emp.reason}</p>
                  <button className="mt-1.5 rounded px-2 py-0.5 text-[10px] font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 transition-colors">
                    Schedule 1:1
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-gray-3 dark:border-dark-3 pt-3">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6 mb-2">Attrition Stats</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "This month", value: "2 exits" },
                { label: "Last month", value: "3 exits" },
                { label: "YTD", value: "11 exits" },
                { label: "Rate", value: "4.4%" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg bg-gray-1 dark:bg-dark-3/40 px-3 py-2">
                  <p className="text-[10px] text-dark-5 dark:text-dark-6">{stat.label}</p>
                  <p className="text-xs font-bold text-dark dark:text-white">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-dark dark:text-white">Exit Interview Summary</h2>
            <span className="text-xs text-dark-5 dark:text-dark-6">11 exits YTD</span>
          </div>
          <div className="space-y-3">
            {exitReasons.map((item) => (
              <div key={item.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-dark dark:text-white">{item.reason}</span>
                  <span className="text-xs text-dark-5 dark:text-dark-6">{item.exits} exits ({item.pct}%)</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                  <div className={`absolute inset-y-0 left-0 rounded-full ${item.barColor}`} style={{ width: item.width }} />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
