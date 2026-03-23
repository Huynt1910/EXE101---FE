import MessagesLayout from '@/components/chat/MessagesLayout';

export default function MessagesPage() {
  return (
    <section className="h-[calc(100dvh-80px)] overflow-hidden bg-[#fffbf8] md:h-[calc(100dvh-112px)]">
      <MessagesLayout />
    </section>
  );
}
