"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOrganization,
  updateOrgPlan,
  deleteOrganization,
} from "@/lib/actions/organizations";
import { CreateOrgModal } from "./create-org-modal";

type Org = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  logoUrl: string | null;
  address: string | null;
  createdAt: string;
  userCount: number;
  employeeCount: number;
  subscriptionStatus: string | null;
  subscriptionEnds: string | null;
};

const PLAN_OPTIONS = ["BASIC", "PRO", "PRO_PLUS", "PRO_MAX"] as const;

const PLAN_LABELS: Record<string, string> = {
  BASIC: "Basic",
  PRO: "Pro",
  PRO_PLUS: "Pro+",
  PRO_MAX: "Pro Max",
};

const PLAN_COLORS: Record<string, string> = {
  BASIC: "bg-gray-2 text-dark-5 dark:bg-dark-3 dark:text-dark-6",
  PRO: "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  PRO_PLUS: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  PRO_MAX: "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
};

export function OrganizationsClient({ orgs: initial }: Readonly<{ orgs: Org[] }>) {
  const router = useRouter();
  const [orgs, setOrgs] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleCreate(form: { name: string; slug: string; plan: string; adminEmail: string; adminPassword: string; adminName: string }) {
    setError("");
    return new Promise<void>((resolve, reject) => {
      startTransition(async () => {
        try {
          await createOrganization({
            ...form,
            plan: form.plan as "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX",
          });
          setShowCreate(false);
          router.refresh();
          resolve();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Failed to create organization");
          reject(err);
        }
      });
    });
  }

  function handlePlanChange(orgId: string, plan: string) {
    startTransition(async () => {
      try {
        await updateOrgPlan({ orgId, plan: plan as "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX" });
        setOrgs((prev) => prev.map((o) => (o.id === orgId ? { ...o, plan } : o)));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to update plan");
      }
    });
  }

  function handleDelete(orgId: string, orgName: string) {
    if (!confirm(`Delete "${orgName}"? This will permanently remove all data for this organization.`)) return;
    startTransition(async () => {
      try {
        await deleteOrganization(orgId);
        setOrgs((prev) => prev.filter((o) => o.id !== orgId));
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete organization");
      }
    });
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Organizations</h1>
          <p className="mt-0.5 text-muted">{orgs.length} organization{orgs.length !== 1 ? "s" : ""} on platform</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="btn-primary"
        >
          + New Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PLAN_OPTIONS.map((plan) => {
          const count = orgs.filter((o) => o.plan === plan).length;
          return (
            <div key={plan} className="stat-card">
              <p className="stat-label">{PLAN_LABELS[plan]}</p>
              <p className="stat-value mt-1">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Orgs table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-2 dark:border-dark-3 bg-gray-1 dark:bg-dark-3/50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Organization</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Slug</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Plan</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Users</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Created</th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orgs.map((org) => (
                <tr key={org.id} className="border-b border-gray-2 dark:border-dark-3 last:border-0 hover:bg-gray-1 dark:hover:bg-dark-3/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-dark dark:text-white">{org.name}</p>
                    <p className="text-[11px] text-dark-5 dark:text-dark-6">{org.employeeCount} employees</p>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-dark-5 dark:text-dark-6">{org.slug}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={org.plan}
                      disabled={isPending}
                      onChange={(e) => handlePlanChange(org.id, e.target.value)}
                      className={`rounded-full border-0 px-2.5 py-1 text-[11px] font-semibold focus:ring-1 focus:ring-primary-300 ${PLAN_COLORS[org.plan]}`}
                    >
                      {PLAN_OPTIONS.map((p) => (
                        <option key={p} value={p}>{PLAN_LABELS[p]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-dark dark:text-white">{org.userCount}</td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">
                    {new Date(org.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => handleDelete(org.id, org.name)}
                      disabled={isPending}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {orgs.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-dark-5 dark:text-dark-6">No organizations yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreate && (
        <CreateOrgModal
          onClose={() => { setShowCreate(false); setError(""); }}
          onCreate={handleCreate}
          error={error}
          isPending={isPending}
        />
      )}
    </div>
  );
}
