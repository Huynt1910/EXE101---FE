import { buddiesData, type Buddy } from "@/lib/data/buddies";
import { getBuddyMeta } from "@/lib/buddy-profile";
import {
  advanceBookingStatus,
  getLatestTripRequest,
  type BookingStatus,
  type ProposalData,
  type TripRequestFormData,
  updateLatestTripRequest,
  updateLatestTripProposal,
} from "@/lib/trip-request";

export const ACTIVE_BUDDY_ID = 1;
const BUDDY_FLOW_STORAGE_KEY = "bonddy.buddyFlowState";

export type BuddyRequestSummary = TripRequestFormData & {
  id: string;
  createdAt: string;
  roughAgenda: string[];
  shortNotes: string;
  source: "seed" | "latest";
};

export type BuddyFlowState = {
  appliedRequestIds: string[];
  declinedInvitationIds: string[];
};

export type WalletSnapshot = {
  balance: number;
  payoutPending: number;
  payoutCompleted: number;
  currentRating: number;
  totalTrips: number;
  commissionHistory: Array<{
    id: string;
    title: string;
    amount: number;
    date: string;
  }>;
  cashTripDeductions: Array<{
    id: string;
    trip: string;
    amount: number;
    date: string;
  }>;
  debts: Array<{
    id: string;
    title: string;
    amount: number;
    due: string;
  }>;
};

const seedRequests: BuddyRequestSummary[] = [
  {
    id: "OPEN-SGN-FOOD",
    city: "Ho Chi Minh City",
    startTime: "2026-03-18T18:30",
    durationMinutes: 240,
    groupSize: 2,
    preferredLanguage: "English",
    budgetMin: 45,
    budgetMax: 120,
    meetingPoint: "Ben Thanh Market main gate",
    notes: "Looking for local food stops and a safe nightlife route.",
    shortNotes: "Street food focus with first-time visitor context.",
    roughAgenda: [
      "Meet at Ben Thanh and align food preferences.",
      "Walk through two local food clusters.",
      "Finish at a rooftop or cocktail bar if energy is still good.",
    ],
    createdAt: "2026-03-12T08:15:00.000Z",
    source: "seed",
  },
  {
    id: "OPEN-HL-ADVENTURE",
    city: "Ha Long",
    startTime: "2026-03-20T07:00",
    durationMinutes: 480,
    groupSize: 4,
    preferredLanguage: "English",
    budgetMin: 120,
    budgetMax: 260,
    meetingPoint: "Sun World Ha Long parking area",
    notes: "Need a buddy comfortable with outdoor routes and transport logistics.",
    shortNotes: "Day trip with active pacing and transport support.",
    roughAgenda: [
      "Briefing at meeting point and transport check.",
      "Outdoor stops across viewpoints and local lunch.",
      "Wrap up with return transfer coordination.",
    ],
    createdAt: "2026-03-12T07:45:00.000Z",
    source: "seed",
  },
  {
    id: "OPEN-SGN-ART",
    city: "Ho Chi Minh City",
    startTime: "2026-03-21T15:00",
    durationMinutes: 210,
    groupSize: 1,
    preferredLanguage: "English",
    budgetMin: 35,
    budgetMax: 90,
    meetingPoint: "The Cafe Apartments lobby",
    notes: "Interested in coffee, indie spaces, and local art.",
    shortNotes: "Solo traveler looking for creative city angle.",
    roughAgenda: [
      "Coffee tasting in Nguyen Hue area.",
      "Walk hidden alleys and art spaces.",
      "End with recommendations for evening spots.",
    ],
    createdAt: "2026-03-12T09:05:00.000Z",
    source: "seed",
  },
];

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function getStoredBuddyFlowState(): BuddyFlowState {
  if (typeof window === "undefined") {
    return { appliedRequestIds: [], declinedInvitationIds: [] };
  }

  const raw = window.localStorage.getItem(BUDDY_FLOW_STORAGE_KEY);
  const parsed = raw ? safeJsonParse<BuddyFlowState>(raw) : null;

  return {
    appliedRequestIds: parsed?.appliedRequestIds ?? [],
    declinedInvitationIds: parsed?.declinedInvitationIds ?? [],
  };
}

function saveBuddyFlowState(state: BuddyFlowState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BUDDY_FLOW_STORAGE_KEY, JSON.stringify(state));
}

function createLatestRequestSummary(): BuddyRequestSummary | null {
  const latest = getLatestTripRequest();
  if (!latest) return null;

  return {
    id: latest.id,
    city: latest.city,
    startTime: latest.startTime,
    durationMinutes: latest.durationMinutes,
    groupSize: latest.groupSize,
    preferredLanguage: latest.preferredLanguage,
    budgetMin: latest.budgetMin,
    budgetMax: latest.budgetMax,
    meetingPoint: latest.meetingPoint,
    notes: latest.notes,
    shortNotes: latest.notes || "Customer did not add extra notes.",
    roughAgenda: [
      `Meet at ${latest.meetingPoint}.`,
      `Guide a ${latest.groupSize}-person trip in ${latest.city}.`,
      "Refine exact stops after the intro conversation.",
    ],
    createdAt: latest.createdAt,
    source: "latest",
  };
}

