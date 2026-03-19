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
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-white">
      {/* Header */}
      <div className="px-4 py-4 flex-shrink-0">
        <h1 className="text-base font-semibold text-gray-900">Chat</h1>
      </div>

      {/* Search — only shows if there are conversations */}
      {conversations.length > 0 && (
        <div className="px-3 py-3 border-b border-gray-100 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm kiếm tin nhắn..."
              className="w-full pl-8 pr-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Conversation items */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {filtered.length === 0 ? (
          // Empty state inside list panel — just show nothing (main area handles illustration)
          <div className="flex flex-col items-center justify-center h-full py-8 px-4 text-center">
            <p className="text-xs text-gray-400">Không tìm thấy cuộc trò chuyện</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((conversation) => (
              <li key={conversation.id}>
                <button
                  onClick={() => onSelect(conversation.id)}
                  className={cn(
                    'w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50',
                    selectedId === conversation.id && 'bg-rose-50 hover:bg-rose-50',
                  )}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden">
                      {conversation.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-semibold text-rose-500">
                          {conversation.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    {conversation.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span
                        className={cn(
                          'text-sm truncate',
                          conversation.unreadCount
                            ? 'font-semibold text-gray-900'
                            : 'font-medium text-gray-800',
                        )}
                      >
                        {conversation.name}
                      </span>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {conversation.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p
                        className={cn(
                          'text-xs truncate',
                          conversation.unreadCount ? 'text-gray-700 font-medium' : 'text-gray-400',
                        )}
                      >
                        {conversation.lastMessage}
                      </p>
                      {conversation.unreadCount ? (
                        <span className="flex-shrink-0 w-4 h-4 bg-rose-500 text-white text-[10px] rounded-full flex items-center justify-center font-semibold">
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
