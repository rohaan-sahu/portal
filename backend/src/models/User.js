const { db, admin } = require('../config/firebase');

class User {
  static async createUser(privyDid, userData) {
    // Return mock user data
    return {
      id: privyDid,
      ...userData,
      createdAt: new Date(),
      totalPoints: 0,
      gamesPlayed: 0,
      lastActive: new Date()
    };
  }

  static async getUserByDid(privyDid) {
    // Return mock user data
    return {
      id: privyDid,
      displayName: 'Mock Player',
      totalPoints: 50,
      gamesPlayed: 5,
      createdAt: new Date(),
      lastActive: new Date()
    };
  }

  static async updateTotalPoints(privyDid, points) {
    // Return mock updated user data
    return {
      id: privyDid,
      displayName: 'Mock Player',
      totalPoints: 50 + points,
      gamesPlayed: 6,
      createdAt: new Date(),
      lastActive: new Date()
    };
  }

  static async updateProfile(privyDid, profileData) {
    // Return mock updated user data
    return {
      id: privyDid,
      ...profileData,
      totalPoints: 50,
      gamesPlayed: 5,
      createdAt: new Date(),
      lastActive: new Date()
    };
  }

  static async getGlobalLeaderboard(limit = 100) {
    // Return mock leaderboard data
    return [
      { userId: 'mock1', displayName: 'Player 1', totalPoints: 100, rank: 1 },
      { userId: 'mock2', displayName: 'Player 2', totalPoints: 80, rank: 2 },
      { userId: 'mock3', displayName: 'Player 3', totalPoints: 60, rank: 3 },
    ];
  }
}

module.exports = User;