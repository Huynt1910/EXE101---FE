import type { RequestParams } from "@/lib/http/client";
import type { PaginatedResult } from "@/features/api-type";

export type ChatContentType = "Text" | "BookingCard" | "Image" | "File" | "System";

export interface ChatRoom {
	id: string;
	roomType: string;
	tripId: string | null;
	tripRequestId: string | null;
	buddyUserId: string | null;
	otherUserId: string | null;
	otherUserName: string | null;
	lastMessage: string | null;
	lastMessageAt: string | null;
}

export interface ChatMessage {
	id: string;
	roomId: string;
	senderUserId?: string;
	senderId?: string;
	contentType: ChatContentType;
	contentText: string | null;
	bookingId: string | null;
	createdAt: string;
}

export interface ChatMessageList extends PaginatedResult<ChatMessage> {
	otherUserId?: string | null;
	otherUserName?: string | null;
	isOnline?: boolean;
}

export type ChatRoomsList = ChatRoom[];

export interface GetRoomMessagesQuery extends RequestParams {
	page?: number;
	pageSize?: number;
}

export interface SendChatMessagePayload {
	contentText?: string;
	contextText?: string;
}
