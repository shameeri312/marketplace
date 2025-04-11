import React from 'react';
import { Badge } from '../ui/badge';

interface MessageProps {
  sender: string;
  isOwnMessage: boolean;
  message: string;
  color: string;
  timestamp: Date;
}

const ChatMessage = ({
  sender,
  isOwnMessage,
  message,
  color,
  timestamp,
}: MessageProps) => {
  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`grid ${
          isOwnMessage ? `justify-items-end` : 'justify-items-start'
        } `}
      >
        <small>{sender}</small>
        <Badge
          className={`w-max text-base ${
            isOwnMessage
              ? `bg-[${color}] text-white`
              : 'bg-gray-200 text-gray-800'
          }`}
          style={{ backgroundColor: isOwnMessage ? color : undefined }} // Fallback for dynamic colors
        >
          <p>{message}</p>
        </Badge>
        <small className="text-muted-foreground">
          {new Date(timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </small>
      </div>
    </div>
  );
};

export default ChatMessage;
