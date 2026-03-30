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

function formatRelativeLastMessageAt(value: string | null | undefined): string {
  if (!value) return "";

  const timestamp = Date.parse(value);
  if (Number.isNaN(timestamp)) return "";

  const elapsedMs = Math.max(0, Date.now() - timestamp);
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;

  if (elapsedMs < minuteMs) return "now";
  if (elapsedMs < hourMs) {
    return `${Math.max(1, Math.floor(elapsedMs / minuteMs))}m`;
  }
  if (elapsedMs < dayMs) return `${Math.floor(elapsedMs / hourMs)}h`;
  if (elapsedMs < weekMs) return `${Math.floor(elapsedMs / dayMs)}d`;

  return `${Math.floor(elapsedMs / weekMs)}w`;
}

function mapRoomToConversation(room: ChatRoom): Conversation {
  const shortTripRequestId = room.tripRequestId
    ? room.tripRequestId.slice(0, 8)
    : null;

  const name =
    room.otherUserName ??
    (shortTripRequestId
      ? `Trip Request ${shortTripRequestId}`
      : `Room ${room.id.slice(0, 8)}`);

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

  const requestedRoomId = searchParams.get("roomId");
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

  const { sendRealtimeMessage, connected: isRealtimeConnected } =
    useChatSignalR({
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
        toast.error("Chat connection is still starting. Please try again.");
      }
      return;
    }

    const hasRoomInList = conversations.some(
      (conversation) => conversation.id === roomId,
    );
    if (!hasRoomInList) {
      toast.error("This conversation is no longer available.");
      return;
    }

    try {
      setIsSendingRealtime(true);
      await sendRealtimeMessage(roomId, content);
      setDraft("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to send message";
      toast.error(message);
    } finally {
      setIsSendingRealtime(false);
    }
  };

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ?? null;

  return (
    <div className="flex h-full min-h-0 max-h-full min-w-0 flex-1 overflow-hidden overscroll-none rounded-[1.5rem] border border-border bg-card shadow-sm">
      <div
        className={`
          w-full min-h-0 min-w-0 shrink-0 overflow-hidden border-r border-border/70 md:basis-[clamp(18rem,28vw,22rem)] md:max-w-[42%]
          ${selectedId ? "hidden md:flex" : "flex"}
          flex-col
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

      <div
        className={`
          min-h-0 min-w-0 flex-1 overflow-hidden flex-col
          ${selectedId ? "flex" : "hidden md:flex"}
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
