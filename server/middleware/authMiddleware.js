// authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from the request header
  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user ID to the request for future use
    req.userId = decoded.userId;

    next(); // Move to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
