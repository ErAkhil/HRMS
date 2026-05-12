"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import type { getPayrollInsights } from "@/lib/actions/payroll";

type InsightsData = Awaited<ReturnType<typeof getPayrollInsights>> | null;

function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function PayrollChart({ trend }: { trend: { label: string; total: number }[] }) {
  if (trend.length < 2) return null;
  const values = trend.map((t) => t.total);
  const min = Math.min(...values) * 0.95;
  const max = Math.max(...values) * 1.05;
  const range = max - min || 1;
  const width = 340;
  const height = 140;
  const padX = 48;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * chartW;
    const y = padY + chartH - ((v - min) / range) * chartH;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `${padX},${padY + chartH} ${points} ${padX + chartW},${padY + chartH}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
      <defs>
        <linearGradient id="payGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.5, 1].map((t) => {
        const y = padY + chartH * (1 - t);
        const val = Math.round((min + range * t) / 1000);
        return (
          <g key={t}>
            <line x1={padX} y1={y} x2={padX + chartW} y2={y} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4,4" />
            <text x={padX - 4} y={y + 4} fontSize="8" fill="#9CA3AF" textAnchor="end">${val}K</text>
          </g>
        );
      })}
      <polygon points={areaPoints} fill="url(#payGrad)" />
      <polyline points={points} fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const x = padX + (i / (values.length - 1)) * chartW;
        const y = padY + chartH - ((v - min) / range) * chartH;
        return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#10B981" strokeWidth="2" />;
      })}
      {trend.map((t, i) => {
        const x = padX + (i / (trend.length - 1)) * chartW;
        return <text key={t.label} x={x} y={height - 3} fontSize="9" fill="#9CA3AF" textAnchor="middle">{t.label}</text>;
      })}
    </svg>
  );
}

export function PayrollInsightsClient({ data }: Readonly<{ data: InsightsData }>) {
  const { toast, setToast } = useToast();

  const totalDeptGross = data?.deptCosts.reduce((s, d) => s + d.grossTotal, 0) ?? 0;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Insights</h1>
          <p className="mt-0.5 text-muted">
            {data?.hasData
              ? `Cost analysis from ${data.trend.length} processed payroll run${data.trend.length !== 1 ? "s" : ""}`
              : "No payroll runs processed yet"}
          </p>
        </div>
        <button
          onClick={() => {
            if (!data?.hasData) { setToast("No payroll data to export"); return; }
            const header = "Period,Gross Total,Net Pay,Deductions";
            const rows = data.trend.map((t) => `${t.label},${t.total.toFixed(2)},,`);
            const deptHeader = "\n\nDepartment,Employees,Gross Total";
            const deptRows = data.deptCosts.map((d) => `${d.dept},${d.count},${d.grossTotal.toFixed(2)}`);
            const csv = [header, ...rows, deptHeader, ...deptRows].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "payroll-report.csv";
            a.click();
            URL.revokeObjectURL(url);
            setToast("Payroll report exported successfully!");
          }}
          className="btn-primary"
        >
          Export Report
        </button>
      </div>

      {!data?.hasData ? (
        <div className="card flex flex-col items-center justify-center gap-3 py-16 text-center">
          <p className="text-body-medium">No payroll data available</p>
          <p className="text-muted mt-1">Run payroll from the Payroll section to see insights here.</p>
        </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: "Total Payroll (Latest)", value: fmt(data.latestTotal), sub: `${data.headcount} employees` },
              { label: "Total Net Pay", value: fmt(data.latestNet), sub: "After deductions" },
              { label: "Total Deductions", value: fmt(data.latestDeductions), sub: "Tax + PF" },
              { label: "Avg Gross Salary", value: fmt(data.avgSalary), sub: "Per employee" },
            ].map((kpi) => (
              <div key={kpi.label} className="card-p">
                <p className="text-muted">{kpi.label}</p>
                <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{kpi.value}</p>
                <p className="mt-1 text-xs text-emerald-dark dark:text-emerald">{kpi.sub}</p>
              </div>
            ))}
          </div>

          {/* Trend Chart */}
          {data.trend.length >= 2 && (
            <div className="card-p">
              <h2 className="section-title mb-4">Payroll Trend — Last {data.trend.length} Runs</h2>
              <PayrollChart trend={data.trend} />
            </div>
          )}

          {/* Department Cost Breakdown */}
          {data.deptCosts.length > 0 && (
            <>
              <div className="card">
                <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
                  <h2 className="section-title">Department Cost Breakdown</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="thead-row">
                        <th className="th">Department</th>
                        <th className="th text-right">Employees</th>
                        <th className="th text-right">Gross Total</th>
                        <th className="th">Share</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.deptCosts.map((d) => (
                        <tr key={d.dept} className="tr-body">
                          <td className="td font-medium text-dark dark:text-white">{d.dept}</td>
                          <td className="td text-right text-dark dark:text-white">{d.count}</td>
                          <td className="td text-right font-semibold text-dark dark:text-white">{fmt(d.grossTotal)}</td>
                          <td className="td">
                            <div className="flex items-center gap-2">
                              <div className="w-16 h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                                <div
                                  className="h-full rounded-full bg-emerald-500"
                                  style={{ width: totalDeptGross > 0 ? `${((d.grossTotal / totalDeptGross) * 100).toFixed(0)}%` : "0%" }}
                                />
                              </div>
                              <span className="text-muted">
                                {totalDeptGross > 0 ? `${((d.grossTotal / totalDeptGross) * 100).toFixed(0)}%` : "—"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card-p">
                <h2 className="section-title mb-4">Department Cost Distribution</h2>
                <div className="space-y-3">
                  {data.deptCosts.map((d) => (
                    <div key={d.dept} className="flex items-center gap-3">
                      <span className="w-28 text-muted shrink-0 truncate">{d.dept}</span>
                      <div className="flex-1 h-5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                        <div
                          className="h-full bg-primary-500 rounded-full transition-all"
                          style={{ width: totalDeptGross > 0 ? `${((d.grossTotal / totalDeptGross) * 100).toFixed(1)}%` : "0%" }}
                        />
                      </div>
                      <span className="text-muted w-14 text-right shrink-0">{fmt(d.grossTotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <div className="h-2.5 w-5 rounded-sm bg-primary-500" />
                    <span className="text-muted">Gross Salary</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      <Toast message={toast} />
    </div>
  );
}
