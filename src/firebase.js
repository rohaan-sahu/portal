import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  signInAnonymously,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
let isSigningIn = false;

// Set auth persistence to LOCAL
setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Auth persistence set to LOCAL'))
  .catch((error) => console.error('Error setting persistence:', error));

// Handle redirect result
async function handleRedirectResult() {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      if (!user.displayName) {
        const derivedName = deriveNameFromEmail(user.email);
        await updateUserProfile(user, { displayName: derivedName });
      }
      await registerUser(user, false);
      window.currentUser = user;
      return user;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error.code, error.message);
    throw error;
  }
}

// Derive display name from email
function deriveNameFromEmail(email) {
  if (!email) return 'unnamedPlayer';
  const localPart = email.split('@')[0];
  const parts = localPart.split('.').map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
  return parts.join('').replace(/[^a-zA-Z0-9]/g, '');
}

// Register user in Firestore
async function registerUser(user, isWeb3 = false, solanaPublicKey = null) {
  const userRef = doc(db, 'users', user.uid);
  let attempts = 0;
  const maxAttempts = 3;
  while (attempts < maxAttempts) {
    try {
      const docSnap = await getDoc(userRef);
      if (!docSnap.exists()) {
        const defaultData = {
          uid: user.uid,
          displayName: user.displayName || deriveNameFromEmail(user.email) || `player${user.uid.slice(0, 8)}`,
          createdAt: serverTimestamp(),
          isWeb3: isWeb3,
          solanaPublicKey: isWeb3 ? solanaPublicKey : null,
          games: {},
          lastActive: serverTimestamp(),
        };
        await setDoc(userRef, defaultData);
        console.log(`User registered: ${user.uid}, Web3: ${isWeb3}`);
      }
      return;
    } catch (error) {
      attempts++;
      console.error(`Register user attempt ${attempts} failed:`, error.code, error.message);
      if (attempts === maxAttempts) {
        throw new Error(`Failed to register user after ${maxAttempts} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

// Sign in with Google
async function signInWithGoogle() {
  if (!auth) throw new Error('Auth not initialized');
  if (isSigningIn) return auth.currentUser;
  isSigningIn = true;
  try {
    await signInWithRedirect(auth, googleProvider);
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message, error.stack);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

// Sign in with Solana wallet
async function signInWithSolana() {
  if (!auth) throw new Error('Auth not initialized');
  if (isSigningIn) return auth.currentUser;
  isSigningIn = true;
  try {
    const provider = window.solana;
    if (!provider || !provider.isConnected) {
      throw new Error('Solana wallet not detected. Please install Solflare or Phantom.');
    }
    await provider.connect();
    const publicKey = provider.publicKey.toString();
    let user = auth.currentUser;
    if (!user) {
      const result = await signInAnonymously(auth);
      user = result.user;
    }
    await registerUser(user, true, publicKey);
    window.currentUser = user;
    return { user, publicKey };
  } catch (error) {
    console.error('Solana sign-in error:', error.code || error.message, error.stack);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

// Sign out
async function signOutUser() {
  if (!auth) throw new Error('Auth not initialized');
  try {
    await firebaseSignOut(auth);
    window.currentUser = null;
    console.log('User signed out successfully');
  } catch (error) {
    console.error('Sign-out error:', error.code, error.message);
    throw error;
  }
}

// Load game data
async function loadGameData() {
  const user = auth.currentUser;
  if (!user) return null;
  const docRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Load game data error:', error.code, error.message);
    throw error;
  }
}

// Save game data
async function saveGameData(data) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user signed in');
  const userRef = doc(db, 'users', user.uid);
  try {
    const updatedData = {
      ...data,
      uid: user.uid,
      displayName: user.displayName || data.displayName || 'unnamedPlayer',
      lastActive: serverTimestamp(),
    };
    await setDoc(userRef, updatedData, { merge: true });
  } catch (error) {
    console.error('Save game data error:', error.code, error.message);
    throw error;
  }
}

// Update profile
async function updateUserProfile(user, profile) {
  try {
    await firebaseUpdateProfile(user, profile);
    if (profile.displayName) {
      await saveGameData({ displayName: profile.displayName });
    }
  } catch (error) {
    console.error('Profile update error:', error.code, error.message);
    throw error;
  }
}

export {
  auth,
  db,
  doc,
  setDoc,
  getDoc,
  registerUser,
  signInWithGoogle,
  signInWithSolana,
  signOutUser,
  loadGameData,
  saveGameData,
  updateUserProfile,
  handleRedirectResult,
};