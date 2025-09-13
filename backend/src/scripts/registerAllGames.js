const Game = require('../models/Game');

async function registerAllGames() {
  const games = [
    {
      name: 'Think Tac Toe',
      description: 'Strategic tic-tac-toe variant',
      gameId: 'think-tac-toe'
    },
    {
      name: 'Chain Bros',
      description: 'Fast-paced chain adventure game',
      gameId: 'chain-bros'
    },
    {
      name: 'Pixel Hunt',
      description: 'Pixelated hunting challenge',
      gameId: 'pixel-hunt'
    },
    {
      name: 'Solflare Defender',
      description: 'Defend the Solflare network',
      gameId: 'solflare-defender'
    },
    {
      name: 'Phantom Runner',
      description: 'Endless runner in the Phantom universe',
      gameId: 'phantom-runner'
    },
    {
      name: 'Block Miner',
      description: 'Mine blocks and build your empire',
      gameId: 'block-miner'
    }
  ];

  try {
    console.log('Registering all games...');

    for (const gameData of games) {
      try {
        const game = await Game.createGame(gameData);
        console.log(`✓ Registered: ${game.name} (ID: ${game.id})`);
        console.log(`  API Key: ${game.plainApiKey}`);
        console.log('  ---');
      } catch (error) {
        console.log(`✗ Failed to register ${gameData.name}:`, error.message);
      }
    }

    console.log('Game registration complete!');
  } catch (error) {
    console.error('Error registering games:', error);
  }
}

// Run if this script is executed directly
if (require.main === module) {
  registerAllGames();
}

module.exports = registerAllGames;