export function getBuddyIdentity(buddyId = ACTIVE_BUDDY_ID): (Buddy & ReturnType<typeof getBuddyMeta>) | null {
  const buddy = buddiesData[buddyId];
  if (!buddy) return null;

  return {
    ...buddy,
    ...getBuddyMeta(buddyId),
  };
}

export function getBuddyAvailableRequests(): BuddyRequestSummary[] {
  const latest = createLatestRequestSummary();
  const latestBooking = getLatestTripRequest();
  const state = getStoredBuddyFlowState();

  const requests = [...seedRequests];

  if (
    latest &&
    latestBooking &&
    latestBooking.bookingStatus === "OPEN" &&
    !latestBooking.selectedBuddyId &&
    !state.declinedInvitationIds.includes(latest.id)
  ) {
    requests.unshift(latest);
  }

  return requests;
}

export function getBuddyRequestById(requestId: string): BuddyRequestSummary | null {
  return getBuddyAvailableRequests().find((request) => request.id === requestId) ?? null;
}

export function getBuddyAppliedRequestIds() {
  return getStoredBuddyFlowState().appliedRequestIds;
}

export function applyToBuddyRequest(requestId: string) {
  const current = getStoredBuddyFlowState();
  if (current.appliedRequestIds.includes(requestId)) return current;

  const next = {
    ...current,
    appliedRequestIds: [...current.appliedRequestIds, requestId],
  };

  saveBuddyFlowState(next);
  return next;
}

export function getBuddyInvitation() {
  const latest = getLatestTripRequest();
  if (
    !latest ||
    latest.selectedBuddyId !== ACTIVE_BUDDY_ID ||
    latest.bookingStatus !== "PENDING_BUDDY_CONFIRMATION"
  ) {
    return null;
  }

  return latest;
}

export function acceptBuddyInvitation() {
  const invitation = getBuddyInvitation();
  if (!invitation) return null;

  return advanceBookingStatus(
    "MATCHED",
    "Buddy accepted the invitation and opened the collaboration chat.",
  );
}

export function declineBuddyInvitation() {
  const invitation = getBuddyInvitation();
  if (!invitation) return null;

  const current = getStoredBuddyFlowState();
  const next = {
    ...current,
    declinedInvitationIds: [...new Set([...current.declinedInvitationIds, invitation.id])],
  };

  saveBuddyFlowState(next);
  updateLatestTripRequest({ selectedBuddyId: null });
  return advanceBookingStatus(
    "OPEN",
    "Buddy declined the invitation. The request returned to the open pool.",
  );
}

export function submitBuddyProposal(proposal: ProposalData) {
  const updated = updateLatestTripProposal(proposal);
  if (!updated) return null;

  return advanceBookingStatus(
    "PROPOSAL_SENT",
    "Buddy sent a proposal update with final plan details.",
  );
}

export function confirmTripFromBuddy() {
  const latest = getLatestTripRequest();
  if (!latest) return null;

  const nextStatus: BookingStatus =
    latest.bookingStatus === "CONFIRMED" ? "IN_PROGRESS" : "CONFIRMED";

  return advanceBookingStatus(
    nextStatus,
    nextStatus === "IN_PROGRESS"
      ? "Buddy marked the trip as in progress."
      : "Buddy confirmed readiness after payment.",
  );
}

export function getBuddyWalletSnapshot(): WalletSnapshot {
  return {
    balance: 1280,
    payoutPending: 340,
    payoutCompleted: 5420,
    currentRating: 4.9,
    totalTrips: 124,
    commissionHistory: [
      { id: "COM-1", title: "Platform commission - Food night walk", amount: -18, date: "2026-03-08" },
      { id: "COM-2", title: "Platform commission - Cu Chi private day", amount: -24, date: "2026-03-04" },
      { id: "COM-3", title: "Platform commission - Coffee creative tour", amount: -12, date: "2026-02-28" },
    ],
    cashTripDeductions: [
      { id: "CASH-1", trip: "Saigon Rooftop Crawl", amount: -8, date: "2026-03-02" },
      { id: "CASH-2", trip: "Street Food Shortcut", amount: -6, date: "2026-02-26" },
    ],
    debts: [
      { id: "DEBT-1", title: "Pending cash settlement", amount: 40, due: "2026-03-15" },
    ],
  };
}

export function getBuddyDashboardData() {
  const buddy = getBuddyIdentity();
  const wallet = getBuddyWalletSnapshot();
  const availableRequests = getBuddyAvailableRequests();
  const latest = getLatestTripRequest();

  const upcomingTrips =
    latest &&
    latest.selectedBuddyId === ACTIVE_BUDDY_ID &&
    ["MATCHED", "PROPOSAL_SENT", "PAYMENT_PENDING", "CONFIRMED", "IN_PROGRESS"].includes(
      latest.bookingStatus,
    )
      ? [latest]
      : [];

  const waitingConfirmations =
    latest &&
    latest.selectedBuddyId === ACTIVE_BUDDY_ID &&
    latest.bookingStatus === "PENDING_BUDDY_CONFIRMATION"
      ? [latest]
      : [];

  return {
    buddy,
    wallet,
    availableRequests,
    upcomingTrips,
    waitingConfirmations,
  };
}
