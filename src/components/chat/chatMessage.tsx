import React from 'react';

interface ChatMessageProps {
  color: string;
  sender: string;
  message: string;
  isOwnMessage: boolean;
  timestamp: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  color,
  sender,
  message,
  isOwnMessage,
  timestamp,
}) => {
  return (
    <div
      className={`flex flex-col space-y-1 ${isOwnMessage ? 'items-end' : 'items-start'} mb-4`}
    >
      <p className="text-sm font-semibold">{sender}</p>
      <div
        className={`max-w-xs rounded-lg px-3 py-2 ${
          isOwnMessage ? 'bg-[${color}] text-white' : 'bg-gray-200 text-black'
        }`}
        style={{ background: isOwnMessage ? color : undefined }}
      >
        <p>{message}</p>
      </div>
      <p className="text-xs text-gray-500">
        {new Date(timestamp).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default ChatMessage;
