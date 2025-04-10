import { createServer } from 'node:http';
import { Server } from 'socket.io';

const hostname = process.env.HOSTNAME || 'localhost';
const port = parseInt(process.env.PORT || '4001', 10);

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Socket.IO Server Running');
});

// Initialize Socket.IO
const io = new Server(server, {
  path: '/socket.io',
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`--> User connected: ${socket.id}`);

  socket.on('join-room', ({ roomId, userName }) => {
    socket.join(roomId);
    console.log(`--> User joined room: ${roomId}`);
    socket.to(roomId).emit('user_joined', `${userName} joined the room!`);
  });

  socket.on('message', ({ roomId, message, sender }) => {
    console.log(`--> Message received: ${message} from ${sender}`);
    socket.to(roomId).emit('message', { sender, message });
  });

  socket.on('disconnect', () => {
    console.log(`--> User disconnected: ${socket.id}`);
  });
});

server.listen(port, () => {
  console.log(`Server running on http://${hostname}:${port}`);
});
