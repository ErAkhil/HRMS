import Image from "next/image";
import Link from "next/link";

const SKILLS = [
  { name: "React", level: 5 },
  { name: "TypeScript", level: 5 },
  { name: "Node.js", level: 4 },
  { name: "GraphQL", level: 3 },
  { name: "AWS", level: 3 },
  { name: "System Design", level: 4 },
];

export function ProfileSidebar() {
  return (
    <div className="flex flex-col gap-5">
      {/* ── Profile Card ── */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        {/* Cover gradient */}
        <div className="-mx-5 -mt-5 h-20 rounded-t-xl bg-gradient-to-r from-primary-500 via-violet-500 to-purple-600" />

        {/* Avatar */}
        <div className="-mt-10 flex flex-col items-center">
          <div className="relative">
            <Image
              src="/images/user/user-01.png"
              width={80}
              height={80}
              alt="Sarah Mitchell"
              className="rounded-full border-4 border-white object-cover dark:border-dark-2"
            />
            <span className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
          </div>
          <h2 className="mt-3 text-base font-bold text-dark dark:text-white">
            Sarah Mitchell
          </h2>
          <p className="text-xs text-dark-5 dark:text-dark-6">
            Sr. Software Engineer
          </p>
          <span className="mt-2 rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
            Engineering
          </span>
        </div>

        {/* Status badge */}
        <div className="mt-4 flex justify-center">
          <span className="rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
            ● Active
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Link
            href="#"
            className="flex flex-1 items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Edit Profile
          </Link>
          <Link
            href="#"
            className="flex flex-1 items-center justify-center rounded-lg border border-gray-3 px-4 py-2 text-sm font-medium text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
          >
            Message
          </Link>
        </div>
      </div>

      {/* ── Contact Info ── */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          Contact Info
        </h3>
        <ul className="mt-3 space-y-3">
          <li className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3">
              <svg
                className="size-4 text-dark-5 dark:text-dark-6"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-dark-5 dark:text-dark-6">Email</p>
              <p className="truncate text-xs font-medium text-dark dark:text-white">
                sarah.mitchell@acme.com
              </p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3">
              <svg
                className="size-4 text-dark-5 dark:text-dark-6"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">Phone</p>
              <p className="text-xs font-medium text-dark dark:text-white">
                +1 (555) 012-3456
              </p>
            </div>
          </li>
          <li className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-2 dark:bg-dark-3">
              <svg
                className="size-4 text-dark-5 dark:text-dark-6"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">
                Location
              </p>
              <p className="text-xs font-medium text-dark dark:text-white">
                San Francisco, CA
              </p>
            </div>
          </li>
        </ul>
      </div>

      {/* ── Manager ── */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          Reports To
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <Image
            src="/images/user/user-13.png"
            width={40}
            height={40}
            alt="David Kim"
            className="rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-semibold text-dark dark:text-white">
              David Kim
            </p>
            <p className="text-xs text-dark-5 dark:text-dark-6">CTO</p>
          </div>
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          Skills
        </h3>
        <ul className="mt-3 space-y-2.5">
          {SKILLS.map((skill) => (
            <li key={skill.name} className="flex items-center justify-between">
              <span className="text-xs font-medium text-dark dark:text-white">
                {skill.name}
              </span>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 w-2 rounded-full ${
                      i < skill.level
                        ? "bg-primary-600"
                        : "bg-gray-3 dark:bg-dark-3"
                    }`}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
