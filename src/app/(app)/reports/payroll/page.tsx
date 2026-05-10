"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const PAYROLL_VALUES = [1_820_000, 1_845_000, 1_858_000, 1_870_000, 1_892_000, 1_905_000];

const DEPT_COSTS = [
  { dept: "Engineering", base: 780_000, benefits: 156_000, total: 936_000 },
  { dept: "Sales", base: 540_000, benefits: 108_000, total: 648_000 },
  { dept: "Product", base: 380_000, benefits: 76_000, total: 456_000 },
  { dept: "Marketing", base: 310_000, benefits: 62_000, total: 372_000 },
  { dept: "Finance", base: 280_000, benefits: 56_000, total: 336_000 },
  { dept: "HR", base: 220_000, benefits: 44_000, total: 264_000 },
];

const totalBase = DEPT_COSTS.reduce((s, d) => s + d.base, 0);
const totalBenefits = DEPT_COSTS.reduce((s, d) => s + d.benefits, 0);

function fmt(n: number) {
  return `$${(n / 1_000).toFixed(0)}K`;
}

function PayrollChart() {
  const min = 1_780_000;
  const max = 1_950_000;
  const range = max - min;
  const width = 340;
  const height = 140;
  const padX = 48;
  const padY = 16;
  const chartW = width - padX * 2;
  const chartH = height - padY * 2;

  const points = PAYROLL_VALUES.map((v, i) => {
    const x = padX + (i / (PAYROLL_VALUES.length - 1)) * chartW;
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
      {PAYROLL_VALUES.map((v, i) => {
        const x = padX + (i / (PAYROLL_VALUES.length - 1)) * chartW;
        const y = padY + chartH - ((v - min) / range) * chartH;
        return <circle key={i} cx={x} cy={y} r="4" fill="white" stroke="#10B981" strokeWidth="2" />;
      })}
      {MONTHS.map((m, i) => {
        const x = padX + (i / (MONTHS.length - 1)) * chartW;
        return <text key={m} x={x} y={height - 3} fontSize="9" fill="#9CA3AF" textAnchor="middle">{m}</text>;
      })}
    </svg>
  );
}

export default function PayrollInsightsPage() {
  const budgetUsed = 84;
  const { toast, setToast } = useToast();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Insights</h1>
          <p className="mt-0.5 text-muted">Cost analysis and payroll trends for Q2 2026</p>
        </div>
        <button
          onClick={() => setToast("Payroll report exported successfully!")}
          className="btn-primary"
        >
          Export Report
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: "Total Payroll (May)", value: "$1.90M", change: "+0.7% MoM" },
          { label: "Base Salaries", value: fmt(totalBase), change: "80% of total" },
          { label: "Benefits Cost", value: fmt(totalBenefits), change: "20% of total" },
          { label: "Avg Salary", value: "$76,800", change: "+$1,200 YoY" },
        ].map((kpi) => (
          <div key={kpi.label} className="card-p">
            <p className="text-muted">{kpi.label}</p>
            <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{kpi.value}</p>
            <p className="mt-1 text-xs text-emerald-dark dark:text-emerald">{kpi.change}</p>
          </div>
        ))}
      </div>

      {/* Chart + Budget */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 card-p">
          <h2 className="section-title mb-4">Monthly Payroll Trend</h2>
          <PayrollChart />
        </div>

        <div className="card-p">
          <h2 className="section-title mb-4">Budget Utilization</h2>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#E5E7EB" strokeWidth="12" className="dark:stroke-dark-3" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#4F46E5" strokeWidth="12"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={`${2 * Math.PI * 50 * (1 - budgetUsed / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-dark dark:text-white">{budgetUsed}%</span>
                <span className="text-muted">Used</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted">Budget</span>
                <span className="font-semibold text-dark dark:text-white">$2.26M</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Spent</span>
                <span className="font-semibold text-dark dark:text-white">$1.90M</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted">Remaining</span>
                <span className="font-semibold text-emerald-dark dark:text-emerald">$360K</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Department Cost Breakdown */}
      <div className="card">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4">
          <h2 className="section-title">Department Cost Breakdown</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="thead-row">
                <th className="th">Department</th>
                <th className="th text-right">Base Salaries</th>
                <th className="th text-right">Benefits</th>
                <th className="th text-right">Total</th>
                <th className="th">Share</th>
              </tr>
            </thead>
            <tbody>
              {DEPT_COSTS.map((d) => (
                <tr key={d.dept} className="tr-body">
                  <td className="td font-medium text-dark dark:text-white">{d.dept}</td>
                  <td className="td text-right text-dark dark:text-white">{fmt(d.base)}</td>
                  <td className="td text-right text-muted">{fmt(d.benefits)}</td>
                  <td className="td text-right font-semibold text-dark dark:text-white">{fmt(d.total)}</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{ width: `${(d.total / DEPT_COSTS.reduce((s, r) => s + r.total, 0)) * 100}%` }}
                        />
                      </div>
                      <span className="text-muted">
                        {((d.total / DEPT_COSTS.reduce((s, r) => s + r.total, 0)) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Benefits vs Base */}
      <div className="card-p">
        <h2 className="section-title mb-4">Benefits vs Base Salary Comparison</h2>
        <div className="space-y-3">
          {DEPT_COSTS.map((d) => (
            <div key={d.dept} className="flex items-center gap-3">
              <span className="w-24 text-muted shrink-0">{d.dept}</span>
              <div className="flex-1 flex h-5 overflow-hidden rounded-full bg-gray-2 dark:bg-dark-3 gap-0.5">
                <div
                  className="h-full bg-primary-500 rounded-l-full transition-all"
                  style={{ width: `${(d.base / d.total) * 100}%` }}
                />
                <div
                  className="h-full bg-emerald-500 rounded-r-full transition-all"
                  style={{ width: `${(d.benefits / d.total) * 100}%` }}
                />
              </div>
              <span className="text-muted w-10 text-right shrink-0">{fmt(d.total)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-5 rounded-sm bg-primary-500" />
            <span className="text-muted">Base Salary</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-5 rounded-sm bg-emerald-500" />
            <span className="text-muted">Benefits</span>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
