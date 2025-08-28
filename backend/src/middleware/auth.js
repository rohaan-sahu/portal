const { privy } = require('../config/privy');
const Game = require('../models/Game');

// Middleware to verify Privy token
async function verifyPrivyToken(req, res, next) {
  if (!privy) {
    return res.status(500).json({ error: 'Authentication service not available' });
  }
  
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Log token info for debugging (don't log the actual token for security)
    console.log('Verifying token for request:', {
      method: req.method,
      url: req.url,
      tokenLength: token.length
    });
    
    // Verify the token with Privy
    const payload = await privy.verifyAuthToken(token);
    
    // Debugging: log the payload structure
    console.log('Privy token payload:', {
      userId: payload.userId,
      id: payload.id,
      issuer: payload.issuer,
      issuedAt: payload.issuedAt,
      expiration: payload.expiration
    });
    
    // Add user info to request object
    req.user = payload;
    
    next();
  } catch (error) {
    console.error('Error verifying Privy token:', error.message);
    console.error('Token verification error details:', error);
    return res.status(403).json({ error: 'Invalid or expired token' });
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