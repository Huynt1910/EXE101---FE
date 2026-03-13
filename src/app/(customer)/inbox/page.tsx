"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Archive,
  Star,
  ArrowLeft,
  X,
  FileText,
  BadgeDollarSign,
  MapPin,
  Users,
  CalendarClock,
} from "lucide-react";

type Mode = "list" | "chat";

type BookingStatus =
  | "MATCHED"
  | "PROPOSAL_SENT"
  | "PAYMENT_PENDING"
  | "CONFIRMED";

type Proposal = {
  startTime: string;
  meetingPoint: string;
  groupSize: number;
  finalPrice: number;
};

type MessageType = "text" | "proposal" | "system";

type ChatMessage = {
  id: number;
  sender: string;
  time: string;
  isOwn: boolean;
  type: MessageType;
  text?: string;
  proposal?: Proposal;
};

type Conversation = {
  id: number;
  name: string;
  lastMessage: string;
  time: string;
  unread: number;
  image: string;
  activity: string;
  status: "active" | "archived";
  bookingStatus: BookingStatus;
};

type ProposalFormState = {
  startTime: string;
  meetingPoint: string;
  groupSize: number;
  finalPrice: number;
};

const initialConversations: Conversation[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    lastMessage: "Thank you for the amazing tour!",
    time: "2 hours ago",
    unread: 2,
    image: "/vietnamese-woman.jpg",
    activity: "Street Food Tour in Hanoi",
    status: "active",
    bookingStatus: "MATCHED",
  },
  {
    id: 2,
    name: "Michael Chen",
    lastMessage: "Can we reschedule to the 19th?",
    time: "5 hours ago",
    unread: 1,
    image: "/vietnamese-man.jpg",
    activity: "Motorbike Adventure",
    status: "active",
    bookingStatus: "MATCHED",
  },
  {
    id: 3,
    name: "Emma Wilson",
    lastMessage: "The cooking class was incredible!",
    time: "1 day ago",
    unread: 0,
    image: "/vietnamese-chef.jpg",
    activity: "Traditional Cooking Class",
    status: "archived",
    bookingStatus: "CONFIRMED",
  },
  {
    id: 4,
    name: "James Rodriguez",
    lastMessage: "Is the activity suitable for beginners?",
    time: "2 days ago",
    unread: 0,
    image: "/placeholder.svg",
    activity: "Sunrise Hike & Meditation",
    status: "active",
    bookingStatus: "MATCHED",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    lastMessage: "Looking forward to the experience!",
    time: "3 days ago",
    unread: 0,
    image: "/placeholder.svg",
    activity: "Kayaking in Phong Nha Cave",
    status: "active",
    bookingStatus: "MATCHED",
  },
];

const initialMessagesByConversation: Record<number, ChatMessage[]> = {
  1: [
    {
      id: 1,
      sender: "Sarah Johnson",
      text: "Hi! I'm excited about the food tour. Do you have any dietary restrictions I should know about?",
      time: "2 hours ago",
      isOwn: false,
      type: "text",
    },
    {
      id: 2,
      sender: "You",
      text: "Hi Sarah! Great question. We can accommodate vegetarian, vegan, and gluten-free diets. Just let me know your preferences!",
      time: "1 hour ago",
      isOwn: true,
      type: "text",
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      text: "Perfect! I'm vegetarian. See you on the 15th!",
      time: "1 hour ago",
      isOwn: false,
      type: "text",
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      text: "Thank you for the amazing tour!",
      time: "30 minutes ago",
      isOwn: false,
      type: "text",
    },
  ],
  2: [
    {
      id: 5,
      sender: "Michael Chen",
      text: "Hi, can we reschedule the trip to the 19th?",
      time: "5 hours ago",
      isOwn: false,
      type: "text",
    },
  ],
  3: [
    {
      id: 6,
      sender: "Emma Wilson",
      text: "The cooking class was incredible!",
      time: "1 day ago",
      isOwn: false,
      type: "text",
    },
  ],
  4: [
    {
      id: 7,
      sender: "James Rodriguez",
      text: "Is the activity suitable for beginners?",
      time: "2 days ago",
      isOwn: false,
      type: "text",
    },
  ],
  5: [
    {
      id: 8,
      sender: "Lisa Anderson",
      text: "Looking forward to the experience!",
      time: "3 days ago",
      isOwn: false,
      type: "text",
    },
  ],
};

