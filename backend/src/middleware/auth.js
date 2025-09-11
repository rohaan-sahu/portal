const { privy } = require('../config/privy');
const Game = require('../models/Game');

// Middleware to verify Privy token
async function verifyPrivyToken(req, res, next) {
  try {
    const { privy } = require('../config/privy');

    if (!privy) {
      console.error('Privy client not initialized');
      return res.status(500).json({ error: 'Authentication service not available' });
    }

    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the token with Privy
    const payload = await privy.verifyAuthToken(token);

    if (!payload) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Attach user info to request
    req.user = {
      userId: payload.userId || payload.sub,
      id: payload.userId || payload.sub,
      ...payload
    };

    console.log('Privy token verified for user:', req.user.userId);
    next();
  } catch (error) {
    console.error('Privy token verification failed:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
}

// Middleware to verify game API key
async function verifyApiKey(req, res, next) {
  try {
    const apiKey = req.headers['x-api-key'];
    const { gameId } = req.body;
    
    if (!apiKey) {
      return res.status(401).json({ error: 'Missing API key' });
    }
    
    if (!gameId) {
      return res.status(400).json({ error: 'Missing gameId in request body' });
    }
    
    // Verify API key
    const isValid = await Game.verifyApiKey(gameId, apiKey);
    
    if (!isValid) {
      return res.status(403).json({ error: 'Invalid API key' });
    }
    
    next();
  } catch (error) {
    console.error('Error verifying API key:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Middleware to validate score data
function validateScore(req, res, next) {
  const { gameId, score } = req.body;
  
  if (!gameId) {
    return res.status(400).json({ error: 'Missing gameId' });
  }
  
  if (score === undefined || score === null) {
    return res.status(400).json({ error: 'Missing score' });
  }
  
  if (!Number.isInteger(score) || score < 0) {
    return res.status(400).json({ error: 'Score must be a non-negative integer' });
  }
  
  next();
}

module.exports = {
  verifyPrivyToken,
  verifyApiKey,
  validateScore
};