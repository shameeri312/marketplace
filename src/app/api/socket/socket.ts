/* eslint-disable @typescript-eslint/no-explicit-any */
// pages/api/socket.ts
import { Server } from 'socket.io';
import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import Chat from '../../models/Chat';

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if ((res.socket.server as any).io) {
    // Use type assertion
    console.log('Socket is already running');
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  (res.socket.server as any).io = io;

  mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chat-app', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (room: string) => {
      socket.join(room);
      console.log(`User joined room: ${room}`);
    });

    socket.on(
      'sendMessage',
      async (data: { room: string; sender: string; message: string }) => {
        const newMessage = new Chat({
          room: data.room,
          sender: data.sender,
          message: data.message,
        });

        await newMessage.save();

        io.to(data.room).emit('receiveMessage', {
          ...data,
          timestamp: new Date(),
        });
      }
    );

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });

  res.end();
}
