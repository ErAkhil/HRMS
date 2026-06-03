"use client";

import { useEffect, useState } from "react";

interface TeamMember {
  readonly id: string;
  readonly name: string;
  readonly status: "online" | "away" | "busy" | "offline";
  readonly currentActivity?: string;
  readonly avatar?: string;
}

interface TeamPresenceProps {
  readonly teamMembers: TeamMember[];
  readonly showDetails?: boolean;
}

const statusIndicators = {
  online: { color: "bg-emerald-500", label: "Online" },
  away: { color: "bg-amber-500", label: "Away" },
  busy: { color: "bg-rose-500", label: "In a meeting" },
  offline: { color: "bg-gray-400 dark:bg-dark-5", label: "Offline" },
};

const statusEmojis = {
  online: "💚",
  away: "💛",
  busy: "❤️",
  offline: "🩶",
};

export function TeamPresence({
  teamMembers,
  showDetails = false,
}: Readonly<TeamPresenceProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const grouped = {
    online: teamMembers.filter((m) => m.status === "online"),
    busy: teamMembers.filter((m) => m.status === "busy"),
    away: teamMembers.filter((m) => m.status === "away"),
    offline: teamMembers.filter((m) => m.status === "offline"),
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-4 gap-2">
        {Object.entries(grouped).map(([status, members]) => (
          <div
            key={status}
            className="rounded-lg border border-gray-3 bg-white p-3 text-center dark:border-dark-3 dark:bg-dark-2"
          >
            <p className="text-2xl">{statusEmojis[status as keyof typeof statusEmojis]}</p>
            <p className="mt-1 text-xs font-medium text-dark-5 dark:text-dark-6 capitalize">
              {status}
            </p>
            <p className="mt-1 text-lg font-bold text-primary-600">
              {members.length}
            </p>
          </div>
        ))}
      </div>

      {/* Detailed List */}
      {showDetails && (
        <div className="space-y-3">
          {Object.entries(grouped).map(([status, members]) => (
            members.length > 0 && (
              <div key={status}>
                <h4 className="mb-2 text-sm font-medium capitalize text-dark dark:text-white">
                  {status} ({members.length})
                </h4>
                <div className="space-y-1">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 rounded-lg border border-gray-3 bg-white p-2 dark:border-dark-3 dark:bg-dark-2"
                    >
                      <div className="relative">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="h-8 w-8 rounded-full"
                          />
                        ) : (
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                            {member.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                            statusIndicators[member.status].color
                          } dark:border-dark-2`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark dark:text-white">
                          {member.name}
                        </p>
                        {member.currentActivity && (
                          <p className="truncate text-xs text-dark-5 dark:text-dark-6">
                            {member.currentActivity}
                          </p>
                        )}
                      </div>

                      <span className="shrink-0 text-xs font-medium text-dark-5 dark:text-dark-6">
                        {statusIndicators[member.status].label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Compact Grid */}
      {!showDetails && (
        <div className="rounded-lg border border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
          <p className="mb-3 text-sm font-medium text-dark dark:text-white">Team Members</p>
          <div className="flex flex-wrap gap-3">
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-2 rounded-full bg-gray-1 px-3 py-1.5 dark:bg-dark-3"
                title={`${member.name} - ${statusIndicators[member.status].label}`}
              >
                <div className="relative">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-600 dark:bg-primary-900/30 dark:text-primary-300">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full ${
                      statusIndicators[member.status].color
                    }`}
                  />
                </div>
                <span className="text-xs font-medium text-dark dark:text-white">
                  {member.name.split(" ")[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
