'use client';
import {
  X,
  EllipsisVertical,
  Link as LinkIcon,
  Search,
  Send,
  User,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { motion } from 'framer-motion'; // Reintroduce for smooth animations
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { chats } from '@/lib/data';
import Link from 'next/link';
import useChatColorStore from '@/zustand/colors/store';

const formSchema = z.object({
  message: z.string().min(1),
});

interface ChatMessage {
  sender: 'user' | 'bot';
  type: 'message' | 'image' | 'link';
  message: string;
  time: string;
  image?: string;
  link?: string;
  message_id?: string; // Add message_id for uniqueness
}

const oldMessages: ChatMessage[] = [
  {
    sender: 'user',
    type: 'message',
    message: 'Hey, how are you?',
    time: '10:00 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: "I'm good! How about you?",
    time: '10:01 AM',
  },
  // ... (rest of your messages)
];

const Chat = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatName, setChatName] = useState<string>('');
  const { chatColor } = useChatColorStore();
  const [ws, setWs] = useState<WebSocket | null>(null); // WebSocket state
  // const [uuid] = useState<string | null>(localStorage.getItem('uuid')); // User ID from localStorage

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial messages
    setMessages(oldMessages);

    // Fetch chat name
    const fetchChatName = async () => {
      setChatName('OK');
    };

    fetchChatName();

    // WebSocket setup
    if (id) {
      const socket = new WebSocket(
        `ws://192.168.100.17:8008/ws/chat/${id}/?user_id=88` // Updated to match your Daphne server
      );

      socket.onopen = () => {
        console.log('WebSocket connection established');
        setWs(socket);
      };

      socket.onerror = (event) => {
        console.error('WebSocket connection error', event);
        toast.error('Failed to connect to chat server.');
      };

      socket.onmessage = (event) => {
        console.log('Message received:', event.data);

        try {
          const data = JSON.parse(event.data);

          if (data.room) {
            // Handle room ID if needed (optional)
            console.log('Room ID received:', data.room);
          } else {
            setMessages((prevMessages) => {
              const isDuplicate = prevMessages.some(
                (msg) => msg.message_id === data.message_id
              );

              if (!isDuplicate && data.message) {
                return [
                  {
                    ...data,
                    time: new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    }),
                  },
                  ...prevMessages,
                ];
              }

              return prevMessages;
            });
          }
        } catch (error) {
          console.error('Error parsing message', error);
        }
      };

      // Cleanup
      return () => {
        console.log('Closing WebSocket connection');
        socket.close();
      };
    }
  }, [id]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newMessage = values.message;
    if (!newMessage.trim() || !ws) return;

    try {
      const messageObject: ChatMessage = {
        sender: 'user',
        message: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'message',
      };

      // Send message via WebSocket
      ws.send(JSON.stringify({ body: newMessage }));

      // Optimistically update UI
      setMessages((prevMessages) => [messageObject, ...prevMessages]);

      form.reset({
        message: '',
      });
    } catch (error) {
      console.error('Form submission error', error);
      toast.error('Failed to send the message.');
    }
  }

  if (!chatName) return null;

  return (
    <div className="flex h-full w-full flex-col justify-between">
      {/* Header */}
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
              background: chatColor + '1d',
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

      {/* Chat Messages */}
      <div
        ref={chatRef}
        className="flex flex-1 flex-col space-y-4 overflow-y-auto p-4"
      >
        <>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div>
                <p
                  className={`flex font-semibold ${msg.sender === 'user' ? 'justify-end pr-2' : 'justify-start pl-2'}`}
                >
                  {msg.sender === 'user' ? 'You' : chatName}
                </p>
                <div
                  className={`max-w-xs ${msg.sender === 'user' ? '' : 'bg-neutral-200'} rounded-md p-2 md:rounded-lg lg:p-3`}
                  style={{
                    background: msg.sender === 'user' ? chatColor : '',
                  }}
                >
                  {msg.type === 'message' && (
                    <p className="text-sm md:text-base">{msg.message}</p>
                  )}
                  {msg.type === 'image' && msg.image && (
                    <img
                      src={msg.image}
                      alt="Sent media"
                      className="w-full rounded-lg"
                    />
                  )}
                  {msg.type === 'link' && msg.link && (
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-300 underline"
                    >
                      {msg.message}
                    </a>
                  )}
                  <span className="mt-1 block w-max text-xs text-neutral-700">
                    {msg.time}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </>
      </div>

      {/* Footer */}
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
                      placeholder="Enter message..."
                      className="h-full flex-1 outline-none !ring-0"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button
              size={'icon'}
              className="size-10 rounded-full"
              style={{ background: chatColor }}
              variant={'default'}
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
