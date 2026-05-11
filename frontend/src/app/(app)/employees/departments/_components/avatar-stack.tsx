import Image from "next/image";

export function AvatarStack({
  employees,
  total,
}: Readonly<{
  employees: { id: string; firstName: string; lastName: string; avatarUrl: string | null }[];
  total: number;
}>) {
  const shown = employees.slice(0, 4);
  const overflow = total - shown.length;
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {shown.map((e) => (
          <Image
            key={e.id}
            src={e.avatarUrl ?? "/images/user/user-03.png"}
            alt={`${e.firstName} ${e.lastName}`}
            width={28}
            height={28}
            className="h-7 w-7 rounded-full border-2 border-white object-cover dark:border-dark-2"
          />
        ))}
        {overflow > 0 && (
          <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-2 text-[10px] font-semibold text-dark-5 dark:border-dark-2 dark:bg-dark-3 dark:text-dark-6">
            +{overflow}
          </div>
        )}
      </div>
      <span className="text-xs text-dark-5 dark:text-dark-6">
        {total} employee{total === 1 ? "" : "s"}
      </span>
    </div>
  );
}
