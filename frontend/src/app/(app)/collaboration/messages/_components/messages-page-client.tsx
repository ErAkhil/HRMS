"use client";

import { useState, useTransition, useCallback, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Toast } from "@/components/ui/toast";
import { useSocket } from "@/hooks/use-socket";
import { DmSidebar } from "./dm-sidebar";
import { DmChatArea } from "./dm-chat-area";
import { IncomingCallModal, ActiveCallOverlay } from "./call-modal";
import { getChannelMessages, sendMessage, markChannelRead } from "@/lib/actions/messages";
import { getDmUsers, getDmMessages, sendDmMessage, markDmRead, getOrCreateConversation } from "@/lib/actions/dm";
import type { ChannelItem, ChannelMessage } from "@/lib/actions/messages";
import type { DmConversation, DmMessage, DmUser } from "@/lib/actions/dm";

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun1.l.google.com:19302" }],
};

type ReadReceipt = { userId: string; name: string; avatar: string | null; readAt: string };
function replaceReadReceipt(readBy: ReadReceipt[] | undefined, receipt: ReadReceipt) {
  return [...(readBy ?? []).filter((item) => item.userId !== receipt.userId), receipt];
}
interface MsgNewPayload { id: string; channelId: string; channelName: string; content: string; senderId: string; senderName: string; senderAvatar: string | null; createdAt: string; readBy?: ReadReceipt[]; }
interface DmNewPayload { id: string; conversationId: string; content: string; senderId: string; senderName: string; senderAvatar: string | null; createdAt: string; readBy?: ReadReceipt[]; }
interface DmReadPayload { conversationId: string; readById: string; lastReadMessageId: string | null; readAt: string | null; readerName: string; readerAvatar: string | null; }
interface ChannelReadPayload { channelId: string; lastReadMessageId: string | null; lastReadAt: string | null; readerId: string; readerName: string; readerAvatar: string | null; }
interface CallInvitePayload { callerId: string; callerName: string; conversationId?: string; channelId?: string; channelName?: string | null; type: "audio" | "video"; }
interface CallOfferPayload { offer: RTCSessionDescriptionInit; fromId: string; }
interface CallAnswerPayload { answer: RTCSessionDescriptionInit; }
interface IceCandidatePayload { candidate: RTCIceCandidateInit; }

