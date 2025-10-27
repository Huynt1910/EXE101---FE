"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";

type Mode = "list" | "chat"; // chỉ dùng cho mobile

export default function InboxPage() {
  const [selectedConversation, setSelectedConversation] = useState<
    number | null
  >(1);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMode, setMobileMode] = useState<Mode>("list");

  // --- Demo data (giữ nguyên) ---
  const conversations = [
    {
      id: 1,
      name: "Sarah Johnson",
      lastMessage: "Thank you for the amazing tour!",
      time: "2 hours ago",
      unread: 2,
      image: "/vietnamese-woman.jpg",
      activity: "Street Food Tour in Hanoi",
      status: "active",
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
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Sarah Johnson",
      text: "Hi! I'm excited about the food tour. Do you have any dietary restrictions I should know about?",
      time: "2 hours ago",
      isOwn: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Hi Sarah! Great question. We can accommodate vegetarian, vegan, and gluten-free diets. Just let me know your preferences!",
      time: "1 hour ago",
      isOwn: true,
    },
    {
      id: 3,
      sender: "Sarah Johnson",
      text: "Perfect! I'm vegetarian. See you on the 15th!",
      time: "1 hour ago",
      isOwn: false,
    },
    {
      id: 4,
      sender: "Sarah Johnson",
      text: "Thank you for the amazing tour!",
      time: "30 minutes ago",
      isOwn: false,
    },
  ];

  // --- Detect mobile (md breakpoint trở xuống) ---
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)"); // tailwind md=768, lg=1024; ta coi <1024 là mobile/tablet dọc
    const handler = (e: MediaQueryListEvent | MediaQueryList) => {
      const mobile = "matches" in e ? e.matches : (e as MediaQueryList).matches;
      setIsMobile(mobile);
      // Khi chuyển từ desktop -> mobile: nếu đang có cuộc trò chuyện thì mặc định vào list trước
      setMobileMode(mobile ? "list" : "chat");
    };
    handler(mq); // init
    mq.addEventListener?.("change", handler as any);
    return () => mq.removeEventListener?.("change", handler as any);
  }, []);

  const selectedConv = useMemo(
    () => conversations.find((c) => c.id === selectedConversation) || null,
    [selectedConversation]
  );

  const filteredConversations = useMemo(
    () =>
      conversations.filter(
        (conv) =>
          conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.activity.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [conversations, searchQuery]
  );

  // Khi click 1 hội thoại (mobile -> chuyển sang chat)
  const openConversation = (id: number) => {
    setSelectedConversation(id);
    if (isMobile) setMobileMode("chat");
  };

  // Nút back (chỉ hiện trên mobile)
  const backToList = () => {
    if (isMobile) setMobileMode("list");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Desktop: grid 2 cột; Mobile: chỉ show 1 cột (list hoặc chat) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* LIST PANE */}
          <div
            className={
              // Desktop: luôn hiển thị cột list (span 1)
              // Mobile: chỉ hiển thị khi ở mode "list"
              `lg:col-span-1 flex flex-col bg-card rounded-lg border border-border overflow-hidden
               ${
                 isMobile
                   ? mobileMode === "list"
                     ? "block"
                     : "hidden"
                   : "block"
               }`
            }
          >
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Messages
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
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
                      <h3
                        className={`font-medium text-sm ${
                          conv.unread > 0
                            ? "text-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        {conv.name}
                      </h3>
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

          {/* CHAT PANE */}
          <div
            className={
              // Desktop: luôn chiếm 2 cột
              // Mobile: chỉ hiển thị khi ở mode "chat"
              `lg:col-span-2 flex flex-col bg-card rounded-lg border border-border overflow-hidden
               ${
                 isMobile ? (mobileMode === "chat" ? "flex" : "hidden") : "flex"
               }`
            }
          >
            {selectedConv ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Back button chỉ hiện trên mobile */}
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
                      <p className="text-xs text-muted-foreground">
                        {selectedConv.activity}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
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

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-xs px-4 py-2 rounded-2xl ${
                          msg.isOwn
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-[11px] mt-1 ${
                            msg.isOwn ? "opacity-70" : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" aria-label="Attach">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                    <Button size="sm" className="self-end" aria-label="Send">
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
    </div>
  );
}
