// app/api/socket/route.ts

import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as IOServer } from 'socket.io';
import { NextApiRequest, NextApiResponse } from 'next';

// Extend the response type to include Socket.IO
type NextApiResponseWithSocketIO = NextApiResponse & {
  socket: NetSocket & {
    server: HTTPServer & {
      io?: IOServer;
    };
  };
};

const SocketHandler = (req: NextApiRequest, res: NextApiResponseWithSocketIO) => {
  if (res.socket.server.io) {
    console.log('Socket is already running');
  } else {
    console.log('Socket is initializing');
    const io = new IOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', (socket) => {
      console.log('A user connected');

      // Join user to their room
      socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined`);
      });

      // Typing indicator
      socket.on('typing', ({ conversationId, userId, isTyping }) => {
        socket.to(conversationId).emit('typing', { userId, isTyping });
      });

      // New message
      socket.on('newMessage', (message) => {
        socket.to(message.conversationId).emit('messageReceived', message);
      });

      // Online status
      socket.on('online', (userId) => {
        socket.broadcast.emit('userOnline', userId);
      });

      socket.on('disconnect', () => {
        console.log('A user disconnected');
      });
    });
  }

  res.end();
};

export default SocketHandler;
