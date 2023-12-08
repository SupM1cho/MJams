// socketManager.js

const socketIO = require('socket.io');

const configureSocket = (server) => {
  const io = socketIO(server);

  io.on('connection', (socket) => {
    console.log('New user connected');

    // Handle chat messages
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg); // Broadcast the message to all connected clients
    });

    // Handle music events or synchronization
    // Add more socket event handlers as needed for your project

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });

  return io;
};

module.exports = configureSocket;
