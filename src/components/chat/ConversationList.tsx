'use client';

import Image from 'next/image';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Conversation = {
  id: string;
  tripRequestId?: string | null;
  name: string;
  avatar?: string;
  lastMessage: string;
  lastMessageAt?: string | null;
  lastMessageTime: string;
  unreadCount?: number;
  isOnline?: boolean;
};

type Props = {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
};

export default function ConversationList({
  conversations,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
}: Readonly<Props>) {
  const filtered = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessageTime.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden border-r border-border bg-card">
      <div className="shrink-0 px-4 py-4">
        <h1 className="text-base font-semibold text-foreground">Chat</h1>
      </div>

      {conversations.length > 0 ? (
        <div className="shrink-0 border-b border-border/70 px-3 py-3">
          <label htmlFor="chat-search" className="sr-only">
            Search conversations
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              id="chat-search"
              name="chat-search"
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              aria-label="Search conversations"
              autoComplete="off"
              placeholder="Search messages..."
              className="w-full rounded-xl border border-border bg-muted/40 py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
        </div>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-xs text-muted-foreground">No conversations found</p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <button
                  type="button"
                  onClick={() => onSelect(conversation.id)}
                  className={cn(
                    'flex w-full items-start gap-3 border-l-2 border-transparent px-4 py-3 text-left transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-inset',
                    selectedId === conversation.id &&
                      'border-l-primary bg-primary/5 hover:bg-primary/5',
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-primary/10">
                      {conversation.avatar ? (
                        <Image
                          src={conversation.avatar}
                          alt={conversation.name}
                          width={40}
                          height={40}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-sm font-semibold text-primary">
                          {conversation.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {conversation.isOnline ? (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card bg-green-500" />
                    ) : null}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          'truncate text-sm',
                          conversation.unreadCount
                            ? 'font-semibold text-foreground'
                            : 'font-medium text-foreground/80',
                        )}
                      >
                        {conversation.name}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          'truncate text-xs',
                          conversation.unreadCount
                            ? 'font-medium text-foreground/75'
                            : 'text-muted-foreground',
                        )}
                      >
                        {conversation.lastMessage}
                        {conversation.lastMessageTime
                          ? ` - ${conversation.lastMessageTime}`
                          : ''}
                      </p>
                      {conversation.unreadCount ? (
                        <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                          {conversation.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
