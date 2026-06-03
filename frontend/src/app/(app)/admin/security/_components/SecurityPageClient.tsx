"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { PasswordPolicyCard } from "./password-policy-card";
import { MfaSettingsCard } from "./mfa-settings-card";
import { SessionManagementCard } from "./session-management-card";
import { ActiveSessionsCard } from "./active-sessions-card";

export function SecurityPageClient() {
  const { toast, setToast } = useToast();

  return (
    <div className="page-container">
      <div>
        <h1 className="page-title">Security Settings</h1>
        <p className="mt-0.5 text-muted">Configure authentication, session, and access control policies</p>
      </div>

      <PasswordPolicyCard onSave={() => setToast("Security settings saved successfully!")} />
      <MfaSettingsCard />
      <SessionManagementCard />
      <ActiveSessionsCard onToast={setToast} />

      <Toast message={toast} />
    </div>
  );
}
