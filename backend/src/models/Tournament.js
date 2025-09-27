const { db, admin } = require('../config/firebase');

class Tournament {
    static async createTournament(gameData) {
      if (!db) {
        throw new Error('Database not initialized');
      }
      if (!gameData.name || !gameData.gameId) {
        throw new Error('Missing required tournament fields');
      }

      try {
        // Generate a random API key
        const apiKey = crypto.randomBytes(32).toString('hex');
        
        // Hash the API key for storage
        const salt = process.env.API_KEY_SALT || 'default-salt';
        const hashedApiKey = crypto
          .createHash('sha256')
          .update(apiKey + salt)
          .digest('hex');
        
        const tournamentRef = await db.collection('tournaments').add({
          ...gameData,
          game: db.collection('games').doc(gameData.gameId),
          apiKey: hashedApiKey,
          startTime: new Date(startTime),
          endTime: new Date(endTime),
          timeElapsed: null,
          participants: [],
          rounds: [],
          createdAt: new Date()
        });
        
        const tournamentDoc = await tournamentRef.get();
        
        // Return the tournament data with the plain API key (only shown once)
        return { 
          id: tournamentDoc.id,
          ...tournamentDoc.data(),
          plainApiKey: apiKey
        };
      } catch (error) {
        console.error('Error creating tournament:', error);
        throw error;
      }
    }

    static async getTournamentById(tournamentId) {
        if (!db) {
          throw new Error('Database not initialized');
        }
        
        try {
          // First try to find by document ID
          const tournamentRef = db.collection('tournaments').doc(tournamentId);
          const tournamentDoc = await tournamentRef.get();
          
          if (tournamentDoc.exists) {
            return { id: tournamentDoc.id, ...tournamentDoc.data() };
          }
          
          // If not found by ID, try to find by tournamentId field
          const query = db.collection('tournaments').where('tournamentId', '==', tournamentId).limit(1);
          const snapshot = await query.get();
          
          if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
          }
          
          return null;
        } catch (error) {
          console.error('Error getting tournament:', error);
          throw error;
        }
      }
    
      static async verifyApiKey(tournamentId, apiKey) {
        if (!db) {
          throw new Error('Database not initialized');
        }
        
        try {
          const tournament = await this.gettournamentById(tournamentId);
          if (!tournament) {
            return false;
          }
          
          const salt = process.env.API_KEY_SALT || 'default-salt';
          const hashedApiKey = crypto
            .createHash('sha256')
            .update(apiKey + salt)
            .digest('hex');
          
          return tournament.apiKey === hashedApiKey;
        } catch (error) {
          console.error('Error verifying API key:', error);
          return false;
        }
      }
}