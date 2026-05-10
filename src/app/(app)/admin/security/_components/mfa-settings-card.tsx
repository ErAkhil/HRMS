"use client";

import { useState } from "react";

export function MfaSettingsCard() {
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [mfaApp, setMfaApp] = useState(true);
  const [mfaSMS, setMfaSMS] = useState(true);
  const [mfaEmail, setMfaEmail] = useState(false);
  const [mfaHardware, setMfaHardware] = useState(false);

  const mfaMethods = [
    { label: "Authenticator App (TOTP)", detail: "Google Authenticator, Microsoft Authenticator", value: mfaApp, setter: setMfaApp },
    { label: "SMS One-Time Password", detail: "Sent to registered mobile number", value: mfaSMS, setter: setMfaSMS },
    { label: "Email OTP", detail: "Sent to registered email address", value: mfaEmail, setter: setMfaEmail },
    { label: "Hardware Security Key (FIDO2)", detail: "YubiKey and compatible keys", value: mfaHardware, setter: setMfaHardware },
  ];

  return (
    <div className="card-p">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="section-title">Multi-Factor Authentication</h2>
          <p className="text-muted mt-0.5">Require MFA for all admin accounts</p>
        </div>
        <button
          onClick={() => setMfaEnabled((v) => !v)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${mfaEnabled ? "bg-primary-600" : "bg-gray-3 dark:bg-dark-3"}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${mfaEnabled ? "translate-x-6" : "translate-x-1"}`} />
        </button>
      </div>
      <div className="space-y-3">
        <p className="text-muted font-semibold uppercase tracking-wide">Available MFA Methods</p>
        {mfaMethods.map((method) => (
          <div key={method.label} className="flex items-center justify-between rounded-lg bg-gray-1 dark:bg-dark-3 px-4 py-3">
            <div>
              <p className="text-body-medium">{method.label}</p>
              <p className="text-muted">{method.detail}</p>
            </div>
            <button
              onClick={() => method.setter((v: boolean) => !v)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${method.value ? "bg-primary-600" : "bg-gray-3 dark:bg-dark-3"}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${method.value ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
