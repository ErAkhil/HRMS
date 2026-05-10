import { notFound } from "next/navigation";
import { getEmployee, getDepartments } from "@/lib/actions/employees";
import { ProfilePageClient } from "./_components/profile-page-client";

export const metadata = { title: "Employee Profile" };

interface Props {
  searchParams: Promise<{ id?: string }>;
}

export default async function EmployeeProfilePage({ searchParams }: Props) {
  const { id } = await searchParams;
  if (!id) notFound();

  const [employee, departments] = await Promise.all([
    getEmployee(id),
    getDepartments(),
  ]);

  if (!employee) notFound();

  return <ProfilePageClient employee={employee} departments={departments} />;
}
