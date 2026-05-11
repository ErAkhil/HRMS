import { getDepartments } from "@/lib/actions/departments";
import { getEmployees } from "@/lib/actions/employees";
import { DepartmentsClient } from "./_components/departments-client";

export const metadata = { title: "Departments" };

export default async function DepartmentsPage() {
  const [departments, employees] = await Promise.all([
    getDepartments(),
    getEmployees(),
  ]);

  return <DepartmentsClient departments={departments} employees={employees} />;
}
