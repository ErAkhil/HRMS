import Image from "next/image";
import type { PayslipRow } from "@/lib/actions/payroll";

function fmt(n: number) {
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function PayrollTable({ rows }: { rows: PayslipRow[] }) {
  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-3 dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Payroll Summary</h3>
        <span className="text-xs text-dark-5 dark:text-dark-6">{rows.length} employees</span>
      </div>

      {rows.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-sm text-dark-5 dark:text-dark-6">No payroll processed yet.</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Run payroll above to generate payslips.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Gross</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Tax</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">PF</th>
                <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Net Pay</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={row.avatarUrl ?? "/images/user/user-01.png"}
                        alt={row.employeeName}
                        width={36}
                        height={36}
                        className="rounded-full object-cover shrink-0"
                      />
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">{row.employeeName}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{row.employeeTitle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm font-medium text-dark dark:text-white">{fmt(row.grossPay)}</td>
                  <td className="px-5 py-3 text-right text-sm text-rose-dark dark:text-rose">{fmt(row.taxDeduction)}</td>
                  <td className="px-5 py-3 text-right text-sm text-amber-dark">{fmt(row.pfDeduction)}</td>
                  <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-dark dark:text-emerald">{fmt(row.netPay)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
