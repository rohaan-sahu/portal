import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously as firebaseSignInAnonymously,
  setPersistence,
  browserLocalPersistence,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { getAnalytics, logEvent } from 'firebase/analytics';
import nacl from 'tweetnacl';
import { firebaseConfig } from './firebase-config.js';


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = process.env.NODE_ENV === 'production' ? getAnalytics(app) : null;
const googleProvider = new GoogleAuthProvider();
let isSigningIn = false;


setPersistence(auth, browserLocalPersistence)
  .then(() => console.log('Auth persistence set to LOCAL'))
  .catch((error) => console.error('Error setting persistence:', error));

function deriveNameFromEmail(email) {
  if (!email) return 'UnnamedPlayer';
  const localPart = email.split('@')[0];
  const parts = localPart.split('.').map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
  return parts.join('').replace(/[^a-zA-Z0-9]/g, '');
}


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
          displayName: user.displayName || deriveNameFromEmail(user.email) || `Player_${user.uid.slice(0, 8)}`,
          createdAt: serverTimestamp(),
          isWeb3: isWeb3,
          solanaPublicKey: isWeb3 ? solanaPublicKey : null,
          highScore: 0,
          timesPlayed: 0,
          totalCoinsClaimed: 0,
          lastActive: serverTimestamp(),
        };
        await setDoc(userRef, defaultData);
        console.log(`User registered: ${user.uid}, Web3: ${isWeb3}`);
        if (typeof window.updateUserCount === 'function') {
          window.updateUserCount();
        }
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


async function signInWithGoogle() {
  if (!auth) throw new Error('Auth not initialized');
  if (isSigningIn) return auth.currentUser;
  isSigningIn = true;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (!user.displayName) {
      const derivedName = deriveNameFromEmail(user.email);
      await firebaseUpdateProfile(user, { displayName: derivedName });
    }
    await registerUser(user, false);
    return user; 
  } catch (error) {
    console.error('Google sign-in error:', error.code, error.message, error.stack);
    throw error;
  } finally {
    isSigningIn = false;
  }
}

async function signInWithSolana() {
  if (!auth) throw new Error('Auth not initialized');
  if (isSigningIn) return auth.currentUser;
  isSigningIn = true;
  try {
    if (!window.solana || (!window.solana.isPhantom && !window.solana.isSolflare)) {
      throw new Error('Solana wallet not detected. Please install Solflare or Phantom.');
    }

    const provider = window.solana;
    const { publicKey } = await provider.connect();
    const publicKeyStr = publicKey.toString();

    const message = new TextEncoder().encode('Sign in to Playrush.io');
    const signatureObj = await provider.signMessage(message, 'utf8');

    
    const signature = signatureObj.signature;
    console.log('Signature length:', signature?.length, 'Signature:', signature);
    if (!signature || signature.length !== 64) {
      throw new Error(`Invalid signature size: ${signature?.length || 0}, expected 64 bytes`);
    }

   
    const signatureUint8 = signature instanceof Uint8Array ? signature : new Uint8Array(signature);
    const publicKeyUint8 = publicKey.toBytes();

  
    const isValid = nacl.sign.detached.verify(message, signatureUint8, publicKeyUint8);
    if (!isValid) {
      throw new Error('Invalid Solana signature');
    } const result = await firebaseSignInAnonymously(auth);
    const user = result.user;

    await registerUser(user, true, publicKeyStr);
    if (analytics) {
      logEvent(analytics, 'sign_in', { method: 'solana' });
    }
    return { user, publicKey: publicKeyStr };
  } catch (error) {
    console.error('Solana sign-in error:', error.message, error.stack);
    if (analytics) {
      logEvent(analytics, 'exception', { description: `Solana sign-in error: ${error.message}`, fatal: false });
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
}


async function signInAnonymously() {
  if (!auth) throw new Error('Auth not initialized');
  if (isSigningIn) return auth.currentUser;
  isSigningIn = true;
  try {
    const result = await firebaseSignInAnonymously(auth);
    const user = result.user;

    await registerUser(user, false);
    if (analytics) {
      logEvent(analytics, 'sign_in', { method: 'anonymous' });
    }
    return result;
  } catch (error) {
    console.error('Anonymous sign-in error:', error.code, error.message, error.stack);
    if (analytics) {
      logEvent(analytics, 'exception', { description: `Anonymous sign-in error: ${error.message}`, fatal: false });
    }
    throw error;
  } finally {
    isSigningIn = false;
  }
}


async function signOut() {
  if (!auth) throw new Error('Auth not initialized');
  try {
    await firebaseSignOut(auth);
    console.log('User signed out successfully');
    if (analytics) {
      logEvent(analytics, 'sign_out');
    }
  } catch (error) {
    console.error('Sign-out error:', error.code, error.message);
    throw error;
  }
}


async function loadGameData() {
  const user = auth.currentUser;
  if (!user) return null;
  const docRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data;
    }
    return null;
  } catch (error) {
    console.error('Load game data error:', error.code, error.message);
    throw error;
  }
}


