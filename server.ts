// /* eslint-disable @typescript-eslint/no-explicit-any */
// // server.ts
// import { createServer } from 'node:http';
// import next from 'next';
// import { Server } from 'socket.io';
// import mongoose from 'mongoose';

// import Chat from './src/models/Chat.model.ts';
// import Message from './src/models/Message.model.ts';

// const dev = process.env.NODE_ENV !== 'production';
// const hostname = '0.0.0.0';
// const port = parseInt(process.env.PORT || '3000', 10);

// const app = next({ dev, hostname, port });
// const handle = app.getRequestHandler();

// const MONGODB_URI = 'mongodb://localhost:27017/practice';

// const dbConnect = async () => {
//   const connectionState = mongoose.connection.readyState;

//   if (connectionState === 1) {
//     console.log('---> Already connected!!!');
//     return;
//   }

//   if (connectionState === 2) {
//     console.log('---> Connecting...');
//     return;
//   }

//   try {
//     mongoose.connect(MONGODB_URI!, {
//       dbName: 'transport',
//       bufferCommands: true,
//     });

//     console.log('---> Connected!!!');
//   } catch (err: any) {
//     console.log('Error: ', err);
//     throw new Error('Error: ', err);
//   }
// };

// app.prepare().then(() => {
//   const server = createServer(handle);

//   const io = new Server(server, {
//     path: '/socket.io',
//     cors: {
//       origin: '*',
//       methods: ['GET', 'POST'],
//     },
//   });

//   io.on('connection', async (socket) => {
//     console.log(`--> User connected: ${socket.id}`); // Socket.IO connection

//     try {
//       await dbConnect();
//     } catch (error) {
//       console.error('❌ Failed to connect to MongoDB:', error);
//       socket.disconnect();
//       return;
//     }

//     // server.ts (inside io.on('connection', ...))
//     socket.on('join-room', async ({ roomId, userName }) => {
//       console.log(`--> User joined room: ${roomId} with username ${userName}`);
//       socket.join(roomId);

//       try {
//         const existingChat = await Chat.findOne({ chatId: roomId });
//         console.log(
//           'Existing chat:',
//           existingChat ? existingChat.toObject() : null
//         );

//         if (!existingChat) {
//           // Create a new chat with both participants
//           const newChat = new Chat({
//             participants: [userName], // Save both participants
//             chatId: roomId, // Initialize chatId with both participants
//             createdAt: new Date(),
//           });
//           await newChat.save();
//           console.log(`✅ Chat room created: ${roomId}`);
//         } else {
//           // Optionally, ensure the userName is in the participants array
//           if (!existingChat.participants.includes(userName)) {
//             existingChat.participants.push(userName);
//             await existingChat.save();
//             console.log(
//               `👥 Added ${userName} to participants in chat room: ${roomId}`
//             );
//           }
//         }

//         socket.to(roomId).emit('user_joined', `${userName} joined the room!`);
//       } catch (error) {
//         console.error('❌ Error joining or creating room:', error);
//       }
//     });

//     socket.on('message', async ({ roomId, message, sender }) => {
//       io.to(roomId).emit('message', { sender, message, timestamp: new Date() });

//       try {
//         const newMessage = new Message({
//           sender: sender,
//           message: message,
//           roomId: roomId,
//         });
//         await newMessage.save();

//         console.log(`✅ Chat message saved: ${roomId}`);
//       } catch (error) {
//         console.error('❌ Error joining or creating room:', error);
//       }
//     });

//     socket.on('disconnect', () => {
//       console.log(`--> User disconnected: ${socket.id}`);
//     });
//   });

//   async function startServer() {
//     try {
//       server.listen(port, '0.0.0.0', () => {
//         console.log(`Server running on http://${hostname}:${port}`);
//       });
//     } catch (error) {
//       console.error('❌ Failed to start server:', error);
//       process.exit(1);
//     }
//   }

//   startServer().catch((error) => {
//     console.error('❌ Uncaught error in startServer:', error);
//     process.exit(1);
//   });
// });

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServer } from 'node:http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'

import Chat from './src/models/Chat.model.ts'
import Message from './src/models/Message.model.ts'

const hostname = '0.0.0.0'
const port = parseInt('3001', 10)

const MONGODB_URI = 'mongodb://localhost:27017/marketplace'

const dbConnect = async () => {
  const connectionState = mongoose.connection.readyState

  if (connectionState === 1) {
    console.log('---> Already connected!!!')
    return
  }

  if (connectionState === 2) {
    console.log('---> Connecting...')
    return
  }

  try {
    mongoose.connect(MONGODB_URI!, {
      dbName: 'transport',
      bufferCommands: true,
    })

    console.log('---> Connected!!!')
  } catch (err: any) {
    console.log('Error: ', err)
    throw new Error('Error: ', err)
  }
}

// Create a basic HTTP server (without Next.js integration)
const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Socket.IO server running\n')
})

const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: (origin, callback) => {
      callback(null, origin)
    },
    credentials: true,
    methods: ['GET', 'POST'],
  },
})

io.on('connection', async (socket) => {
  console.log(`--> User connected: ${socket.id}`)

  try {
    await dbConnect()
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error)
    socket.disconnect()
    return
  }

  socket.on('join-room', async ({ roomId, userName, chatName }) => {
    console.log(
      `--> User joined room: ${roomId} with username ${userName} and ${chatName}`
    )
    socket.join(roomId)

    try {
      const existingChat = await Chat.findOne({ chatId: roomId })
      console.log(
        'Existing chat:',
        existingChat ? existingChat.toObject() : null
      )

      if (!existingChat) {
        const newChat = new Chat({
          participants: [userName, chatName],
          chatId: roomId,
          createdAt: new Date(),
        })
        await newChat.save()

        console.log(`✅ Chat room created: ${roomId}`)
      }

      socket.to(roomId).emit('user_joined', `${userName} joined the room!`)
    } catch (error) {
      console.error('❌ Error joining or creating room:', error)
    }
  })

  socket.on('message', async ({ roomId, message, sender, timestamp }) => {
    const messageData = {
      sender,
      message,
      timestamp: timestamp ? new Date(timestamp) : new Date(),
    }

    try {
      const newMessage = new Message({
        sender,
        message,
        roomId,
        timestamp: messageData.timestamp,
      })
      await newMessage.save()
      io.to(roomId).emit('message', newMessage)

      console.log(`✅ Chat message saved: ${roomId}`)
    } catch (error) {
      console.error('❌ Error saving message:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log(`--> User disconnected: ${socket.id}`)
  })
})

async function startServer() {
  try {
    server.listen(port, hostname, () => {
      console.log(`Socket.IO server running on http://${hostname}:${port}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

startServer().catch((error) => {
  console.error('❌ Uncaught error in startServer:', error)
  process.exit(1)
})
