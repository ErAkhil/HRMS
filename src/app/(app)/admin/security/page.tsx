"use client";

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";

const ACTIVE_SESSIONS = [
  { device: "MacBook Pro (Chrome)", location: "Mumbai, India", ip: "103.21.58.14", lastActive: "Just now", current: true },
  { device: "iPhone 15 (Safari)", location: "Mumbai, India", ip: "103.21.58.14", lastActive: "2 hours ago", current: false },
  { device: "Windows PC (Edge)", location: "Bangalore, India", ip: "49.36.112.88", lastActive: "Yesterday", current: false },
  { device: "iPad (Chrome)", location: "Delhi, India", ip: "122.170.45.22", lastActive: "3 days ago", current: false },
];

export default function SecurityPage() {
  // Password policy
  const [minLength, setMinLength] = useState(8);
  const [maxAge, setMaxAge] = useState(90);
  const [historyCount, setHistoryCount] = useState(5);
  const [lockoutAttempts, setLockoutAttempts] = useState(5);

  // Password checkboxes
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(true);
  const [disallowCommon, setDisallowCommon] = useState(true);

  // MFA
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaApp, setMfaApp] = useState(true);
  const [mfaSMS, setMfaSMS] = useState(true);
  const [mfaEmail, setMfaEmail] = useState(false);
  const [mfaHardware, setMfaHardware] = useState(false);

  // Session management
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [maxSessions, setMaxSessions] = useState("3");
  const [invalidateOnPwChange, setInvalidateOnPwChange] = useState(true);
  const [notifyNewDevice, setNotifyNewDevice] = useState(true);
  const [autoLogoutOnClose, setAutoLogoutOnClose] = useState(false);

  // Toast
  const { toast, setToast } = useToast();

  const mfaMethods = [
    { label: "Authenticator App (TOTP)", detail: "Google Authenticator, Microsoft Authenticator", value: mfaApp, setter: setMfaApp },
    { label: "SMS One-Time Password", detail: "Sent to registered mobile number", value: mfaSMS, setter: setMfaSMS },
    { label: "Email OTP", detail: "Sent to registered email address", value: mfaEmail, setter: setMfaEmail },
    { label: "Hardware Security Key (FIDO2)", detail: "YubiKey and compatible keys", value: mfaHardware, setter: setMfaHardware },
  ];

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
          <button
            onClick={() => setToast("Security settings saved successfully!")}
            className="rounded-lg bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-700"
          >
            Save Changes
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Minimum Password Length</label>
            <input
              type="number"
              value={minLength}
              onChange={(e) => setMinLength(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Password Expiry (days)</label>
            <input
              type="number"
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Password History (prevent reuse)</label>
            <input
              type="number"
              value={historyCount}
              onChange={(e) => setHistoryCount(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">Max Login Attempts</label>
            <input
              type="number"
              value={lockoutAttempts}
              onChange={(e) => setLockoutAttempts(Number(e.target.value))}
              className="h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireUppercase}
              onChange={(e) => setRequireUppercase(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Require uppercase letters</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireLowercase}
              onChange={(e) => setRequireLowercase(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Require lowercase letters</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireNumbers}
              onChange={(e) => setRequireNumbers(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Require numbers</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireSymbols}
              onChange={(e) => setRequireSymbols(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Require special characters (!@#$)</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={disallowCommon}
              onChange={(e) => setDisallowCommon(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Disallow common passwords</span>
          </label>
        </div>
      </div>

      {/* MFA Settings */}
      <div className="rounded-xl bg-white p-5 shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-dark dark:text-white">Multi-Factor Authentication</h2>
            <p className="text-xs text-dark-5 dark:text-dark-6 mt-0.5">Require MFA for all admin accounts</p>
          </div>
          <button
            onClick={() => setMfaEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mfaEnabled ? "bg-primary-600" : "bg-gray-3 dark:bg-dark-3"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mfaEnabled ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-xs font-semibold text-dark-5 dark:text-dark-6 uppercase tracking-wide">Available MFA Methods</p>
          {mfaMethods.map((method) => (
            <div key={method.label} className="flex items-center justify-between rounded-lg bg-gray-1 dark:bg-dark-3 px-4 py-3">
              <div>
                <p className="text-sm font-medium text-dark dark:text-white">{method.label}</p>
                <p className="text-xs text-dark-5 dark:text-dark-6">{method.detail}</p>
              </div>
              <button
                onClick={() => method.setter((v: boolean) => !v)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${method.value ? "bg-primary-600" : "bg-gray-3 dark:bg-dark-3"}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${method.value ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
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
                min={5}
                max={120}
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                className="flex-1 accent-primary-600"
              />
              <span className="text-sm font-semibold text-dark dark:text-white w-16 text-right">{sessionTimeout} minutes</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-dark-5 dark:text-dark-6 mb-1.5">
              Max Concurrent Sessions
            </label>
            <select
              value={maxSessions}
              onChange={(e) => setMaxSessions(e.target.value)}
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
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={invalidateOnPwChange}
              onChange={(e) => setInvalidateOnPwChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Invalidate all sessions on password change</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyNewDevice}
              onChange={(e) => setNotifyNewDevice(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Notify user on new session from unknown device</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={autoLogoutOnClose}
              onChange={(e) => setAutoLogoutOnClose(e.target.checked)}
              className="h-4 w-4 rounded border-gray-3 accent-primary-600"
            />
            <span className="text-sm text-dark dark:text-white">Auto-logout on browser close</span>
          </label>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="rounded-xl bg-white shadow-card dark:bg-dark-2 dark:border dark:border-dark-3">
        <div className="border-b border-gray-3 dark:border-dark-3 px-5 py-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-dark dark:text-white">Active Sessions</h2>
          <button
            onClick={() => setToast("All other sessions revoked successfully!")}
            className="rounded-lg border border-rose-200 px-4 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 dark:border-rose-500/20 dark:hover:bg-rose-500/10"
          >
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
                      <button
                        onClick={() => setToast("Session revoked!")}
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

      <Toast message={toast} />
    </div>
  );
}
