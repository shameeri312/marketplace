'use client';
import Chat2 from '@/components/chat/chat2';
import ChatMessage from '@/components/chat/chatMessage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { socket } from '@/lib/socketClient';
import { useEffect, useState } from 'react';

interface IMessage {
  sender: string;
  message: string;
}

export default function Home() {
  const [roomId, setRoom] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [userName, setUserName] = useState('');
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    socket.on('message', (data: IMessage) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    socket.on('user_joined', (data) => {
      console.log(data);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'system', message: data.message },
      ]);
    });

    return () => {
      socket.off('user_joined');
      socket.off('message');
    };
  }, []);

  const handleMessages = (message: string) => {
    const data = { roomId, message, sender: userName };

    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userName, message },
    ]);

    socket.emit('message', data);
  };

  const handleRoomJoin = (e: React.FormEvent<HTMLFormElement>) => {
    // Fixed type
    e.preventDefault();

    if (roomId && userName) {
      socket.emit('join-room', { roomId, userName });

      setJoined(true);
    }
    console.log(roomId, userName);
  };

  return (
    <div className="grid h-full w-full place-content-center">
      {!joined ? (
        <>
          <form className="space-y-2" onSubmit={handleRoomJoin}>
            <Label>RoomId:</Label>
            <Input value={roomId} onChange={(e) => setRoom(e.target.value)} />
            <Label>Username:</Label>
            <Input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button type="submit">Join</Button>{' '}
            {/* Added type="submit" for form */}
          </form>
        </>
      ) : (
        <div className="grid h-full w-full rounded-xl p-2 shadow-lg md:w-[500px]">
          <div className="mb-2 h-[400px] overflow-y-auto rounded-lg bg-neutral-100 p-4">
            {messages.map((msg, i) => {
              return (
                <ChatMessage
                  key={i}
                  sender={msg.sender}
                  message={msg.message}
                  isOwnMessage={msg.sender === userName}
                />
              );
            })}
          </div>

          <Chat2 onSendMessage={handleMessages} />
        </div>
      )}
    </div>
  );
}
