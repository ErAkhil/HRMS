import { getOrgReviews } from "@/lib/actions/performance";
import { ReviewsClient } from "./_components/reviews-client";

export const metadata = { title: "Performance Reviews" };

export default async function ReviewsPage() {
  const reviews = await getOrgReviews().catch(() => []);

  const rows = reviews.map((r) => ({
    id: r.id,
    revieweeName: `${r.reviewee.firstName} ${r.reviewee.lastName}`,
    revieweeTitle: r.reviewee.title,
    revieweeDept: r.reviewee.department?.name ?? "—",
    reviewerName: `${r.reviewer.firstName} ${r.reviewer.lastName}`,
    period: r.period,
    type: r.type,
    score: r.score,
    status: r.status,
    completedAt: r.completedAt,
  }));

  return <ReviewsClient reviews={rows} />;
}
