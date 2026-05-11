import { getOrgUsers } from "@/lib/actions/admin";
import { AdminUsersClient } from "./_components/admin-users-client";

export const metadata = { title: "User Management" };

export default async function UsersPage() {
  const users = await getOrgUsers();
  return <AdminUsersClient users={users} />;
}
