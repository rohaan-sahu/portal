// Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBt17oe3cgN9NVD08gNa90Q45wLx3tUWf0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "runner-18abe.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "runner-18abe",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "runner-18abe.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "47659608687",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:47659608687:web:1f0a1a1a1a1a1a1a1a1a1a"
};