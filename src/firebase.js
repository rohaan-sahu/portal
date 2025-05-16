import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  signInWithCustomToken,
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { firebaseConfig } from './firebase-config';
import nacl from 'tweetnacl';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    await signInWithRedirect(auth, googleProvider);
    return { success: true };
  } catch (error) {
    console.error('Google sign-in error:', error.message);
    throw new Error(`Google sign-in failed: ${error.message}`);
  }
};

export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      const user = result.user;
      await setDoc(doc(db, 'users', user.uid), {
        displayName: user.displayName || user.email?.split('@')[0] || 'Player',
        email: user.email,
        lastLogin: new Date(),
      }, { merge: true });
      return user;
    }
    return null;
  } catch (error) {
    console.error('Redirect result error:', error.message);
    throw new Error(`Redirect error: ${error.message}`);
  }
};

export const signInWithSolana = async () => {
  try {
    if (!window.solana || (!window.solana.isPhantom && !window.solana.isSolflare)) {
      throw new Error('Solana wallet not detected. Please install Solflare or Phantom.');
    }

    const provider = window.solana;
    const { publicKey } = await provider.connect();
    const publicKeyStr = publicKey.toString();

    const message = new TextEncoder().encode('Sign in to Playrush.io');
    const signature = await provider.signMessage(message);
    const isValid = nacl.sign.detached.verify(message, signature, publicKey.toBytes());

    if (!isValid) {
      throw new Error('Invalid Solana signature');
    }

    // Mock custom token (replace with backend if available)
    const response = await fetch('http://localhost:3000/api/auth/solana', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicKey: publicKeyStr, signature: Buffer.from(signature).toString('hex') }),
    });

    if (!response.ok) {
      throw new Error('Solana authentication failed');
    }

    const { token } = await response.json();
    const userCredential = await signInWithCustomToken(auth, token);
    const user = userCredential.user;

    await setDoc(doc(db, 'users', user.uid), {
      solanaPublicKey: publicKeyStr,
      displayName: user.displayName || `Player_${publicKeyStr.slice(0, 4)}`,
      lastLogin: new Date(),
    }, { merge: true });

    return { user, publicKey: publicKeyStr };
  } catch (error) {
    console.error('Solana sign-in error:', error.message);
    throw error;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    console.error('Sign-out error:', error.message);
    throw new Error(`Sign-out failed: ${error.message}`);
  }
};

export const loadGameData = async () => {
  const user = auth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data();
    }
  }
  return null;
};

export const updateUserProfile = async (user, data) => {
  if (user) {
    await setDoc(doc(db, 'users', user.uid), data, { merge: true });
  }
};

export { auth, onAuthStateChanged };