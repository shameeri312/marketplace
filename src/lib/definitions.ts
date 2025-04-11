// sign in schema
import { z } from 'zod';

export const loginInSchema = z.object({
  email: z.string(),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

// Define the types based on your Django models
export type User = {
  id: string;
  username: string;
};

export type Chat = {
  chatId: string;
  participants?: string[];
  messages?: Message[];
  is_important?: boolean;
};

export type Message = {
  message_id: string;
  chat_id: string;
  sender_id: string;
  body: string;
  created_at: string;
};
