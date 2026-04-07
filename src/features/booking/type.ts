import type { ApiResponse, PaginatedResult } from "@/features/api-type";

export interface CreateBookingOfferPayload {
	bookedDate: string;
	bookedStartTime: string;
	bookedDurationHours: number;
	bookedAdults: number;
	bookedChildren: number;
	price: number;
	currency: string;
	includes: string;
	excludes: string;
	noteForCustomer: string;
}

export interface CreateBookingPayload extends CreateBookingOfferPayload {
	tripRequestId?: string | null;
	chatRoomId?: string | null;
}

export interface BookingOffer {
	id: string;
	tripId: string | null;
	tripRequestId: string | null;
	buddyId: string;
	buddyName: string;
	buddyAvatar: string;
	travelerUserId: string;
	travelerName: string;
	chatRoomId: string;
	bookedDate: string;
	bookedStartTime: string;
	bookedDurationHours: number;
	bookedAdults: number;
	bookedChildren: number;
	price: number;
	currency: string;
	platformFeeAmount: number;
	totalAmount: number;
	includes: string;
	excludes: string;
	noteForCustomer: string;
	status: string;
	statusName: string;
	paymentDeadline: string | null;
	createdAt: string;
	updatedAt: string | null;
}

export interface CreateBookingReviewPayload {
	rating: number;
	comment: string;
	isPublic: boolean;
}

export interface BookingReview {
	id: string;
	bookingId: string | null;
	reviewerUserId: string | null;
	reviewerName: string | null;
	rating: number;
	comment: string | null;
	isPublic: boolean;
	createdAt: string | null;
}

export interface TravelerBookingsList extends PaginatedResult<BookingOffer> {}

export interface BookingOfferEnvelope {
	success: boolean;
	code: string | null;
	message: string | null;
	data: BookingOffer;
	errors: string[] | null;
	timestamp: string;
}

export type CreateBookingOfferResponse = ApiResponse<BookingOfferEnvelope>;

export interface BookingPaymentOrder {
	paymentId: string;
	bookingId: string;
	orderId: string;
	approveUrl: string;
	currency: string;
	amount: number;
}

export interface ConfirmBookingAndPayData {
	booking: BookingOffer;
	paymentOrder: BookingPaymentOrder;
}

export type ConfirmBookingAndPayResponse = ApiResponse<ConfirmBookingAndPayData>;

export type GetBookingDetailResponse = ApiResponse<BookingOffer>;
export type GetTravelerBookingsResponse = ApiResponse<TravelerBookingsList>;
export type CreateBookingReviewResponse = ApiResponse<BookingReview>;
export type GetBookingReviewResponse = ApiResponse<BookingReview | null>;
