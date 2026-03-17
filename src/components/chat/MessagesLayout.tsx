'use client';

import { useState } from 'react';
import ConversationList, { type Conversation } from './ConversationList';
import MessageContainer from './MessageContainer';

type Props = {
  conversations: Conversation[];
};

export default function MessagesLayout({ conversations }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden border border-gray-200 bg-white shadow-sm mx-4 md:mx-6 2xl:mx-16">
      {/* Left sidebar — fixed width on desktop, hidden on mobile when conversation is open */}
      <div
        className={`
          w-full md:w-[300px] lg:w-[340px] flex-shrink-0
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
        <MessageContainer selectedConversation={selectedConversation} />
      </div>
    </div>
  );
}
