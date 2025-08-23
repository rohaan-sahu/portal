
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getLeaderboard } from '../firebase';

export default function Leaderboard() {
  const [user] = useAuthState(auth);
  const [globalLeaderboard, setGlobalLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(null);
  const [seasonEndDate] = useState(new Date('2025-12-31'));

  useEffect(() => {
    async function fetchData() {
      try {
        const lb = await getLeaderboard();
        setGlobalLeaderboard(lb);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const games = [
    {
      id: 'chainbros',
      name: 'Chain Bros',
      icon: '⛓️',
      leaderboard: [
        { uid: '1', displayName: 'PlayerA', highScore: 1500, gamesPlayed: 45, lastPlayed: '2 hours ago' },
        { uid: '2', displayName: 'PlayerB', highScore: 1200, gamesPlayed: 38, lastPlayed: '5 hours ago' },
        { uid: '3', displayName: 'PlayerC', highScore: 900, gamesPlayed: 25, lastPlayed: '1 day ago' },
        { uid: '4', displayName: 'PlayerD', highScore: 850, gamesPlayed: 32, lastPlayed: '3 hours ago' },
        { uid: '5', displayName: 'PlayerE', highScore: 720, gamesPlayed: 18, lastPlayed: '6 hours ago' },
      ],
    },
    {
      id: 'pixelhunt',
      name: 'Pixel Hunt',
      icon: '🎯',
      leaderboard: [
        { uid: '4', displayName: 'HunterX', highScore: 2000, gamesPlayed: 52, lastPlayed: '1 hour ago' },
        { uid: '5', displayName: 'PixelMaster', highScore: 1800, gamesPlayed: 41, lastPlayed: '4 hours ago' },
        { uid: '6', displayName: 'SeekerY', highScore: 1400, gamesPlayed: 29, lastPlayed: '2 days ago' },
        { uid: '7', displayName: 'TargetAce', highScore: 1350, gamesPlayed: 35, lastPlayed: '8 hours ago' },
        { uid: '8', displayName: 'SharpEye', highScore: 1200, gamesPlayed: 22, lastPlayed: '12 hours ago' },
      ],
    },
    {
      id: 'thinktactoe',
      name: 'Think Tac Toe',
      icon: '🧩',
      leaderboard: [
        { uid: '7', displayName: 'Strategist1', highScore: 500, gamesPlayed: 78, lastPlayed: '30 min ago' },
        { uid: '8', displayName: 'TicTacPro', highScore: 450, gamesPlayed: 65, lastPlayed: '2 hours ago' },
        { uid: '9', displayName: 'ThinkerZ', highScore: 400, gamesPlayed: 44, lastPlayed: '5 hours ago' },
        { uid: '10', displayName: 'LogicMaster', highScore: 380, gamesPlayed: 51, lastPlayed: '1 day ago' },
        { uid: '11', displayName: 'BrainPower', highScore: 350, gamesPlayed: 33, lastPlayed: '3 hours ago' },
      ],
    },
    {
      id: 'tankcity',
      name: 'Tank City',
      icon: '🚗',
      leaderboard: [
        { uid: '10', displayName: 'TankCommander', highScore: 3000, gamesPlayed: 89, lastPlayed: '45 min ago' },
        { uid: '11', displayName: 'CityDestroyer', highScore: 2500, gamesPlayed: 67, lastPlayed: '3 hours ago' },
        { uid: '12', displayName: 'ArmorKing', highScore: 2000, gamesPlayed: 54, lastPlayed: '6 hours ago' },
        { uid: '13', displayName: 'BattleTank', highScore: 1850, gamesPlayed: 71, lastPlayed: '1 hour ago' },
        { uid: '14', displayName: 'WarMachine', highScore: 1600, gamesPlayed: 43, lastPlayed: '4 hours ago' },
      ],
    },
  ];

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getDaysUntilSeasonEnd = () => {
    const now = new Date();
    const timeDiff = seasonEndDate.getTime() - now.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleClaimReward = (rank) => {
    
    const rewards = {
      1: '10 SOL + Legendary NFT',
      2: '5 SOL + Rare NFT',
      3: '2.5 SOL + Epic NFT',
      'top10': '1 SOL',
      'top50': '0.5 SOL',
      'top100': '0.1 SOL'
    };
    
    let reward = rewards[rank] || rewards['top100'];
    if (rank <= 10) reward = rewards['top10'];
    if (rank <= 50) reward = rewards['top50'];
    
    alert(`Claiming reward: ${reward}\nFeature coming soon!`);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a86ff]"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] relative z-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bebas mb-6 sm:mb-8 text-center animate-neon-glow">
        Leaderboards
      </h2>

      {/* Season Info */}
      <div className="glass-card p-4 sm:p-6 border border-[#ff006e]/50 rounded-xl max-w-4xl mx-auto mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className="text-xl font-bold text-[#ff006e] flex items-center">
              <span className="mr-2">🏆</span> Season 1 - Play to Earn
            </h3>
            <p className="text-gray-300 text-sm mt-1">Compete for SOL rewards and exclusive NFTs</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#3a86ff]">{getDaysUntilSeasonEnd()}</p>
            <p className="text-xs text-gray-400">Days Remaining</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#ff006e]">100 SOL</p>
            <p className="text-xs text-gray-400">Total Prize Pool</p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-4">
       
        <div className="glass-card border border-[#ff006e]/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('community')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-[#ff006e]/10 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">👥</span>
              <div>
                <h3 className="text-xl font-bold text-[#ff006e]">Community Leaderboard</h3>
                <p className="text-sm text-gray-400">Based on daily login streaks and community tasks</p>
              </div>
              <span className="ml-4 bg-[#ff006e] text-white text-xs px-3 py-1 rounded-full">
                Community Points
              </span>
            </div>
            <span className="text-[#ff006e] text-xl">
              {expandedSection === 'community' ? '▲' : '▼'}
            </span>
          </button>
          
          {expandedSection === 'community' && (
            <div className="px-6 pb-6 overflow-x-auto">
              <table className="w-full min-w-[600px]">
                <thead>
                  <tr className="border-b border-[#ff006e]/20">
                    <th className="text-left py-3">Rank</th>
                    <th className="text-left py-3">Player</th>
                    <th className="text-center py-3">Community Points</th>
                    <th className="text-center py-3">Login Streak</th>
                    <th className="text-center py-3">Tasks Completed</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { rank: 1, displayName: 'CommunityKing', points: 2500, streak: 30, tasks: 45 },
                    { rank: 2, displayName: 'TaskMaster', points: 2200, streak: 25, tasks: 38 },
                    { rank: 3, displayName: 'SocialGuru', points: 1900, streak: 20, tasks: 32 },
                    { rank: 4, displayName: 'EngagementPro', points: 1600, streak: 15, tasks: 28 },
                    { rank: 5, displayName: 'CommunityHero', points: 1400, streak: 12, tasks: 24 },
                    { rank: 6, displayName: 'LoginLegend', points: 1200, streak: 18, tasks: 20 },
                    { rank: 7, displayName: 'TaskWarrior', points: 1100, streak: 10, tasks: 22 }
                  ].map((player) => (
                    <tr key={player.rank} className="border-b border-[#ff006e]/10 hover:bg-[#ff006e]/5">
                      <td className="py-3">
                        <span className={`font-bold ${player.rank <= 3 ? 'text-[#ff006e]' : 'text-gray-400'}`}>
                          {player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : player.rank === 3 ? '🥉' : `${player.rank}.`}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-[#ff006e] to-[#8338ec] rounded-full flex items-center justify-center mr-3">
                            <span className="text-white text-xs font-bold">{player.displayName?.[0] || 'P'}</span>
                          </div>
                          {player.displayName}
                        </div>
                      </td>
                      <td className="py-3 text-center text-[#ff006e] font-bold">{player.points}</td>
                      <td className="py-3 text-center text-[#3a86ff] font-medium">{player.streak} days</td>
                      <td className="py-3 text-center text-[#8338ec] font-medium">{player.tasks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      
        <div className="glass-card border border-[#8338ec]/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('global')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-[#8338ec]/10 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">🌍</span>
              <div>
                <h3 className="text-xl font-bold text-[#3a86ff]">Global Leaderboard</h3>
                <p className="text-sm text-gray-400">All games combined rankings</p>
              </div>
              <span className="ml-4 bg-[#ff006e] text-white text-xs px-3 py-1 rounded-full">
                {globalLeaderboard.length} players
              </span>
            </div>
            <span className="text-[#3a86ff] text-xl">
              {expandedSection === 'global' ? '▲' : '▼'}
            </span>
          </button>
          
          {expandedSection === 'global' && (
            <div className="px-6 pb-6 overflow-x-auto">
              {globalLeaderboard.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No data available.</p>
              ) : (
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-[#8338ec]/20">
                      <th className="text-left py-3">Rank</th>
                      <th className="text-left py-3">Player</th>
                      <th className="text-center py-3">Score</th>
                      <th className="text-center py-3">Reward</th>
                      <th className="text-center py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {globalLeaderboard.map((player, index) => {
                      const rank = index + 1;
                      let rewardText = '0.1 SOL';
                      if (rank === 1) rewardText = '10 SOL + NFT';
                      else if (rank === 2) rewardText = '5 SOL + NFT';
                      else if (rank === 3) rewardText = '2.5 SOL + NFT';
                      else if (rank <= 10) rewardText = '1 SOL';
                      else if (rank <= 50) rewardText = '0.5 SOL';
                      
                      return (
                        <tr key={player.uid} className="border-b border-[#8338ec]/10 hover:bg-[#8338ec]/5">
                          <td className="py-3">
                            <span className={`font-bold ${rank <= 3 ? 'text-[#ff006e]' : 'text-gray-400'}`}>
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#ff006e] to-[#8338ec] rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">{player.displayName?.[0] || 'P'}</span>
                              </div>
                              <div>
                                <span className="font-medium">{player.displayName}</span>
                                {player.solanaPublicKey && <span className="ml-2 text-[#3a86ff] text-xs">[Connected]</span>}
                              </div>
                            </div>
                          </td>
                          <td className="py-3 text-center text-[#3a86ff] font-bold">{player.highScore}</td>
                          <td className="py-3 text-center text-[#ff006e] font-medium text-sm">{rewardText}</td>
                          <td className="py-3 text-center">
                            <button
                              onClick={() => handleClaimReward(rank)}
                              className="bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white px-3 py-1 rounded text-xs hover:shadow-lg transition-all transform hover:scale-105"
                            >
                              Claim
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        {games.map((game) => (
          <div key={game.id} className="glass-card border border-[#8338ec]/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection(game.id)}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-[#8338ec]/10 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{game.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-[#3a86ff]">{game.name} Leaderboard</h3>
                  <p className="text-sm text-gray-400">Game-specific rankings</p>
                </div>
                <span className="ml-4 bg-[#8338ec] text-white text-xs px-3 py-1 rounded-full">
                  {game.leaderboard.length} players
                </span>
              </div>
              <span className="text-[#3a86ff] text-xl">
                {expandedSection === game.id ? '▲' : '▼'}
              </span>
            </button>
            
            {expandedSection === game.id && (
              <div className="px-6 pb-6 overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#8338ec]/20">
                      <th className="text-left py-3">Rank</th>
                      <th className="text-left py-3">Player</th>
                      <th className="text-center py-3">High Score</th>
                      <th className="text-center py-3">Games Played</th>
                      <th className="text-center py-3">Last Played</th>
                      <th className="text-center py-3">Reward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {game.leaderboard.map((player, index) => {
                      const rank = index + 1;
                      let rewardText = '50 points';
                      if (rank === 1) rewardText = '500 points';
                      else if (rank === 2) rewardText = '300 points';
                      else if (rank === 3) rewardText = '200 points';
                      else if (rank <= 5) rewardText = '100 points';
                      
                      return (
                        <tr key={player.uid} className="border-b border-[#8338ec]/10 hover:bg-[#8338ec]/5">
                          <td className="py-3">
                            <span className={`font-bold ${rank <= 3 ? 'text-[#ff006e]' : 'text-gray-400'}`}>
                              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`}
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-8 h-8 bg-gradient-to-r from-[#3a86ff] to-[#8338ec] rounded-full flex items-center justify-center mr-3">
                                <span className="text-white text-xs font-bold">{player.displayName?.[0] || 'P'}</span>
                              </div>
                              {player.displayName}
                            </div>
                          </td>
                          <td className="py-3 text-center text-[#3a86ff] font-bold">{player.highScore}</td>
                          <td className="py-3 text-center text-gray-300">{player.gamesPlayed}</td>
                          <td className="py-3 text-center text-gray-400 text-sm">{player.lastPlayed}</td>
                          <td className="py-3 text-center">
                            <span className="text-[#ff006e] font-medium text-sm">{rewardText}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>

   
      <div className="glass-card p-6 border border-[#ff006e]/50 rounded-xl max-w-4xl mx-auto mt-8">
        <h3 className="text-xl font-bold text-[#ff006e] mb-4 flex items-center">
          <span className="mr-2">💎</span> Season Rewards Structure
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-gradient-to-b from-[#ff006e]/20 to-transparent rounded-lg border border-[#ff006e]/20">
            <p className="text-sm text-gray-300">🥇 1st Place</p>
            <p className="text-lg font-bold text-[#ff006e]">10 SOL + NFT</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-[#8338ec]/20 to-transparent rounded-lg border border-[#8338ec]/20">
            <p className="text-sm text-gray-300">🥈 2nd Place</p>
            <p className="text-lg font-bold text-[#8338ec]">5 SOL + NFT</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-[#3a86ff]/20 to-transparent rounded-lg border border-[#3a86ff]/20">
            <p className="text-sm text-gray-300">🥉 3rd Place</p>
            <p className="text-lg font-bold text-[#3a86ff]">2.5 SOL + NFT</p>
          </div>
          <div className="text-center p-4 bg-gradient-to-b from-gray-500/20 to-transparent rounded-lg border border-gray-500/20">
            <p className="text-sm text-gray-300">Top 4-10</p>
            <p className="text-lg font-bold text-gray-300">1 SOL</p>
          </div>
        </div>
        <p className="text-center text-gray-400 text-sm mt-4">
          Season ends in {getDaysUntilSeasonEnd()} days. Rankings reset after reward distribution.
        </p>
      </div>
    </div>
  );
}