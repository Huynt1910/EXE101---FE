"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import MessagesEmptyState from "./MessagesEmptyState";
import { type Conversation } from "./ConversationList";
import type { ChatMessage } from "@/features/chat/type";
import CreateOfferModal from "./CreateOfferModal";
import BookingDetailCard from "./BookingDetailCard";
import { useAuthStore } from "@/lib/store/authStore";

type MessageUI = {
  id: string;
  senderUserId: string;
  bookingId: string | null;
  contentType: ChatMessage["contentType"];
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
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getFallbackContentText(contentType: ChatMessage["contentType"]) {
  if (contentType === "BookingCard") return "[Booking card]";
  if (contentType === "Image") return "[Image]";
  if (contentType === "File") return "[File]";
  if (contentType === "System") return "[System message]";
  return "";
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
  if (
    !text.includes("New trip request from buddy") &&
    !text.includes("Offer price:")
  ) {
    return null;
  }

  const location = text.match(/Trip:\s*([^\n]+?)\s+on\s/)?.[1]?.trim() ?? "";
  const date = text.match(/on\s+([\d-]+)/)?.[1]?.trim() ?? "";
  const time = text.match(/at\s+([\d:]+)/)?.[1]?.trim() ?? "";
  const adults = text.match(/(\d+)\s+adults?/)?.[1] ?? "0";
  const children = text.match(/(\d+)\s+children/)?.[1] ?? "0";
  const duration = text.match(/(\d+)\s+hours?/)?.[1] ?? "0";
  const price = text.match(/Offer price:\s*([^\n]+)/)?.[1]?.trim() ?? "";
  const buddyMessage =
    text.match(/Message from buddy:[\r\n]+([\s\S]*?)(?:\n\n|$)/)?.[1]?.trim() ??
    "";

  if (!location && !price) return null;

  return {
    location,
    date,
    time,
    adults,
    children,
    duration,
    price,
    buddyMessage,
  };
}

function IconMapPin() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function IconClock() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function IconUsers() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

function OfferMessageCard({
  offer,
  isMine,
}: Readonly<{ offer: ParsedOffer; isMine: boolean }>) {
  return (
    <div
      className={`w-72 overflow-hidden rounded-2xl border shadow-sm sm:w-80 ${
        isMine ? "border-amber-200" : "border-border"
      }`}
    >
      <div
        className={`px-4 pb-3 pt-4 ${isMine ? "bg-amber-200/90" : "bg-muted/50"}`}
      >
        <div className="mb-3">
          <span className="text-sm font-semibold uppercase tracking-wide text-foreground">
            Trip offer
          </span>
        </div>
        <div className="mb-0.5 flex items-baseline gap-2">
          <p className="text-xl font-bold uppercase tracking-wide text-foreground">
            Price
          </p>
          <span className="text-xl font-bold text-foreground">
            {offer.price}
          </span>
        </div>
        {offer.location ? (
          <div className="mt-1.5 flex items-center gap-1.5">
            <span className="text-foreground">
              <IconMapPin />
            </span>
            <p className="text-xs text-foreground">{offer.location}</p>
          </div>
        ) : null}
      </div>

      <div className="space-y-2.5 bg-secondary px-4 pb-3 pt-3">
        {offer.date ? (
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="text-muted-foreground">
              <IconCalendar />
            </span>
            <span>
              {offer.date}
              {offer.time ? ` at ${offer.time}` : ""}
            </span>
          </div>
        ) : null}
        {offer.duration && offer.duration !== "0" ? (
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="text-muted-foreground">
              <IconClock />
            </span>
            <span>{offer.duration} hours</span>
          </div>
        ) : null}
        {offer.adults || offer.children ? (
          <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
            <span className="text-muted-foreground">
              <IconUsers />
            </span>
            <span>
              {offer.adults} adult{Number(offer.adults) !== 1 ? "s" : ""}
              {offer.children !== "0" &&
                `, ${offer.children} child${Number(offer.children) !== 1 ? "ren" : ""}`}
            </span>
          </div>
        ) : null}
      </div>

      {offer.buddyMessage ? (
        <div className="mx-3 mb-3 rounded-xl border border-border bg-muted/40 px-3 py-2.5">
          <div className="mb-1 flex items-center gap-1.5">
            <span className="text-muted-foreground">
              <IconTag />
            </span>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Note from buddy
            </p>
          </div>
          <p className="text-xs italic leading-relaxed text-muted-foreground">
            &ldquo;{offer.buddyMessage}&rdquo;
          </p>
        </div>
      ) : null}

      <div
        className={`border-t px-4 py-2.5 text-center text-[11px] font-medium ${
          isMine
            ? "border-amber-100 bg-amber-50 text-amber-700"
            : "border-border bg-muted/30 text-primary"
        }`}
      >
        {isMine
          ? "Offer sent · Awaiting traveler review"
          : "Reply to discuss or accept this offer"}
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
    user?.roles?.some((role) => role.toLowerCase() === "buddy") ?? false;
  const isSendDisabled =
    isSending || draft.trim() === "" || !isRealtimeConnected;
  const messagesViewportRef = useRef<HTMLDivElement>(null);
  const previousConversationIdRef = useRef<string | null>(null);
  const previousLastMessageIdRef = useRef<string | null>(null);

  const scrollToLatest = useCallback((behavior: ScrollBehavior = "smooth") => {
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
      scrollToLatest("smooth");
    });
  }, [isSendDisabled, onSend, scrollToLatest]);

  const displayMessages: MessageUI[] = [...messages]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map((item) => ({
      id: item.id,
      senderUserId: item.senderUserId ?? item.senderId ?? "",
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

    const normalizedCurrentUserId = currentUserId?.trim().toLowerCase() ?? "";
    const conversationId = selectedConversation.id;
    const lastMessage = displayMessages.at(-1);
    const lastMessageId = lastMessage?.id ?? null;

    const isConversationChanged =
      previousConversationIdRef.current !== conversationId;
    const isNewLastMessage =
      Boolean(lastMessageId) &&
      lastMessageId !== previousLastMessageIdRef.current;

    if (isConversationChanged) {
      requestAnimationFrame(() => {
        scrollToLatest("auto");
      });
    } else if (isNewLastMessage) {
      const normalizedSenderUserId =
        lastMessage?.senderUserId.trim().toLowerCase() ?? "";
      const isOwnMessage =
        Boolean(normalizedCurrentUserId) &&
        normalizedSenderUserId === normalizedCurrentUserId;

      if (isOwnMessage) {
        requestAnimationFrame(() => {
          scrollToLatest("smooth");
        });
      }
    }

    previousConversationIdRef.current = conversationId;
    previousLastMessageIdRef.current = lastMessageId;
  }, [currentUserId, displayMessages, scrollToLatest, selectedConversation]);

  if (!selectedConversation) {
    return (
      <div className="flex h-full min-h-0 flex-1 items-center justify-center overflow-hidden bg-secondary">
        <MessagesEmptyState />
      </div>
    );
  }

  let messageBody: React.ReactNode;
  if (isLoadingMessages) {
    messageBody = (
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Loading messages…
      </p>
    );
  } else if (displayMessages.length === 0) {
    messageBody = (
      <p className="mt-6 text-center text-xs text-muted-foreground">
        Start the conversation with {selectedConversation.name}
      </p>
    );
  } else {
    messageBody = (
      <div className="space-y-3 pb-1">
        {displayMessages.map((message) => {
          const normalizedCurrentUserId = currentUserId?.trim().toLowerCase();
          const normalizedSenderUserId = message.senderUserId
            .trim()
            .toLowerCase();
          const isMine =
            Boolean(normalizedCurrentUserId) &&
            normalizedSenderUserId === normalizedCurrentUserId;
          const senderInitial = selectedConversation.name
            .charAt(0)
            .toUpperCase();
          const parsedOffer =
            message.contentType !== "BookingCard"
              ? parseOfferText(message.contentText)
              : null;

          let bubbleClassName = "max-w-[90%]";
          if (message.contentType !== "BookingCard" && !parsedOffer) {
            bubbleClassName = `max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
              isMine
                ? "rounded-br-md bg-amber-200 text-foreground"
                : "rounded-bl-md bg-muted text-foreground"
            }`;
          }

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"}`}
            >
              {isMine ? null : (
                <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-primary/10">
                  {selectedConversation.avatar ? (
                    <Image
                      src={selectedConversation.avatar}
                      alt={selectedConversation.name}
                      width={32}
                      height={32}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-primary">
                      {senderInitial}
                    </span>
                  )}
                </div>
              )}

              <div className={bubbleClassName}>
                {message.contentType === "BookingCard" ? (
                  <BookingDetailCard
                    bookingId={message.bookingId}
                    currentUserId={currentUserId}
                    isMine={isMine}
                  />
                ) : parsedOffer ? (
                  <OfferMessageCard offer={parsedOffer} isMine={isMine} />
                ) : (
                  <p className="whitespace-pre-wrap break-words">
                    {message.contentText}
                  </p>
                )}
                <p
                  className={`mt-1 text-[10px] ${
                    isMine ? "text-foreground/70" : "text-muted-foreground"
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
    <div className="flex h-full min-h-0 max-h-full flex-1 flex-col overflow-hidden bg-">
      <div className="flex shrink-0 items-center gap-3 border-b border-border/70 px-4 py-3">
        <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-primary/10">
          {selectedConversation.avatar ? (
            <Image
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              width={32}
              height={32}
              className="h-full w-full rounded-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-sm font-semibold text-primary">
              {selectedConversation.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {selectedConversation.name}
          </p>
          {selectedConversation.isOnline ? (
            <p className="text-xs text-green-600">Active now</p>
          ) : null}
        </div>
        {canCreateOffer ? (
          <button
            type="button"
            onClick={() => setIsOfferModalOpen(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition-[background-color,transform,box-shadow] hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
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

      <div
        ref={messagesViewportRef}
        className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4 scrollbar-hide"
      >
        {messageBody}
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-border/70 px-4 py-3">
        <label htmlFor="message-draft" className="sr-only">
          Type your message
        </label>
        <input
          id="message-draft"
          name="message-draft"
          type="text"
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !isSendDisabled) {
              event.preventDefault();
              handleSendMessage();
            }
          }}
          aria-label="Type your message"
          autoComplete="off"
          placeholder="Type a message…"
          className="flex-1 rounded-full border border-border bg-muted/40 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        />
        <button
          type="button"
          onClick={handleSendMessage}
          disabled={isSendDisabled}
          className="shrink-0 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Send message"
        >
          {isSending ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
