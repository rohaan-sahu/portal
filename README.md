# Playrush Gaming Portal

A modern Web3 gaming platform built with React, Vite, and Firebase. Features include user authentication via Privy, leaderboard management, game integration, and community features.

## Features

- **Web3 Authentication**: Secure login with Privy (Google, Solana wallets)
- **Game Integration**: Connect with multiple skill-based games
- **Leaderboards**: Global and game-specific rankings
- **Community Features**: Activity tracking, tasks, and social engagement
- **Responsive Design**: Mobile-friendly interface with dark theme
- **Real-time Updates**: Live leaderboard updates via Firestore

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: Firebase Firestore
- **Authentication**: Privy
- **3D Graphics**: Three.js, React Three Fiber
- **Deployment**: Vercel

## Prerequisites

- Node.js 20+
- Firebase project
- **Privy account** (required for authentication)

## Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd playrush-launcher
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

3. **Environment Configuration**

   Create `.env` file in root:
   ```env
   VITE_FIREBASE_API_KEY=your-firebase-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   VITE_PRIVY_APP_ID=your-privy-app-id
   VITE_API_BASE_URL=/api
   ```

   Create `backend/.env`:
   ```env
   PORT=3002
   FIREBASE_SERVICE_ACCOUNT_KEY_PATH=./runner-18abe-firebase-adminsdk-fbsvc-eee2faafd9.json
   PRIVY_APP_ID=your-privy-app-id
   PRIVY_APP_SECRET=your-privy-app-secret
   API_KEY_SALT=your-unique-salt
   ```

4. **Firebase Setup**
   - Create Firebase project
   - Enable Firestore
   - Generate service account key
   - Place the JSON file in `backend/` directory

5. **Privy Setup** (CRITICAL - Required for Authentication)
    - Go to [privy.io](https://privy.io) and create an account
    - Create a new app in the Privy dashboard
    - Configure authentication methods (Google, Solana wallets)
    - Copy the **App ID** and **App Secret** from your Privy app settings
    - Update the environment files with your real Privy credentials:

    **Frontend (.env):**
    ```env
    VITE_PRIVY_APP_ID=your-actual-privy-app-id
    ```

    **Backend (backend/.env):**
    ```env
    PRIVY_APP_ID=your-actual-privy-app-id
    PRIVY_APP_SECRET=your-actual-privy-app-secret
    ```

    ⚠️ **IMPORTANT**: The current Privy credentials are invalid. You must replace them with real credentials from your Privy dashboard for authentication to work.

## Running the Application

### Development
```bash
# Start frontend
npm run dev

# Start backend (in another terminal)
npm run dev:backend

# Or start both
npm run dev:both
```

### Production Build
```bash
npm run build
npm run preview
```

## Project Structure

```
├── src/
│   ├── components/     # React components
│   ├── scenes/         # 3D scenes
│   ├── firebase.js     # Firebase configuration
│   ├── api.js          # API utilities
│   └── PrivyAuth.jsx   # Authentication provider
├── backend/
│   ├── src/
│   │   ├── config/     # Firebase/Privy config
│   │   ├── controllers/# API controllers
│   │   ├── middleware/ # Auth middleware
│   │   ├── models/     # Database models
│   │   └── routes/     # API routes
│   └── API_DOCUMENTATION.md
├── public/             # Static assets
└── backend/            # Backend server
```

## API Documentation

See `backend/API_DOCUMENTATION.md` for detailed API information.

## Deployment

- **Frontend**: Deploy to Vercel/Netlify
- **Backend**: Deploy to any Node.js hosting (Heroku, Railway, etc.)

## Troubleshooting

### Privy Authentication Errors

If you see errors like "Invalid Privy app ID" or "Invalid or expired token":

1. **Check Privy Credentials**: Ensure your Privy app credentials are correct
2. **Update Environment Files**: Replace placeholder values with real Privy credentials
3. **Restart Servers**: Restart both frontend and backend after updating credentials
4. **Check Privy Dashboard**: Verify your app is active in the Privy dashboard

### Common Issues

- **403 Forbidden**: Invalid or missing Privy credentials
- **ECONNREFUSED**: Backend server not running
- **404 Not Found**: API routes not properly configured
- **CORS errors**: Check Vite proxy configuration

### Development Commands

```bash
# Start frontend only
npm run dev

# Start backend only
npm run dev:backend

# Start both servers
npm run dev:both

# Check backend health
curl http://localhost:3002/health
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
