import Link from "next/link";
import { OrgTree } from "./_components/org-tree";

export const metadata = {
  title: "Org Chart",
};

export default function OrgChartPage() {
  return (
    <div className="space-y-5">
      {/* ── Page Header ── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <nav className="mb-1 flex items-center gap-1.5 text-xs text-dark-5 dark:text-dark-6">
            <Link
              href="/"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Dashboard
            </Link>
            <span>/</span>
            <Link
              href="/employees"
              className="hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              Employees
            </Link>
            <span>/</span>
            <span className="text-dark dark:text-white">Org Chart</span>
          </nav>
          <h1 className="text-xl font-bold text-dark dark:text-white">
            Org Chart
          </h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">
            Acme Corporation · 248 employees · 4 departments
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-dark-5 dark:text-dark-6"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              placeholder="Search people..."
              readOnly
              className="h-9 w-48 rounded-lg border border-gray-3 bg-gray-2 pl-9 pr-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
            />
          </div>

          {/* Export */}
          <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
            Export
          </button>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="flex flex-wrap items-center gap-4 rounded-xl bg-white px-5 py-3 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <p className="text-xs font-semibold text-dark dark:text-white">
          Departments:
        </p>
        {[
          {
            name: "Engineering",
            color:
              "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
          },
          {
            name: "Product",
            color:
              "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
          },
          {
            name: "Finance",
            color:
              "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
          },
          {
            name: "HR",
            color:
              "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
          },
        ].map((dept) => (
          <span
            key={dept.name}
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${dept.color}`}
          >
            {dept.name}
          </span>
        ))}
        <div className="ml-auto flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald" />
            Online
          </span>
        </div>
      </div>

      {/* ── Org Chart Tree ── */}
      <div className="rounded-xl bg-white p-6 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <OrgTree />
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { dept: "Engineering", count: 45, color: "text-indigo-600 dark:text-indigo-300" },
          { dept: "Product", count: 18, color: "text-violet-dark dark:text-violet-300" },
          { dept: "Finance", count: 12, color: "text-sky-dark dark:text-sky" },
          { dept: "HR", count: 8, color: "text-amber-dark dark:text-amber" },
        ].map((item) => (
          <div
            key={item.dept}
            className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3"
          >
            <p className={`text-2xl font-bold ${item.color}`}>{item.count}</p>
            <p className="mt-0.5 text-xs font-medium text-dark dark:text-white">
              {item.dept}
            </p>
            <p className="text-[10px] text-dark-5 dark:text-dark-6">employees</p>
          </div>
        ))}
      </div>
    </div>
  );
}
