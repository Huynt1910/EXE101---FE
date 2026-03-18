'use client';

import MessagesEmptyState from './MessagesEmptyState';
import { type Conversation } from './ConversationList';

type Props = {
  selectedConversation: Conversation | null;
};

export default function MessageContainer({ selectedConversation }: Props) {
  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white h-full">
        <MessagesEmptyState />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0">
          {selectedConversation.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={selectedConversation.avatar}
              alt={selectedConversation.name}
              className="w-full h-full rounded-full object-cover"
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
            <p className="text-xs text-green-500">Đang hoạt động</p>
          )}
        </div>
      </div>

      {/* Messages area — placeholder for future messages */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        <p className="text-center text-xs text-gray-400 mt-6">
          Bắt đầu cuộc trò chuyện với {selectedConversation.name}
        </p>
      </div>

      {/* Input area */}
      <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 flex-shrink-0">
        <input
          type="text"
          placeholder="Nhập tin nhắn..."
          className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
        />
        <button
          className="flex-shrink-0 px-4 py-2 bg-rose-500 hover:bg-rose-600 transition-colors text-white text-sm font-medium rounded-full"
          aria-label="Gửi tin nhắn"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
