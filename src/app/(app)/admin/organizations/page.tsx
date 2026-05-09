import { getOrganizations } from "@/lib/actions/organizations";
import { OrganizationsClient } from "./_components/organizations-client";

export const metadata = { title: "Organizations" };

export default async function OrganizationsPage() {
  const orgs = await getOrganizations().catch(() => []);

  return <OrganizationsClient orgs={orgs} />;
}
