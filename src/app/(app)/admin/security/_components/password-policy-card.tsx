"use client";

import { useState } from "react";

interface Props {
  onSave: () => void;
}

export function PasswordPolicyCard({ onSave }: Readonly<Props>) {
  const [minLength, setMinLength] = useState(8);
  const [maxAge, setMaxAge] = useState(90);
  const [historyCount, setHistoryCount] = useState(5);
  const [lockoutAttempts, setLockoutAttempts] = useState(5);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSymbols, setRequireSymbols] = useState(true);
  const [disallowCommon, setDisallowCommon] = useState(true);

  return (
    <div className="card-p">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Password Policy</h2>
        <button onClick={onSave} className="btn-primary">Save Changes</button>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label-field">Minimum Password Length</label>
          <input type="number" value={minLength} onChange={(e) => setMinLength(Number(e.target.value))} className="input-field h-9 w-full" />
        </div>
        <div>
          <label className="label-field">Password Expiry (days)</label>
          <input type="number" value={maxAge} onChange={(e) => setMaxAge(Number(e.target.value))} className="input-field h-9 w-full" />
        </div>
        <div>
          <label className="label-field">Password History (prevent reuse)</label>
          <input type="number" value={historyCount} onChange={(e) => setHistoryCount(Number(e.target.value))} className="input-field h-9 w-full" />
        </div>
        <div>
          <label className="label-field">Max Login Attempts</label>
          <input type="number" value={lockoutAttempts} onChange={(e) => setLockoutAttempts(Number(e.target.value))} className="input-field h-9 w-full" />
        </div>
      </div>
      <div className="mt-4 space-y-3">
        {[
          { label: "Require uppercase letters", value: requireUppercase, setter: setRequireUppercase },
          { label: "Require lowercase letters", value: requireLowercase, setter: setRequireLowercase },
          { label: "Require numbers", value: requireNumbers, setter: setRequireNumbers },
          { label: "Require special characters (!@#$)", value: requireSymbols, setter: setRequireSymbols },
          { label: "Disallow common passwords", value: disallowCommon, setter: setDisallowCommon },
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
