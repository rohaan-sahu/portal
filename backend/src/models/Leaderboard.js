const { db } = require('../config/firebase');

class Leaderboard {
  static async updateGameLeaderboard(gameId, userId, score, userData) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      // Update game-specific leaderboard
      const leaderboardId = `${gameId}-all-time`;
      const entryRef = db.collection('leaderboards').doc(leaderboardId).collection('entries').doc(userId);
      
      // Use a transaction to ensure data consistency
      await db.runTransaction(async (transaction) => {
        const entryDoc = await transaction.get(entryRef);
        
        // If entry exists and new score is higher, update it
        if (entryDoc.exists) {
          const currentScore = entryDoc.data().score;
          if (score > currentScore) {
            transaction.update(entryRef, {
              score: score,
              updatedAt: new Date(),
              ...userData
            });
          }
        } else {
          // Create new entry
          transaction.set(entryRef, {
            score: score,
            userId: userId,
            createdAt: new Date(),
            ...userData
          });
        }
      });
      
      console.log(`Updated leaderboard for game ${gameId}, user ${userId} with score ${score}`);
      return true;
    } catch (error) {
      console.error('Error updating game leaderboard:', error);
      throw error;
    }
  }

  static async getGameLeaderboard(gameId, limit = 100) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const leaderboardId = `${gameId}-all-time`;
      const entriesRef = db.collection('leaderboards').doc(leaderboardId).collection('entries');
      const query = entriesRef.orderBy('score', 'desc').limit(limit);
      
      const snapshot = await query.get();
      const entries = [];
      
      let rank = 1;
      snapshot.forEach(doc => {
        const entryData = doc.data();
        entries.push({
          userId: entryData.userId,
          displayName: entryData.displayName || 'Anonymous Player',
          score: entryData.score,
          rank: rank++
        });
      });
      
      return entries;
    } catch (error) {
      console.error('Error getting game leaderboard:', error);
      throw error;
    }
  }

  static async getUserRankInGame(gameId, userId) {
    if (!db) {
      throw new Error('Database not initialized');
    }
    
    try {
      const leaderboardId = `${gameId}-all-time`;
      const entriesRef = db.collection('leaderboards').doc(leaderboardId).collection('entries');
      const query = entriesRef.orderBy('score', 'desc');
      
      const snapshot = await query.get();
      
      let userRank = null;
      let rank = 1;
      
      for (const doc of snapshot.docs) {
        if (doc.id === userId) {
          userRank = rank;
          break;
        }
        rank++;
      }
      
      return userRank;
    } catch (error) {
      console.error('Error getting user rank in game:', error);
      throw error;
    }
  }
}

module.exports = Leaderboard;