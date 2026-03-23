'use client';

import { useCallback, useEffect, useRef } from 'react';
import MessagesEmptyState from './MessagesEmptyState';
import { type Conversation } from './ConversationList';
import type { ChatMessage } from '@/features/chat/type';

type MessageUI = {
  id: string;
  senderUserId: string;
  contentType: ChatMessage['contentType'];
  contentText: string;
  createdAt: string;
};

type Props = {
  selectedConversation: Conversation | null;
  messages: ChatMessage[];
  currentUserId?: string;
  isRealtimeConnected?: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  isSending?: boolean;
  isLoadingMessages?: boolean;
};

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getFallbackContentText(contentType: ChatMessage['contentType']) {
  if (contentType === 'BookingCard') return '[Booking card]';
  if (contentType === 'Image') return '[Image]';
  if (contentType === 'File') return '[File]';
  if (contentType === 'System') return '[System message]';
  return '';
}

export default function MessageContainer({
  selectedConversation,
  messages,
  currentUserId,
  isRealtimeConnected = false,
  draft,
  onDraftChange,
  onSend,
  isSending = false,
  isLoadingMessages = false,
}: Readonly<Props>) {
  const isSendDisabled = isSending || draft.trim() === '' || !isRealtimeConnected;
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const previousConversationIdRef = useRef<string | null>(null);
  const previousLastMessageIdRef = useRef<string | null>(null);

  const scrollToLatest = useCallback((behavior: ScrollBehavior = 'smooth') => {
    const viewport = messagesViewportRef.current;
    if (!viewport) return;

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior,
    });
  }, []);

  const handleSendMessage = useCallback(() => {
    if (isSendDisabled) return;

    onSend();
    requestAnimationFrame(() => {
      scrollToLatest('smooth');
    });
  }, [isSendDisabled, onSend, scrollToLatest]);

  const displayMessages: MessageUI[] = [...messages]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((item) => ({
      id: item.id,
      senderUserId: item.senderUserId ?? item.senderId ?? '',
      contentType: item.contentType,
      contentText: item.contentText ?? getFallbackContentText(item.contentType),
      createdAt: item.createdAt,
    }));

  useEffect(() => {
    if (!selectedConversation) {
      previousConversationIdRef.current = null;
      previousLastMessageIdRef.current = null;
      return;
    }

    const normalizedCurrentUserId = currentUserId?.trim().toLowerCase() ?? '';
    const conversationId = selectedConversation.id;
    const lastMessage = displayMessages.at(-1);
    const lastMessageId = lastMessage?.id ?? null;

    const isConversationChanged = previousConversationIdRef.current !== conversationId;
    const isNewLastMessage =
      Boolean(lastMessageId) && lastMessageId !== previousLastMessageIdRef.current;

    if (isConversationChanged) {
      requestAnimationFrame(() => {
        scrollToLatest('auto');
      });
    } else if (isNewLastMessage) {
      const normalizedSenderUserId = lastMessage?.senderUserId.trim().toLowerCase() ?? '';
      const isOwnMessage =
        Boolean(normalizedCurrentUserId) && normalizedSenderUserId === normalizedCurrentUserId;

      if (isOwnMessage) {
        requestAnimationFrame(() => {
          scrollToLatest('smooth');
        });
      }
    }

    previousConversationIdRef.current = conversationId;
    previousLastMessageIdRef.current = lastMessageId;
  }, [currentUserId, displayMessages, scrollToLatest, selectedConversation]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-white">
        <MessagesEmptyState />
      </div>
    );
  }

  let messageBody: React.ReactNode;
  if (isLoadingMessages) {
    messageBody = <p className="text-center text-xs text-gray-400 mt-6">Đang tải tin nhắn...</p>;
  } else if (displayMessages.length === 0) {
    messageBody = (
      <p className="text-center text-xs text-gray-400 mt-6">
        Bắt đầu cuộc trò chuyện với {selectedConversation.name}
      </p>
    );
  } else {
    messageBody = (
      <div className="space-y-2">
        {displayMessages.map((message) => {
          const normalizedCurrentUserId = currentUserId?.trim().toLowerCase();
          const normalizedSenderUserId = message.senderUserId.trim().toLowerCase();
          const isMine =
            Boolean(normalizedCurrentUserId) &&
            normalizedSenderUserId === normalizedCurrentUserId;
          const senderInitial = selectedConversation.name.charAt(0).toUpperCase();

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isMine ? 'justify-end' : 'justify-start'}`}
            >
              {isMine ? null : (
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-rose-100">
                  {selectedConversation.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-rose-500">
                      {senderInitial}
                    </span>
                  )}
                </div>
              )}

              <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${isMine
                    ? 'bg-[#ffdb5b] text-black rounded-br-md'
                    : 'bg-[#f3f5f7] text-gray-800 rounded-bl-md'
                  }`}
              >
                <p className="whitespace-pre-wrap wrap-break-word">{message.contentText}</p>
                <p
                  className={`mt-1 text-[10px] ${isMine ? 'text-black' : 'text-gray-400'
                    }`}
                >
                  {formatTime(message.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center shrink-0">
          {selectedConversation.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-rose-500">
              {selectedConversation.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">{selectedConversation.name}</p>
          {selectedConversation.isOnline && (
            <p className="text-xs text-green-500">Active now</p>
          )}
        </div>
      </div>

      {/* Messages area */}
      <div ref={messagesViewportRef} className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        {messageBody}
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 shrink-0">
        <input
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !isSendDisabled) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isSendDisabled}
          className="shrink-0 px-4 py-2 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 transition-colors text-white text-sm font-medium rounded-full cursor-pointer"
          aria-label="Send message"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
