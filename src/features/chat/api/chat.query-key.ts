import type { GetRoomMessagesQuery } from "@/features/chat/type";

export const chatQueryKeys = {
  all: ["chat"] as const,

  rooms: () => [...chatQueryKeys.all, "rooms"] as const,
  unreadSummary: () => [...chatQueryKeys.all, "unread-summary"] as const,

  messages: () => [...chatQueryKeys.all, "messages"] as const,
  roomMessages: (roomId: string, params?: GetRoomMessagesQuery) =>
    [...chatQueryKeys.messages(), roomId, params] as const,
};
