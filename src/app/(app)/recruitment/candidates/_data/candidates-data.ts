export type Stage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
export type Source = "LinkedIn" | "Indeed" | "Referral" | "Direct";

export interface Candidate {
  id: number;
  name: string;
  avatar: string;
  position: string;
  source: Source;
  aiScore: number;
  stage: Stage;
  appliedDate: string;
}

export const candidates: Candidate[] = [
  { id: 1, name: "Rahul Gupta", avatar: "/images/user/user-01.png", position: "Senior React Developer", source: "LinkedIn", aiScore: 82, stage: "Applied", appliedDate: "May 5, 2026" },
  { id: 2, name: "Mia Thompson", avatar: "/images/user/user-02.png", position: "Product Designer", source: "Indeed", aiScore: 76, stage: "Screening", appliedDate: "May 3, 2026" },
  { id: 3, name: "Carlos Vega", avatar: "/images/user/user-03.png", position: "Backend Engineer", source: "Referral", aiScore: 88, stage: "Interview", appliedDate: "Apr 28, 2026" },
  { id: 4, name: "Ananya Iyer", avatar: "/images/user/user-04.png", position: "HR Business Partner", source: "Direct", aiScore: 91, stage: "Offer", appliedDate: "Apr 25, 2026" },
  { id: 5, name: "Jake Morrison", avatar: "/images/user/user-05.png", position: "Senior Data Analyst", source: "LinkedIn", aiScore: 85, stage: "Screening", appliedDate: "May 1, 2026" },
  { id: 6, name: "Fatima Al-Rashid", avatar: "/images/user/user-06.png", position: "Marketing Manager", source: "Indeed", aiScore: 79, stage: "Applied", appliedDate: "May 6, 2026" },
  { id: 7, name: "Nathan Brooks", avatar: "/images/user/user-07.png", position: "Cloud Architect", source: "LinkedIn", aiScore: 93, stage: "Interview", appliedDate: "Apr 20, 2026" },
  { id: 8, name: "Yuki Tanaka", avatar: "/images/user/user-08.png", position: "Sr. Product Manager", source: "Referral", aiScore: 87, stage: "Interview", appliedDate: "Apr 22, 2026" },
  { id: 9, name: "Preet Kaur", avatar: "/images/user/user-09.png", position: "Lead Engineer", source: "Direct", aiScore: 90, stage: "Offer", appliedDate: "Apr 15, 2026" },
  { id: 10, name: "Leo Martinez", avatar: "/images/user/user-10.png", position: "Engineering Lead", source: "LinkedIn", aiScore: 94, stage: "Hired", appliedDate: "Apr 1, 2026" },
  { id: 11, name: "Aisha Okonkwo", avatar: "/images/user/user-11.png", position: "CFO", source: "Referral", aiScore: 89, stage: "Hired", appliedDate: "Mar 28, 2026" },
  { id: 12, name: "David Cheng", avatar: "/images/user/user-12.png", position: "VP Sales", source: "Direct", aiScore: 92, stage: "Rejected", appliedDate: "Apr 10, 2026" },
];

export const stageBadge: Record<Stage, string> = {
  Applied: "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Screening: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Interview: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Offer: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Hired: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Rejected: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

export const sourceBadge: Record<Source, string> = {
  LinkedIn: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Indeed: "rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Referral: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Direct: "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};
