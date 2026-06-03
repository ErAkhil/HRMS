"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
  orgId: string;
  orgName: string;
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
  SUPER_ADMIN: "badge-error",
  HR_ADMIN: "badge-ai",
  MANAGER: "badge-warning",
  EMPLOYEE: "badge-success",
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
  const { data: session } = useSession();
  const { toast, setToast } = useToast();
  const router = useRouter();
  const currentUserRole = session?.user?.role;
  const canManageSuperAdmin = currentUserRole === "SUPER_ADMIN";
  const showOrganizationColumn = currentUserRole === "SUPER_ADMIN";

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
    <div className="page-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="mt-0.5 text-muted">{users.length} users · Manage roles and access</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          className="btn-primary"
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
          className="input-field w-full sm:w-64"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as UserRole | "All")}
          className="input-field"
        >
          <option value="All">All Roles</option>
          {canManageSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
          <option value="HR_ADMIN">HR Admin</option>
          <option value="MANAGER">Manager</option>
          <option value="EMPLOYEE">Employee</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="thead-row">
                <th className="th">User</th>
                {showOrganizationColumn && <th className="th">Organization</th>}
                <th className="th">Role</th>
                <th className="th">Department</th>
                <th className="th">Status</th>
                <th className="th">Last Active</th>
                <th className="th text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id} className="tr-body">
                  <td className="td">
                    <div className="flex items-center gap-3">
                      {u.avatarUrl ? (
                        <Image
                          src={u.avatarUrl}
                          alt={u.name}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                          {getInitials(u.name)}
                        </span>
                      )}
                      <div>
                        <p className="text-body-medium">{u.name}</p>
                        <p className="text-muted">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  {showOrganizationColumn && <td className="td text-muted">{u.orgName}</td>}
                  <td className="td">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="input-field py-1 text-xs"
                    >
                      {canManageSuperAdmin && <option value="SUPER_ADMIN">Super Admin</option>}
                      <option value="HR_ADMIN">HR Admin</option>
                      <option value="MANAGER">Manager</option>
                      <option value="EMPLOYEE">Employee</option>
                    </select>
                  </td>
                  <td className="td text-muted">{u.department}</td>
                  <td className="td">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${u.isActive ? "badge-success" : "badge-error"}`}>
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="td text-muted">{formatDate(u.lastLoginAt)}</td>
                  <td className="td text-right">
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
                  <td colSpan={showOrganizationColumn ? 7 : 6} className="px-5 py-8 text-center text-muted">
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
        <div className="modal-overlay">
          <div className="modal-panel w-full max-w-md">
            <div className="modal-header">
              <h2 className="text-lg font-bold text-dark dark:text-white">Invite User</h2>
              <button onClick={() => setShowInviteModal(false)} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
                <svg className="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <p className="text-muted mb-4">
                User invitations are managed through the employee onboarding flow. Create an employee profile first, then they&apos;ll receive login credentials.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowInviteModal(false)} className="btn-secondary">
                  Close
                </button>
                <a href="/employees" className="btn-primary">
                  Go to Employees
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <Toast message={toast} />
    </div>
  );
}
