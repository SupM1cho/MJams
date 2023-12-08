// room.js

document.addEventListener('DOMContentLoaded', () => {
  const socket = io(); // Connect to the Socket.IO server

  // DOM elements
  const roomNameElement = document.getElementById('room-name');
  const userNicknameElement = document.getElementById('user-nickname');
  const chatMessages = document.getElementById('chat-messages');
  const messageForm = document.getElementById('message-form');
  const messageInput = document.getElementById('message-input');
  const playBtn = document.getElementById('play-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const skipBtn = document.getElementById('skip-btn');
  const songQueue = document.getElementById('song-queue');
  const logoutBtn = document.getElementById('logout-btn');

  // Get room name and user nickname from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const roomName = urlParams.get('room');
  const userNickname = urlParams.get('nickname');

  // Display room name and user nickname
  roomNameElement.textContent = roomName;
  userNicknameElement.textContent = userNickname;

  // Event listener for chat form submission
  messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;

    // Emit the chat message to the server
    socket.emit('chat message', { room: roomName, message, user: userNickname });

    // Clear the message input field
    messageInput.value = '';
  });

  // Event listener for receiving chat messages from the server
  socket.on('chat message', (msg) => {
    const messageItem = document.createElement('li');
    messageItem.textContent = `${msg.user}: ${msg.message}`;
    chatMessages.appendChild(messageItem);
  });

  // Event listener for playing a song
  playBtn.addEventListener('click', () => {
    // Emit a play event to the server
    socket.emit('play', { room: roomName });
  });

  // Event listener for pausing a song
  pauseBtn.addEventListener('click', () => {
    // Emit a pause event to the server
    socket.emit('pause', { room: roomName });
  });

  // Event listener for skipping a song
  skipBtn.addEventListener('click', () => {
    // Emit a skip event to the server
    socket.emit('skip', { room: roomName });
  });

  // Event listener for logging out
  logoutBtn.addEventListener('click', () => {
    // Redirect to the login page
    window.location.href = '/login';
  });

  // Handle additional Socket.IO events here
});
