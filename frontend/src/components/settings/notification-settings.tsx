"use client";

import { useState } from "react";
import { usePushNotifications } from "@/hooks/use-push-notifications";

const notificationOptions = [
  { id: "notify-leave-approvals", label: "Leave Approvals" },
  { id: "notify-performance-reviews", label: "Performance Reviews" },
  { id: "notify-task-assignments", label: "Task Assignments" },
  { id: "notify-meeting-reminders", label: "Meeting Reminders" },
] as const;

async function enableNotifications(
  permission: NotificationPermission,
  requestPermission: () => Promise<boolean>,
  subscribe: () => Promise<boolean>,
) {
  const hasPermission = permission === "granted" ? true : await requestPermission();

  if (!hasPermission) {
    return { type: "error" as const, text: "Notification permission denied" };
  }

  const success = await subscribe();
  return success
    ? { type: "success" as const, text: "Notifications enabled" }
    : { type: "error" as const, text: "Failed to enable notifications" };
}

export function NotificationSettings() {
  const { isSupported, permission, isSubscribed, requestPermission, subscribe, unsubscribe } =
    usePushNotifications();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string }>();

  const handleToggleNotifications = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        const success = await unsubscribe();
        if (success) {
          setMessage({ type: "success", text: "Notifications disabled" });
        }
      } else {
        setMessage(await enableNotifications(permission, requestPermission, subscribe));
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Something went wrong",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="rounded-lg border border-amber-2 bg-amber-50 p-4 dark:border-amber-900/30 dark:bg-amber-900/20">
        <p className="text-sm text-amber-800 dark:text-amber-200">
          Push notifications are not supported in your browser.
        </p>
      </div>
    );
  }

  let buttonLabel = "Enable";
  if (isLoading) {
    buttonLabel = "...";
  } else if (isSubscribed) {
    buttonLabel = "Disable";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
        <div>
          <h3 className="font-medium text-dark dark:text-white">Push Notifications</h3>
          <p className="text-sm text-dark-5 dark:text-dark-6">
            Get alerts for approvals, task assignments, and updates
          </p>
        </div>
        <button
          onClick={handleToggleNotifications}
          disabled={isLoading}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            isSubscribed
              ? "bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
              : "bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
          }`}
        >
          {buttonLabel}
        </button>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200"
              : "bg-rose-50 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {notificationOptions.map((option) => (
          <label
            key={option.id}
            htmlFor={option.id}
            className="flex items-center gap-3 rounded-lg border border-gray-3 p-3 dark:border-dark-3"
          >
            <input id={option.id} type="checkbox" className="rounded" defaultChecked />
            <span className="text-sm font-medium text-dark dark:text-white">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
