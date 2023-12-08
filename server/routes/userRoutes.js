// userRoutes.js

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Route to handle user registration
router.post('/signup', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ email, password: hashedPassword, nickname });
    await newUser.save();

    // Display pop-up box with success message
    res.send(`
      <html>
        <head>
          <script>
            function closePopup() {
              window.location.href = '/login'; // Redirect to login page
            }
          </script>
        </head>
        <body>
          <div style="text-align: center; padding: 20px; border: 1px solid #ccc;">
            <h2>Successfully Registered</h2>
            <button onclick="closePopup()">Close</button>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Route to handle user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id, nickname: user.nickname }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and nickname as JSON response
    // res.json({ token, nickname });

    // Redirect to the desired page with token and nickname as query parameters
    res.redirect(`/index.html?token=${token}&nickname=${user.nickname}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
