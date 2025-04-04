'use client';
import React, { useState } from 'react';
import { chats } from '@/lib/data';
import { Chat } from '@/lib/definitions';
import { User } from 'lucide-react';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import useChatColorStore from '@/zustand/colors/store';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const buttons = ['All', 'Unread', 'Important'];
const colorNames = ['red', 'green', 'blue', 'orange', 'yellow'];

const ChatSidebar = () => {
  const { chatColor, setChatColor, colorOptions } = useChatColorStore();
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
    <div className="flex h-full flex-col md:w-[300px] md:border-r md:border-neutral-400 lg:w-[350px]">
      <div className="flex h-16 items-center justify-between rounded-tl-sm rounded-tr-sm border-b border-neutral-400 bg-secondary px-3 md:rounded-tr-none">
        <h2 className="text-3xl font-bold">Inbox</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-sm border bg-white px-2 py-1 text-sm shadow-sm outline-none ring-0">
              Theme
              <span
                className="h-4 w-4 rounded-full"
                style={{ backgroundColor: chatColor }}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="border border-neutral-200 bg-background shadow-md dark:border-neutral-700">
            <div>
              {colorOptions.map((color, index) => (
                <DropdownMenuItem
                  key={color}
                  className="size-7 w-full text-secondary-foreground"
                  onClick={() => setChatColor(color)}
                >
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span>{colorNames[index]}</span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters Section */}
      <div className="rounded-tl-sm border-b border-neutral-400 p-3">
        <h6 className="text-sm font-light">Filters</h6>
        <div className="flex flex-wrap gap-1 py-1">
          {buttons.map((btn) => {
            const isActive = filter === btn;
            const buttonStyle = isActive ? { background: chatColor } : {};

            return (
              <Badge
                variant={isActive ? 'default' : 'outline'}
                // size="sm"
                className={`py-1 !text-xs ${isActive ? 'font-bold' : 'font-light'}`}
                style={buttonStyle}
                key={btn}
                onClick={() => setFilter(btn)}
              >
                {btn}
              </Badge>
            );
          })}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
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
                    router.push(`/chat/12-1`);
                  }}
                >
                  <User
                    style={{
                      color: chatColor,
                      background: chatColor + '1d',
                      borderColor: chatColor,
                    }}
                    className="size-12 rounded-full border p-2 text-white"
                  />
                  <div className="ml-2 flex flex-1 flex-col">
                    <span
                      className={`text-base ${messages.length > 0 ? 'font-bold' : 'font-medium'}`}
                    >
                      {chat.chat_name}
                    </span>
                    <span className="text-xs font-light">
                      {messages.length > 0 ? 'New Message' : 'No Messages'}
                    </span>
                  </div>
                  {messages.length > 0 && (
                    <Badge
                      className="grid size-4 h-auto place-content-center"
                      style={{
                        background: chatColor,
                      }}
                    >
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
