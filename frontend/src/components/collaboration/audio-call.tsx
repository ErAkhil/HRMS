"use client";

import { useEffect, useRef, useState } from "react";

interface AudioCallProps {
  readonly callId: string;
  readonly remoteName: string;
  readonly onEnd: () => void;
}

/**
 * Audio-only call component using WebRTC
 */
export function AudioCall({
  callId,
  remoteName,
  onEnd,
}: Readonly<AudioCallProps>) {
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [error, setError] = useState<string>();
  const [callDuration, setCallDuration] = useState(0);

  // Initialize audio call
  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: ["stun:stun.l.google.com:19302"] },
          ],
        });

        peerConnectionRef.current = peerConnection;

        // Add audio tracks
        stream.getAudioTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote audio
        peerConnection.ontrack = (event) => {
          if (audioRef.current) {
            audioRef.current.srcObject = event.streams[0];
          }
        };

        // Connection state
        peerConnection.onconnectionstatechange = () => {
          if (peerConnection.connectionState === "connected") {
            setIsConnected(true);
          } else if (
            peerConnection.connectionState === "disconnected" ||
            peerConnection.connectionState === "failed"
          ) {
            onEnd();
          }
        };

        setIsConnected(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to start call";
        setError(message);
      }
    };

    initializeCall();

    return () => {
      peerConnectionRef.current?.close();
    };
  }, [onEnd]);

  // Call duration timer
  useEffect(() => {
    if (!isConnected) return;

    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isConnected]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const handleToggleMute = () => {
    if (peerConnectionRef.current) {
      const audioTrack = peerConnectionRef.current
        .getSenders()
        .find((sender) => sender.track?.kind === "audio")?.track;
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const handleToggleHold = async () => {
    setIsOnHold(!isOnHold);
    // TODO: Implement hold/resume logic
  };

  const handleEndCall = () => {
    peerConnectionRef.current?.close();
    onEnd();
  };

  if (error) {
    return (
      <div className="rounded-lg bg-rose-50 p-6 text-center dark:bg-rose-900/20">
        <p className="font-medium text-rose-900 dark:text-rose-200">Call error</p>
        <p className="mt-2 text-sm text-rose-700 dark:text-rose-300">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Remote Audio Element */}
      <audio ref={audioRef} autoPlay playsInline />

      {/* Call Status */}
      <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-8 text-center text-white shadow-lg">
        <div className="flex items-center justify-center gap-2 text-sm font-medium">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white" />
          {isConnected ? "Connected" : "Connecting..."}
        </div>

        <p className="mt-4 text-3xl font-light">{remoteName}</p>

        <div className="mt-6 text-2xl font-mono tabular-nums">
          {formatDuration(callDuration)}
        </div>

        {isOnHold && (
          <div className="mt-2 inline-block rounded-full bg-white/20 px-3 py-1 text-sm">
            ⏸ On Hold
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleToggleMute}
          className={`flex-1 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
            isMuted
              ? "bg-rose-600 text-white hover:bg-rose-700"
              : "bg-gray-2 text-dark hover:bg-gray-3 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-2"
          }`}
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? "🔇 Unmute" : "🎤 Mute"}
        </button>

        <button
          onClick={handleToggleHold}
          className={`flex-1 rounded-full px-6 py-3 text-sm font-medium transition-colors ${
            isOnHold
              ? "bg-amber-600 text-white hover:bg-amber-700"
              : "bg-gray-2 text-dark hover:bg-gray-3 dark:bg-dark-3 dark:text-white dark:hover:bg-dark-2"
          }`}
        >
          {isOnHold ? "⏯ Resume" : "⏸ Hold"}
        </button>

        <button
          onClick={handleEndCall}
          className="flex-1 rounded-full bg-rose-600 px-6 py-3 text-sm font-medium text-white hover:bg-rose-700"
        >
          📞 End Call
        </button>
      </div>

      {/* Keypad (optional) */}
      <div className="rounded-lg border border-gray-3 bg-white p-4 dark:border-dark-3 dark:bg-dark-2">
        <p className="mb-3 text-sm font-medium text-dark dark:text-white">Keypad</p>
        <div className="grid grid-cols-3 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
            <button
              key={key}
              className="rounded-lg bg-gray-2 py-2 text-sm font-medium hover:bg-gray-3 dark:bg-dark-3 dark:hover:bg-dark-2"
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
