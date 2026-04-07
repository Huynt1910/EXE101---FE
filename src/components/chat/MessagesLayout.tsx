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
import { useIsMobile } from "@/features/use-mobile";
import { useChatSignalR } from "@/features/chat/hooks/useChatSignalR";
import type { ChatMessage, ChatRoom } from "@/features/chat/type";
import { chatApi } from "@/features/chat/api/chat.services";
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
    avatar: room.otherUserProfilePicture ?? undefined,
    lastMessage: room.lastMessage ?? room.roomType ?? "No messages yet",
    lastMessageAt: room.lastMessageAt ?? null,
    lastMessageTime: formatRelativeLastMessageAt(room.lastMessageAt),
  };
}

export default function MessagesLayout() {
  const searchParams = useSearchParams();
  const authState = useAuthStore();
  const isMobile = useIsMobile();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [isSendingRealtime, setIsSendingRealtime] = useState(false);
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [hasAppliedInitialRoom, setHasAppliedInitialRoom] = useState(false);

  const requestedRoomId = searchParams.get("roomId");
  const normalizedToken = (authState.token ?? "").trim();

  const [olderPage, setOlderPage] = useState(2);
  const [olderMessages, setOlderMessages] = useState<ChatMessage[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [onlineByRoomId, setOnlineByRoomId] = useState<Record<string, boolean>>({});

  const roomsQuery = useChatRooms();
  const messagesQuery = useChatRoomMessages(selectedId ?? undefined, {
    page: 1,
    pageSize: 10,
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
    () =>
      (roomsQuery.data?.data ?? []).map((room) => {
        const conversation = mapRoomToConversation(room);
        return {
          ...conversation,
          isOnline: onlineByRoomId[room.id],
        };
      }),
    [onlineByRoomId, roomsQuery.data?.data],
  );

  // Reset older messages when switching rooms
  useEffect(() => {
    setOlderMessages([]);
    setOlderPage(2);
    setCanLoadMore(false);
  }, [selectedId]);

  useEffect(() => {
    const baseMessages = messagesQuery.data?.data?.items ?? [];
    setRealtimeMessages(baseMessages);
    if (messagesQuery.data?.data) {
      setCanLoadMore(messagesQuery.data.data.hasNextPage ?? false);

      if (selectedId && typeof messagesQuery.data.data.isOnline === "boolean") {
        setOnlineByRoomId((current) => ({
          ...current,
          [selectedId]: messagesQuery.data?.data?.isOnline ?? false,
        }));
      }
    }
  }, [messagesQuery.data?.data, messagesQuery.data?.data?.items, selectedId]);

  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !selectedId || !canLoadMore) return;
    setIsLoadingMore(true);
    try {
      const result = await chatApi.getRoomMessages(selectedId, {
        page: olderPage,
        pageSize: 10,
      });
      const items = result.data?.items ?? [];
      if (items.length > 0) {
        setOlderMessages((prev) => [...items, ...prev]);
        setOlderPage((prev) => prev + 1);
      }
      setCanLoadMore(result.data?.hasNextPage ?? false);
    } catch {
      // silently ignore load-more errors
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, selectedId, canLoadMore, olderPage]);

  const messages = useMemo(() => {
    const seen = new Set<string>();
    const combined: ChatMessage[] = [];
    for (const m of [...olderMessages, ...realtimeMessages]) {
      if (!seen.has(m.id)) {
        seen.add(m.id);
        combined.push(m);
      }
    }
    return combined;
  }, [olderMessages, realtimeMessages]);

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

    if (!selectedId && !isMobile) {
      setSelectedId(conversations[0].id);
    }
  }, [
    conversations,
    hasAppliedInitialRoom,
    isMobile,
    requestedRoomId,
    selectedId,
  ]);

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
    <div className="flex h-full min-h-0 max-h-full min-w-0 flex-1 overflow-hidden overscroll-none rounded-none border-y border-border bg-secondary shadow-sm md:rounded-3xl md:border">
      <div
        className={`
          w-full min-h-0 min-w-0 shrink-0 overflow-hidden md:basis-[clamp(18rem,28vw,22rem)] md:max-w-[42%] md:border-r md:border-border/70
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
          isLoading={roomsQuery.isLoading}
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
          isLoadingMessages={
            messagesQuery.isLoading ||
            roomsQuery.isLoading ||
            (messagesQuery.isFetching && messages.length === 0)
          }
          isLoadingMore={isLoadingMore}
          canLoadMore={canLoadMore}
          onLoadMore={handleLoadMore}
          showMobileBack={isMobile}
          onBackToList={() => setSelectedId(null)}
        />
      </div>
    </div>
  );
}
