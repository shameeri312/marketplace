import React from 'react';
import { Badge } from '../ui/badge';

interface MessageProps {
  sender: string;
  isOwnMessage: boolean;
  message: string;
}

const ChatMessage = ({ sender, isOwnMessage, message }: MessageProps) => {
  const isSystemMessage = sender === 'system';
  console.log(message);

  return (
    <div
      className={`flex ${isSystemMessage ? 'justify-center' : isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <Badge
        className={`text-base ${isSystemMessage ? 'bg-yellow-100 italic text-yellow-800' : isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'} `}
      >
        <p>{message}</p>
      </Badge>
    </div>
  );
};

export default ChatMessage;
