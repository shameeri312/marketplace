import ChatSidebar from '@/components/chat/chatSidebar';
import React from 'react';

const ChatPage = () => {
  return (
    <>
      <div className="hidden h-full w-full place-content-center md:grid">
        Open a chat
      </div>

      <div className="block h-full md:hidden">
        <ChatSidebar />
      </div>
    </>
  );
};

export default ChatPage;
