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
import React, { useEffect, useRef, useState } from 'react';
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
import Messages from './messages';
import axios from 'axios';
import Loading from '../loading/Loading';

const formSchema = z.object({
  message: z.string().min(1, { message: 'Message cannot be empty' }),
});

interface ChatMessage {
  sender: 'user' | 'bot';
  type: 'message' | 'image' | 'link';
  message: string;
  time: string;
  image?: string;
  link?: string;
  message_id?: string;
  userId?: string;
  chat?: string;
}

const Chat = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [chatName, setChatName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const { chatColor } = useChatColorStore();
  const { data: session }: any = useSession();
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>(id); // Initialize with id ("12-1")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  });

  console.log(roomId);

  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input field

  const getMessages = async () => {
    const token = session?.user?.token;

    if (token) {
      try {
        const res = await axios.get(
          `${process.env.API_URL_PREFIX}/chat/messages/`,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (res.status === 200) {
          return res.data.filter((msg: ChatMessage) => msg.chat === id);
        }
        return [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const fetchedMessages = await getMessages();
      setMessages(fetchedMessages);

      const fetchChatName = async () => {
        setChatName(localStorage.getItem('chat_name') ?? 'Chat');
      };
      await fetchChatName();

      const uid = session?.user?.userId;

      if (uid) {
        setUserId(uid);
        console.log('Current userId set to:', uid);
      } else {
        console.warn('No userId from session');
      }

      if (id && userId) {
        const socket = new WebSocket(
          `ws://192.168.100.17:8008/ws/chat/${id}/?user_id=${uid}`
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
          try {
            const data = JSON.parse(event.data);

            if (data.room) {
              localStorage.setItem('room', data.room);
              setRoomId(data.room);
            } else {
              setMessages((prevMessages) => {
                const isDuplicate = prevMessages.some(
                  (msg) => msg.message_id === data.message_id
                );

                if (!isDuplicate) {
                  return [data, ...prevMessages];
                }

                return prevMessages;
              });
            }
          } catch (error) {
            console.error('Error parsing message', error);
          }
        };

        return () => {
          console.log('Closing WebSocket connection');
          socket.close();
        };
      }
    };

    fetchInitialData();
  }, [id, session?.user, userId]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newMessage = values.message;
    if (!newMessage.trim() || !ws) return;

    try {
      ws.send(JSON.stringify({ body: newMessage, userId: userId }));

      form.reset({
        message: '',
      });

      // Focus the input after submission
      if (inputRef.current) {
        inputRef.current.focus();
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to send the message.');
    }
  }

  if (loading || !chatName) return <Loading />;

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
      <div
        ref={chatRef}
        className="flex-1 flex-col space-y-4 overflow-y-auto p-4"
      >
        <Messages messages={messages} userId={userId} chatName={chatName} />
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
                      ref={inputRef} // Attach the ref to the Input
                      placeholder="Enter message..."
                      className="h-full flex-1 outline-none !ring-0"
                      value={field.value || ''}
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
