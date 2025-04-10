// types/socket.io.d.ts
import { Server as NetServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as IOServer } from 'socket.io';
import { NextApiResponse } from 'next';

declare module 'http' {
  interface Server extends NetServer {
    io?: IOServer; // Optional property for Socket.IO server
  }
}

declare module 'socket.io' {
  interface Socket {
    server: IOServer; // Add server property to Socket
  }
}

declare module 'next' {
  interface NextApiResponse {
    status(arg0: number): unknown;
    socket: NetSocket & {
      server: NetServer & {
        io?: IOServer; // Socket.IO server on Next.js response
      };
    };
  }
}
