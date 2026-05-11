"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { io } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

type EventHandlers = Record<string, (data: unknown) => void>;

/**
 * Connects to the NestJS Socket.io gateway, authenticates with the current
 * access token, and registers the provided event handlers.
 * Reconnects automatically if the access token changes.
 */
export function useSocket(events: EventHandlers) {
  const { data: session } = useSession();
  const handlersRef = useRef<EventHandlers>(events);
  handlersRef.current = events;

  const token = (session as { accessToken?: string } | null)?.accessToken;

  useEffect(() => {
    if (!token) return;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    const eventNames = Object.keys(handlersRef.current);
    const stableHandlers: Record<string, (data: unknown) => void> = {};

    for (const name of eventNames) {
      const handler = (data: unknown) => handlersRef.current[name]?.(data);
      stableHandlers[name] = handler;
      socket.on(name, handler);
    }

    return () => {
      for (const [name, handler] of Object.entries(stableHandlers)) {
        socket.off(name, handler);
      }
      socket.disconnect();
    };
  }, [token]);
}
