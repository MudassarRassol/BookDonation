// app/lib/socket.ts
import { io } from 'socket.io-client';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const socket = io(URL, {
  autoConnect: false,
  withCredentials: true,
});