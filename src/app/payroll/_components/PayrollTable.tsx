import Image from "next/image";

type PayrollStatus = "Processed" | "Pending" | "On Hold";

interface PayrollRow {
  id: number;
  name: string;
  avatar: string;
  role: string;
  gross: string;
  tax: string;
  pf: string;
  netPay: string;
  status: PayrollStatus;
}

const payrollData: PayrollRow[] = [
  { id: 1, name: "Sarah Mitchell", avatar: "/images/user/user-01.png", role: "Sr. Software Engineer", gross: "₹3,20,000", tax: "₹48,000", pf: "₹21,600", netPay: "₹2,50,400", status: "Processed" },
  { id: 2, name: "Daniel Park", avatar: "/images/user/user-02.png", role: "Product Manager", gross: "₹2,80,000", tax: "₹42,000", pf: "₹18,900", netPay: "₹2,19,100", status: "Processed" },
  { id: 3, name: "Priya Sharma", avatar: "/images/user/user-03.png", role: "UX Designer", gross: "₹2,10,000", tax: "₹28,000", pf: "₹14,175", netPay: "₹1,67,825", status: "Pending" },
  { id: 4, name: "James Williams", avatar: "/images/user/user-04.png", role: "Sales Lead", gross: "₹2,50,000", tax: "₹35,000", pf: "₹16,875", netPay: "₹1,98,125", status: "Processed" },
  { id: 5, name: "Elena Torres", avatar: "/images/user/user-05.png", role: "HR Manager", gross: "₹1,80,000", tax: "₹22,500", pf: "₹12,150", netPay: "₹1,45,350", status: "On Hold" },
  { id: 6, name: "Arjun Mehta", avatar: "/images/user/user-06.png", role: "Financial Analyst", gross: "₹1,90,000", tax: "₹24,700", pf: "₹12,825", netPay: "₹1,52,475", status: "Processed" },
  { id: 7, name: "Lisa Chen", avatar: "/images/user/user-07.png", role: "Marketing Head", gross: "₹2,40,000", tax: "₹33,600", pf: "₹16,200", netPay: "₹1,90,200", status: "Pending" },
  { id: 8, name: "Marcus Johnson", avatar: "/images/user/user-08.png", role: "Backend Engineer", gross: "₹2,95,000", tax: "₹44,250", pf: "₹19,913", netPay: "₹2,30,837", status: "Processed" },
];

const statusBadge: Record<PayrollStatus, string> = {
  Processed: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Pending: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  "On Hold": "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

export function PayrollTable() {
  return (
    <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-gray-3 dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">Payroll Summary</h3>
        <input
          type="text"
          placeholder="Search employee..."
          className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
        />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-1 dark:bg-dark-3">
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Employee</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Gross</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Tax</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">PF</th>
              <th className="px-5 py-3 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Net Pay</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {payrollData.map((row) => (
              <tr key={row.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Image src={row.avatar} alt={row.name} width={36} height={36} className="rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-medium text-dark dark:text-white">{row.name}</p>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{row.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-right text-sm font-medium text-dark dark:text-white">{row.gross}</td>
                <td className="px-5 py-3 text-right text-sm text-rose-dark dark:text-rose">{row.tax}</td>
                <td className="px-5 py-3 text-right text-sm text-amber-dark">{row.pf}</td>
                <td className="px-5 py-3 text-right text-sm font-semibold text-emerald-dark dark:text-emerald">{row.netPay}</td>
                <td className="px-5 py-3">
                  <span className={statusBadge[row.status]}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
