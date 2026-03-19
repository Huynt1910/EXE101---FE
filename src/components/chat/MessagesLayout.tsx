  'use client';

import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import ConversationList, { type Conversation } from './ConversationList';
import MessageContainer from './MessageContainer';
import {
  useChatRoomMessages,
  useChatRooms,
  useSendChatMessageMutation,
} from '@/features/chat/hooks/useChat';
import type { ChatRoom, ChatRoomsList } from '@/features/chat/type';
import { useAuthStore } from '@/lib/store/authStore';
import { decodeJwtPayload, extractJwtUserId } from '@/lib/auth/decode-jwt';

function mapRoomToConversation(room: ChatRoom): Conversation {
  const shortTripRequestId = room.tripRequestId ? room.tripRequestId.slice(0, 8) : null;
  const name =
    room.name ??
    room.otherUserName ??
    (shortTripRequestId ? `Trip Request ${shortTripRequestId}` : `Room ${room.id.slice(0, 8)}`);

  return {
    id: room.id,
    name,
    avatar: room.avatar ?? room.otherUserAvatar ?? undefined,
    lastMessage: room.lastMessage ?? room.roomType ?? 'No messages yet',
    lastMessageTime: room.lastMessageAt
      ? new Date(room.lastMessageAt).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '',
    unreadCount: room.unreadCount,
    isOnline: room.isOnline,
  };
}

function normalizeRooms(data: ChatRoomsList | null | undefined): ChatRoom[] {
  if (!data) return [];
  return Array.isArray(data) ? data : data.items ?? [];
}

export default function MessagesLayout() {
  const searchParams = useSearchParams();
  const authState = useAuthStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [hasAppliedInitialRoom, setHasAppliedInitialRoom] = useState(false);

  const requestedRoomId = searchParams.get('roomId');

  const roomsQuery = useChatRooms();
  const sendMessageMutation = useSendChatMessageMutation();
  const messagesQuery = useChatRoomMessages(selectedId ?? undefined, {
    page: 1,
    pageSize: 50,
  });

  const currentUserId = useMemo(() => {
    const payload = decodeJwtPayload(authState.token);
    return extractJwtUserId(payload);
  }, [authState.token]);

  const conversations = useMemo(
    () => normalizeRooms(roomsQuery.data?.data).map(mapRoomToConversation),
    [roomsQuery.data?.data],
  );

  const messages = useMemo(
    () => messagesQuery.data?.data?.items ?? [],
    [messagesQuery.data?.data],
  );

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
    if (!roomId || !content) return;

    try {
      await sendMessageMutation.mutateAsync({
        roomId,
        payload: {
          contentText: content,
          contextText: content,
        },
      });
      setDraft('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      toast.error(message);
    }
  };

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden border border-gray-200 bg-white shadow-sm mx-4 md:mx-6 2xl:mx-16">
      {/* Left sidebar — fixed width on desktop, hidden on mobile when conversation is open */}
      <div
        className={`
          w-full md:w-75 lg:w-85 shrink-0
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
          flex-1 flex flex-col
          ${selectedId ? 'flex' : 'hidden md:flex'}
        `}
      >
        <MessageContainer
          selectedConversation={selectedConversation}
          messages={messages}
          currentUserId={currentUserId}
          draft={draft}
          onDraftChange={setDraft}
          onSend={handleSend}
          isSending={sendMessageMutation.isPending}
          isLoadingMessages={messagesQuery.isLoading || roomsQuery.isLoading}
        />
      </div>
    </div>
  );
}
