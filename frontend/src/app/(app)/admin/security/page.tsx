"use client";

import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { PasswordPolicyCard } from "./_components/password-policy-card";
import { MfaSettingsCard } from "./_components/mfa-settings-card";
import { SessionManagementCard } from "./_components/session-management-card";
import { ActiveSessionsCard } from "./_components/active-sessions-card";

export default function SecurityPage() {
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
