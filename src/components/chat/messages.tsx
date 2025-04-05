/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useRef } from 'react';
import MessageBox from './messageBox';

const Messages = ({
  messages,
  userId,
  chatName,
}: {
  messages: any[];
  userId: string;
  chatName: string;
}) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  console.log(messages);

  useEffect(() => {
    const timeout = setTimeout(() => {
      endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 400);
    return () => clearTimeout(timeout);
  }, [messages]);

  const reversed = [...messages].reverse();

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-y-auto">
      {reversed.map((message, index) => (
        <MessageBox
          key={index}
          created={message.created_at}
          text={message.body}
          userid={userId}
          chatName={chatName}
          sender={message.sender}
        />
      ))}
      <div ref={endOfMessagesRef}></div>
    </div>
  );
};

export default Messages;
