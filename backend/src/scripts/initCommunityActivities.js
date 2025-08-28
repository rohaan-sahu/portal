const { db } = require('../config/firebase');

async function initCommunityActivities() {
  try {
    // Sample community activities
    const activities = [
      {
        title: 'New User Joined',
        description: 'Welcome to Playrush! Start playing games to earn points.',
        type: 'login',
        timestamp: new Date(),
        points: 50
      },
      {
        title: 'High Score Achieved',
        description: 'Player achieved a new high score in Chain Bros!',
        type: 'leaderboard',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        points: 100
      },
      {
        title: 'Community Task Completed',
        description: 'Player completed the Twitter follow task',
        type: 'task',
        timestamp: new Date(Date.now() - 86400000), // 1 day ago
        points: 75
      },
      {
        title: 'Leaderboard Climb',
        description: 'Player moved up 5 positions on the global leaderboard',
        type: 'leaderboard',
        timestamp: new Date(Date.now() - 172800000), // 2 days ago
        points: 150
      }
    ];

    // Add activities to Firestore
    for (const activity of activities) {
      await db.collection('communityActivities').add(activity);
    }

    console.log('Community activities initialized successfully');
  } catch (error) {
    console.error('Error initializing community activities:', error);
  }
}

// Run the initialization if this script is executed directly
if (require.main === module) {
  initCommunityActivities().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { initCommunityActivities };