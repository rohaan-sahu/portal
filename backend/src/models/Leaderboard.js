const { db } = require('../config/firebase');

class Leaderboard {
  static async updateGameLeaderboard(gameId, userId, score, userData) {
    // Mock update - always succeed
    console.log(`Mock updated leaderboard for game ${gameId}, user ${userId} with score ${score}`);
    return true;
  }

  static async getGameLeaderboard(gameId, limit = 100) {
    // Return mock game leaderboard data
    return [
      { userId: 'mock1', displayName: 'Player 1', score: 100, rank: 1 },
      { userId: 'mock2', displayName: 'Player 2', score: 80, rank: 2 },
      { userId: 'mock3', displayName: 'Player 3', score: 60, rank: 3 },
    ];
  }

  static async getUserRankInGame(gameId, userId) {
    // Return mock rank
    return 1;
  }
}

module.exports = Leaderboard;