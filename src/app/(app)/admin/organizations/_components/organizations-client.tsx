"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOrganization,
  updateOrgPlan,
  deleteOrganization,
} from "@/lib/actions/organizations";

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

  const [form, setForm] = useState({
    name: "",
    slug: "",
    plan: "PRO" as string,
    adminEmail: "",
    adminPassword: "",
    adminName: "",
  });

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: autoSlug(name) }));
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      try {
        await createOrganization({
          ...form,
          plan: form.plan as "BASIC" | "PRO" | "PRO_PLUS" | "PRO_MAX",
        });
        setShowCreate(false);
        setForm({ name: "", slug: "", plan: "PRO", adminEmail: "", adminPassword: "", adminName: "" });
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create organization");
      }
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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Organizations</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{orgs.length} organization{orgs.length !== 1 ? "s" : ""} on platform</p>
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + New Organization
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {PLAN_OPTIONS.map((plan) => {
          const count = orgs.filter((o) => o.plan === plan).length;
          return (
            <div key={plan} className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
              <p className="text-xs text-dark-5 dark:text-dark-6">{PLAN_LABELS[plan]}</p>
              <p className="mt-1 text-2xl font-bold text-dark dark:text-white">{count}</p>
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

      {/* Create modal */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-floating dark:bg-dark-2">
            <div className="flex items-center justify-between border-b border-gray-2 p-5 dark:border-dark-3">
              <h2 className="font-semibold text-dark dark:text-white">New Organization</h2>
              <button
                onClick={() => { setShowCreate(false); setError(""); }}
                className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4 p-5">
              {error && (
                <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-dark/10 dark:text-rose">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Organization Name</label>
                  <input
                    value={form.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    required
                    placeholder="Acme Corp"
                    className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Slug</label>
                  <input
                    value={form.slug}
                    onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                    required
                    placeholder="acme-corp"
                    className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm font-mono text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  />
                  <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">Lowercase letters, numbers, hyphens only</p>
                </div>
                <div className="col-span-2">
                  <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Plan</label>
                  <select
                    value={form.plan}
                    onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))}
                    className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                  >
                    {PLAN_OPTIONS.map((p) => (
                      <option key={p} value={p}>{PLAN_LABELS[p]}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-2 pt-4 dark:border-dark-3">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Admin Account</p>
                <div className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Full Name</label>
                    <input
                      value={form.adminName}
                      onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))}
                      required
                      placeholder="Jane Smith"
                      className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Email</label>
                    <input
                      type="email"
                      value={form.adminEmail}
                      onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))}
                      required
                      placeholder="admin@acmecorp.com"
                      className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Password</label>
                    <input
                      type="password"
                      value={form.adminPassword}
                      onChange={(e) => setForm((f) => ({ ...f, adminPassword: e.target.value }))}
                      required
                      placeholder="Min. 8 characters"
                      className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowCreate(false); setError(""); }}
                  className="flex-1 rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                >
                  {isPending ? "Creating…" : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
