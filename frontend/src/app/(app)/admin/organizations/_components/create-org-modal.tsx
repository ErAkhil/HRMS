"use client";

import { useState } from "react";

const PLAN_OPTIONS = ["BASIC", "PRO", "PRO_PLUS", "PRO_MAX"] as const;
const PLAN_LABELS: Record<string, string> = { BASIC: "Basic", PRO: "Pro", PRO_PLUS: "Pro+", PRO_MAX: "Pro Max" };

interface FormData {
  name: string;
  slug: string;
  plan: string;
  adminEmail: string;
  adminPassword: string;
  adminName: string;
}

interface Props {
  onClose: () => void;
  onCreate: (form: FormData) => Promise<void>;
  error: string;
  isPending: boolean;
}

export function CreateOrgModal({ onClose, onCreate, error, isPending }: Readonly<Props>) {
  const [form, setForm] = useState<FormData>({
    name: "", slug: "", plan: "PRO", adminEmail: "", adminPassword: "", adminName: "",
  });

  function autoSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: autoSlug(name) }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onCreate(form);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-floating dark:bg-dark-2">
        <div className="flex items-center justify-between border-b border-gray-2 p-5 dark:border-dark-3">
          <h2 className="font-semibold text-dark dark:text-white">New Organization</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          {error && (
            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-dark/10 dark:text-rose">{error}</div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Organization Name</label>
              <input value={form.name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="Acme Corp" className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Slug</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} required placeholder="acme-corp" className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm font-mono text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
              <p className="mt-0.5 text-[10px] text-dark-5 dark:text-dark-6">Lowercase letters, numbers, hyphens only</p>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Plan</label>
              <select value={form.plan} onChange={(e) => setForm((f) => ({ ...f, plan: e.target.value }))} className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white">
                {PLAN_OPTIONS.map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
              </select>
            </div>
          </div>
          <div className="border-t border-gray-2 pt-4 dark:border-dark-3">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Admin Account</p>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Full Name</label>
                <input value={form.adminName} onChange={(e) => setForm((f) => ({ ...f, adminName: e.target.value }))} required placeholder="Jane Smith" className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Email</label>
                <input type="email" value={form.adminEmail} onChange={(e) => setForm((f) => ({ ...f, adminEmail: e.target.value }))} required placeholder="admin@acmecorp.com" className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-dark dark:text-white">Password</label>
                <input type="password" value={form.adminPassword} onChange={(e) => setForm((f) => ({ ...f, adminPassword: e.target.value }))} required placeholder="Min. 8 characters" className="w-full rounded-lg border border-gray-3 px-3 py-2 text-sm text-dark focus:border-primary-300 focus:outline-none dark:border-dark-3 dark:bg-dark-3 dark:text-white" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
              Cancel
            </button>
            <button type="submit" disabled={isPending} className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50">
              {isPending ? "Creating…" : "Create Organization"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