async function saveGameData(data) {
  const user = auth.currentUser;
  if (!user) throw new Error('No user signed in');
  const userRef = doc(db, 'users', user.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (docSnap.exists() && docSnap.data().isWeb3) {
      return;
    }
    const updatedData = {
      ...data,
      uid: user.uid,
      displayName: user.displayName || data.displayName || 'UnnamedPlayer',
      lastActive: serverTimestamp(),
    };
    await setDoc(userRef, updatedData, { merge: true });
    if (updatedData.highScore) {
      const leaderboardRef = doc(db, 'leaderboard', user.uid);
      await setDoc(
        leaderboardRef,
        {
          uid: user.uid,
          displayName: updatedData.displayName,
          highScore: updatedData.highScore,
          lastUpdated: serverTimestamp(),
        },
        { merge: true }
      );
    }
  } catch (error) {
    console.error('Save game data error:', error.code, error.message);
    throw error;
  }
}


async function getLeaderboard() {
  try {
    const q = query(collection(db, 'leaderboard'), orderBy('highScore', 'desc'), limit(10));
    const querySnapshot = await getDocs(q);
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      leaderboard.push({
        uid: doc.id,
        displayName: data.displayName || 'UnnamedPlayer',
        highScore: data.highScore || 0,
      });
    });
    return leaderboard;
  } catch (error) {
    console.error('Get Leaderboard Error:', error.code, error.message);
    return [];
  }
}


function getTotalUsers(callback) {
  try {
    if (!auth.currentUser) {
      console.log('Skipping getTotalUsers: no authenticated user');
      callback(0);
      return () => {};
    }
    console.log('Setting up getTotalUsers query');
    const q = query(collection(db, 'users'));
    return onSnapshot(
      q,
      { includeMetadataChanges: true },
      (snapshot) => {
        if (snapshot.metadata.fromCache) {
          console.warn('User count from cache, may be stale');
        }
        const count = snapshot.size;
        console.log(`Total users: ${count}, hasPendingWrites: ${snapshot.metadata.hasPendingWrites}`);
        callback(count || 0);
      },
      (error) => {
        console.error('Total users query error:', error.code, error.message, error.stack);
        callback(0);
      }
    );
  } catch (error) {
    console.error('Get total users setup error:', error.message, error.stack);
    callback(0);
    return () => {};
  }
}

async function updateProfile(user, profile) {
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


async function getRecentActivity(limitCount = 5) {
  try {
    const q = query(
      collection(db, 'activity'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    const activities = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      activities.push({
        id: doc.id,
        userId: data.userId,
        displayName: data.displayName || 'UnnamedPlayer',
        action: data.action,
        timestamp: data.timestamp?.toDate().toLocaleString() || 'Unknown',
      });
    });
    return activities;
  } catch (error) {
    console.error('Get recent activity error:', error.code, error.message);
    return [];
  }
}


async function logActivity(user, action) {
  if (!user) return;
  try {
    const activityRef = collection(db, 'activity');
    await addDoc(activityRef, {
      userId: user.uid,
      displayName: user.displayName || 'UnnamedPlayer',
      action,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error('Log activity error:', error.code, error.message);
  }
}


async function claimReward(solanaPublicKey) {
  if (!auth.currentUser) throw new Error('No user signed in');
  if (!solanaPublicKey) throw new Error('No Solana wallet connected');

  const userRef = doc(db, 'users', auth.currentUser.uid);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists() || !docSnap.data().isWeb3 || docSnap.data().solanaPublicKey !== solanaPublicKey) {
      throw new Error('Invalid Solana account');
    }

    // Verify Solana signature
    const provider = window.solana;
    if (!provider || (!provider.isPhantom && !provider.isSolflare)) {
      throw new Error('Solana wallet not detected');
    }

    const message = new TextEncoder().encode(`Claim Playrush reward for ${solanaPublicKey}`);
    const signatureObj = await provider.signMessage(message, 'utf8');
    const signature = signatureObj.signature;
    if (!signature || signature.length !== 64) {
      throw new Error(`Invalid signature size: ${signature?.length || 0}`);
    }

    const signatureUint8 = signature instanceof Uint8Array ? signature : new Uint8Array(signature);
    const publicKeyUint8 = (await provider.connect()).publicKey.toBytes();
    const isValid = nacl.sign.detached.verify(message, signatureUint8, publicKeyUint8);
    if (!isValid) {
      throw new Error('Invalid reward claim signature');
    }

    // Update user data
    const currentCoins = docSnap.data().totalCoinsClaimed || 0;
    const rewardAmount = 10; 
    await setDoc(
      userRef,
      {
        totalCoinsClaimed: currentCoins + rewardAmount,
        lastActive: serverTimestamp(),
      },
      { merge: true }
    );

   
    await logActivity(auth.currentUser, `Claimed ${rewardAmount} Playrush coins`);

    if (analytics) {
      logEvent(analytics, 'reward_claim', { method: 'solana', amount: rewardAmount });
    }
    return { success: true, amount: rewardAmount };
  } catch (error) {
    console.error('Claim reward error:', error.message);
    if (analytics) {
      logEvent(analytics, 'exception', { description: `Reward claim error: ${error.message}`, fatal: false });
    }
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
  signInAnonymously,
  signOut,
  loadGameData,
  saveGameData,
  getTotalUsers,
  getLeaderboard,
  updateProfile,
  getRecentActivity,
  logActivity,
  claimReward,
};