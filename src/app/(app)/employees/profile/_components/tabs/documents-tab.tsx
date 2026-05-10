const DOCUMENTS = [
  { name: "Offer Letter", type: "PDF", date: "Uploaded March 2022", action: "Download" },
  { name: "Employment Contract", type: "PDF", date: "Uploaded March 2022", action: "Download" },
  { name: "May 2026 Payslip", type: "PDF", date: "Generated May 1, 2026", action: "Download" },
  { name: "Apr 2026 Payslip", type: "PDF", date: "Generated Apr 1, 2026", action: "Download" },
  { name: "PAN Card", type: "PDF", date: "Uploaded March 2022", action: "Download" },
  { name: "Aadhaar Card", type: "PDF", date: "Uploaded March 2022", action: "View" },
];

export function DocumentsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-dark dark:text-white">Documents</h2>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">Upload Document</button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOCUMENTS.map(({ name, type, date, action }) => (
          <div key={name} className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-900/20">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-dark dark:text-white">{name}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">{date}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">{type}</span>
              <button className="text-xs font-medium text-indigo-600 hover:underline dark:text-indigo-400">{action}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
