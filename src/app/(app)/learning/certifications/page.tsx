import { getLearningData } from "@/lib/actions/learning";
import { CertificationsClient } from "./_components/certifications-client";

export const metadata = { title: "Certifications" };

export default async function CertificationsPage() {
  const { certifications } = await getLearningData().catch(() => ({
    certifications: [],
    enrollments: [],
    allCourses: [],
  }));

  const certs = certifications.map((c) => ({
    id: c.id,
    name: c.name,
    issuer: c.issuer,
    credential: c.credential ?? null,
    earnedAt: c.earnedAt.toISOString(),
    expiresAt: c.expiresAt?.toISOString() ?? null,
  }));

  return <CertificationsClient certifications={certs} />;
}
