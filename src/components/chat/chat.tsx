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

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { chats } from '@/lib/data';
import Link from 'next/link';

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
  {
    sender: 'user',
    type: 'message',
    message: 'Doing great! What can you do?',
    time: '10:02 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: 'I can chat with you, answer questions, and more!',
    time: '10:03 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: "That's cool! Tell me a joke.",
    time: '10:04 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message:
      "Sure! Why don't skeletons fight each other? Because they don't have the guts!",
    time: '10:05 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: "Haha! That's funny.",
    time: '10:06 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: 'Glad you liked it! Need help with anything?',
    time: '10:07 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: 'Yes, how do I learn JavaScript?',
    time: '10:08 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message:
      'Start with the basics like variables, functions, and loops. Then practice!',
    time: '10:09 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: 'Got it! Can you suggest a project?',
    time: '10:10 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message:
      'How about building a to-do list app? It covers important concepts!',
    time: '10:11 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: 'That sounds good. Any tips?',
    time: '10:12 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: 'Break the project into small tasks and practice regularly.',
    time: '10:13 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: 'Thanks for the advice!',
    time: '10:14 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: "You're welcome! Happy coding!",
    time: '10:15 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: 'How do I use an API?',
    time: '10:16 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: 'Use fetch() in JavaScript to call APIs and handle responses.',
    time: '10:17 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: 'Got it! Can I use async/await?',
    time: '10:18 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: 'Yes! async/await makes handling asynchronous code easier.',
    time: '10:19 AM',
  },
  {
    sender: 'user',
    type: 'message',
    message: "You're really helpful!",
    time: '10:20 AM',
  },
  {
    sender: 'bot',
    type: 'message',
    message: "I'm happy to help! Anything else?",
    time: '10:21 AM',
  },
];

const Chat = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatName, setChatName] = useState<string>('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(oldMessages);

    const fetchChatName = async () => {
      chats.forEach((chat) => {
        if (chat.chat_id === id) {
          setChatName(chat.chat_name);
        }
      });
    };

    fetchChatName();
  }, [id]);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newMessage = values.message;
    if (!newMessage.trim()) return;
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
      form.reset({
        message: '',
      });
      setMessages((prevMessages) => [...prevMessages, messageObject]);
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
          <User className="size-9 rounded-full bg-neutral-700 p-1 text-white" />
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
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs rounded-lg p-3 ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-primary/30 text-black'}`}
            >
              {msg.type === 'message' && <p>{msg.message}</p>}
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
              <span className="mt-1 block text-xs text-gray-300">
                {msg.time}
              </span>
            </div>
          </div>
        ))}
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
