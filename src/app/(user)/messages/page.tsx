import MessagesLayout from "@/components/chat/MessagesLayout";

export default function MessagesPage() {
  return (
    <main className="flex h-full min-h-0 max-h-full flex-1 flex-col overflow-hidden overscroll-none">
      <section className="flex h-full min-h-0 max-h-full flex-1 overflow-hidden overscroll-none">
        <MessagesLayout />
      </section>
    </main>
  );
}
