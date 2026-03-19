"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatApi } from "@/features/chat/api/chat.services";
import { chatQueryKeys } from "@/features/chat/api/chat.query-key";
import type { GetRoomMessagesQuery, SendChatMessagePayload } from "@/features/chat/type";

type SendRoomMessageVariables = {
  roomId: string;
  payload: SendChatMessagePayload;
};

export function useChatRooms() {
  return useQuery({
    queryKey: chatQueryKeys.rooms(),
    queryFn: () => chatApi.getRooms(),
    staleTime: 30 * 1000,
  });
}

export function useChatRoomMessages(roomId?: string, params?: GetRoomMessagesQuery) {
  return useQuery({
    queryKey: chatQueryKeys.roomMessages(roomId ?? "", params),
    queryFn: () => chatApi.getRoomMessages(roomId ?? "", params),
    enabled: Boolean(roomId),
    staleTime: 5 * 1000,
    refetchInterval: roomId ? 3000 : false,
  });
}

export function useSendChatMessageMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ roomId, payload }: SendRoomMessageVariables) =>
      chatApi.sendRoomMessage(roomId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [...chatQueryKeys.messages(), variables.roomId],
      });
      queryClient.invalidateQueries({ queryKey: chatQueryKeys.rooms() });
    },
  });
}
