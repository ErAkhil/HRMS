import Image from "next/image";
import Link from "next/link";

type Stage = "Applied" | "Screening" | "Interview" | "Offer" | "Hired" | "Rejected";
type Source = "LinkedIn" | "Indeed" | "Referral" | "Direct";

interface Candidate {
  id: number;
  name: string;
  avatar: string;
  position: string;
  source: Source;
  aiScore: number;
  stage: Stage;
  appliedDate: string;
}

const candidates: Candidate[] = [
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

const stageBadge: Record<Stage, string> = {
  Applied: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Screening: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Interview: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Offer: "rounded-full bg-violet-light px-2.5 py-0.5 text-xs font-medium text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Hired: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Rejected: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

const sourceBadge: Record<Source, string> = {
  LinkedIn: "rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-medium text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  Indeed: "rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300",
  Referral: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Direct: "rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6",
};

function AiScoreBar({ score }: { score: number }) {
  const color = score >= 90 ? "bg-emerald-500" : score >= 80 ? "bg-sky-500" : score >= 70 ? "bg-amber-400" : "bg-rose-500";
  const textColor = score >= 90 ? "text-emerald-dark dark:text-emerald" : score >= 80 ? "text-sky-dark dark:text-sky" : score >= 70 ? "text-amber-dark" : "text-rose-dark";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-gray-3 dark:bg-dark-3 overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${textColor}`}>{score}%</span>
    </div>
  );
}

export const metadata = {
  title: "Candidates",
};

export default function CandidatesPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-dark-5 dark:text-dark-6 mb-1">
            <Link href="/recruitment" className="hover:text-primary-600">Recruitment</Link>
            <span>/</span>
            <span>Candidates</span>
          </div>
          <h1 className="text-xl font-bold text-dark dark:text-white">All Candidates</h1>
          <p className="text-xs text-dark-5 dark:text-dark-6">12 candidates across all stages</p>
        </div>
        <button className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 flex items-center gap-2">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Candidate
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          type="text"
          placeholder="Search candidates..."
          className="h-9 rounded-lg border border-gray-3 bg-white px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:placeholder-dark-6"
        />
        {(["LinkedIn", "Indeed", "Referral", "Direct"] as Source[]).map((src) => (
          <button
            key={src}
            className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 hover:border-primary-600 hover:text-primary-600 dark:border-dark-3 dark:text-dark-6"
          >
            {src}
          </button>
        ))}
        <select className="ml-auto h-9 rounded-lg border border-gray-3 bg-white px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-2 dark:text-white">
          <option>All Stages</option>
          <option>Applied</option>
          <option>Screening</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Hired</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Name</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Position</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Source</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">AI Score</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Stage</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Applied</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {candidates.map((c) => (
                <tr key={c.id} className="border-b border-gray-3 last:border-0 hover:bg-gray-1 dark:border-dark-3 dark:hover:bg-dark-3">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <Image src={c.avatar} alt={c.name} width={36} height={36} className="rounded-full object-cover" />
                      <span className="text-sm font-medium text-dark dark:text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6 max-w-[160px] truncate">{c.position}</td>
                  <td className="px-5 py-3">
                    <span className={sourceBadge[c.source]}>{c.source}</span>
                  </td>
                  <td className="px-5 py-3">
                    <AiScoreBar score={c.aiScore} />
                  </td>
                  <td className="px-5 py-3">
                    <span className={stageBadge[c.stage]}>{c.stage}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-dark-5 dark:text-dark-6">{c.appliedDate}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                        View
                      </button>
                      <button className="rounded-lg border border-gray-3 px-3 py-1.5 text-xs font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6">
                        Move
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