function getRelativeNowLabel() {
  return "Just now";
}

function formatTripRequestDateTime(value: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function getBookingStatusLabel(status: BookingStatus) {
  switch (status) {
    case "MATCHED":
      return "Matched";
    case "PROPOSAL_SENT":
      return "Proposal sent";
    case "PAYMENT_PENDING":
      return "Payment pending";
    case "CONFIRMED":
      return "Confirmed";
    default:
      return status;
  }
}

function ProposalMessageCard({
  proposal,
  bookingStatus,
  onConfirm,
  onReject,
  isOwn,
}: {
  proposal: Proposal;
  bookingStatus: BookingStatus;
  onConfirm: () => void;
  onReject: () => void;
  isOwn: boolean;
}) {
  return (
    <div
      className={`mt-1 rounded-2xl border p-4 ${
        isOwn
          ? "border-primary-foreground/20 bg-primary-foreground/10"
          : "border-border bg-background/80"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">Trip proposal</p>
          <p className="text-xs opacity-80">
            Review the final details before payment.
          </p>
        </div>
        <div className="rounded-full border px-3 py-1 text-[11px] font-medium">
          {getBookingStatusLabel(bookingStatus)}
        </div>
      </div>

      <div className="grid gap-3 text-sm md:grid-cols-2">
        <div className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 shrink-0 opacity-80" />
          <span>
            Start:{" "}
            <span className="font-medium">
              {formatTripRequestDateTime(proposal.startTime)}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0 opacity-80" />
          <span>
            Meeting point:{" "}
            <span className="font-medium">{proposal.meetingPoint}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 shrink-0 opacity-80" />
          <span>
            Group size:{" "}
            <span className="font-medium">{proposal.groupSize}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BadgeDollarSign className="h-4 w-4 shrink-0 opacity-80" />
          <span>
            Final price:{" "}
            <span className="font-medium">${proposal.finalPrice}</span>
          </span>
        </div>
      </div>

      {!isOwn && (
        <div className="mt-4 flex flex-wrap gap-3">
          <Button
            type="button"
            className="rounded-full px-5"
            disabled={bookingStatus !== "PROPOSAL_SENT"}
            onClick={onConfirm}
          >
            Confirm
          </Button>

          <Button
            type="button"
            variant="outline"
            className="rounded-full px-5"
            disabled={bookingStatus !== "PROPOSAL_SENT"}
            onClick={onReject}
          >
            Reject
          </Button>
        </div>
      )}
    </div>
  );
}

function ProposalModal({
  open,
  onClose,
  onSubmit,
  defaultGroupSize = 2,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (proposal: ProposalFormState) => void;
  defaultGroupSize?: number;
}) {
  const [form, setForm] = useState<ProposalFormState>({
    startTime: "",
    meetingPoint: "",
    groupSize: defaultGroupSize,
    finalPrice: 25,
  });

  useEffect(() => {
    if (open) {
      setForm({
        startTime: "",
        meetingPoint: "",
        groupSize: defaultGroupSize,
        finalPrice: 25,
      });
    }
  }, [open, defaultGroupSize]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.startTime || !form.meetingPoint.trim()) return;
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Create trip proposal
            </h3>
            <p className="text-sm text-muted-foreground">
              Send the final booking details directly in this chat.
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Start time
            </label>
            <Input
              type="datetime-local"
              value={form.startTime}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, startTime: e.target.value }))
              }
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Meeting point
            </label>
            <Input
              placeholder="Ben Thanh Market main gate"
              value={form.meetingPoint}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, meetingPoint: e.target.value }))
              }
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Group size
              </label>
              <Input
                type="number"
                min={1}
                value={form.groupSize}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    groupSize: Number(e.target.value),
                  }))
                }
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Final price
              </label>
              <Input
                type="number"
                min={1}
                value={form.finalPrice}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    finalPrice: Number(e.target.value),
                  }))
                }
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              <FileText className="mr-2 h-4 w-4" />
              Send proposal
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InboxPage() {
  const router = useRouter();

  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMode, setMobileMode] = useState<Mode>("list");
  const [proposalModalOpen, setProposalModalOpen] = useState(false);

  const [conversations, setConversations] =
    useState<Conversation[]>(initialConversations);

  const [messagesByConversation, setMessagesByConversation] = useState<
    Record<number, ChatMessage[]>
  >(initialMessagesByConversation);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");

    const updateFromMediaQuery = (media: MediaQueryList) => {
      setIsMobile(media.matches);
      setMobileMode(media.matches ? "list" : "chat");
    };

    updateFromMediaQuery(mq);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
      setMobileMode(e.matches ? "list" : "chat");
    };

    mq.addEventListener("change", handleChange);

    return () => {
      mq.removeEventListener("change", handleChange);
    };
  }, []);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedConversation) || null,
    [conversations, selectedConversation],
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.activity.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [conversations, searchQuery],
  );

  const currentMessages = selectedConversation
    ? messagesByConversation[selectedConversation] || []
    : [];

  const updateConversationPreview = (
    conversationId: number,
    payload: Partial<Conversation>,
  ) => {
    setConversations((prev) =>
      prev.map((conv) =>
        conv.id === conversationId ? { ...conv, ...payload } : conv,
      ),
    );
  };

  const appendMessage = (conversationId: number, message: ChatMessage) => {
    setMessagesByConversation((prev) => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), message],
    }));
  };

  const openConversation = (id: number) => {
    setSelectedConversation(id);
    if (isMobile) setMobileMode("chat");

    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, unread: 0 } : conv)),
    );
  };

  const backToList = () => {
    if (isMobile) setMobileMode("list");
  };

  const advanceBookingStatus = (
    conversationId: number,
    nextStatus: BookingStatus,
    systemText: string,
  ) => {
    updateConversationPreview(conversationId, {
      bookingStatus: nextStatus,
      lastMessage: systemText,
      time: getRelativeNowLabel(),
    });

    appendMessage(conversationId, {
      id: Date.now(),
      sender: "System",
      text: systemText,
      time: getRelativeNowLabel(),
      isOwn: false,
      type: "system",
    });
  };

  const handleSendMessage = () => {
    if (!selectedConversation || !messageText.trim()) return;

    const trimmed = messageText.trim();

    appendMessage(selectedConversation, {
      id: Date.now(),
      sender: "You",
      text: trimmed,
      time: getRelativeNowLabel(),
      isOwn: true,
      type: "text",
    });

    updateConversationPreview(selectedConversation, {
      lastMessage: trimmed,
      time: getRelativeNowLabel(),
    });

    setMessageText("");
  };

  const handleTextareaKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateProposal = (proposalForm: ProposalFormState) => {
    if (!selectedConversation) return;

    const proposal: Proposal = {
      startTime: new Date(proposalForm.startTime).toISOString(),
      meetingPoint: proposalForm.meetingPoint,
      groupSize: proposalForm.groupSize,
      finalPrice: proposalForm.finalPrice,
    };

    appendMessage(selectedConversation, {
      id: Date.now(),
      sender: "You",
      time: getRelativeNowLabel(),
      isOwn: true,
      type: "proposal",
      proposal,
    });

    advanceBookingStatus(
      selectedConversation,
      "PROPOSAL_SENT",
      "A trip proposal has been sent in inbox.",
    );

    setProposalModalOpen(false);
  };

  const handleConfirmProposal = () => {
    if (!selectedConversation) return;

    advanceBookingStatus(
      selectedConversation,
      "PAYMENT_PENDING",
      "Customer confirmed the proposal in inbox and is ready to pay.",
    );

    router.push("/booking-payment");
  };

  const handleRejectProposal = () => {
    if (!selectedConversation) return;

    advanceBookingStatus(
      selectedConversation,
      "MATCHED",
      "Customer rejected the proposal in inbox and requested a revision.",
    );
  };

  return (
    <>
      <div className="bg-background">
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-3">
          <div
            className={`lg:col-span-1 flex flex-col bg-card rounded-bl-lg rounded-tl-lg border border-border overflow-hidden ${
              isMobile ? (mobileMode === "list" ? "block" : "hidden") : "block"
            }`}
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Messages
              </h2>

              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredConversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => openConversation(conv.id)}
                  className={`w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors ${
                    selectedConversation === conv.id && !isMobile
                      ? "bg-muted"
                      : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img
                        src={conv.image || "/placeholder.svg"}
                        alt={conv.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      {conv.unread > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                          {conv.unread}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3
                          className={`font-medium text-sm ${
                            conv.unread > 0
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {conv.name}
                        </h3>
                        <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {getBookingStatusLabel(conv.bookingStatus)}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground truncate">
                        {conv.activity}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          conv.unread > 0
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {conv.lastMessage}
                      </p>
                    </div>

                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {conv.time}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div
            className={`lg:col-span-2 flex flex-col bg-card border border-border overflow-hidden ${
              isMobile ? (mobileMode === "chat" ? "flex" : "hidden") : "flex"
            }`}
          >
            {selectedConv ? (
              <>
                <div className="p-4 border-b border-border flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {isMobile && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mr-1"
                        onClick={backToList}
                        aria-label="Back to conversations"
                      >
                        <ArrowLeft className="w-5 h-5" />
                      </Button>
                    )}

                    <img
                      src={selectedConv.image || "/placeholder.svg"}
                      alt={selectedConv.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      <h3 className="font-semibold text-foreground">
                        {selectedConv.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-xs text-muted-foreground">
                          {selectedConv.activity}
                        </p>
                        <span className="rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {getBookingStatusLabel(selectedConv.bookingStatus)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setProposalModalOpen(true)}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Create proposal
                    </Button>

                    <Button variant="ghost" size="sm">
                      <Star className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {currentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.type === "system"
                          ? "justify-center"
                          : msg.isOwn
                            ? "justify-end"
                            : "justify-start"
                      }`}
                    >
                      {msg.type === "system" ? (
                        <div className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">
                          {msg.text}
                        </div>
                      ) : (
                        <div
                          className={`max-w-[88%] sm:max-w-xl rounded-2xl px-4 py-3 ${
                            msg.isOwn
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          {msg.type === "text" && (
                            <p className="text-sm leading-6">{msg.text}</p>
                          )}

                          {msg.type === "proposal" && msg.proposal && (
                            <ProposalMessageCard
                              proposal={msg.proposal}
                              bookingStatus={selectedConv.bookingStatus}
                              onConfirm={handleConfirmProposal}
                              onReject={handleRejectProposal}
                              isOwn={msg.isOwn}
                            />
                          )}

                          <p
                            className={`text-[11px] mt-2 ${
                              msg.isOwn ? "opacity-70" : "text-muted-foreground"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" aria-label="Attach">
                      <Paperclip className="w-4 h-4" />
                    </Button>

                    <Textarea
                      placeholder="Type your message."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleTextareaKeyDown}
                      className="resize-none"
                      rows={3}
                    />

                    <Button
                      size="sm"
                      className="self-end"
                      aria-label="Send"
                      onClick={handleSendMessage}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">
                  Select a conversation to start messaging
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProposalModal
        open={proposalModalOpen}
        onClose={() => setProposalModalOpen(false)}
        onSubmit={handleCreateProposal}
      />
    </>
  );
}
