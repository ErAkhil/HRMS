"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
  userName: string;
  roleLabel: string;
  userImage: string;
  onNavigate: () => void;
}

export function SidebarUserFooter({ userName, roleLabel, userImage, onNavigate }: Readonly<Props>) {
  const router = useRouter();

  return (
    <div className="border-t border-gray-3 px-3 py-3 dark:border-dark-3">
      <Link
        href="/profile"
        onClick={onNavigate}
        className="flex items-center gap-2.5 rounded-lg px-3 py-2 transition-colors hover:bg-gray-2 dark:hover:bg-dark-3"
      >
        <div className="relative shrink-0">
          <Image src={userImage} width={32} height={32} alt="Profile" className="rounded-full object-cover" />
          <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-white bg-emerald-DEFAULT dark:border-dark-2" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-dark dark:text-white capitalize">{userName}</p>
          <p className="truncate text-[10px] text-dark-5 dark:text-dark-6">{roleLabel}</p>
        </div>
        <button
          className="rounded p-1 text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
          aria-label="Settings"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push("/pages/settings");
          }}
        >
          <svg width={14} height={14} viewBox="0 0 24 24" fill="none">
            <path d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </Link>
    </div>
  );
}
