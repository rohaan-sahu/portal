# Playrush Frontend Integration Guide

This document provides instructions for integrating the Playrush frontend with the Privy authentication system and backend API.

## Overview

The Playrush frontend has been updated to use Privy for authentication instead of Firebase Auth. This provides a more streamlined Web3 authentication experience while maintaining compatibility with the backend API.

## Authentication Flow

1. User clicks "Sign In" button
2. User chooses authentication method (Google or Solana wallet)
3. Privy handles the authentication flow
4. Upon successful authentication, the frontend receives:
   - User object with user details
   - Access token for API authentication
5. The access token is used in API calls to the backend

## Key Components

### 1. PrivyAuth.jsx

This file contains the authentication context and provider:

- `PrivyAuthProvider`: Wraps the entire app with Privy authentication
- `AuthProvider`: Manages the authentication state
- `useAuth`: Custom hook to access authentication state

### 2. SignInModal.jsx

Updated to use Privy authentication methods:

- `loginWithGoogle`: For Google authentication
- `loginWithSolana`: For Solana wallet authentication

### 3. Header.jsx

Updated to show user information and handle sign out using Privy.

### 4. Profile.jsx

Updated to display user information from Privy and handle profile updates.

### 5. Games.jsx

Updated to handle game launching with authentication.

### 6. Leaderboard.jsx

Updated to show user ranking and leaderboard information.

### 7. api.js

Utility functions for making authenticated API calls to the backend:

- `submitScore`: Submit game scores to the backend
- `getLeaderboard`: Retrieve leaderboard data
- `getUserProfile`: Retrieve user profile data

## Making Authenticated API Calls

To make authenticated API calls to the backend, use the functions in [api.js](file:///C:/Users/Administrator/portal/src/api.js):

```javascript
import { submitScore } from '../api';
import { useAuth } from '../PrivyAuth';

function GameComponent() {
  const { accessToken } = useAuth();
  
  const handleScoreSubmit = async () => {
    try {
      const result = await submitScore('chain-bros', 1500, accessToken);
      console.log('Score submitted:', result);
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  };
}
```

## Environment Variables

The following environment variables are required:

```env
# Privy Configuration
VITE_PRIVY_APP_ID=your_privy_app_id

# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

## Game Integration

For game developers to integrate with the Playrush platform:

1. Obtain a game API key from the Playrush team
2. When a player completes a game session, collect their score
3. Make an API call to the Playrush backend with:
   - The game's API key in the `x-api-key` header
   - The player's access token in the `Authorization` header
   - The game ID and score in the request body

Example API call:

```javascript
const submitScore = async (gameId, score, accessToken, apiKey) => {
  const response = await fetch('http://localhost:3001/api/v1/submit-score', {
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
  
  return await response.json();
};
```

## Security Considerations

1. Access tokens are short-lived and automatically refreshed by Privy
2. Game API keys should be kept secret and not exposed in client-side code
3. All API calls to the backend are authenticated and validated
4. Score submissions are validated and checked for potential cheating

## Testing

To test the integration:

1. Start the backend server:
   ```bash
   cd backend
   npm start
   ```

2. Start the frontend:
   ```bash
   npm run dev
   ```

3. Navigate to http://localhost:5173
4. Click "Sign In" and choose an authentication method
5. After successful authentication, you should see your user information
6. Navigate to the Games page and try to launch a game
7. Check the browser console for authentication tokens and API calls

## Production Deployment

When deploying to production:

1. Update `VITE_API_BASE_URL` to point to your production backend
2. Ensure `VITE_PRIVY_APP_ID` is set to your production Privy app ID
3. Configure your web server to serve the React app
4. Ensure the backend is properly configured and secured
5. Test the authentication flow and API calls in production