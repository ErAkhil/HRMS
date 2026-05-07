import React from "react";

interface KpiCardProps {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  iconBg: string;
  trend?: React.ReactNode;
}

function KpiCard({ title, value, sub, icon, iconBg, trend }: KpiCardProps) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-dark-5 dark:text-dark-6">{title}</p>
          <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{value}</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">{sub}</p>
        </div>
        <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg}`}>
          {icon}
        </span>
      </div>
      {trend && <div className="mt-3">{trend}</div>}
    </div>
  );
}

export function AttendanceKpiCards() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <KpiCard
        title="Present Today"
        value="218"
        sub="out of 248 employees"
        iconBg="bg-emerald-light dark:bg-emerald-dark/20"
        icon={
          <svg className="h-5 w-5 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        trend={
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-emerald-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            <span className="text-xs text-emerald-dark dark:text-emerald">+4 from yesterday</span>
          </div>
        }
      />
      <KpiCard
        title="Late Arrivals"
        value="14"
        sub="compared to yesterday: 8"
        iconBg="bg-amber-light dark:bg-amber-dark/20"
        icon={
          <svg className="h-5 w-5 text-amber-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
        trend={
          <div className="flex items-center gap-1">
            <svg className="h-3 w-3 text-rose-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span className="text-xs text-rose-dark dark:text-rose">+6 from yesterday</span>
          </div>
        }
      />
      <KpiCard
        title="On Leave"
        value="12"
        sub="approved leaves today"
        iconBg="bg-sky-50 dark:bg-sky-dark/10"
        icon={
          <svg className="h-5 w-5 text-sky-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        }
      />
      <KpiCard
        title="Work From Home"
        value="24"
        sub="remote employees today"
        iconBg="bg-violet-100 dark:bg-violet-dark/20"
        icon={
          <svg className="h-5 w-5 text-violet-dark" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
      />
    </div>
  );
}
