'use client';

import MessagesEmptyState from './MessagesEmptyState';
import { type Conversation } from './ConversationList';

type Props = {
  selectedConversation: Conversation | null;
};

export default function MessageContainer({ selectedConversation }: Props) {
  if (!selectedConversation) {
    return (
      <div className="flex h-full flex-1 items-center justify-center bg-white">
        <MessagesEmptyState />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col bg-white">
      <div className="flex shrink-0 items-center gap-3 border-b border-gray-200 px-4 py-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-rose-100">
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

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4">
        <p className="mt-6 text-center text-xs text-gray-400">
          Start the conversation with {selectedConversation.name}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2 border-t border-gray-200 px-4 py-3">
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-rose-400"
        />
        <button
          className="shrink-0 rounded-full bg-rose-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-600"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
}
