'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import MessagesEmptyState from './MessagesEmptyState';
import { type Conversation } from './ConversationList';
import type { ChatMessage } from '@/features/chat/type';
import CreateOfferModal from './CreateOfferModal';
import BookingDetailCard from './BookingDetailCard';
import { useAuthStore } from '@/lib/store/authStore';

type MessageUI = {
  id: string;
  senderUserId: string;
  bookingId: string | null;
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

type ParsedOffer = {
  location: string;
  date: string;
  time: string;
  adults: string;
  children: string;
  duration: string;
  price: string;
  buddyMessage: string;
};

function parseOfferText(text: string): ParsedOffer | null {
  if (!text.includes('New trip request from buddy') && !text.includes('Offer price:')) return null;

  const location = text.match(/Trip:\s*([^\n]+?)\s+on\s/)?.[1]?.trim() ?? '';
  const date = text.match(/on\s+([\d-]+)/)?.[1]?.trim() ?? '';
  const time = text.match(/at\s+([\d:]+)/)?.[1]?.trim() ?? '';
  const adults = text.match(/(\d+)\s+adults?/)?.[1] ?? '0';
  const children = text.match(/(\d+)\s+children/)?.[1] ?? '0';
  const duration = text.match(/(\d+)\s+hours?/)?.[1] ?? '0';
  const price = text.match(/Offer price:\s*([^\n]+)/)?.[1]?.trim() ?? '';
  const budMessage = text.match(/Message from buddy:[\r\n]+([\s\S]*?)(?:\n\n|$)/)?.[1]?.trim() ?? '';

  if (!location && !price) return null;

  return { location, date, time, adults, children, duration, price, buddyMessage: budMessage };
}

function IconMapPin() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
}
function IconTag() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}

function OfferMessageCard({ offer, isMine }: Readonly<{ offer: ParsedOffer; isMine: boolean }>) {
  const headerClassName = isMine
    ? 'bg-[#ffdb5b]'
    : 'bg-[#f3f5f7]';
  const headerSubtleTextClassName = 'text-black';
  const headerMutedIconClassName = 'text-black';
  const headerPriceClassName = 'text-black';

  return (
    <div className={`w-72 sm:w-80 rounded-2xl overflow-hidden shadow-md border ${
      isMine ? 'border-amber-200' : 'border-indigo-100'
    }`}>
      {/* Header */}
      <div className={`px-4 pt-4 pb-3 ${headerClassName}`}>
        <div className="mb-3">
          <span className={`text-sm font-semibold tracking-wide uppercase ${headerSubtleTextClassName}`}>Trip Offer</span>
        </div>
        <div className="mb-0.5 flex items-baseline gap-2">
          <p className={`text-xl font-bold uppercase tracking-wide ${headerSubtleTextClassName}`}>Price</p>
          <span className={`text-xl font-bold ${headerPriceClassName}`}>{offer.price}</span>
        </div>
        {offer.location && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className={headerMutedIconClassName}><IconMapPin /></span>
            <p className={`text-xs ${headerSubtleTextClassName}`}>{offer.location}</p>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="bg-white px-4 pt-3 pb-3 space-y-2.5">
        {offer.date && (
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <span className="text-gray-400"><IconCalendar /></span>
            <span>{offer.date}{offer.time ? ` at ${offer.time}` : ''}</span>
          </div>
        )}
        {offer.duration && offer.duration !== '0' && (
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <span className="text-gray-400"><IconClock /></span>
            <span>{offer.duration} hours</span>
          </div>
        )}
        {(offer.adults || offer.children) && (
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <span className="text-gray-400"><IconUsers /></span>
            <span>
              {offer.adults} adult{Number(offer.adults) !== 1 ? 's' : ''}
              {offer.children !== '0' && `, ${offer.children} child${Number(offer.children) !== 1 ? 'ren' : ''}`}
            </span>
          </div>
        )}
      </div>

      {/* Buddy note */}
      {offer.buddyMessage && (
        <div className="mx-3 mb-3 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-gray-400"><IconTag /></span>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Note from buddy</p>
          </div>
          <p className="text-xs text-gray-600 italic leading-relaxed">&ldquo;{offer.buddyMessage}&rdquo;</p>
        </div>
      )}

      {/* Footer */}
      <div className={`px-4 py-2.5 text-center text-[11px] font-medium ${
        isMine
          ? 'bg-amber-50 text-amber-700 border-t border-amber-100'
          : 'bg-indigo-50 text-indigo-600 border-t border-indigo-100'
      }`}>
        {isMine ? 'Offer sent · Awaiting traveler review' : 'Reply to discuss or accept this offer'}
      </div>
    </div>
  );
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
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const { user } = useAuthStore();
  const canCreateOffer =
    user?.roles?.some((role) => role.toLowerCase() === 'buddy') ?? false;
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
      bookingId: item.bookingId,
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
          const isOfferCard = message.contentType !== 'BookingCard' && Boolean(parseOfferText(message.contentText));
          let bubbleClassName = 'max-w-[90%]';
          if (message.contentType !== 'BookingCard' && !isOfferCard) {
            const toneClassName = isMine
              ? 'bg-[#ffdb5b] text-black rounded-br-md'
              : 'bg-[#f3f5f7] text-gray-800 rounded-bl-md';
            bubbleClassName = `max-w-[80%] rounded-2xl px-3 py-2 text-sm ${toneClassName}`;
          }

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
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                      {senderInitial}
                    </span>
                  )}
                </div>
              )}

              <div
                className={bubbleClassName}
              >
                {message.contentType === 'BookingCard' ? (
                  <BookingDetailCard
                    bookingId={message.bookingId}
                    currentUserId={currentUserId}
                    isMine={isMine}
                  />
                ) : (() => {
                  const parsed = parseOfferText(message.contentText);
                  if (parsed) return <OfferMessageCard offer={parsed} isMine={isMine} />;
                  return <p className="whitespace-pre-wrap wrap-break-word">{message.contentText}</p>;
                })()}
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
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          {selectedConversation.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {selectedConversation.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{selectedConversation.name}</p>
          {selectedConversation.isOnline && (
            <p className="text-xs text-green-500">Active now</p>
          )}
        </div>
        {canCreateOffer ? (
          <button
            type="button"
            onClick={() => setIsOfferModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary/90 active:scale-95 transition-all text-primary-foreground text-xs font-semibold shadow-sm shrink-0"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <line x1="9" y1="15" x2="15" y2="15" />
            </svg>
            Create offer
          </button>
        ) : null}
      </div>

      {canCreateOffer ? (
        <CreateOfferModal
          open={isOfferModalOpen}
          onClose={() => setIsOfferModalOpen(false)}
          buddyName="You"
          buddyAvatar={selectedConversation.avatar}
          tripRequestId={selectedConversation.tripRequestId}
          chatRoomId={selectedConversation.id}
        />
      ) : null}

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
          className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isSendDisabled}
          className="shrink-0 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 transition-colors text-primary-foreground text-sm font-medium rounded-full cursor-pointer"
          aria-label="Send message"
        >
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </div>
  );
}
