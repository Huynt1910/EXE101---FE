import MessagesLayout from '@/components/chat/MessagesLayout';
import type { Conversation } from '@/components/chat/ConversationList';

// Mock data — replace with real API call / server fetch when ready
const MOCK_CONVERSATIONS: Conversation[] = [];

export default function MessagesPage() {
  return <MessagesLayout conversations={MOCK_CONVERSATIONS} />;
}
