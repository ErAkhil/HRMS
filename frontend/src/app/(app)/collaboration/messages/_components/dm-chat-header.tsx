import Image from "next/image";

interface ChatHeaderProps {
  mode: "channel" | "dm";
  headerName?: string;
  headerSub: string;
  headerAvatar?: string | null;
  onCall: (type: "audio" | "video") => void;
  onSearch: () => void;
  onSearchFocus: () => void;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

export function ChatHeader({ mode, headerName, headerSub, headerAvatar, onCall, onSearch, onSearchFocus }: Readonly<ChatHeaderProps>) {
  return (
    <div className="flex items-center justify-between border-b border-gray-3 bg-white px-5 py-3 dark:border-dark-3 dark:bg-dark-2">
      <div className="flex items-center gap-3">
        {mode === "dm" && headerAvatar ? (
          <Image src={headerAvatar} alt={headerName ?? ""} width={36} height={36} className="size-9 rounded-full object-cover" />
        ) : (
          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${mode === "dm" ? "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300" : "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300"}`}>
            {mode === "dm" ? getInitials(headerName ?? "") : "#"}
          </div>
        )}
        <div>
          <p className="text-body font-bold">{headerName}</p>
          <p className="text-xs text-dark-5 dark:text-dark-6">{headerSub}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <button aria-label="Audio call" onClick={() => onCall("audio")} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
            <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button aria-label="Video call" onClick={() => onCall("video")} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
            <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button aria-label="Search" onClick={() => { onSearchFocus(); onSearch(); }} className="flex size-8 items-center justify-center rounded-lg text-dark-5 hover:bg-gray-2 dark:text-dark-6 dark:hover:bg-dark-3">
          <svg className="size-4.5" viewBox="0 0 24 24" fill="none">
            <path d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
