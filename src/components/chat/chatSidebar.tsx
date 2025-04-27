/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useEffect, useState } from 'react';
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
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Loading from '../loading/Loading';

const buttons = ['All', 'Unread', 'Important'];
const colorNames = ['red', 'green', 'blue', 'orange', 'yellow'];

const ChatSidebar = () => {
  const { chatColor, setChatColor, colorOptions } = useChatColorStore();
  const [filter, setFilter] = useState<string>('All');
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const { data: session }: any = useSession();
  const router = useRouter();

  // Fetch chats from the API
  const getChats = async () => {
    try {
      const res = await axios.get('/api/messages');
      if (res.status === 200) {
        setChats(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user) {
      getChats();
    }
  }, [session?.user]);

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
      {loading ? (
        <Loading />
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ul className="flex flex-col">
            {chats.length > 0 ? (
              chats.map((chat: Chat, index: number) => {
                // For now, we don't have messages in the Chat model; adjust if needed
                const messages = []; // Placeholder; update if you add messages to Chat model

                const user = chat.participants?.filter(
                  (p) =>
                    p !==
                    session?.user?.firstName + ' ' + session?.user?.lastName
                )[0];

                console.log(chat.participants);

                return (
                  <li
                    className="flex h-16 cursor-pointer items-center border-b border-neutral-400 px-2 hover:bg-neutral-100"
                    key={index}
                    onClick={() => {
                      // Navigate to the chat room using the chat's name as the roomId
                      router.push(`/chat/${chat?.chatId}?user=${user}`);
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
                      <p
                        className={`truncate text-wrap text-base ${messages.length > 0 ? 'font-bold' : 'font-medium'}`}
                      >
                        {user}
                      </p>
                      <p className="text-xs font-light">
                        {messages.length > 0 ? 'New Message' : 'No Messages'}
                      </p>
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
      )}
    </div>
  );
};

export default ChatSidebar;
