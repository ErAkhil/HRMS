import Image from "next/image";

type TeamMember = {
  name: string;
  avatarUrl: string | null;
  tasks: number;
  done: number;
};

type TasksTeamWorkloadProps = {
  teamWorkload: TeamMember[];
};

export function TasksTeamWorkload({ teamWorkload }: TasksTeamWorkloadProps) {
  if (teamWorkload.length === 0) {
    return (
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="font-semibold text-dark dark:text-white mb-4">Team Workload</h2>
        <p className="text-sm text-dark-5 dark:text-dark-6 py-4">No task assignments yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-semibold text-dark dark:text-white">Team Workload</h2>
        <span className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600 dark:bg-primary-900/20 dark:text-primary-300">
          {teamWorkload.length} member{teamWorkload.length !== 1 ? "s" : ""}
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-2 dark:border-dark-3">
              <th className="pb-2 text-left text-xs font-medium text-dark-5 dark:text-dark-6">Member</th>
              <th className="pb-2 text-center text-xs font-medium text-dark-5 dark:text-dark-6">Tasks</th>
              <th className="pb-2 text-center text-xs font-medium text-dark-5 dark:text-dark-6">Done</th>
              <th className="pb-2 text-left text-xs font-medium text-dark-5 dark:text-dark-6 pl-2">Progress</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-2 dark:divide-dark-3">
            {teamWorkload.map((m) => {
              const pct = m.tasks > 0 ? Math.round((m.done / m.tasks) * 100) : 0;
              const initials = m.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
              return (
                <tr key={m.name}>
                  <td className="py-2.5 pr-2">
                    <div className="flex items-center gap-2">
                      {m.avatarUrl ? (
                        <Image src={m.avatarUrl} alt={m.name} width={28} height={28} className="rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
                          {initials}
                        </div>
                      )}
                      <span className="whitespace-nowrap text-xs font-medium text-dark dark:text-white">
                        {m.name.split(" ")[0]}
                      </span>
                    </div>
                  </td>
                  <td className="py-2.5 text-center text-xs text-dark-5 dark:text-dark-6">{m.tasks}</td>
                  <td className="py-2.5 text-center text-xs text-dark-5 dark:text-dark-6">{m.done}</td>
                  <td className="py-2.5 pl-2">
                    <div className="relative h-1 w-20 rounded-full bg-gray-2 dark:bg-dark-3 overflow-hidden">
                      <div className="absolute inset-y-0 left-0 rounded-full bg-primary-500" style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
