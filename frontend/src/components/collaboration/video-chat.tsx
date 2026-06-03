"use client";

import { useEffect, useRef, useState } from "react";

interface VideoChatProps {
  readonly callId: string;
  readonly isInitiator: boolean;
  readonly remoteUserId: string;
  readonly onEnd: () => void;
}

/**
 * Video chat component using WebRTC
 * Handles peer connection, local/remote video streams, call lifecycle
 */
export function VideoChat({
  callId,
  isInitiator,
  remoteUserId,
  onEnd,
}: Readonly<VideoChatProps>) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [hasLocalVideo, setHasLocalVideo] = useState(false);
  const [hasRemoteVideo, setHasRemoteVideo] = useState(false);
  const [error, setError] = useState<string>();

  // Initialize WebRTC
  useEffect(() => {
    const initializeCall = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: { echoCancellation: true, noiseSuppression: true },
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          setHasLocalVideo(true);
        }

        // Create peer connection
        const peerConnection = new RTCPeerConnection({
          iceServers: [
            { urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"] },
          ],
        });

        peerConnectionRef.current = peerConnection;

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        // Handle remote stream
        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
            setHasRemoteVideo(true);
          }
        };

        // Handle connection state changes
        peerConnection.onconnectionstatechange = () => {
          if (peerConnection.connectionState === "connected") {
            setIsConnected(true);
          } else if (
            peerConnection.connectionState === "disconnected" ||
            peerConnection.connectionState === "failed"
          ) {
            setIsConnected(false);
            onEnd();
          }
        };

        // Handle ICE candidates (in real app, send via signaling server)
        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            // TODO: Send ICE candidate to remote peer via signaling server
            console.log("ICE candidate:", event.candidate);
          }
        };

        setIsConnected(true);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to start video call";
        setError(message);
      }
    };

    initializeCall();

    return () => {
      peerConnectionRef.current?.close();
      localVideoRef.current?.srcObject &&
        (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    };
  }, [onEnd]);

  const handleEndCall = () => {
    peerConnectionRef.current?.close();
    if (localVideoRef.current?.srcObject) {
      (localVideoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
    }
    onEnd();
  };

  const handleToggleVideo = async () => {
    if (peerConnectionRef.current) {
      const videoTrack = (localVideoRef.current?.srcObject as MediaStream)?.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  };

  const handleToggleAudio = async () => {
    if (peerConnectionRef.current) {
      const audioTrack = (localVideoRef.current?.srcObject as MediaStream)?.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  };

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center rounded-lg bg-rose-50 text-center dark:bg-rose-900/20">
        <div>
          <p className="font-medium text-rose-900 dark:text-rose-200">Video call error</p>
          <p className="text-sm text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Video Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Local Video */}
        <div className="relative overflow-hidden rounded-lg bg-black">
          {hasLocalVideo ? (
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-white">
              <p>Loading local video...</p>
            </div>
          )}
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            You
          </span>
        </div>

        {/* Remote Video */}
        <div className="relative overflow-hidden rounded-lg bg-black">
          {hasRemoteVideo ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="h-64 w-full object-cover"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-white">
              <p>Waiting for remote video...</p>
            </div>
          )}
          <span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
            {remoteUserId}
          </span>
        </div>
      </div>

      {/* Status */}
      <div className="rounded-lg bg-sky-50 p-3 text-sm dark:bg-sky-900/20">
        <span className={isConnected ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
          ●
        </span>
        <span className="ml-2">{isConnected ? "Connected" : "Connecting..."}</span>
      </div>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={handleToggleVideo}
          className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 active:scale-95"
          title="Toggle video"
        >
          📹 Video
        </button>
        <button
          onClick={handleToggleAudio}
          className="flex-1 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 active:scale-95"
          title="Toggle audio"
        >
          🎤 Audio
        </button>
        <button
          onClick={handleEndCall}
          className="flex-1 rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 active:scale-95"
          title="End call"
        >
          📞 End
        </button>
      </div>
    </div>
  );
}
