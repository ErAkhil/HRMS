export const metadata = { title: "Course Catalog" };

const CATEGORIES = ["All", "HR", "Leadership", "Tech", "Compliance", "Soft Skills"];

const COURSES = [
  { id: 1, title: "HR Fundamentals 2026", category: "HR", duration: "4h 20m", level: "Beginner", rating: 4.7, enrolled: 1240, gradient: "from-indigo-500 to-purple-600", enrolled2: true },
  { id: 2, title: "Strategic Leadership Program", category: "Leadership", duration: "8h 30m", level: "Advanced", rating: 4.9, enrolled: 856, gradient: "from-emerald-500 to-teal-600", enrolled2: false },
  { id: 3, title: "Python for HR Analytics", category: "Tech", duration: "10h 15m", level: "Intermediate", rating: 4.8, enrolled: 632, gradient: "from-orange-500 to-amber-600", enrolled2: false },
  { id: 4, title: "Employment Law Essentials", category: "Compliance", duration: "3h 45m", level: "Intermediate", rating: 4.6, enrolled: 2180, gradient: "from-rose-500 to-pink-600", enrolled2: true },
  { id: 5, title: "Effective Communication", category: "Soft Skills", duration: "2h 30m", level: "Beginner", rating: 4.5, enrolled: 3420, gradient: "from-sky-500 to-blue-600", enrolled2: false },
  { id: 6, title: "Talent Acquisition Mastery", category: "HR", duration: "6h 10m", level: "Advanced", rating: 4.8, enrolled: 445, gradient: "from-violet-500 to-purple-600", enrolled2: false },
  { id: 7, title: "Managing Remote Teams", category: "Leadership", duration: "4h 00m", level: "Intermediate", rating: 4.7, enrolled: 1890, gradient: "from-cyan-500 to-sky-600", enrolled2: false },
  { id: 8, title: "Data Visualization with Power BI", category: "Tech", duration: "7h 20m", level: "Intermediate", rating: 4.6, enrolled: 780, gradient: "from-fuchsia-500 to-pink-600", enrolled2: true },
  { id: 9, title: "GDPR & Data Privacy", category: "Compliance", duration: "2h 50m", level: "Beginner", rating: 4.4, enrolled: 1560, gradient: "from-red-500 to-rose-600", enrolled2: false },
  { id: 10, title: "Emotional Intelligence at Work", category: "Soft Skills", duration: "3h 15m", level: "Beginner", rating: 4.7, enrolled: 2750, gradient: "from-amber-500 to-orange-600", enrolled2: false },
  { id: 11, title: "Performance Management Systems", category: "HR", duration: "5h 40m", level: "Intermediate", rating: 4.5, enrolled: 672, gradient: "from-lime-500 to-green-600", enrolled2: false },
  { id: 12, title: "Project Management Basics", category: "Leadership", duration: "6h 30m", level: "Beginner", rating: 4.6, enrolled: 2100, gradient: "from-teal-500 to-emerald-600", enrolled2: false },
];

const levelColors: Record<string, string> = {
  Beginner: "rounded-full bg-emerald-light px-2.5 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald",
  Intermediate: "rounded-full bg-amber-light px-2.5 py-0.5 text-xs font-medium text-amber-dark",
  Advanced: "rounded-full bg-rose-light px-2.5 py-0.5 text-xs font-medium text-rose-dark",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-3 w-3 ${star <= Math.round(rating) ? "text-amber-400" : "text-gray-300 dark:text-dark-3"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
      <span className="ml-1 text-xs text-dark-5 dark:text-dark-6">{rating}</span>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-dark dark:text-white">Course Catalog</h1>
          <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Browse {COURSES.length} courses across all categories</p>
        </div>
        <div className="relative">
          <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-dark-5 dark:text-dark-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            placeholder="Search courses..."
            className="h-9 w-64 rounded-lg border border-gray-3 bg-gray-2 pl-9 pr-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white dark:placeholder-dark-6"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              cat === "All"
                ? "bg-primary-600 text-white"
                : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6 dark:hover:bg-dark-3"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((course) => (
          <div key={course.id} className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3 overflow-hidden">
            <div className={`h-36 bg-gradient-to-br ${course.gradient} flex items-center justify-center`}>
              <svg className="h-12 w-12 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-300">
                  {course.category}
                </span>
                <span className={levelColors[course.level]}>{course.level}</span>
              </div>
              <p className="text-sm font-semibold text-dark dark:text-white mb-2">{course.title}</p>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-dark-5 dark:text-dark-6">{course.duration}</span>
                <StarRating rating={course.rating} />
              </div>
              <p className="text-xs text-dark-5 dark:text-dark-6 mb-3">
                {course.enrolled.toLocaleString()} enrolled
              </p>
              <button
                className={`w-full rounded-lg py-1.5 text-sm font-semibold transition-colors ${
                  course.enrolled2
                    ? "bg-primary-600 text-white hover:bg-primary-700"
                    : "border border-gray-3 text-dark-5 hover:bg-gray-2 dark:border-dark-3 dark:text-dark-6"
                }`}
              >
                {course.enrolled2 ? "Continue" : "Enroll"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
