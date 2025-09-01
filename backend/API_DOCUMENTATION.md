# Playrush API Documentation

This document provides instructions for game developers on how to integrate their games with the Playrush platform.

## Overview

The Playrush API allows games to securely submit player scores to the platform. All requests must be authenticated with both a game API key and a user authentication token.

## Base URL

```
http://localhost:3002/api
```

**Note:** The API base URL has been updated from `/api/v1` to `/api` for consistency with the frontend configuration.

## Authentication

All requests to the API must include two authentication headers:

1. `x-api-key`: The game's secret API key
2. `Authorization`: A Bearer token for the authenticated user

### Privy Authentication Setup

**IMPORTANT:** The API uses Privy for user authentication. You must have valid Privy credentials configured:

1. Create a Privy account at [privy.io](https://privy.io)
2. Create a new app in the Privy dashboard
3. Configure authentication methods (Google, Solana wallets)
4. Update your environment files with the real Privy credentials:

**Backend (backend/.env):**
```env
PRIVY_APP_ID=your-actual-privy-app-id
PRIVY_APP_SECRET=your-actual-privy-app-secret
```

**Frontend (.env):**
```env
VITE_PRIVY_APP_ID=your-actual-privy-app-id
```

⚠️ **Current Issue:** The application currently has invalid Privy credentials. Authentication will fail until you replace the placeholder values with real Privy credentials.

## Endpoints

### Submit Score

Submit a player's score to the leaderboard.

**Endpoint:** `POST /submit-score`

**Headers:**
```
x-api-key: YOUR_GAME_API_KEY
Authorization: Bearer USER_AUTH_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "gameId": "string",
  "score": "integer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Score submitted successfully",
  "data": {
    "gameId": "string",
    "userId": "string",
    "score": "integer"
  }
}
```

### Get Global Leaderboard

Retrieve the global leaderboard with all players ranked by total points.

**Endpoint:** `GET /leaderboard/global`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "string",
      "displayName": "string",
      "totalPoints": "integer",
      "rank": "integer"
    }
  ]
}
```

### Get Game Leaderboard

Retrieve the leaderboard for a specific game.

**Endpoint:** `GET /leaderboard/:gameId`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "userId": "string",
      "displayName": "string",
      "score": "integer",
      "rank": "integer"
    }
  ]
}
```

### Get User Profile

Retrieve a user's profile information.

**Endpoint:** `GET /users/:userId`

**Headers:**
```
Authorization: Bearer USER_AUTH_TOKEN
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "displayName": "string",
    "totalPoints": "integer",
    "gamesPlayed": "integer",
    "createdAt": "timestamp",
    "lastActive": "timestamp"
  }
}
```

### Update User Profile

Update a user's profile information.

**Endpoint:** `PUT /users/:userId`

**Headers:**
```
Authorization: Bearer USER_AUTH_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "displayName": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "string",
    "displayName": "string",
    "totalPoints": "integer",
    "gamesPlayed": "integer",
    "createdAt": "timestamp",
    "lastActive": "timestamp"
  }
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message"
}
```

Common HTTP status codes:
- 400: Bad Request - Invalid request data
- 401: Unauthorized - Missing or invalid authentication
- 403: Forbidden - Access denied
- 404: Not Found - Resource not found
- 500: Internal Server Error - Something went wrong on our end

## Implementation Notes

1. All score submissions must include both the game's API key and the user's authentication token
2. API keys are generated when a game is registered and should be kept secret
3. User authentication tokens are provided by the Privy authentication system
4. Scores are validated to prevent cheating
5. Leaderboard updates use Firestore transactions to ensure data consistency
6. All timestamps are in ISO 8601 format