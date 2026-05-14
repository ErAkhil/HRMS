"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { io, Socket } from "socket.io-client";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:3001";

type EventHandlers = Record<string, (data: unknown) => void>;

export function useSocket(events: EventHandlers) {
  const { data: session } = useSession();
  const handlersRef = useRef<EventHandlers>(events);
  handlersRef.current = events;

  const socketRef = useRef<Socket | null>(null);
  const token = (session as { accessToken?: string } | null)?.accessToken;

  useEffect(() => {
    if (!token) return;

    // Guard against React StrictMode double-invoke: if already connected, skip
    let active = true;

    const socket = io(WS_URL, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    socketRef.current = socket;

    const eventNames = Object.keys(handlersRef.current);
    const stableHandlers: Record<string, (data: unknown) => void> = {};

    for (const name of eventNames) {
      const handler = (data: unknown) => handlersRef.current[name]?.(data);
      stableHandlers[name] = handler;
      socket.on(name, handler);
    }

    return () => {
      active = false;
      for (const [name, handler] of Object.entries(stableHandlers)) {
        socket.off(name, handler);
      }
      // Disconnect only after the connection resolves to avoid the StrictMode
      // "closed before established" browser warning in development
      if (socket.connected) {
        socket.disconnect();
      } else {
        socket.on("connect", () => { if (!active) socket.disconnect(); });
        socket.on("connect_error", () => { /* ignore abandoned attempt */ });
      }
      socketRef.current = null;
    };
  }, [token]);

  const emit = useCallback((event: string, data: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  return { emit };
}
