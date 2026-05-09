"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { updateUserRole, toggleUserActive } from "@/lib/actions/admin";

type UserRole = "SUPER_ADMIN" | "HR_ADMIN" | "MANAGER" | "EMPLOYEE";

type OrgUser = {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  name: string;
  avatarUrl: string | null;
  department: string;
  title: string;
};

const ROLE_LABELS: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  HR_ADMIN: "HR Admin",
  MANAGER: "Manager",
  EMPLOYEE: "Employee",
};

const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  HR_ADMIN: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  MANAGER: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  EMPLOYEE: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

function formatDate(iso: string | null) {
  if (!iso) return "Never";
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AdminUsersClient({ users }: Readonly<{ users: OrgUser[] }>) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "All">("All");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const { toast, setToast } = useToast();
  const router = useRouter();

  const filtered = users.filter((u) => {
    const matchSearch = !search
      || u.name.toLowerCase().includes(search.toLowerCase())
      || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  async function handleRoleChange(userId: string, newRole: UserRole) {
    try {
      await updateUserRole({ userId, role: newRole });
      setToast("Role updated successfully.");
      router.refresh();
    } catch {
      setToast("Failed to update role.");
    }
  }

  async function handleToggleActive(userId: string, isActive: boolean) {
    try {
      await toggleUserActive(userId);
      setToast(isActive ? "User deactivated." : "User activated.");
      router.refresh();
    } catch {
      setToast("Failed to update user status.");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">User Management</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{users.length} users · Manage roles and access</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
        >
          + Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-indigo-500 dark:border-dark-3 dark:bg-dark-2 dark:text-white w-full sm:w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
          className="rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm text-dark outline-none focus:border-indigo-500 dark:border-dark-3 dark:bg-dark-2 dark:text-white"
        >
          <option value="All">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="HR_ADMIN">HR Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Employee</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-3 dark:border-dark-3 bg-gray-1 dark:bg-dark-3/40">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">User</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Role</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Department</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Status</th>
                <th className="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Last Active</th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-dark-5 dark:text-dark-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-3 dark:divide-dark-3">
              {filtered.map((u) => (
                <tr key={u.id} className="hover:bg-gray-1 dark:hover:bg-dark-3/40 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.name} className="h-8 w-8 rounded-full object-cover" />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300">
                          {getInitials(u.name)}
                        </span>
                      )}
                      <div>
                        <p className="text-sm font-medium text-dark dark:text-white">{u.name}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="rounded-lg border border-gray-3 bg-white px-2 py-1 text-xs text-dark outline-none focus:border-indigo-500 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
                    >
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="HR_ADMIN">HR Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="EMPLOYEE">Employee</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 text-sm text-dark-5 dark:text-dark-6">{u.department}</td>
                  <td className="px-3 py-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? "bg-emerald-light text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald" : "bg-rose-light text-rose-dark"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-xs text-dark-5 dark:text-dark-6">{formatDate(u.lastLoginAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <button
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                        u.isActive
                          ? "bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white"
                          : "bg-emerald-light text-emerald-dark hover:bg-emerald-dark hover:text-white"
                      }`}
                    >
                      {u.isActive ? "Deactivate" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-dark-5 dark:text-dark-6">
                    No users match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark dark:text-white">Invite User</h2>
              <button onClick={() => setShowInviteModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-dark-5 dark:text-dark-6 mb-4">
              User invitations are managed through the employee onboarding flow. Create an employee profile first, then they&apos;ll receive login credentials.
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowInviteModal(false)} className="rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark hover:bg-gray-2 dark:border-dark-3 dark:text-white">
                Close
              </button>
              <a href="/employees" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                Go to Employees
              </a>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
