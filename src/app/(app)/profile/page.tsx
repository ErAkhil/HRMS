import { getMyProfile } from "@/lib/actions/employees";
import { ProfileClient } from "./_components/profile-client";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const profile = await getMyProfile().catch(() => null);
  return <ProfileClient profile={profile} />;
}
