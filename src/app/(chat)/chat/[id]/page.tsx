import Chat from '@/components/chat/chat';
import React from 'react';

interface Params {
  id: string;
}

const ChatPage = async ({ params }: { params: Promise<Params> }) => {
  const id = decodeURIComponent((await params)?.id);

  return (
    <>
      <Chat id={id} />
    </>
  );
};

export default ChatPage;
