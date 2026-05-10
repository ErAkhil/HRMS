"use client";

import { useState } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import type { CelebrationItem } from "@/lib/actions/celebrations";

interface Props {
  celebrations: CelebrationItem[];
}

export function BirthdayStrip({ celebrations }: Readonly<Props>) {
  const [wished, setWished] = useState<Set<string>>(new Set());
  const { toast, setToast } = useToast();

  const handleWish = (id: string, name: string) => {
    setWished((prev) => new Set(prev).add(id));
    setToast(`Wish sent to ${name}! 🎉`);
  };

  if (celebrations.length === 0) {
    return (
      <div className="card-p">
        <h3 className="section-title">Celebrations this week</h3>
        <p className="mt-3 text-sm text-dark-5 dark:text-dark-6">No upcoming anniversaries this week.</p>
      </div>
    );
  }

  return (
    <div className="card-p">
      <div className="flex items-center justify-between">
        <h3 className="section-title">Celebrations this week</h3>
        <span className="rounded-full bg-amber-light px-2 py-0.5 text-[10px] font-bold text-amber-dark dark:bg-amber-dark/20 dark:text-amber">
          {celebrations.length} upcoming
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {celebrations.map((person) => (
          <div
            key={person.id}
            className="flex items-center gap-2.5 rounded-xl border border-gray-3 px-3 py-2.5 dark:border-dark-3"
          >
            <Image
              src={person.avatarUrl ?? "/images/user/user-03.png"}
              width={36}
              height={36}
              alt={person.name}
              className="rounded-full object-cover"
            />
            <div>
              <p className="text-xs font-semibold text-dark dark:text-white">{person.name}</p>
              <p className="text-[10px] text-dark-5 dark:text-dark-6">{person.label}</p>
            </div>
            {wished.has(person.id) ? (
              <button
                disabled
                className="ml-1 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-300 cursor-default"
              >
                Wished ✓
              </button>
            ) : (
              <button
                onClick={() => handleWish(person.id, person.name)}
                className="ml-1 rounded-lg bg-primary-50 px-2.5 py-1.5 text-[10px] font-semibold text-primary-600 transition-colors hover:bg-primary-100 dark:bg-primary-900/20 dark:text-primary-300 dark:hover:bg-primary-900/30"
              >
                Wish
              </button>
            )}
          </div>
        ))}
      </div>

      <Toast message={toast} />
    </div>
  );
}
