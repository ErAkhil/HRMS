/**
 * Web Push Notification Service
 * Handles subscription management, permission requests, and notifications
 */

export interface PushNotificationOptions {
  readonly title: string;
  readonly body?: string;
  readonly icon?: string;
  readonly badge?: string;
  readonly tag?: string;
  readonly requireInteraction?: boolean;
  readonly data?: Record<string, unknown>;
}

class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;

  /**
   * Initialize push notifications
   */
  async init(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("Push notifications not supported");
      return false;
    }

    try {
      this.registration = await navigator.serviceWorker.register("/sw.js");
      return true;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return false;
    }
  }

  /**
   * Request push notification permission
   */
  async requestPermission(): Promise<boolean> {
    if (!("Notification" in window)) {
      console.warn("Notifications not supported");
      return false;
    }

    if (Notification.permission === "granted") {
      return true;
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }

    return false;
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe(vapidKey: string): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.init();
    }

    if (!this.registration) return null;

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidKey),
      });

      // Send subscription to server
      await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscription),
      });

      return subscription;
    } catch (error) {
      console.error("Push subscription failed:", error);
      return null;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe(): Promise<boolean> {
    if (!this.registration) return false;

    try {
      const subscription = await this.registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();

        // Notify server
        await fetch("/api/notifications/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(subscription),
        });

        return true;
      }
    } catch (error) {
      console.error("Unsubscribe failed:", error);
    }

    return false;
  }

  /**
   * Send local notification (no server push needed)
   */
  async sendNotification(options: Readonly<PushNotificationOptions>): Promise<void> {
    if (!this.registration) {
      await this.init();
    }

    if (Notification.permission === "granted" && this.registration) {
      await this.registration.showNotification(options.title, {
        body: options.body,
        icon: options.icon || "/images/logo.png",
        badge: options.badge || "/images/badge.png",
        tag: options.tag,
        requireInteraction: options.requireInteraction ?? false,
        data: options.data,
      });
    }
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus(): Promise<{
    readonly isSubscribed: boolean;
    readonly permission: NotificationPermission;
  }> {
    const permission = Notification.permission || "default";
    const isSubscribed = !!(await this.registration?.pushManager.getSubscription());

    return { isSubscribed, permission };
  }

  /**
   * Convert VAPID key from base64 to Uint8Array
   */
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

export const pushNotificationService = new PushNotificationService();
