"use client";

interface IncomingCallProps {
  callerName: string;
  type: "audio" | "video";
  onAccept: () => void;
  onReject: () => void;
}

export function IncomingCallModal({ callerName, type, onAccept, onReject }: Readonly<IncomingCallProps>) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-80 rounded-2xl bg-white p-6 shadow-modal dark:bg-dark-2 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30">
          <svg className="size-8 text-primary-600" viewBox="0 0 24 24" fill="none">
            {type === "video" ? (
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </div>
        <p className="text-sm text-dark-5 dark:text-dark-6 mb-1">Incoming {type} call</p>
        <p className="text-lg font-bold text-dark dark:text-white mb-6">{callerName}</p>
        <div className="flex gap-3">
          <button
            onClick={onReject}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-600 transition-colors"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Decline
          </button>
          <button
            onClick={onAccept}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none">
              <path d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

interface ActiveCallProps {
  peerName: string;
  type: "audio" | "video";
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>;
  isMuted: boolean;
  isCamOff: boolean;
  onToggleMute: () => void;
  onToggleCam: () => void;
  onEnd: () => void;
}

export function ActiveCallOverlay({
  peerName,
  type,
  localVideoRef,
  remoteVideoRef,
  remoteAudioRef,
  isMuted,
  isCamOff,
  onToggleMute,
  onToggleCam,
  onEnd,
}: Readonly<ActiveCallProps>) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-dark/95">
      {/* Hidden audio element always present to play remote audio in audio-only calls */}
      <audio ref={remoteAudioRef} autoPlay className="hidden" />

      {type === "video" ? (
        <div className="relative w-full max-w-3xl aspect-video bg-dark-2 rounded-2xl overflow-hidden">
          <video ref={remoteVideoRef} autoPlay playsInline className="h-full w-full object-cover" />
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="absolute bottom-4 right-4 h-28 w-40 rounded-xl object-cover border-2 border-white/20"
          />
        </div>
      ) : (
        <div className="flex size-32 items-center justify-center rounded-full bg-primary-600 text-white text-3xl font-bold mb-6">
          {peerName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
        </div>
      )}
      <p className="mt-4 text-white text-lg font-semibold">{peerName}</p>
      <p className="text-dark-5 text-sm mb-8">In call</p>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMute}
          className={`flex size-12 items-center justify-center rounded-full transition-colors ${isMuted ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          <svg className="size-5" viewBox="0 0 24 24" fill="none">
            {isMuted ? (
              <path d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
        {type === "video" && (
          <button
            onClick={onToggleCam}
            className={`flex size-12 items-center justify-center rounded-full transition-colors ${isCamOff ? "bg-rose-500 text-white" : "bg-white/10 text-white hover:bg-white/20"}`}
            aria-label={isCamOff ? "Turn camera on" : "Turn camera off"}
          >
            <svg className="size-5" viewBox="0 0 24 24" fill="none">
              <path d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
        <button
          onClick={onEnd}
          className="flex size-14 items-center justify-center rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
          aria-label="End call"
        >
          <svg className="size-6" viewBox="0 0 24 24" fill="currentColor">
            <path fillRule="evenodd" d="M1.5 4.5a3 3 0 013-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 01-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 006.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 011.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 01-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
