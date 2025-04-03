import ChatSidebar from '@/components/chat/chatSidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-[calc(100vh_-_140px)] p-2">
      <div className="flex h-full rounded-sm border border-neutral-400 lg:container lg:mx-auto">
        <ChatSidebar />
        <div className="w-full lg:w-[calc(100%_-_300px)]">{children}</div>
      </div>
    </main>
  );
}
