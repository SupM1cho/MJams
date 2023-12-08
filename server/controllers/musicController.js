// musicController.js

const axios = require('axios');
const MusicSession = require('../models/musicSessionModel');
const User = require('../models/userModel');

// Controller to get music tracks from Deezer API
const getTracks = async (req, res) => {
  try {
    // Make a request to Deezer API to get tracks (replace with your Deezer API logic)
    const response = await axios.get('https://api.deezer.com/chart/0/tracks');

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to create a new music session
const createSession = async (req, res) => {
  try {
    const { userId } = req;
    const { sessionName, tracks } = req.body;

    // Create a new music session
    const newSession = new MusicSession({
      sessionName,
      tracks,
      createdBy: userId,
    });

    await newSession.save();

    // Add the session to the user's sessions
    await User.findByIdAndUpdate(userId, { $push: { musicSessions: newSession._id } });

    res.status(201).json({ message: 'Music session created successfully', sessionId: newSession._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// Controller to get all music sessions for a user
const getSessions = async (req, res) => {
  try {
    const { userId } = req;

    // Get all music sessions for the user
    const user = await User.findById(userId).populate('musicSessions');
    res.json(user.musicSessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  getTracks,
  createSession,
  getSessions,
};
