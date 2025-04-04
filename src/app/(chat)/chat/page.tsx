import ChatSidebar from '@/components/chat/chatSidebar';
import React from 'react';

const Chats = () => {
  return (
    <div className="h-full">
      <div className="hidden h-full w-full place-content-center md:grid">
        Open a chat
      </div>

      <div className="block h-full w-full md:hidden">
        <ChatSidebar />
      </div>
    </div>
  );
};

export default Chats;
