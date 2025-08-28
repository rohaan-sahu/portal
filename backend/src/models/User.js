const { db, admin } = require('../config/firebase');

class User {
  static async createUser(privyDid, userData) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const userRef = db.collection('users').doc(privyDid);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        await userRef.set({
          ...userData,
          createdAt: new Date(),
          totalPoints: 0,
          gamesPlayed: 0,
          lastActive: new Date()
        });
        console.log(`Created new user with DID: ${privyDid}`);
      } else {
        console.log(`User with DID: ${privyDid} already exists`);
      }
      
      const updatedUserDoc = await userRef.get();
      return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async getUserByDid(privyDid) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const userRef = db.collection('users').doc(privyDid);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
        return null;
      }
      
      return { id: userDoc.id, ...userDoc.data() };
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  static async updateTotalPoints(privyDid, points) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const userRef = db.collection('users').doc(privyDid);
      await userRef.update({
        totalPoints: admin.firestore.FieldValue.increment(points),
        lastActive: new Date()
      });
      
      const updatedUserDoc = await userRef.get();
      return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
    } catch (error) {
      console.error('Error updating user points:', error);
      throw error;
    }
  }

  static async updateProfile(privyDid, profileData) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const userRef = db.collection('users').doc(privyDid);
      await userRef.update({
        ...profileData,
        lastActive: new Date()
      });
      
      const updatedUserDoc = await userRef.get();
      return { id: updatedUserDoc.id, ...updatedUserDoc.data() };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  static async getGlobalLeaderboard(limit = 100) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const usersRef = db.collection('users');
      const query = usersRef
        .orderBy('totalPoints', 'desc')
        .limit(limit);
      
      const snapshot = await query.get();
      const leaderboard = [];
      
      let rank = 1;
      snapshot.forEach(doc => {
        const userData = doc.data();
        leaderboard.push({
          userId: doc.id,
          displayName: userData.displayName || 'Anonymous Player',
          totalPoints: userData.totalPoints || 0,
          rank: rank++
        });
      });
      
      return leaderboard;
    } catch (error) {
      console.error('Error getting global leaderboard:', error);
      throw error;
    }
  }
}

module.exports = User;