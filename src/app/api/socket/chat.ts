import type { NextApiRequest, NextApiResponse } from 'next';
import Chat from '@/models/chat';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { name, participants } = req.body;
      const chat = new Chat({ name, participants });
      await chat.save();
      res.status(201).json(chat);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to create chat' });
    }
  } else if (req.method === 'GET') {
    try {
      const chats = await Chat.find();
      res.status(200).json(chats);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Failed to fetch chats' });
    }
  }
}
