# Playrush Game Integration Guide

## How Game Scores Get to the Leaderboard

### Simple Explanation

1. **Player plays a game** (like Chain Bros, Pixel Hunt, etc.)
2. **Game calculates the score** when the player finishes
3. **Game sends the score to Playrush portal** using a special API call
4. **Portal verifies the player** (makes sure they're logged in)
5. **Portal saves the score** to the database
6. **Leaderboard updates** automatically showing the new rankings

### Technical Flow

```
Game Website → API Call → Playrush Portal → Database → Leaderboard Display
     ↓              ↓              ↓            ↓              ↓
  Player          POST /submit-score      Verify        Save Score    Update Rankings
  finishes        with token & API key    Token         to Firebase    in Real-time
```

## For Game Developers

### Step 1: Get Required Information

Each game needs:
- **API Key**: A secret key that identifies your game (ask Playrush admin)
- **Game ID**: Unique identifier for your game (e.g., "chain-bros", "pixel-hunt")

### Step 2: When Player Finishes a Game

```javascript
// Example code for your game
async function submitScore(gameId, playerScore, accessToken, apiKey) {
  try {
    const response = await fetch('https://your-portal-domain.com/api/submit-score', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        gameId: gameId,
        score: playerScore
      })
    });

    if (response.ok) {
      console.log('Score submitted successfully!');
    } else {
      console.error('Failed to submit score');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Step 3: Getting Player Access Token

The access token comes from the Playrush portal when the player logs in. You'll need to:

1. **Open your game from Playrush portal** (not directly)
2. **Portal passes the token** to your game URL as a parameter
3. **Game extracts the token** from the URL

Example URL your game might receive:
```
https://your-game.com/play?token=abc123...&apiKey=game-secret-key
```

## Setting Up Google OAuth

### Step-by-Step Instructions

1. **Go to Privy Dashboard**
   - Visit: https://app.privy.io/
   - Log in to your account

2. **Select Your App**
   - Choose the Playrush app from your dashboard

3. **Enable Google OAuth**
   - Go to "Authentication" or "Login Methods" section
   - Find "Google" in the list of providers
   - Click "Enable" or toggle it on

4. **Configure Google OAuth** (if required)
   - You may need to provide:
     - Google Client ID (from Google Cloud Console)
     - Google Client Secret
   - Or Privy might handle this automatically

5. **Save Changes**
   - Click "Save" or "Update" in the Privy dashboard

6. **Test the Login**
   - Go back to your Playrush portal
   - Try clicking "Sign In with Google"
   - It should now work properly

### If Google OAuth Still Doesn't Work

1. **Check Browser Console** for error messages
2. **Verify Privy App Configuration** matches your code settings
3. **Check if Google OAuth is enabled** in Privy dashboard
4. **Clear browser cache/cookies** and try again

## Testing Score Submission

### Using cURL

```bash
curl -X POST https://your-portal-domain.com/api/submit-score \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "x-api-key: YOUR_GAME_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"gameId": "chain-bros", "score": 1500}'
```

### Expected Response

```json
{
  "success": true,
  "message": "Score submitted successfully",
  "data": {
    "gameId": "chain-bros",
    "userId": "user-123",
    "score": 1500
  }
}
```

## Troubleshooting

### Common Issues

1. **"No access token available"**
   - Make sure the player is logged in to Playrush first
   - Check that the token is being passed correctly to your game

2. **"No API key available"**
   - Get the correct API key from Playrush administrators
   - Make sure it's included in the request headers

3. **"Failed to submit score"**
   - Check the API endpoint URL
   - Verify the request format (JSON, headers)
   - Check browser console for CORS errors

4. **Score not appearing on leaderboard**
   - Wait a few seconds for the update
   - Check that the game ID matches exactly
   - Verify the score is a valid number

### Getting Help

- Check the browser developer console for error messages
- Look at the Network tab to see API request details
- Contact Playrush development team for API keys and support
