export const metadata = { title: "Security Settings" };

const ACTIVE_SESSIONS = [
  { device: "MacBook Pro (Chrome)", location: "Mumbai, India", ip: "103.21.58.14", lastActive: "Just now", current: true },
  { device: "iPhone 15 (Safari)", location: "Mumbai, India", ip: "103.21.58.14", lastActive: "2 hours ago", current: false },
  { device: "Windows PC (Edge)", location: "Bangalore, India", ip: "49.36.112.88", lastActive: "Yesterday", current: false },
  { device: "iPad (Chrome)", location: "Delhi, India", ip: "122.170.45.22", lastActive: "3 days ago", current: false },
];

export default function SecurityPage() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-dark dark:text-white">Security Settings</h1>
        <p className="mt-0.5 text-xs text-dark-5 dark:text-dark-6">Configure authentication, session, and access control policies</p>
      </div>

      {/* Password Policy */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Password Policy</h2>
          <button className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700">
            Save Changes
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Minimum Password Length</label>
            <input
              type="number"
              defaultValue={12}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Password Expiry (days)</label>
            <input
              type="number"
              defaultValue={90}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Password History (prevent reuse)</label>
            <input
              type="number"
              defaultValue={5}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Max Login Attempts</label>
            <input
              type="number"
              defaultValue={5}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {[
            { label: "Require uppercase letters", checked: true },
            { label: "Require lowercase letters", checked: true },
            { label: "Require numbers", checked: true },
            { label: "Require special characters (!@#$)", checked: true },
            { label: "Disallow common passwords", checked: true },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked={item.checked} className="h-4 w-4 rounded border-gray-3 accent-primary-600" />
              <span className="text-sm text-dark dark:text-white">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* MFA Settings */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-dark dark:text-white">Multi-Factor Authentication</h2>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Require MFA for all admin accounts</p>
          </div>
          {/* Toggle */}
          <div className="relative h-6 w-11 cursor-pointer rounded-full bg-primary-600">
            <div className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow" />
          </div>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-dark-5 dark:text-dark-6 uppercase tracking-wide">Available MFA Methods</p>
          {[
            { label: "Authenticator App (TOTP)", detail: "Google Authenticator, Microsoft Authenticator", enabled: true },
            { label: "SMS One-Time Password", detail: "Sent to registered mobile number", enabled: true },
            { label: "Email OTP", detail: "Sent to registered email address", enabled: false },
            { label: "Hardware Security Key (FIDO2)", detail: "YubiKey and compatible keys", enabled: false },
          ].map((method) => (
            <div key={method.label} className="flex items-center justify-between rounded-lg bg-gray-1 dark:bg-dark-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">{method.label}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">{method.detail}</p>
              </div>
              <div className={`relative h-5 w-9 rounded-full transition-colors ${method.enabled ? "bg-emerald-500" : "bg-gray-300 dark:bg-dark-2"}`}>
                <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${method.enabled ? "translate-x-4" : "translate-x-0.5"}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Management */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <h2 className="text-sm font-semibold text-dark dark:text-white mb-4">Session Management</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">
              Session Timeout (minutes)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={15}
                max={480}
                defaultValue={60}
                className="flex-1 accent-primary-600"
              />
              <span className="text-sm font-semibold text-dark dark:text-white w-16 text-right">60 min</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">
              Max Concurrent Sessions
            </label>
            <select
              defaultValue="3"
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            >
              <option value="1">1 session</option>
              <option value="2">2 sessions</option>
              <option value="3">3 sessions</option>
              <option value="5">5 sessions</option>
              <option value="0">Unlimited</option>
            </select>
          </div>
        </div>
        <div className="mt-4 space-y-3">
          {[
            { label: "Invalidate all sessions on password change", checked: true },
            { label: "Notify user on new session from unknown device", checked: true },
            { label: "Auto-logout on browser close", checked: false },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked={item.checked} className="h-4 w-4 rounded border-gray-3 accent-primary-600" />
              <span className="text-sm text-dark dark:text-white">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Active Sessions</h2>
          <button className="rounded-lg border border-rose-200 px-4 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10">
            Revoke All Others
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-1 dark:bg-dark-3">
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Device</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Location</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">IP Address</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Last Active</th>
                <th className="px-5 py-3 text-left text-xs font-semibold text-dark-5 dark:text-dark-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {ACTIVE_SESSIONS.map((session, idx) => (
                <tr key={idx} className="border-b border-gray-3 dark:border-dark-3 hover:bg-gray-1 dark:hover:bg-dark-3">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-dark dark:text-white">{session.device}</p>
                      {session.current && (
                        <span className="rounded-full bg-emerald-light px-2 py-0.5 text-xs font-medium text-emerald-dark dark:bg-emerald-dark/20 dark:text-emerald">
                          Current
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{session.location}</td>
                  <td className="px-5 py-3.5 font-mono text-xs text-dark-5 dark:text-dark-6">{session.ip}</td>
                  <td className="px-5 py-3.5 text-dark-5 dark:text-dark-6">{session.lastActive}</td>
                  <td className="px-5 py-3.5">
                    {session.current ? (
                      <span className="text-xs text-dark-5 dark:text-dark-6">—</span>
                    ) : (
                      <button className="rounded-lg border border-rose-200 px-3 py-1 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10">
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
    </div>
  );
}
