"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

const MY_CERTIFICATIONS = [
  { id: 1, name: "SHRM Certified Professional", issuer: "SHRM", earned: "Mar 15, 2025", expiry: "Mar 15, 2028", credential: "SHRM-CP-2025-8821" },
  { id: 2, name: "PHR — Professional in Human Resources", issuer: "HRCI", earned: "Nov 20, 2024", expiry: "Nov 20, 2027", credential: "HRCI-PHR-2024-3341" },
  { id: 3, name: "Google Data Analytics Certificate", issuer: "Google", earned: "Jul 8, 2025", expiry: "N/A", credential: "GDA-2025-7702" },
  { id: 4, name: "Employment Law Compliance", issuer: "Unikove Academy", earned: "Jan 12, 2026", expiry: "Jan 12, 2028", credential: "UNIKOVE-ELC-9931" },
  { id: 5, name: "Advanced Excel Specialist", issuer: "Microsoft", earned: "Dec 3, 2024", expiry: "N/A", credential: "MSFT-AES-5547" },
];

const AVAILABLE_CERTIFICATIONS = [
  { id: 1, name: "SPHR — Senior Professional in Human Resources", provider: "HRCI", requirements: "5+ years HR experience, PHR certification", examDate: "Jun 20, 2026", fee: "$395" },
  { id: 2, name: "Certified Compensation Professional", provider: "WorldatWork", requirements: "3+ years compensation experience", examDate: "Jul 5, 2026", fee: "$450" },
  { id: 3, name: "Talent Management Practitioner", provider: "IHRP", requirements: "2+ years in talent management", examDate: "Jun 28, 2026", fee: "$280" },
  { id: 4, name: "Diversity & Inclusion Specialist", provider: "Cornell ILR", requirements: "HR role, online coursework", examDate: "Jul 15, 2026", fee: "$350" },
  { id: 5, name: "Workday HCM Functional Consultant", provider: "Workday", requirements: "Workday HCM system experience", examDate: "Jun 10, 2026", fee: "$500" },
  { id: 6, name: "AI in HR Practitioner", provider: "Unikove Academy", requirements: "Basic data literacy, HR role", examDate: "May 25, 2026", fee: "Free" },
];

export default function CertificationsPage() {
  const { toast, setToast } = useToast();

  return (
    <div className="page-container">
      {/* Header */}
      <div>
        <h1 className="page-title">Certifications</h1>
        <p className="text-muted mt-0.5">Manage your earned certificates and explore new ones</p>
      </div>

      {/* My Certifications */}
      <div>
        <h2 className="section-title mb-3">My Certifications</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MY_CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="card-p"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/20">
                  <svg className="h-5 w-5 text-primary-600 dark:text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                  Active
                </span>
              </div>
              <p className="text-body-medium mb-1">{cert.name}</p>
              <p className="text-muted mb-3">{cert.issuer}</p>
              <div className="text-muted space-y-1 mb-3">
                <p>Earned: <span className="text-dark dark:text-white">{cert.earned}</span></p>
                <p>Expires: <span className="text-dark dark:text-white">{cert.expiry}</span></p>
                <p className="font-mono text-xs truncate">{cert.credential}</p>
              </div>
              <button
                onClick={() => setToast("Downloading certificate PDF...")}
                className="btn-secondary w-full py-1.5 text-xs"
              >
                Download Certificate
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Available Certifications */}
      <div>
        <h2 className="section-title mb-3">Available Certifications</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {AVAILABLE_CERTIFICATIONS.map((cert) => (
            <div
              key={cert.id}
              className="card-p"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-light dark:bg-violet-dark/20">
                  <svg className="h-5 w-5 text-violet-dark dark:text-violet-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cert.fee === "Free" ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" : "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300"}`}>
                  {cert.fee}
                </span>
              </div>
              <p className="text-body-medium mb-1">{cert.name}</p>
              <p className="text-muted mb-3">{cert.provider}</p>
              <div className="text-muted space-y-1 mb-3">
                <p>Requires: {cert.requirements}</p>
                <p>Next Exam: <span className="text-dark dark:text-white font-medium">{cert.examDate}</span></p>
              </div>
              <button
                onClick={() => setToast("Registration confirmed! Check your email for details.")}
                className="btn-primary w-full py-1.5"
              >
                Register
              </button>
            </div>
          ))}
        </div>
      </div>

      <Toast message={toast} />
    </div>
  );
}
