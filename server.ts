/* eslint-disable @typescript-eslint/no-explicit-any */
// server.ts
import { config } from 'dotenv';
config(); // Load .env file
console.log('MONGO_URI after dotenv:', process.env.MONGO_URI); // Debug: Check env var

import { createServer } from 'node:http';
import { Server } from 'socket.io';
import Chat from './src/models/Chat.model.ts';
import Message from './src/models/Message.model.ts';

import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://localhost:27017/practice';

const dbConnect = async () => {
  const connectionState = mongoose.connection.readyState;

  if (connectionState === 1) {
    console.log('---> Already connected!!!');
    return;
  }

  if (connectionState === 2) {
    console.log('---> Connecting...');
    return;
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: 'transport',
      bufferCommands: true,
    });

    console.log('---> Connected!!!');
  } catch (err: any) {
    console.log('Error: ', err);
    throw new Error('Error: ', err);
  }
};

const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '4001', 10);

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server Running');
});

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', async (socket) => {
  console.log(`--> User connected: ${socket.id}`); // Socket.IO connection

  try {
    await dbConnect();
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error);
    socket.disconnect();
    return;
  }

  // server.ts (inside io.on('connection', ...))
  socket.on('join-room', async ({ roomId, userName }) => {
    console.log(`--> User joined room: ${roomId} with username ${userName}`);
    socket.join(roomId);

    try {
      const existingChat = await Chat.findOne({ chatId: roomId });
      console.log(
        'Existing chat:',
        existingChat ? existingChat.toObject() : null
      );

      if (!existingChat) {
        // Create a new chat with both participants
        const newChat = new Chat({
          participants: [userName], // Save both participants
          chatId: roomId, // Initialize chatId with both participants
          createdAt: new Date(),
        });
        await newChat.save();
        console.log(`✅ Chat room created: ${roomId}`);
      } else {
        // Optionally, ensure the userName is in the participants array
        if (!existingChat.participants.includes(userName)) {
          existingChat.participants.push(userName);
          await existingChat.save();
          console.log(
            `👥 Added ${userName} to participants in chat room: ${roomId}`
          );
        }
      }

      socket.to(roomId).emit('user_joined', `${userName} joined the room!`);
    } catch (error) {
      console.error('❌ Error joining or creating room:', error);
    }
  });

  socket.on('message', async ({ roomId, message, sender }) => {
    io.to(roomId).emit('message', { sender, message, timestamp: new Date() });

    try {
      const newMessage = new Message({
        sender: sender,
        message: message,
        roomId: roomId,
      });
      await newMessage.save();

      console.log(`✅ Chat message saved: ${roomId}`);
    } catch (error) {
      console.error('❌ Error joining or creating room:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`--> User disconnected: ${socket.id}`);
  });
});

async function startServer() {
  try {
    server.listen(port, () => {
      console.log(`Server running on http://${hostname}:${port}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer().catch((error) => {
  console.error('❌ Uncaught error in startServer:', error);
  process.exit(1);
});
