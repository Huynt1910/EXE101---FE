import type { ApiResponse } from "@/features/api-type";
import type {
  ChatMessage,
  ChatMessageList,
  ChatRoomsList,
  ChatUnreadSummary,
  GetRoomMessagesQuery,
  SendChatMessagePayload,
} from "@/features/chat/type";
import { httpClient } from "@/lib/http/client";

const CHAT_BASE_PATH = "/api/Chat";

export const chatApi = {
  async getRooms() {
    const res = await httpClient.get<ApiResponse<ChatRoomsList>>(
      `${CHAT_BASE_PATH}/rooms`,
    );
    return res.data;
  },

  async getUnreadSummary() {
    const res = await httpClient.get<ApiResponse<ChatUnreadSummary>>(
      `${CHAT_BASE_PATH}/unread-summary`,
    );
    return res.data;
  },

  async getRoomMessages(roomId: string, params?: GetRoomMessagesQuery) {
    const res = await httpClient.get<ApiResponse<ChatMessageList>>(
      `${CHAT_BASE_PATH}/rooms/${roomId}/messages`,
      params,
    );
    return res.data;
  },

  async sendRoomMessage(roomId: string, payload: SendChatMessagePayload) {
    const res = await httpClient.post<ApiResponse<ChatMessage>, SendChatMessagePayload>(
      `${CHAT_BASE_PATH}/rooms/${roomId}/messages`,
      payload,
    );
    return res.data;
  },

  async markRoomAsRead(roomId: string) {
    const res = await httpClient.post<ApiResponse<null>>(
      `${CHAT_BASE_PATH}/rooms/${roomId}/mark-read`,
    );
    return res.data;
  },
};
