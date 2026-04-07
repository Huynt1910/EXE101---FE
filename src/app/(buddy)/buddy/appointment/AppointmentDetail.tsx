"use client";

import {
	CalendarClock,
	CreditCard,
	TimerOff,
	Users,
	X,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { BuddyBooking } from "@/features/buddy/type";

interface AppointmentDetailProps {
	booking: BuddyBooking | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onClose: () => void;
}

function shortId(value: string, length = 8) {
	if (!value) return "N/A";
	return value.slice(0, length).toUpperCase();
}

function formatDisplayDate(value: string) {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en-GB", {
		weekday: "short",
		day: "2-digit",
		month: "short",
		year: "numeric",
	}).format(date);
}

function formatDisplayTimeRange(startTime: string, durationHours: number) {
	const [hour = "0", minute = "0"] = startTime.split(":");
	const base = new Date();
	base.setHours(Number.parseInt(hour, 10), Number.parseInt(minute, 10), 0, 0);

	const end = new Date(base);
	end.setHours(end.getHours() + durationHours);

	const formatter = new Intl.DateTimeFormat("en-US", {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});

	return `${formatter.format(base)} - ${formatter.format(end)}`;
}

function formatSafeCurrency(amount: number, currency: string) {
	try {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			maximumFractionDigits: currency === "VND" ? 0 : 2,
		}).format(amount);
	} catch {
		return `${amount.toLocaleString("en-US")} ${currency}`.trim();
	}
}

function formatDateTimeOrFallback(value: string | null) {
	if (!value) return "N/A";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;

	return new Intl.DateTimeFormat("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
}

function getInitials(name: string) {
	const chars = name
		.split(" ")
		.filter(Boolean)
		.slice(0, 2)
		.map((word) => word[0]?.toUpperCase() ?? "")
		.join("");

	return chars || "TR";
}

export default function AppointmentDetail({
	booking,
	open,
	onOpenChange,
	onClose,
}: Readonly<AppointmentDetailProps>) {
	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				className="w-full gap-0 overflow-hidden border-l-0 p-0 sm:max-w-xl"
			>
				{booking ? (
					<div className="flex h-full flex-col bg-[#f6f7fb]">
						<SheetHeader className="border-b border-gray-200 bg-white px-5 py-4">
							<div className="flex items-start justify-between gap-3">
								<div>
									<SheetDescription className="text-[11px] uppercase tracking-wide text-gray-400">
										Booking ID
									</SheetDescription>
									<SheetTitle className="mt-1 text-xl font-semibold text-[#1f2937]">
										#{shortId(booking.id, 10)}
									</SheetTitle>
									<p className="mt-1 text-xs text-gray-500">
										Trip request #{shortId(booking.tripRequestId, 8)} • {booking.statusName}
									</p>
								</div>
								<button
									type="button"
									onClick={onClose}
									className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100"
									aria-label="Close trip detail"
								>
									<X className="h-4 w-4" />
								</button>
							</div>
						</SheetHeader>

						<div className="scrollbar-hover flex-1 space-y-4 overflow-y-auto p-4">
							<div className="rounded-xl border border-gray-200 bg-white p-4">
								<div className="flex items-center gap-3">
									<div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d946ef] text-sm font-semibold text-white">
										{getInitials(booking.travelerName)}
									</div>
									<div className="min-w-0">
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Traveler</p>
										<p className="truncate text-base font-semibold text-[#111827]">
											{booking.travelerName}
										</p>
										<p className="truncate text-xs text-gray-500">
											User ID: {shortId(booking.travelerUserId, 12)}
										</p>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div className="rounded-xl border border-gray-200 bg-white p-3">
									<div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
										<CalendarClock className="h-3.5 w-3.5" />
										Date & time
									</div>
									<p className="text-sm font-semibold text-[#111827]">
										{formatDisplayDate(booking.bookedDate)}
									</p>
									<p className="text-xs text-gray-500">
										{formatDisplayTimeRange(
											booking.bookedStartTime,
											booking.bookedDurationHours,
										)}
									</p>
								</div>

								<div className="rounded-xl border border-gray-200 bg-white p-3">
									<div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
										<Users className="h-3.5 w-3.5" />
										Group size
									</div>
									<p className="text-sm font-semibold text-[#111827]">
										{booking.bookedAdults + booking.bookedChildren} people
									</p>
									<p className="text-xs text-gray-500">
										{booking.bookedAdults} adults, {booking.bookedChildren} children
									</p>
								</div>

								<div className="rounded-xl border border-gray-200 bg-white p-3">
									<div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
										<TimerOff className="h-3.5 w-3.5" />
										Duration
									</div>
									<p className="text-sm font-semibold text-[#111827]">
										{booking.bookedDurationHours} hour{booking.bookedDurationHours > 1 ? "s" : ""}
									</p>
								</div>

								<div className="rounded-xl border border-gray-200 bg-white p-3">
									<div className="mb-1 flex items-center gap-2 text-xs text-gray-500">
										<CreditCard className="h-3.5 w-3.5" />
										Status
									</div>
									<p className="text-sm font-semibold text-[#111827]">
										{booking.statusName}
									</p>
								</div>
							</div>

							<div className="rounded-xl border border-gray-200 bg-white">
								<div className="border-b border-gray-100 px-4 py-3">
									<h3 className="text-sm font-semibold text-[#111827]">Payment</h3>
								</div>
								<div className="grid grid-cols-2 gap-4 px-4 py-3 text-sm">
									<div>
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Trip price</p>
										<p className="mt-1 font-semibold text-[#111827]">
											{formatSafeCurrency(booking.price, booking.currency)}
										</p>
									</div>
									<div>
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Platform fee</p>
										<p className="mt-1 font-semibold text-[#111827]">
											{formatSafeCurrency(booking.platformFeeAmount, booking.currency)}
										</p>
									</div>
									<div className="col-span-2">
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Total amount</p>
										<p className="mt-1 text-base font-bold text-[#111827]">
											{formatSafeCurrency(booking.totalAmount, booking.currency)}
										</p>
									</div>
									<div className="col-span-2">
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Payment deadline</p>
										<p className="mt-1 font-medium text-[#111827]">
											{formatDateTimeOrFallback(booking.paymentDeadline)}
										</p>
									</div>
								</div>
							</div>

							<div className="rounded-xl border border-gray-200 bg-white">
								<div className="border-b border-gray-100 px-4 py-3">
									<h3 className="text-sm font-semibold text-[#111827]">Trip details</h3>
								</div>
								<div className="space-y-3 px-4 py-3 text-sm">
									<div>
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Includes</p>
										<p className="mt-1 text-[#111827]">
											{booking.includes?.trim() || "-"}
										</p>
									</div>
									<div>
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Excludes</p>
										<p className="mt-1 text-[#111827]">
											{booking.excludes?.trim() || "-"}
										</p>
									</div>
									<div>
										<p className="text-[11px] uppercase tracking-wide text-gray-400">Note for traveler</p>
										<p className="mt-1 text-[#111827]">
											{booking.noteForCustomer?.trim() || "-"}
										</p>
									</div>
								</div>
							</div>

						</div>

					</div>
				) : null}
			</SheetContent>
		</Sheet>
	);
}
