import type { ApiResponse } from "@/features/api-type";
import type {
  ChatMessage,
  ChatMessageList,
  ChatRoomsList,
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
};
