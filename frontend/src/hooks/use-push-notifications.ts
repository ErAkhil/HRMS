"use client";

import { useEffect, useState } from "react";
import { pushNotificationService, type PushNotificationOptions } from "@/lib/services/push-notifications";

export interface UsePushNotificationsReturn {
  readonly isSupported: boolean;
  readonly permission: NotificationPermission;
  readonly isSubscribed: boolean;
  readonly requestPermission: () => Promise<boolean>;
  readonly subscribe: (vapidKey?: string) => Promise<boolean>;
  readonly unsubscribe: () => Promise<boolean>;
  readonly sendNotification: (options: PushNotificationOptions) => Promise<void>;
}

/**
 * Hook for managing push notifications
 */
export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Initialize push notifications
  useEffect(() => {
    const init = async () => {
      const supported = "serviceWorker" in navigator && "PushManager" in window;
      setIsSupported(supported);

      if (supported) {
        await pushNotificationService.init();
        const status = await pushNotificationService.getSubscriptionStatus();
        setPermission(status.permission);
        setIsSubscribed(status.isSubscribed);
      }
    };

    init();
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    const granted = await pushNotificationService.requestPermission();
    setPermission(Notification.permission || "default");
    return granted;
  };

  const subscribe = async (vapidKey?: string): Promise<boolean> => {
    const vapidKeyToUse =
      vapidKey || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

    if (!vapidKeyToUse) {
      console.warn("VAPID key not configured");
      return false;
    }

    const result = await pushNotificationService.subscribe(vapidKeyToUse);
    if (result) {
      setIsSubscribed(true);
      return true;
    }

    return false;
  };

  const unsubscribe = async (): Promise<boolean> => {
    const result = await pushNotificationService.unsubscribe();
    if (result) {
      setIsSubscribed(false);
    }
    return result;
  };

  const sendNotification = async (options: PushNotificationOptions): Promise<void> => {
    await pushNotificationService.sendNotification(options);
  };

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    subscribe,
    unsubscribe,
    sendNotification,
  };
}
