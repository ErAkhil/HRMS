"use client";

import { useState } from "react";

export function SessionManagementCard() {
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [maxSessions, setMaxSessions] = useState("3");
  const [invalidateOnPwChange, setInvalidateOnPwChange] = useState(true);
  const [notifyNewDevice, setNotifyNewDevice] = useState(true);
  const [autoLogoutOnClose, setAutoLogoutOnClose] = useState(false);

  return (
    <div className="card-p">
      <h2 className="section-title mb-4">Session Management</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Session Timeout (minutes)</label>
          <div className="flex items-center gap-3">
            <input type="range" min={5} max={120} value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))} className="flex-1 accent-primary-600" />
            <span className="text-body-medium w-16 text-right">{sessionTimeout} minutes</span>
          </div>
        </div>
        <div>
          <label className="label-field">Max Concurrent Sessions</label>
          <select value={maxSessions} onChange={(e) => setMaxSessions(e.target.value)} className="input-field h-9 w-full">
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
          { label: "Invalidate all sessions on password change", value: invalidateOnPwChange, setter: setInvalidateOnPwChange },
          { label: "Notify user on new session from unknown device", value: notifyNewDevice, setter: setNotifyNewDevice },
          { label: "Auto-logout on browser close", value: autoLogoutOnClose, setter: setAutoLogoutOnClose },
        ].map((item) => (
          <label key={item.label} className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={item.value} onChange={(e) => item.setter(e.target.checked)} className="h-4 w-4 rounded border-gray-3 accent-primary-600" />
            <span className="text-body">{item.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
