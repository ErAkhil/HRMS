const ACTIVE_SESSIONS = [
  { device: "MacBook Pro (Chrome)", location: "Mumbai, India", ip: "103.21.58.14", lastActive: "Just now", current: true },
  { device: "iPhone 15 (Safari)", location: "Mumbai, India", ip: "103.21.58.14", lastActive: "2 hours ago", current: false },
  { device: "Windows PC (Edge)", location: "Bangalore, India", ip: "49.36.112.88", lastActive: "Yesterday", current: false },
  { device: "iPad (Chrome)", location: "Delhi, India", ip: "122.170.45.22", lastActive: "3 days ago", current: false },
];

interface Props {
  onToast: (msg: string) => void;
}

export function ActiveSessionsCard({ onToast }: Readonly<Props>) {
  return (
    <div className="card">
      <div className="modal-header">
        <h2 className="section-title">Active Sessions</h2>
        <button
          onClick={() => onToast("All other sessions revoked successfully!")}
          className="rounded-lg border border-rose-200 px-4 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10"
        >
          Revoke All Others
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="thead-row">
              <th className="th">Device</th>
              <th className="th">Location</th>
              <th className="th">IP Address</th>
              <th className="th">Last Active</th>
              <th className="th">Action</th>
            </tr>
          </thead>
          <tbody>
            {ACTIVE_SESSIONS.map((session, idx) => (
              <tr key={idx} className="tr-body">
                <td className="td">
                  <div className="flex items-center gap-2">
                    <p className="text-body-medium">{session.device}</p>
                    {session.current && (
                      <span className="rounded-full bg-emerald-light px-2 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">Current</span>
                    )}
                  </div>
                </td>
                <td className="td text-muted">{session.location}</td>
                <td className="td font-mono text-xs text-muted">{session.ip}</td>
                <td className="td text-muted">{session.lastActive}</td>
                <td className="td">
                  {session.current ? (
                    <span className="text-muted">—</span>
                  ) : (
                    <button
                      onClick={() => onToast("Session revoked!")}
                      className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10"
                    >
                      Revoke
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
