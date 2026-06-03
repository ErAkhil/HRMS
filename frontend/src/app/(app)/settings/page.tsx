import { NotificationSettings } from "@/components/settings/notification-settings";
import { PageHeader } from "@/components/ui/page-header";

export const metadata = {
  title: "Settings | Monja HRMS",
  description: "Manage your preferences and settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        subtitle="Manage your preferences, notifications, and integrations"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Notifications */}
          <div className="rounded-lg border border-gray-3 bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Notifications
            </h2>
            <NotificationSettings />
          </div>

          {/* Email Preferences */}
          <div className="rounded-lg border border-gray-3 bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Email Digest
            </h2>
            <div className="space-y-3">
              <label htmlFor="digest-daily" className="flex items-center gap-3 rounded-lg border border-gray-3 p-3 dark:border-dark-3">
                <input id="digest-daily" type="radio" name="digest" value="daily" defaultChecked className="rounded" />
                <span className="text-sm font-medium text-dark dark:text-white">Daily Digest</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">Summary of all activities each morning</span>
              </label>

              <label htmlFor="digest-weekly" className="flex items-center gap-3 rounded-lg border border-gray-3 p-3 dark:border-dark-3">
                <input id="digest-weekly" type="radio" name="digest" value="weekly" className="rounded" />
                <span className="text-sm font-medium text-dark dark:text-white">Weekly Digest</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">Weekly summary every Monday</span>
              </label>

              <label htmlFor="digest-none" className="flex items-center gap-3 rounded-lg border border-gray-3 p-3 dark:border-dark-3">
                <input id="digest-none" type="radio" name="digest" value="none" className="rounded" />
                <span className="text-sm font-medium text-dark dark:text-white">No Digest</span>
                <span className="text-xs text-dark-5 dark:text-dark-6">Only critical notifications via email</span>
              </label>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="rounded-lg border border-gray-3 bg-white p-6 dark:border-dark-3 dark:bg-dark-2">
            <h2 className="mb-4 text-lg font-semibold text-dark dark:text-white">
              Privacy
            </h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-dark dark:text-white">
                  Allow colleagues to see my online status
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-dark dark:text-white">
                  Show my profile in company directory
                </span>
              </label>

              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded" defaultChecked />
                <span className="text-sm text-dark dark:text-white">
                  Allow HR to access my performance data
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg border border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <h3 className="font-medium text-dark dark:text-white">Profile Linked</h3>
            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Your account is synced with your organization&apos;s directory.
            </p>
            <button className="mt-4 w-full rounded-lg border border-gray-3 bg-white px-3 py-2 text-sm font-medium text-dark hover:bg-gray-1 dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:hover:bg-dark-3">
              View Profile
            </button>
          </div>

          <div className="rounded-lg border border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
            <h3 className="font-medium text-dark dark:text-white">Danger Zone</h3>
            <p className="mt-2 text-sm text-dark-5 dark:text-dark-6">
              Review security and account options.
            </p>
            <button className="mt-4 w-full rounded-lg border border-rose-2 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/30">
              Security Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
