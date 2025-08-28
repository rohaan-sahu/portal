// Utility functions for API calls to the Playrush backend

// Base URL for the backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';

/**
 * Submit a score to the Playrush backend
 * @param {string} gameId - The ID of the game
 * @param {number} score - The score to submit
 * @param {string} accessToken - The user's Privy access token
 * @param {string} apiKey - The game's API key
 * @returns {Promise<Object>} The response from the backend
 */
export async function submitScoreToBackend(gameId, score, accessToken, apiKey) {
  // Validate inputs
  if (!gameId || typeof score !== 'number' || score < 0) {
    throw new Error('Invalid gameId or score');
  }
  
  if (!accessToken) {
    throw new Error('Access token is required');
  }
  
  if (!apiKey) {
    throw new Error('Game API key is required');
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}/submit-score`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey
      },
      body: JSON.stringify({
        gameId,
        score
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

/**
 * Get leaderboard data for a specific game
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Object>} The leaderboard data
 */
export async function fetchGameLeaderboard(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

/**
 * Get global leaderboard data
 * @returns {Promise<Object>} The global leaderboard data
 */
export async function fetchGlobalLeaderboard() {
  try {
    const response = await fetch(`${API_BASE_URL}/leaderboard/global`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching global leaderboard:', error);
    throw error;
  }
}

/**
 * Get user profile data
 * @param {string} userId - The user's ID
 * @param {string} accessToken - The user's Privy access token
 * @returns {Promise<Object>} The user profile data
 */
export async function fetchUserProfile(userId, accessToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

/**
 * Update user profile data
 * @param {string} userId - The user's ID
 * @param {Object} profileData - The profile data to update
 * @param {string} accessToken - The user's Privy access token
 * @returns {Promise<Object>} The updated user profile data
 */
export async function updateProfileOnBackend(userId, profileData, accessToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(profileData)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

/**
 * Get game details
 * @param {string} gameId - The ID of the game
 * @returns {Promise<Object>} The game details
 */
export async function fetchGameDetails(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/games/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching game details:', error);
    throw error;
  }
}

/**
 * Get user's game statistics
 * @param {string} userId - The user's ID
 * @param {string} gameId - The ID of the game
 * @param {string} accessToken - The user's Privy access token
 * @returns {Promise<Object>} The user's game statistics
 */
export async function fetchUserGameStats(userId, gameId, accessToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/games/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user game stats:', error);
    throw error;
  }
}