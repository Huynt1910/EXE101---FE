"use client";

import { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import {
  getChatConnection,
  getChatConnectionState,
  getOrCreateChatConnection,
  joinRoom,
  leaveRoom,
} from "@/lib/hub/chatHub";
import type { ChatMessage } from "../type";

type Props = {
  accessToken: string;
  roomId?: string;
  onMessageCreated: (message: ChatMessage) => void;
};

export function useChatSignalR({ accessToken, roomId, onMessageCreated }: Props) {
  const [connectionState, setConnectionState] = useState<signalR.HubConnectionState>(
    signalR.HubConnectionState.Disconnected,
  );
  const connected = connectionState === signalR.HubConnectionState.Connected;

  useEffect(() => {
    if (!accessToken) {
      setConnectionState(signalR.HubConnectionState.Disconnected);
      return;
    }

    let active = true;
    let joinedRoomId = "";

    async function init() {
      try {
        setConnectionState(signalR.HubConnectionState.Connecting);
        const conn = await getOrCreateChatConnection(accessToken);
        if (!active) return;

        setConnectionState(conn.state);

        conn.onreconnecting(() => {
          setConnectionState(signalR.HubConnectionState.Reconnecting);
        });

        conn.onreconnected(() => {
          setConnectionState(signalR.HubConnectionState.Connected);
        });

        conn.onclose(() => {
          setConnectionState(signalR.HubConnectionState.Disconnected);
        });

        conn.off("MessageCreated");
        conn.on("MessageCreated", (message: ChatMessage) => {
          onMessageCreated(message);
        });

        if (roomId) {
          await joinRoom(roomId);
          joinedRoomId = roomId;
        }
      } catch (error) {
        console.error("SignalR init failed:", error);
        setConnectionState(getChatConnectionState());
      }
    }

    init();

    return () => {
      active = false;
      const conn = getChatConnection();
      if (!conn) return;

      conn.off("MessageCreated");

      if (joinedRoomId) {
        leaveRoom(joinedRoomId).catch(() => {});
      }
    };
  }, [accessToken, roomId, onMessageCreated]);

  const sendRealtimeMessage = async (roomId: string, content: string) => {
    const normalizedRoomId = roomId.trim();
    const conn = getChatConnection();
    if (conn?.state !== signalR.HubConnectionState.Connected) {
      throw new Error("SignalR chưa kết nối, không thể gửi tin nhắn");
    }
    await conn.invoke("SendMessage", normalizedRoomId, content);
  };

  return {
    connected,
    connectionState,
    sendRealtimeMessage,
  };
}