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
  where, // Added where for permission-based filtering
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  increment
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth
import nacl from 'tweetnacl';
import { firebaseConfig } from './firebase-config.js';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize Firebase Authentication

// User functions
async function registerUser(userId, userData) {
  const userRef = doc(db, 'users', userId);
  try {
    const docSnap = await getDoc(userRef);
    if (!docSnap.exists()) {
      const defaultData = {
        uid: userId,
        displayName: userData.displayName || `Player_${userId.slice(0, 8)}`,
        createdAt: serverTimestamp(),
        isWeb3: userData.isWeb3 || false,
        solanaPublicKey: userData.solanaPublicKey || null,
        highScore: 0,
        timesPlayed: 0,
        totalCoinsClaimed: 0,
        lastActive: serverTimestamp(),
      };
      await setDoc(userRef, defaultData);
      console.log(`User registered: ${userId}`);
      if (typeof window.updateUserCount === 'function') {
        window.updateUserCount();
      }
    }
    return;
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
}

async function loadGameData() {
  // This function would typically fetch user-specific game data
  // For now, we'll return mock data
  return {
    highScore: 0,
    timesPlayed: 0,
    totalCoinsClaimed: 0
  };
}

async function updateProfile(user, profileData) {
  const userRef = doc(db, 'users', user.id);
  try {
    await updateDoc(userRef, profileData);
    console.log(`Profile updated for user: ${user.id}`);
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Leaderboard functions
async function getLeaderboard() {
  try {
    const leaderboardRef = collection(db, 'leaderboards', 'global', 'entries');
    const q = query(leaderboardRef, orderBy('score', 'desc'), limit(100));
    const querySnapshot = await getDocs(q);
    
    const leaderboard = [];
    querySnapshot.forEach((doc) => {
      leaderboard.push({ id: doc.id, ...doc.data() });
    });
    
    return leaderboard;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
}

// Game functions
async function submitScore(userId, gameId, score) {
  try {
    // Add score to game-specific leaderboard
    const gameLeaderboardRef = collection(db, 'leaderboards', `${gameId}-all-time`, 'entries');
    const scoreDocRef = doc(gameLeaderboardRef, userId);
    const scoreDoc = await getDoc(scoreDocRef);
    
    if (scoreDoc.exists()) {
      const currentScore = scoreDoc.data().score;
      if (score > currentScore) {
        await updateDoc(scoreDocRef, {
          score: score,
          updatedAt: serverTimestamp()
        });
      }
    } else {
      await setDoc(scoreDocRef, {
        userId: userId,
        score: score,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    }
    
    // Update user's total score
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalScore: increment(score),
      timesPlayed: increment(1),
      lastActive: serverTimestamp()
    });
    
    console.log(`Score submitted for user ${userId} in game ${gameId}: ${score}`);
    return { success: true };
  } catch (error) {
    console.error('Error submitting score:', error);
    throw error;
  }
}

// Community functions
async function getRecentActivity() {
  try {
    const user = auth.currentUser; // Get current authenticated user
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Ensure the user is authorized to read community activities
    const activitiesRef = collection(db, 'communityActivities');
    const q = query(activitiesRef, where('readers', 'array-contains', user.uid), orderBy('timestamp', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);

    const activities = [];
    querySnapshot.forEach((doc) => {
      activities.push({ id: doc.id, ...doc.data() });
    });

    return activities;
  } catch (error) {
    console.error('Error fetching recent activity:', error);
    throw error;
  }
}

export {
  db,
  auth, // Export auth for general access
  registerUser,
  loadGameData,
  updateProfile,
  getLeaderboard,
  submitScore,
  getRecentActivity
};