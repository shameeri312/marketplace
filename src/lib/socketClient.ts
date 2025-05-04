import { io } from 'socket.io-client'

const socket = io('http://localhost:3001', {
  path: '/socket.io',
  autoConnect: true,
  withCredentials: true, // Only if credentials are needed
})

export { socket }
