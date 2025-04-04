import ChatSidebar from '@/components/chat/chatSidebar';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="h-[calc(100vh_-_124px)] md:h-[calc(100vh_-_140px)] md:p-2">
      <div className="flex h-full rounded-sm border-neutral-400 lg:container md:border lg:mx-auto">
        <div className="hidden h-full md:block">
          <ChatSidebar />
        </div>
        <div className="w-full lg:w-[calc(100%_-_300px)]">{children}</div>
      </div>
    </main>
  );
}
