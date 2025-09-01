const { privy } = require('../config/privy');
const Game = require('../models/Game');

// Middleware to verify Privy token
async function verifyPrivyToken(req, res, next) {
  // TEMPORARY BYPASS: Skip Privy authentication for now
  console.log('BYPASSING Privy authentication for request:', {
    method: req.method,
    url: req.url
  });

  // Create a mock user object for testing, using the userId from params if available
  const userId = req.params.userId || 'test-user-id';
  req.user = {
    userId: userId,
    id: userId,
    issuer: 'test-issuer',
    issuedAt: new Date().toISOString(),
    expiration: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
  };

  next();
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