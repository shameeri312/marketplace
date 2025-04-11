/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import {
  X,
  EllipsisVertical,
  Link as LinkIcon,
  Search,
  Send,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Link from 'next/link';
import useChatColorStore from '@/zustand/colors/store';
import { useSession } from 'next-auth/react';
import Loading from '../loading/Loading';
import { socket } from '@/lib/socketClient';
import ChatMessage from './chatMessage';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty' }),
});

const Chat = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [chatName, setChatName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { chatColor } = useChatColorStore();
  const { data: session }: any = useSession();
  const [roomId, setRoomId] = useState<string>(id); // Initialize with id ("12-1")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Fetch previous messages from the database
  const fetchPreviousMessages = useCallback(async () => {
    try {
      const res = await fetch(`/api/messages?type=messages&roomId=${roomId}`);
      if (!res.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await res.json();
      setMessages(data); // Set initial messages from DB
    } catch (error) {
      console.error('Error fetching previous messages:', error);
      toast.error('Failed to load previous messages');
    }
  }, [roomId]);

  // Handle incoming messages via Socket.IO
  const handleNewMessage = useCallback((data: any) => {
    setMessages((prevMessages) => [...prevMessages, data]);
  }, []);

  // Initialize chat: Join room, fetch messages, set up listeners
  useEffect(() => {
    setRoomId(id); // Update roomId when id prop changes

    const initializeChat = async () => {
      if (!roomId) {
        toast.error('No room ID provided');
        setLoading(false);
        return;
      }

      try {
        // Set chatName from session or localStorage
        const nameFromSession = session?.user?.name || 'Anonymous';
        const storedName = localStorage.getItem('chat_name');
        const finalChatName =
          storedName || nameFromSession || `User_${Date.now()}`;
        setChatName(finalChatName);
        localStorage.setItem('chat_name', finalChatName);

        // Join the room
        socket.emit('join-room', { roomId, userName: finalChatName });

        // Fetch previous messages from DB
        await fetchPreviousMessages();

        // Listen for new messages
        socket.on('message', handleNewMessage);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing chat:', error);
        toast.error('Error connecting to the chat server');
        setLoading(false);
      }
    };

    initializeChat();

    // Cleanup on unmount
    return () => {
      socket.off('message', handleNewMessage);
      socket.emit('leave-room', { roomId, chatName });
    };
  }, [id, session, handleNewMessage, fetchPreviousMessages]);

  // Handle form submission: Send message via API and Socket.IO
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const message = values.message;

    try {
      const data = { roomId, message, sender: chatName, timestamp: new Date() };

      // Optimistically update UI
      setMessages((prevMessages) => [...prevMessages, data]);

      // Send message via Socket.IO for real-time update
      socket.emit('message', data);

      // Reset form and focus input
      form.reset({ message: '' });

      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      // Revert optimistic update if send fails
      setMessages((prevMessages) => prevMessages.slice(0, -1));
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="flex h-full w-full flex-col justify-between">
      <div className="flex h-16 items-center justify-between rounded-tr-sm border-b border-neutral-400 px-3">
        <div className="flex items-center gap-2">
          <Link href={'/chat'}>
            <Button
              size={'icon'}
              className="size-7 bg-white"
              variant={'outline'}
            >
              <X />
            </Button>
          </Link>
          <User
            style={{
              color: chatColor,
              background: `${chatColor}1d`,
              borderColor: chatColor,
            }}
            className="size-12 rounded-full border p-2 text-white"
          />
          <h2 className="text-lg font-medium">{chatName}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size={'icon'} className="size-7 bg-white" variant={'outline'}>
            <Search />
          </Button>
          <Button size={'icon'} className="size-7 bg-white" variant={'outline'}>
            <EllipsisVertical />
          </Button>
        </div>
      </div>

      <div
        ref={chatRef}
        className="flex-1 flex-col space-y-4 overflow-y-auto p-4"
      >
        {messages.map((msg, i) => (
          <ChatMessage
            key={i}
            color={chatColor}
            sender={msg.sender}
            message={msg.message}
            isOwnMessage={msg.sender === chatName}
            timestamp={msg.timestamp}
          />
        ))}
        <div ref={chatRef} />
      </div>

      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex h-16 items-center justify-between gap-2 rounded-br-sm border-t border-neutral-400 px-3 py-1"
          >
            <Button
              size={'icon'}
              className="size-8 rounded-full"
              variant={'ghost'}
            >
              <LinkIcon />
            </Button>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem className="h-full flex-1">
                  <FormControl>
                    <Input
                      {...field}
                      ref={inputRef}
                      placeholder="Enter message..."
                      className="h-full flex-1 outline-none !ring-0"
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              size={'icon'}
              className="size-10 rounded-full"
              style={{ background: chatColor }}
              type="submit"
            >
              <Send />
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Chat;
