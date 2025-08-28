const readline = require('readline');
const Game = require('../models/Game');
require('dotenv').config({ path: '../.env' });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function registerGame() {
  console.log('Register a new game');
  console.log('====================');

  rl.question('Game ID (used as document ID): ', async (gameId) => {
    rl.question('Game name: ', async (name) => {
      rl.question('Game description: ', async (description) => {
        try {
          const gameData = {
            name,
            description,
            gameId
          };

          const result = await Game.createGame(gameData);
          
          console.log('\nGame registered successfully!');
          console.log('==============================');
          console.log(`Game ID: ${result.id}`);
          console.log(`Name: ${result.name}`);
          console.log(`Description: ${result.description}`);
          console.log(`API Key (KEEP THIS SECRET!): ${result.plainApiKey}`);
          console.log('\nStore this API key securely. It will not be shown again.');
          
          rl.close();
        } catch (error) {
          if (error.message === 'Database not initialized') {
            console.error('Error: Database service not available. Please check your Firebase configuration.');
          } else {
            console.error('Error registering game:', error);
          }
          rl.close();
        }
      });
    });
  });
}

// Run if this script is executed directly
if (require.main === module) {
  registerGame();
}

module.exports = registerGame;