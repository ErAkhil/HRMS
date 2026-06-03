/**
 * Service Worker for handling push notifications
 * Place this at: public/sw.js
 */

self.addEventListener("push", (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? "Monja HRMS";
  const options = {
    body: data.body,
    icon: "/images/logo.png",
    badge: "/images/badge.png",
    tag: data.tag ?? "notification",
    requireInteraction: data.requireInteraction ?? false,
    data: data.data ?? {},
    actions: data.actions ?? [
      { action: "open", title: "Open" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data = event.notification.data || {};
  const url = data.url || "/";

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        // Check if window already open
        for (const client of clientList) {
          if (client.url === url && "focus" in client) {
            return client.focus();
          }
        }
        // Open new window if not found
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      }),
  );
});

self.addEventListener("notificationclose", (event) => {
  console.log("Notification dismissed", event.notification.tag);
});

// Background sync for offline notifications
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-notifications") {
    event.waitUntil(
      fetch("/api/notifications/pending")
        .then((res) => res.json())
        .then((notifications) => {
          notifications.forEach((notif) => {
            self.registration.showNotification(notif.title, {
              body: notif.body,
              icon: notif.icon || "/images/logo.png",
              badge: notif.badge || "/images/badge.png",
              tag: notif.tag,
              data: notif.data,
            });
          });
        })
        .catch(() => {
          // Offline, retry later
          self.registration.sync.register("sync-notifications");
        }),
    );
  }
});
