'use client';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { chats } from '@/lib/data';
import { Chat } from '@/lib/definitions';
import { User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';

const buttons = ['All', 'Unread', 'Important'];

const ChatSidebar = () => {
  const [filter, setFilter] = useState<string>('All');
  const router = useRouter();

  // Sorting chats: Chats with messages come first
  const sortedChats = [...chats].sort((a, b) => {
    const aHasMessages = a.messages && a.messages.length > 0;
    const bHasMessages = b.messages && b.messages.length > 0;
    return Number(bHasMessages) - Number(aHasMessages);
  });

  // Filtering chats based on the selected filter
  const filteredChats = sortedChats.filter((chat) => {
    if (filter === 'Unread') return chat.messages?.length ?? 0 > 0;
    if (filter === 'Important') return chat.is_important; // Assuming chat has `isImportant`
    return true; // 'All' case
  });

  return (
    <div className="hidden h-full flex-col border-r border-neutral-400 lg:flex lg:w-[300px]">
      <div className="flex h-16 items-center rounded-tl-sm border-b border-neutral-400 bg-secondary px-3">
        <h2 className="text-3xl font-bold">Inbox</h2>
      </div>

      {/* Filters Section */}
      <div className="rounded-tl-sm border-b border-neutral-400 p-3">
        <h6 className="text-sm font-light">Filters</h6>
        <div className="flex flex-wrap gap-1 py-1">
          {buttons.map((button) => (
            <Button
              variant={filter === button ? 'default' : 'outline'}
              size="sm"
              className="h-8 !text-xs font-light"
              key={button}
              onClick={() => setFilter(button)}
            >
              {button}
            </Button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div>
        <ul className="flex flex-col">
          {filteredChats.length > 0 ? (
            filteredChats.map((chat: Chat, index: number) => {
              const messages = chat.messages ?? [];

              return (
                <li
                  className="flex h-16 cursor-pointer items-center border-b border-neutral-400 px-2 hover:bg-neutral-100"
                  key={index}
                  onClick={() => {
                    // Handle chat click
                    router.push(`/chat/${chat.chat_id}`);
                  }}
                >
                  <User className="size-10 rounded-full bg-neutral-700 p-1 text-white" />
                  <div className="ml-2 flex flex-1 flex-col">
                    <span
                      className={`text-sm ${messages.length > 0 ? 'font-bold' : 'font-medium'}`}
                    >
                      {chat.chat_name}
                    </span>
                    <span className="text-xs font-light">
                      {messages.length > 0 ? 'New Message' : 'No Messages'}
                    </span>
                  </div>
                  {messages.length > 0 && (
                    <Badge className="grid size-4 h-auto place-content-center">
                      {messages.length}
                    </Badge>
                  )}
                </li>
              );
            })
          ) : (
            <p className="p-3 text-center text-sm text-gray-500">
              No chats found for this filter.
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ChatSidebar;
