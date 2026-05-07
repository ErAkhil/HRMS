import Image from "next/image";

const CELEBRATIONS = [
  {
    avatar: "/images/user/user-15.png",
    name: "Sarah Mitchell",
    type: "birthday",
    label: "🎂 Birthday Today",
    dept: "Engineering",
  },
  {
    avatar: "/images/user/user-26.png",
    name: "Priya Sharma",
    type: "work-anniversary",
    label: "🎉 3 Years at Acme",
    dept: "Product",
  },
  {
    avatar: "/images/user/user-28.png",
    name: "James Williams",
    type: "birthday",
    label: "🎂 Birthday Tomorrow",
    dept: "Sales",
  },
  {
    avatar: "/images/user/user-23.png",
    name: "Arjun Mehta",
    type: "work-anniversary",
    label: "🎉 1 Year at Acme",
    dept: "HR",
  },
  {
    avatar: "/images/user/user-27.png",
    name: "Elena Torres",
    type: "birthday",
    label: "🎂 Birthday in 3 days",
    dept: "Finance",
  },
];

export function BirthdayStrip() {
  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-dark dark:text-white">
          Celebrations this week
        </h3>
        <span className="rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-bold text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
          {CELEBRATIONS.length} upcoming
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {CELEBRATIONS.map((person, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 rounded-xl border border-gray-3 px-3 py-2.5 dark:border-dark-3"
          >
            <Image
              src={person.avatar}
              width={36}
              height={36}
              alt={person.name}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-semibold text-dark dark:text-white">{person.name}</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">{person.label}</p>
            </div>
            <button className="ml-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-[10px] font-semibold text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-300 dark:hover:bg-indigo-900/30">
              Wish
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
