require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const socketIO = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const connectDB = require('./server/config/dbConfig');
const configureSocket = require('./server/utils/socketManager');

const app = express();
const server = http.createServer(app);
const io = configureSocket(server);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
const userRoutes = require('./server/routes/userRoutes');
const musicRoutes = require('./server/routes/musicRoutes');

app.use('/users', userRoutes);
app.use('/music', musicRoutes);

// Serve static files (for example, index.html, main.js, styles.css)
app.use(express.static('public'));

// Serve login and signup pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

// Handle session creation
app.post('/create-session', (req, res) => {
  const { sessionName } = req.body;

  // Generate a unique room ID (you can use a library like `uuid` for this)
  const roomId = generateUniqueRoomId(); // Implement this function

  // Redirect to the room with the generated ID
  res.redirect(`/room/${roomId}`);
});

// Handle room pages
app.get('/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  // Render the room page or handle it as needed
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Set up Socket.IO events (add more as needed)
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join room', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on('chat message', (msg) => {
    console.log('Received chat message:', msg);
    const { room, message, user } = msg;
    io.to(room).emit('chat message', { message, user });
  });

  // Handle additional Socket.IO events here

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Login route
app.post('/login', async (req, res) => {
  try {
    console.log('Login route accessed');

    const { email, password } = req.body;

    // Cari user berdasarkan email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Bandingkan password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Login berhasil, buat token JWT dan kirim ke klien
    const token = jwt.sign({ userId: user._id, nickname: user.nickname }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, nickname: user.nickname });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to generate a unique room ID
function generateUniqueRoomId() {
  // Implement your logic to generate a unique room ID (e.g., using `uuid` library)
  // Example:
  const uuid = require('uuid');
  return uuid.v4();
}

// Server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});