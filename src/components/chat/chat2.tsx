/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const Chat2 = ({ onSendMessage }: any) => {
  const [input, setInput] = useState('');

  console.log('Start');

  const sendMessage = () => {
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="w-full space-y-2">
      <Input
        value={input}
        placeholder="Type message here..."
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <Button onClick={sendMessage}>Send</Button>
    </div>
  );
};

export default Chat2;
