"use client";

import { ChevronUpIcon } from "@/assets/icons";
import {
  Dropdown,
  DropdownContent,
  DropdownTrigger,
} from "@/components/ui/dropdown";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { LogOutIcon, SettingsIcon, UserIcon } from "./icons";

export function UserInfo() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const name = session?.user?.name ?? session?.user?.email?.split("@")[0] ?? "User";
  const email = session?.user?.email ?? "";
  const img = session?.user?.image ?? "/images/user/user-03.png";

  return (
    <Dropdown isOpen={isOpen} setIsOpen={setIsOpen}>
      <DropdownTrigger className="rounded align-middle outline-none ring-primary ring-offset-2 focus-visible:ring-1 dark:ring-offset-gray-dark">
        <span className="sr-only">My Account</span>

        <figure className="flex items-center gap-3">
          <Image
            src={img}
            className="size-10 rounded-full object-cover"
            alt={`Avatar of ${name}`}
            role="presentation"
            width={40}
            height={40}
          />
          <figcaption className="flex items-center gap-1 font-medium text-dark dark:text-dark-6 max-[1024px]:sr-only">
            <span className="text-sm">{name}</span>
            <ChevronUpIcon
              aria-hidden
              className={cn("rotate-180 transition-transform", isOpen && "rotate-0")}
              strokeWidth={1.5}
            />
          </figcaption>
        </figure>
      </DropdownTrigger>

      <DropdownContent
        className="border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark min-[230px]:min-w-[17.5rem]"
        align="end"
      >
        <h2 className="sr-only">User information</h2>

        <figure className="flex items-center gap-2.5 px-5 py-3.5">
          <Image
            src={img}
            className="size-10 rounded-full object-cover"
            alt={`Avatar for ${name}`}
            role="presentation"
            width={40}
            height={40}
          />
          <figcaption className="space-y-1">
            <div className="text-sm font-semibold leading-none text-dark dark:text-white">
              {name}
            </div>
            <div className="text-xs leading-none text-dark-5 dark:text-dark-6">{email}</div>
            {session?.user?.role && (
              <div className="text-[10px] font-medium text-primary-600 dark:text-primary-300 capitalize">
                {session.user.role.replace("_", " ").toLowerCase()}
              </div>
            )}
          </figcaption>
        </figure>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2 text-base text-[#4B5563] dark:text-dark-6 [&>*]:cursor-pointer">
          <Link
            href="/profile"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <UserIcon />
            <span className="mr-auto text-sm font-medium">View profile</span>
          </Link>

          <Link
            href="/pages/settings"
            onClick={() => setIsOpen(false)}
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] hover:bg-gray-2 hover:text-dark dark:hover:bg-dark-3 dark:hover:text-white"
          >
            <SettingsIcon />
            <span className="mr-auto text-sm font-medium">Account Settings</span>
          </Link>
        </div>

        <hr className="border-[#E8E8E8] dark:border-dark-3" />

        <div className="p-2">
          <button
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-[9px] text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOutIcon />
            <span className="text-sm font-medium">Sign out</span>
          </button>
        </div>
      </DropdownContent>
    </Dropdown>
  );
}
