import Image from "next/image";
import Link from "next/link";

interface OrgNodeProps {
  id: string;
  avatar: string;
  name: string;
  title: string;
  department?: string;
  reportsCount?: number;
  isRoot?: boolean;
  isHead?: boolean;
}

const DEPT_COLORS: Record<string, string> = {
  Engineering:
    "bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-300",
  Product:
    "bg-violet-light text-violet-dark dark:bg-violet-dark/20 dark:text-violet-300",
  Finance:
    "bg-sky-50 text-sky-dark dark:bg-sky-dark/10 dark:text-sky",
  HR: "bg-amber-light text-amber-dark dark:bg-amber-dark/20 dark:text-amber",
};

function getNodeMinWidthClass(isRoot: boolean, isHead: boolean) {
  if (isRoot) return "min-w-48 border-2 border-primary-200 dark:border-primary-800";
  if (isHead) return "min-w-40";
  return "min-w-36";
}

function getAvatarSize(isRoot: boolean, isHead: boolean) {
  if (isRoot) return 64;
  if (isHead) return 52;
  return 44;
}

export function OrgNode({
  id,
  avatar,
  name,
  title,
  department,
  reportsCount,
  isRoot = false,
  isHead = false,
}: Readonly<OrgNodeProps>) {
  const minWidthClass = getNodeMinWidthClass(isRoot, isHead);
  const avatarSize = getAvatarSize(isRoot, isHead);
  const nameSizeClass = isRoot ? "text-sm" : "text-xs";

  return (
    <Link
      href={`/employees/profile?id=${id}`}
      className={`group flex flex-col items-center rounded-xl bg-white p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg dark:bg-dark-2 dark:border dark:border-dark-3 ${minWidthClass}`}
    >
      <div className="relative">
        <Image
          src={avatar}
          width={avatarSize}
          height={avatarSize}
          alt={name}
          className="rounded-full object-cover ring-2 ring-white dark:ring-dark-2"
        />
        <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald dark:border-dark-2" />
      </div>

      <p className={`mt-2 text-center font-semibold text-dark dark:text-white ${nameSizeClass}`}>
        {name}
      </p>
      <p className="mt-0.5 text-center text-[10px] text-dark-5 dark:text-dark-6">
        {title}
      </p>

      {department && (
        <span
          className={`mt-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${DEPT_COLORS[department] ?? "bg-gray-100 text-gray-600"}`}
        >
          {department}
        </span>
      )}

      {reportsCount !== undefined && (
        <span className="mt-1.5 rounded-full bg-gray-2 px-2 py-0.5 text-[10px] font-medium text-dark-5 dark:bg-dark-3 dark:text-dark-6">
          {reportsCount} reports
        </span>
      )}
    </Link>
  );
}
