"use client";

import { useState } from "react";
import Image from "next/image";

type Role = "Super Admin" | "HR Admin" | "Manager" | "Employee";
type Status = "Active" | "Inactive" | "Invited";

const USERS = [
  { id: 1, name: "Sarah Johnson", email: "sarah.johnson@unikove.com", role: "HR Admin" as Role, dept: "HR", status: "Active" as Status, lastActive: "2 mins ago", avatar: "user-01.png" },
  { id: 2, name: "Alex Rivera", email: "alex.rivera@unikove.com", role: "Super Admin" as Role, dept: "Engineering", status: "Active" as Status, lastActive: "5 mins ago", avatar: "user-02.png" },
  { id: 3, name: "Marcus Webb", email: "marcus.webb@unikove.com", role: "Manager" as Role, dept: "Sales", status: "Active" as Status, lastActive: "1 hour ago", avatar: "user-03.png" },
  { id: 4, name: "Priya Patel", email: "priya.patel@unikove.com", role: "Manager" as Role, dept: "Product", status: "Active" as Status, lastActive: "3 hours ago", avatar: "user-04.png" },
  { id: 5, name: "Emma Davis", email: "emma.davis@unikove.com", role: "Employee" as Role, dept: "Marketing", status: "Active" as Status, lastActive: "Yesterday", avatar: "user-05.png" },
  { id: 6, name: "James Liu", email: "james.liu@unikove.com", role: "Manager" as Role, dept: "Finance", status: "Active" as Status, lastActive: "2 days ago", avatar: "user-06.png" },
  { id: 7, name: "Amanda Ross", email: "amanda.ross@unikove.com", role: "HR Admin" as Role, dept: "HR", status: "Active" as Status, lastActive: "1 hour ago", avatar: "user-07.png" },
  { id: 8, name: "David Kim", email: "david.kim@unikove.com", role: "Employee" as Role, dept: "Engineering", status: "Inactive" as Status, lastActive: "1 week ago", avatar: "user-08.png" },
  { id: 9, name: "Rachel Torres", email: "rachel.torres@unikove.com", role: "Employee" as Role, dept: "Marketing", status: "Active" as Status, lastActive: "30 mins ago", avatar: "user-09.png" },
  { id: 10, name: "Chris Morgan", email: "chris.morgan@unikove.com", role: "Manager" as Role, dept: "Operations", status: "Active" as Status, lastActive: "4 hours ago", avatar: "user-10.png" },
  { id: 11, name: "Lily Chen", email: "lily.chen@unikove.com", role: "Employee" as Role, dept: "Finance", status: "Invited" as Status, lastActive: "Never", avatar: "user-11.png" },
  { id: 12, name: "Omar Hassan", email: "omar.hassan@unikove.com", role: "Employee" as Role, dept: "Sales", status: "Active" as Status, lastActive: "Yesterday", avatar: "user-12.png" },
];

const roleColors: Record<Role, string> = {
  "Super Admin": "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  "HR Admin": "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  "Manager": "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  "Employee": "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
};

const statusColors: Record<Status, string> = {
  Active: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Inactive: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
  Invited: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
};

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const [statusFilter, setStatusFilter] = useState<Status | "All">("All");

  const filtered = USERS.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === "All" || u.role === roleFilter;
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">User Management</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">{USERS.length} users · Manage roles and access</p>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
          + Invite User
        </button>
      </div>

      {/* Filters */}
      <div className="rounded-xl bg-white p-4 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 pl-9 pr-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | "All")}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          >
            <option value="All">All Roles</option>
            <option value="Super Admin">Super Admin</option>
            <option value="HR Admin">HR Admin</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "All")}
            className="h-9 rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Invited">Invited</option>
          </select>
          <span className="text-xs text-dark-5 dark:text-dark-6">{filtered.length} results</span>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">User</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Role</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Department</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Status</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Last Active</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Image
                        src={`/images/user/${user.avatar}`}
                        alt={user.name}
                        width={32}
                        height={32}
                        className="rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-dark dark:text-white">{user.name}</p>
                        <p className="text-xs text-dark-5 dark:text-dark-6">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={roleColors[user.role]}>{user.role}</span>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{user.dept}</td>
                  <td className="px-5 py-3.5">
                    <span className={statusColors[user.status]}>{user.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{user.lastActive}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-gray-3 px-3 py-1 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                        Edit
                      </button>
                      <button className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10">
                        Revoke
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
