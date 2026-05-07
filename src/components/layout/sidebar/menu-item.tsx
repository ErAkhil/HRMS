"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSidebarContext } from "./sidebar-context";

type BaseProps = {
  className?: string;
  children: React.ReactNode;
  isActive: boolean;
  isSubItem?: boolean;
};

type ButtonProps = BaseProps & { as?: "button"; onClick: () => void };
type LinkProps = BaseProps & { as: "link"; href: string };

export function MenuItem(props: ButtonProps | LinkProps) {
  const { toggleSidebar, isMobile } = useSidebarContext();

  const baseClass = cn(
    "flex w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-all duration-150",
    props.isSubItem
      ? "py-1.5 pl-9 text-dark-5 hover:text-dark dark:text-dark-6 dark:hover:text-white"
      : "py-2.5 text-dark-5 dark:text-dark-6",
    props.isActive && !props.isSubItem
      ? "bg-indigo-50 text-indigo-600 dark:bg-[rgba(79,70,229,0.15)] dark:text-indigo-300"
      : props.isActive && props.isSubItem
        ? "text-indigo-600 dark:text-indigo-300"
        : !props.isSubItem
          ? "hover:bg-gray-1 hover:text-dark dark:hover:bg-[rgba(255,255,255,0.06)] dark:hover:text-white"
          : "",
    props.className,
  );

  if (props.as === "link") {
    return (
      <Link
        href={props.href}
        onClick={() => isMobile && toggleSidebar()}
        className={baseClass}
      >
        {props.children}
      </Link>
    );
  }

  return (
    <button onClick={props.onClick} aria-expanded={props.isActive} className={baseClass}>
      {props.children}
    </button>
  );
}
