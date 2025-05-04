import { Server } from 'socket.io';
import { createServer } from 'node:http';

const httpServer = createServer();
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('A user connected');
});

httpServer.listen(3000, () => {
  console.log('Socket.IO server running on port 3000');
});
