import Link from "next/link";

const MONTHS = [
  "May 2026", "April 2026", "March 2026", "February 2026",
  "January 2026", "December 2025", "November 2025", "October 2025",
  "September 2025", "August 2025", "July 2025", "June 2025",
];

export const metadata = {
  title: "Payslips",
};

export default function PayslipsPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/payroll" className="hover:text-primary-600">Payroll</Link>
            <span>/</span>
            <span>Payslips</span>
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Payslips</h1>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-12">
        {/* Month List */}
        <div className="lg:col-span-3">
          <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
            <div className="p-4 border-b border-gray-3 dark:border-dark-3">
              <p className="text-sm font-semibold text-dark dark:text-white">Select Period</p>
            </div>
            <div className="p-2">
              {MONTHS.map((month, i) => (
                <button
                  key={month}
                  className={`w-full rounded-lg px-4 py-2.5 text-left text-sm transition-colors ${
                    i === 0
                      ? "bg-primary-600 font-semibold text-white"
                      : "text-dark-5 hover:bg-gray-1 dark:text-dark-6 dark:hover:bg-dark-3"
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payslip Document */}
        <div className="lg:col-span-9">
          <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
            {/* Payslip Header */}
            <div className="border-b border-gray-3 bg-gray-1 p-6 dark:border-dark-3 dark:bg-dark-3">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-dark dark:text-white">Acme Corporation</h2>
                  <p className="text-xs text-dark-5 dark:text-dark-6">123 Business Park, San Francisco, CA 94105</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">GSTIN: 27AABCA1234B1Z5 | CIN: U72200MH2010PTC123456</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-dark dark:text-white">PAYSLIP</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">May 2026</p>
                  <p className="text-xs text-dark-5 dark:text-dark-6">Slip #: PAY-2026-05-001</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Employee Details */}
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Employee Details</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-4">
                  {[
                    { label: "Name", value: "Sarah Mitchell" },
                    { label: "Employee ID", value: "EMP-001" },
                    { label: "Department", value: "Engineering" },
                    { label: "Designation", value: "Sr. Software Engineer" },
                    { label: "Date of Joining", value: "Mar 14, 2022" },
                    { label: "PAN", value: "ABCDE1234F" },
                    { label: "Bank Account", value: "XXXX XXXX 4521" },
                    { label: "IFSC", value: "HDFC0001234" },
                  ].map((item) => (
                    <div key={item.label}>
                      <p className="text-xs text-dark-5 dark:text-dark-6">{item.label}</p>
                      <p className="text-sm font-medium text-dark dark:text-white">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Earnings & Deductions side by side */}
              <div className="grid gap-5 md:grid-cols-2">
                {/* Earnings */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Earnings</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-1 dark:bg-dark-3">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Component</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Basic Salary", amount: "₹1,92,000" },
                        { label: "HRA", amount: "₹64,000" },
                        { label: "Transport Allowance", amount: "₹19,200" },
                        { label: "Medical Allowance", amount: "₹12,500" },
                        { label: "Special Allowance", amount: "₹22,300" },
                        { label: "Performance Bonus", amount: "₹10,000" },
                      ].map((item) => (
                        <tr key={item.label} className="border-b border-gray-3 dark:border-dark-3">
                          <td className="px-3 py-2 text-dark dark:text-white">{item.label}</td>
                          <td className="px-3 py-2 text-right font-medium text-emerald-dark dark:text-emerald">{item.amount}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-1 dark:bg-dark-3">
                        <td className="px-3 py-2 text-sm font-bold text-dark dark:text-white">Gross Earnings</td>
                        <td className="px-3 py-2 text-right text-sm font-bold text-dark dark:text-white">₹3,20,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Deductions */}
                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Deductions</p>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-1 dark:bg-dark-3">
                        <th className="px-3 py-2 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Component</th>
                        <th className="px-3 py-2 text-right text-xs font-semibold text-dark-5 dark:text-dark-6">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { label: "Provident Fund (Employee)", amount: "₹21,600" },
                        { label: "Income Tax (TDS)", amount: "₹44,000" },
                        { label: "Professional Tax", amount: "₹2,400" },
                        { label: "Health Insurance", amount: "₹1,600" },
                      ].map((item) => (
                        <tr key={item.label} className="border-b border-gray-3 dark:border-dark-3">
                          <td className="px-3 py-2 text-dark dark:text-white">{item.label}</td>
                          <td className="px-3 py-2 text-right font-medium text-rose-dark dark:text-rose">{item.amount}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-1 dark:bg-dark-3">
                        <td className="px-3 py-2 text-sm font-bold text-dark dark:text-white">Total Deductions</td>
                        <td className="px-3 py-2 text-right text-sm font-bold text-rose-dark dark:text-rose">₹69,600</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Net Pay */}
              <div className="rounded-xl border-2 border-primary-600 bg-indigo-50 p-5 dark:bg-indigo-900/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-dark-5 dark:text-dark-6">Net Pay (Take Home)</p>
                    <p className="text-3xl font-bold text-dark dark:text-white mt-1">₹2,50,400</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Two Lakh Fifty Thousand Four Hundred Rupees Only</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-dark-5 dark:text-dark-6">Payment Date</p>
                    <p className="text-sm font-semibold text-dark dark:text-white">May 31, 2026</p>
                    <p className="text-xs text-dark-5 dark:text-dark-6 mt-1">Mode: Bank Transfer</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 border-t border-gray-3 pt-4 dark:border-dark-3">
                <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download PDF
                </button>
                <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Payslip
                </button>
                <button className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                  </svg>
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
