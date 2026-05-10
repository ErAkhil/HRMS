import Image from "next/image";

export function ProfileHeroCard() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex flex-wrap items-start gap-6">
        <div className="relative shrink-0">
          <Image src="/images/user/user-15.png" alt="Sarah Mitchell" width={80} height={80} className="rounded-full object-cover" />
          <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
        </div>

        <div className="min-w-[160px]">
          <h1 className="text-xl font-bold text-dark dark:text-white">Sarah Mitchell</h1>
          <p className="mt-0.5 text-sm text-dark-5 dark:text-dark-6">Senior Software Engineer</p>
          <p className="mt-1 text-xs text-dark-5 dark:text-dark-6">Joined March 2022 &middot; 3 years 2 months</p>
        </div>

        <div className="min-w-[200px] flex-1 space-y-2.5">
          <div>
            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">Engineering</span>
          </div>
          <p className="flex items-center gap-1.5 text-sm text-dark-5 dark:text-dark-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            Remote &middot; Bengaluru, India
          </p>
          <div className="flex items-center gap-2">
            <Image src="/images/user/user-28.png" alt="James Williams" width={24} height={24} className="rounded-full object-cover" />
            <span className="text-sm text-dark-5 dark:text-dark-6">
              Reports to <span className="font-medium text-dark dark:text-white">James Williams</span>, VP Engineering
            </span>
          </div>
          <p className="text-sm text-dark-5 dark:text-dark-6">
            Employee ID: <span className="font-semibold text-dark dark:text-white">EMP-0042</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-center sm:grid-cols-4">
          <div>
            <p className="text-2xl font-bold text-indigo-600">87<span className="text-base font-normal text-dark-5 dark:text-dark-6">/100</span></p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Performance</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-dark dark:text-white">18</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Leave Days</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-dark dark:text-white">6</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Active Tasks</p>
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-dark dark:text-white">Platform<br />Team</p>
            <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Team</p>
          </div>
        </div>
      </div>
    </div>
  );
}
