'use client';

import { io } from 'socket.io-client';

export const socket = io('http://localhost:3000', {
  path: '/socket.io',
  transports: ['websocket', 'polling'],
});
