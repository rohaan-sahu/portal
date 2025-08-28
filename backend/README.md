# Playrush Backend Server

This is the backend server for the Playrush gaming portal. It handles user authentication, game score submissions, and leaderboard management.

## Features

- User authentication with Privy
- Game API key management
- Secure score submission endpoint
- Leaderboard management with Firestore
- Anti-cheat validation

## Prerequisites

- Node.js 14+
- Firebase project with Firestore enabled
- Privy account with app credentials

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```
   cd backend
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```

5. Fill in the environment variables in the `.env` file:
   - Firebase Admin SDK credentials
   - Privy app credentials

### Setting up Firebase

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Go to Project Settings > Service Accounts
4. Click "Generate new private key" to download the service account JSON file
5. Copy the values from the JSON file to your `.env` file or place the file in the backend root directory

For security, the service account file is already added to `.gitignore`.

### Setting up Privy

1. Go to the [Privy Console](https://privy.io/)
2. Create a new app or select an existing one
3. Go to the App Settings
4. Copy the App ID and App Secret to your `.env` file:
   ```
   PRIVY_APP_ID=your-privy-app-id
   PRIVY_APP_SECRET=your-privy-app-secret
   ```

## Running the Server

### Development Mode
```
npm run dev
```

### Production Mode
```
npm start
```

## API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for detailed API information.

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication and validation middleware
│   ├── models/          # Database models
│   ├── routes/          # API route definitions
│   ├── scripts/         # Utility scripts
│   └── index.js         # Main server file
├── .env                 # Environment variables (not in version control)
├── .env.example         # Environment variables template
├── API_DOCUMENTATION.md # API documentation
└── README.md            # This file
```

## Registering Games

To register a new game and generate an API key, run:
```
node src/scripts/registerGame.js
```

## Production Deployment Checklist

1. [ ] Verify all environment variables are set correctly
2. [ ] Ensure service account file is securely deployed
3. [ ] Check that API_KEY_SALT is unique and secure
4. [ ] Verify Privy credentials are correctly configured
5. [ ] Test all API endpoints with valid and invalid requests
6. [ ] Confirm health check endpoint shows all services connected
7. [ ] Set up proper logging and monitoring
8. [ ] Configure rate limiting if needed
9. [ ] Ensure HTTPS is used in production
10. [ ] Verify security headers are properly set

## Deployment

This server can be deployed to any Node.js hosting platform such as:
- Google Cloud Run
- Heroku
- AWS Elastic Beanstalk
- DigitalOcean App Platform

Make sure to set the environment variables in your deployment environment.