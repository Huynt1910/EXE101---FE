  "use client";

  import { useCallback, useEffect, useMemo, useState } from "react";
  import { useSearchParams } from "next/navigation";
  import { toast } from "sonner";
  import ConversationList, { type Conversation } from "./ConversationList";
  import MessageContainer from "./MessageContainer";
import {
  useChatRoomMessages,
  useChatRooms,
  } from "@/features/chat/hooks/useChat";
  import { useChatSignalR } from "@/features/chat/hooks/useChatSignalR";
  import type { ChatMessage, ChatRoom } from "@/features/chat/type";
  import { useAuthStore } from "@/lib/store/authStore";
  import { decodeJwtPayload, extractJwtUserId } from "@/lib/auth/decode-jwt";

const GUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function formatRelativeLastMessageAt(value: string | null | undefined): string {
  if (!value) return "";

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return "";

  const elapsedMs = Math.max(0, Date.now() - timestamp);
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;

  if (elapsedMs < minuteMs) {
    return "now";
  }

  if (elapsedMs < hourMs) {
    return `${Math.max(1, Math.floor(elapsedMs / minuteMs))}m`;
  }

  if (elapsedMs < dayMs) {
    return `${Math.floor(elapsedMs / hourMs)}h`;
  }

  if (elapsedMs < weekMs) {
    return `${Math.floor(elapsedMs / dayMs)}d`;
  }

  return `${Math.floor(elapsedMs / weekMs)}w`;
}

function mapRoomToConversation(room: ChatRoom): Conversation {
  const shortTripRequestId = room.tripRequestId ? room.tripRequestId.slice(0, 8) : null;
  const name =
    room.otherUserName ??
    (shortTripRequestId ? `Trip Request ${shortTripRequestId}` : `Room ${room.id.slice(0, 8)}`);

  return {
    id: room.id,
    tripRequestId: room.tripRequestId,
    name,
    lastMessage: room.lastMessage ?? room.roomType ?? "No messages yet",
    lastMessageAt: room.lastMessageAt ?? null,
    lastMessageTime: formatRelativeLastMessageAt(room.lastMessageAt),
  };
}

export default function MessagesLayout() {
  const searchParams = useSearchParams();
  const authState = useAuthStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [isSendingRealtime, setIsSendingRealtime] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [hasAppliedInitialRoom, setHasAppliedInitialRoom] = useState(false);

  const requestedRoomId = searchParams.get('roomId');
  const normalizedToken = (authState.token ?? "").trim();

  const roomsQuery = useChatRooms();
  const messagesQuery = useChatRoomMessages(selectedId ?? undefined, {
    page: 1,
    pageSize: 50,
  });

  const currentUserId = useMemo(() => {
    const payload = decodeJwtPayload(authState.token);
    return extractJwtUserId(payload);
  }, [authState.token]);

  const handleMessageCreated = useCallback(
    (message: ChatMessage) => {
      if (!selectedId || message.roomId !== selectedId) return;

      setRealtimeMessages((current) => {
        if (current.some((item) => item.id === message.id)) return current;
        return [...current, message];
      });
    },
    [selectedId],
  );

  const {
    sendRealtimeMessage,
    connected: isRealtimeConnected,
  } = useChatSignalR({
    accessToken: normalizedToken,
    roomId: selectedId ?? undefined,
    onMessageCreated: handleMessageCreated,
  });

  const conversations = useMemo(
    () => (roomsQuery.data?.data ?? []).map(mapRoomToConversation),
    [roomsQuery.data?.data],
  );

  useEffect(() => {
    const baseMessages = messagesQuery.data?.data?.items ?? [];
    setRealtimeMessages(baseMessages);
  }, [messagesQuery.data?.data?.items, selectedId]);

  const messages = useMemo(() => realtimeMessages, [realtimeMessages]);

  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    // Prevent page-level scroll; only chat panes should scroll.
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  useEffect(() => {
    if (conversations.length === 0) return;

    if (requestedRoomId && !hasAppliedInitialRoom) {
      setHasAppliedInitialRoom(true);
      const hasRequestedRoom = conversations.some(
        (conversation) => conversation.id === requestedRoomId,
      );

      if (hasRequestedRoom) {
        setSelectedId(requestedRoomId);
        return;
      }
    }

    if (!selectedId) {
      setSelectedId(conversations[0].id);
    }
  }, [conversations, hasAppliedInitialRoom, requestedRoomId, selectedId]);

  const handleSend = async () => {
    const roomId = selectedId;
    const content = draft.trim();
    if (!roomId || !content || !isRealtimeConnected) {
      if (!isRealtimeConnected) {
        toast.error("SignalR chưa connected, vui lòng đợi rồi gửi lại");
      }
      return;
    }

    const hasRoomInList = conversations.some((conversation) => conversation.id === roomId);
    if (!hasRoomInList) {
      toast.error("Room không tồn tại trong danh sách hiện tại");
      return;
    }

    try {
      setIsSendingRealtime(true);
      await sendRealtimeMessage(roomId, content);
      setDraft("");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    } finally {
      setIsSendingRealtime(false);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="mx-4 flex h-full overflow-hidden border border-gray-200 bg-white shadow-sm md:mx-6 2xl:mx-16">
      {/* Left sidebar — fixed width on desktop, hidden on mobile when conversation is open */}
      <div
        className={`
          w-full md:w-75 lg:w-85 shrink-0 min-h-0 min-w-0
          ${selectedId ? 'hidden md:flex' : 'flex'}
          flex-col border-r border-gray-200
        `}
      >
        <ConversationList
          conversations={conversations}
          selectedId={selectedId}
          onSelect={setSelectedId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Right main area — takes remaining space */}
      <div
        className={`
          flex-1 flex flex-col min-h-0 min-w-0
          ${selectedId ? 'flex' : 'hidden md:flex'}
        `}
      >
        <MessageContainer
          selectedConversation={selectedConversation}
          messages={messages}
          currentUserId={currentUserId}
          isRealtimeConnected={isRealtimeConnected}
          draft={draft}
          onDraftChange={setDraft}
          onSend={handleSend}
          isSending={isSendingRealtime}
          isLoadingMessages={messagesQuery.isLoading || roomsQuery.isLoading}
        />
      </div>
    </div>
  );
}