// ─── Self-fetching New DM picker ───────────────────────────────────────────────
function NewDmPicker({ onSelect, onClose }: Readonly<{ onSelect: (u: DmUser) => void; onClose: () => void }>) {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<DmUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDmUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) => !q || u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-modal dark:bg-dark-2">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-dark dark:text-white">New direct message</h2>
          <button onClick={onClose} className="text-dark-5 hover:text-dark dark:text-dark-6">
            <svg className="size-5" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <input
          placeholder="Search people..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          autoFocus
          className="mb-3 h-9 w-full rounded-lg border border-gray-3 bg-gray-2 px-3 text-sm outline-none focus:border-primary-600 dark:border-dark-3 dark:bg-dark-3 dark:text-white"
        />
        <div className="max-h-64 overflow-y-auto space-y-0.5">
          {loading && <p className="py-4 text-center text-sm text-dark-5">Loading...</p>}
          {!loading && filtered.length === 0 && <p className="py-4 text-center text-sm text-dark-5">No people found.</p>}
          {filtered.map((u) => (
            <button key={u.userId} onClick={() => onSelect(u)} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-gray-2 dark:hover:bg-dark-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700 dark:bg-violet-900/30 dark:text-violet-300">
                {u.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-semibold text-dark dark:text-white">{u.name}</p>
                {u.jobTitle && <p className="text-xs text-dark-5 dark:text-dark-6">{u.jobTitle}</p>}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  channels: ChannelItem[];
  conversations: DmConversation[];
  dmUsers: DmUser[];
  initialMessages: ChannelMessage[];
  initialChannelId: string | null;
  initialDmId?: string | null;
  initialChannelParam?: string | null;
}

export function MessagesPageClient({
  channels,
  conversations: initConvos,
  dmUsers: initDmUsers,
  initialMessages,
  initialChannelId,
  initialDmId,
  initialChannelParam,
}: Readonly<Props>) {
  const { data: session } = useSession();
  const [mode, setMode] = useState<"channel" | "dm">("channel");
  const [activeChannelId, setActiveChannelId] = useState<string | null>(initialChannelId);
  const [activeDmId, setActiveDmId] = useState<string | null>(null);
  const [channelMessages, setChannelMessages] = useState<ChannelMessage[]>(initialMessages);
  const [dmMessages, setDmMessages] = useState<DmMessage[]>([]);
  const [conversations, setConversations] = useState<DmConversation[]>(initConvos);
  const [allUsers, setAllUsers] = useState<DmUser[]>(initDmUsers);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [showNewDm, setShowNewDm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast, setToast } = useToast();

  // Fetch all users client-side as well (in case server-side prop was empty)
  useEffect(() => {
    if (initDmUsers.length === 0) {
      getDmUsers().then(setAllUsers).catch(() => null);
    }
  }, [initDmUsers.length]);

  // Call state
  const [incomingCall, setIncomingCall] = useState<CallInvitePayload | null>(null);
  const [activeCall, setActiveCall] = useState<{ peerId: string; peerName: string; type: "audio" | "video"; scope: "dm" | "channel" } | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCamOff, setIsCamOff] = useState(false);

  const peerRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const callStartTimeRef = useRef<number | null>(null);
  const activeCallConvoIdRef = useRef<string | null>(null);
  const activeCallChannelIdRef = useRef<string | null>(null);
  const activeCallScopeRef = useRef<"dm" | "channel" | null>(null);
  const emitRef = useRef<(event: string, data: unknown) => void>(() => null);

  const currentUserId = session?.user?.id;
  const currentUserName = (session?.user as { name?: string } | undefined)?.name ?? session?.user?.email ?? "You";

  const activeChannel = channels.find((ch) => ch.id === activeChannelId) ?? null;
  const activeConversation = conversations.find((c) => c.id === activeDmId) ?? null;

  // ─── WebRTC ───────────────────────────────────────────────────────────────────
  function teardownCall() {
    peerRef.current?.close();
    peerRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    callStartTimeRef.current = null;
    activeCallConvoIdRef.current = null;
    activeCallChannelIdRef.current = null;
    activeCallScopeRef.current = null;
    setActiveCall(null);
    setIncomingCall(null);
    setIsMuted(false);
    setIsCamOff(false);
  }

  function makePeer(peerId: string): RTCPeerConnection {
    const pc = new RTCPeerConnection(RTC_CONFIG);
    peerRef.current = pc;
    pc.onicecandidate = (e) => {
      if (e.candidate) emitRef.current("call:ice-candidate", { targetId: peerId, candidate: e.candidate.toJSON() });
    };
    pc.ontrack = (e) => {
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
      if (remoteAudioRef.current) remoteAudioRef.current.srcObject = e.streams[0];
    };
    localStreamRef.current?.getTracks().forEach((t) => pc.addTrack(t, localStreamRef.current!));
    return pc;
  }

  // ─── Socket handlers ──────────────────────────────────────────────────────────
  const handleMessageNew = useCallback((data: unknown) => {
    const p = data as MsgNewPayload;
    if (p.channelId !== activeChannelId) return;
    setChannelMessages((prev) => {
      if (prev.some((m) => m.id === p.id)) return prev;
      return [...prev, { id: p.id, content: p.content, senderId: p.senderId, senderName: p.senderName, senderAvatar: p.senderAvatar, isMe: p.senderId === currentUserId, createdAt: p.createdAt, readBy: p.readBy ?? [] }];
    });
    if (p.senderId !== currentUserId) {
      markChannelRead(p.channelId).catch(() => null);
    }
  }, [activeChannelId, currentUserId]);

  const activeDmIdRef = useRef(activeDmId);
  activeDmIdRef.current = activeDmId;

  const handleDmNew = useCallback((data: unknown) => {
    const p = data as DmNewPayload;
    const curDmId = activeDmIdRef.current;
    if (p.conversationId === curDmId) {
      setDmMessages((prev) => {
        if (prev.some((m) => m.id === p.id)) return prev;
        return [...prev, { ...p, isMe: p.senderId === currentUserId, readBy: p.readBy ?? [] }];
      });
      markDmRead(p.conversationId).catch(() => null);
    }
    const isCallStamp = p.content.startsWith('{"__call__"');
    const sidebarLastMsg = isCallStamp ? "📞 Call" : p.content;
    setConversations((prev) =>
      prev.map((c) =>
        c.id === p.conversationId
          ? { ...c, lastMessage: sidebarLastMsg, lastMessageAt: p.createdAt, unreadCount: c.id === curDmId ? 0 : c.unreadCount + 1 }
          : c,
      ),
    );
  }, [currentUserId]);

  const handleDmRead = useCallback((data: unknown) => {
    const p = data as DmReadPayload;
    if (p.conversationId === activeDmIdRef.current) {
      const receipt = { userId: p.readById, name: p.readerName, avatar: p.readerAvatar, readAt: p.readAt ?? new Date().toISOString() };
      setDmMessages((prev) => prev.map((m) => m.id === p.lastReadMessageId ? {
        ...m,
        readBy: replaceReadReceipt(m.readBy, receipt),
      } : m));
    }
    setConversations((prev) => prev.map((c) => c.id === p.conversationId ? { ...c, unreadCount: 0 } : c));
  }, []);

  const handleChannelRead = useCallback((data: unknown) => {
    const p = data as ChannelReadPayload;
    if (p.channelId !== activeChannelId) return;
    const receipt = { userId: p.readerId, name: p.readerName, avatar: p.readerAvatar, readAt: p.lastReadAt ?? new Date().toISOString() };
    setChannelMessages((prev) => prev.map((m) => m.id === p.lastReadMessageId ? {
      ...m,
      readBy: replaceReadReceipt(m.readBy, receipt),
    } : m));
  }, [activeChannelId]);

  const handleCallInvite = useCallback((data: unknown) => {
    setIncomingCall(data as CallInvitePayload);
  }, []);

  const incomingCallRef = useRef(incomingCall);
  incomingCallRef.current = incomingCall;
  const activeCallRef = useRef(activeCall);
  activeCallRef.current = activeCall;

  const handleCallAccepted = useCallback(async (data: unknown) => {
    const p = data as { calleeId: string };
    if (!activeCallRef.current) return;
    callStartTimeRef.current = Date.now();
    const pc = makePeer(p.calleeId);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    emitRef.current("call:offer", { targetId: p.calleeId, offer });
   
  }, []);

  const handleCallRejected = useCallback(() => {
    setToast("Call declined.");
    teardownCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCallOffer = useCallback(async (data: unknown) => {
    const p = data as CallOfferPayload;
    if (!incomingCallRef.current) return;
    const pc = peerRef.current ?? makePeer(p.fromId);
    await pc.setRemoteDescription(p.offer);
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    emitRef.current("call:answer", { targetId: p.fromId, answer });
   
  }, []);

  const handleCallAnswer = useCallback(async (data: unknown) => {
    const p = data as CallAnswerPayload;
    await peerRef.current?.setRemoteDescription(p.answer);
  }, []);

  const handleIceCandidate = useCallback(async (data: unknown) => {
    const p = data as IceCandidatePayload;
    await peerRef.current?.addIceCandidate(p.candidate).catch(() => null);
  }, []);

  const handleCallEnd = useCallback(() => {
    setToast("Call ended.");
    teardownCall();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { emit } = useSocket({
    "message:new": handleMessageNew,
    "dm:new": handleDmNew,
    "dm:read": handleDmRead,
    "channel:read": handleChannelRead,
    "call:invite": handleCallInvite,
    "call:accepted": handleCallAccepted,
    "call:rejected": handleCallRejected,
    "call:offer": handleCallOffer,
    "call:answer": handleCallAnswer,
    "call:ice-candidate": handleIceCandidate,
    "call:end": handleCallEnd,
  });
  emitRef.current = emit;

  // ─── Navigation ───────────────────────────────────────────────────────────────
  function handleSelectChannel(id: string) {
    setMode("channel");
    setActiveChannelId(id);
    setActiveDmId(null);
    startTransition(async () => {
      try {
        setChannelMessages(await getChannelMessages(id));
        await markChannelRead(id);
      } catch {
        setChannelMessages([]);
      }
    });
  }

  function handleSelectDm(id: string) {
    setMode("dm");
    setActiveDmId(id);
    setActiveChannelId(null);
    setConversations((prev) => prev.map((c) => c.id === id ? { ...c, unreadCount: 0 } : c));
    startTransition(async () => {
      try {
        setDmMessages(await getDmMessages(id));
        await markDmRead(id);
      } catch { setDmMessages([]); }
    });
  }

  // Handle URL params from notification deep-links (runs once on mount)
  const handledParamRef = useRef(false);
  useEffect(() => {
    if (handledParamRef.current) return;
    if (!initialDmId && !initialChannelParam) return;
    handledParamRef.current = true;
    if (initialDmId) {
      handleSelectDm(initialDmId);
    } else if (initialChannelParam) {
      handleSelectChannel(initialChannelParam);
    }
   
  }, [initialDmId, initialChannelParam]);

  // ─── Open / create a DM conversation ─────────────────────────────────────────
  function openDmWith(userId: string, name: string, avatar: string | null = null) {
    startTransition(async () => {
      try {
        const convo = await getOrCreateConversation(userId);
        setConversations((prev) => {
          if (prev.some((c) => c.id === convo.id)) return prev;
          return [{ id: convo.id, otherUserId: userId, otherUserName: name, otherUserAvatar: avatar, lastMessage: null, lastMessageAt: null, unreadCount: 0 }, ...prev];
        });
        handleSelectDm(convo.id);
      } catch { setToast("Failed to open conversation"); }
    });
  }

  // ─── Send ─────────────────────────────────────────────────────────────────────
  function handleSend() {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");

    if (mode === "channel" && activeChannelId) {
      startTransition(async () => {
        try {
          await sendMessage(activeChannelId, content);
          await markChannelRead(activeChannelId);
        }
        catch (err) { setToast(err instanceof Error ? err.message : "Failed to send"); setInput(content); }
      });
    } else if (mode === "dm" && activeDmId) {
      const optimistic: DmMessage = {
        id: `tmp-${Date.now()}`,
        content,
        senderId: currentUserId ?? "",
        senderName: currentUserName,
        senderAvatar: null,
        isMe: true,
        readBy: [],
        createdAt: new Date().toISOString(),
      };
      setDmMessages((prev) => [...prev, optimistic]);
      startTransition(async () => {
        try {
          const saved = await sendDmMessage(activeDmId, content);
          setDmMessages((prev) => prev.map((m) => m.id === optimistic.id ? { ...saved, isMe: true } : m));
          setConversations((prev) => prev.map((c) => c.id === activeDmId ? { ...c, lastMessage: content, lastMessageAt: saved.createdAt } : c));
        } catch (err) {
          setToast(err instanceof Error ? err.message : "Failed to send");
          setDmMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
          setInput(content);
        }
      });
    }
  }

  // ─── Call helpers ─────────────────────────────────────────────────────────────
  async function initiateCall(peerId: string, peerName: string, conversationId: string, type: "audio" | "video") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === "video" });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      activeCallConvoIdRef.current = conversationId;
      activeCallChannelIdRef.current = null;
      activeCallScopeRef.current = "dm";
      setActiveCall({ peerId, peerName, type, scope: "dm" });
      emit("call:invite", { calleeId: peerId, conversationId, type, callerName: currentUserName });
    } catch {
      setToast("Could not access camera/microphone");
    }
  }

  async function initiateChannelCall(channelId: string, channelName: string, type: "audio" | "video") {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: type === "video" });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      activeCallConvoIdRef.current = null;
      activeCallChannelIdRef.current = channelId;
      activeCallScopeRef.current = "channel";
      setActiveCall({ peerId: channelId, peerName: channelName, type, scope: "channel" });
      emit("call:invite", { channelId, channelName, type, callerName: currentUserName });
    } catch {
      setToast("Could not access camera/microphone");
    }
  }

  async function handleCall(type: "audio" | "video") {
    if (mode === "channel" && activeChannel) {
      await initiateChannelCall(activeChannel.id, activeChannel.name, type);
      return;
    }
    if (!activeConversation || !activeDmId) return;
    await initiateCall(activeConversation.otherUserId, activeConversation.otherUserName, activeDmId, type);
  }

  async function handleCallUser(userId: string, name: string, type: "audio" | "video") {
    startTransition(async () => {
      try {
        const convo = await getOrCreateConversation(userId);
        setConversations((prev) => {
          if (prev.some((c) => c.id === convo.id)) return prev;
          return [{ id: convo.id, otherUserId: userId, otherUserName: name, otherUserAvatar: null, lastMessage: null, lastMessageAt: null, unreadCount: 0 }, ...prev];
        });
        await initiateCall(userId, name, convo.id, type);
      } catch { setToast("Failed to start call"); }
    });
  }

  async function handleAcceptCall() {
    if (!incomingCall) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: incomingCall.type === "video" });
      localStreamRef.current = stream;
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      callStartTimeRef.current = Date.now();
      activeCallConvoIdRef.current = incomingCall.conversationId ?? null;
      activeCallChannelIdRef.current = incomingCall.channelId ?? null;
      activeCallScopeRef.current = incomingCall.channelId ? "channel" : "dm";
      makePeer(incomingCall.callerId);
      setActiveCall({ peerId: incomingCall.callerId, peerName: incomingCall.channelName ?? incomingCall.callerName, type: incomingCall.type, scope: incomingCall.channelId ? "channel" : "dm" });
      setIncomingCall(null);
      emit("call:accepted", { callerId: incomingCall.callerId, conversationId: incomingCall.conversationId, channelId: incomingCall.channelId });
    } catch {
      setToast("Could not access camera/microphone");
      setIncomingCall(null);
    }
  }

  function handleRejectCall() {
    if (!incomingCall) return;
    emit("call:rejected", {
      callerId: incomingCall.callerId,
      conversationId: incomingCall.conversationId,
      channelId: incomingCall.channelId,
      callType: incomingCall.type,
    });
    setIncomingCall(null);
  }

  function handleEndCall() {
    if (activeCall) {
      const duration = callStartTimeRef.current
        ? Math.floor((Date.now() - callStartTimeRef.current) / 1000)
        : 0;
      emit("call:end", activeCallScopeRef.current === "channel" ? {
        channelId: activeCallChannelIdRef.current,
        callType: activeCall.type,
        duration,
      } : {
        targetId: activeCall.peerId,
        conversationId: activeCallConvoIdRef.current,
        callType: activeCall.type,
        duration,
      });
    }
    teardownCall();
  }

  const displayMessages = mode === "channel" ? channelMessages : dmMessages;

  return (
    <>
      <div className="page-container">
        <div className={`flex h-[calc(100vh-10rem)] overflow-hidden rounded-xl shadow-card transition-opacity ${isPending ? "opacity-70" : ""}`}>
          <DmSidebar
            channels={channels}
            conversations={conversations}
            allUsers={allUsers}
            activeChannelId={activeChannelId}
            activeDmId={activeDmId}
            mode={mode}
            search={search}
            onSelectChannel={handleSelectChannel}
            onSelectDm={handleSelectDm}
            onSearch={setSearch}
            onNewDm={() => setShowNewDm(true)}
            onStartDmWithUser={openDmWith}
          />
          <DmChatArea
            mode={mode}
            channel={mode === "channel" ? activeChannel : null}
            conversation={mode === "dm" ? activeConversation : null}
            messages={displayMessages}
            input={input}
            onInputChange={setInput}
            onSend={handleSend}
            onCall={handleCall}
            onSearch={() => setToast("Search coming soon")}
            onEmoji={() => setToast("Emoji picker coming soon!")}
            onAttach={() => setToast("File attachment coming soon!")}
            onStartDm={(userId, name) => openDmWith(userId, name)}
            onCallUser={handleCallUser}
          />
        </div>
        <Toast message={toast} />
      </div>

      {showNewDm && (
        <NewDmPicker onSelect={(u) => { setShowNewDm(false); openDmWith(u.userId, u.name, u.avatar); }} onClose={() => setShowNewDm(false)} />
      )}

      {incomingCall && !activeCall && (
        <IncomingCallModal
          callerName={incomingCall.callerName}
          channelName={incomingCall.channelName}
          type={incomingCall.type}
          onAccept={handleAcceptCall}
          onReject={handleRejectCall}
        />
      )}

      {activeCall && (
        <ActiveCallOverlay
          peerName={activeCall.peerName}
          type={activeCall.type}
          localVideoRef={localVideoRef}
          remoteVideoRef={remoteVideoRef}
          remoteAudioRef={remoteAudioRef}
          isMuted={isMuted}
          isCamOff={isCamOff}
          onToggleMute={() => { localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; }); setIsMuted((v) => !v); }}
          onToggleCam={() => { localStreamRef.current?.getVideoTracks().forEach((t) => { t.enabled = !t.enabled; }); setIsCamOff((v) => !v); }}
          onEnd={handleEndCall}
        />
      )}
    </>
  );
}
