'use client';

import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Conversation = {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
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
}: Props) {
  const filtered = conversations.filter(
    (conversation) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="px-4 py-4 flex-shrink-0">
        <h1 className="text-base font-semibold text-gray-900">Chat</h1>
      </div>

      {conversations.length > 0 && (
        <div className="shrink-0 border-b border-gray-100 px-3 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search messages..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-1.5 pl-8 pr-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
            <p className="text-xs text-gray-400">No conversations found</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelect(conversation.id)}
                  className={cn(
                    'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50',
                    selectedId === conversation.id && 'bg-rose-50 hover:bg-rose-50',
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-rose-100">
                      {conversation.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-rose-500">
                          {conversation.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {conversation.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-green-500" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          'truncate text-sm',
                          conversation.unreadCount
                            ? 'font-semibold text-gray-900'
                            : 'font-medium text-gray-800',
                        )}
                      >
                        {conversation.name}
                      </span>
                      <span className="shrink-0 text-[10px] text-gray-400">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <div className="mt-0.5 flex items-center justify-between gap-1">
                      <p
                        className={cn(
                          'truncate text-xs',
                          conversation.unreadCount ? 'font-medium text-gray-700' : 'text-gray-400',
                        )}
                      >
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount ? (
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
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
