// src/components/Community.jsx (Enhanced: Daily login, community tasks, social leaderboard, improved UI/UX)
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getRecentActivity, loadGameData } from '../firebase';

export default function Community() {
  const [user, loading] = useAuthState(auth);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [lastLogin, setLastLogin] = useState(null);
  const [loginStreak, setLoginStreak] = useState(0);
  const [communityPoints, setCommunityPoints] = useState(0);
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState([]);

  // Mock community tasks
  const communityTasks = [
    {
      id: 1,
      title: 'Follow @playrushio on Twitter',
      points: 50,
      type: 'twitter',
      action: 'follow',
      url: 'https://twitter.com/playrushio',
      completed: false
    },
    {
      id: 2,
      title: 'Retweet our latest announcement',
      points: 30,
      type: 'twitter',
      action: 'retweet',
      url: 'https://twitter.com/playrushio',
      completed: false
    },
    {
      id: 3,
      title: 'Share your high score on Twitter',
      points: 40,
      type: 'twitter',
      action: 'share',
      completed: false
    },
    {
      id: 4,
      title: 'Join our Discord community',
      points: 60,
      type: 'discord',
      action: 'join',
      url: 'https://discord.gg/playrush',
      completed: false
    }
  ];

  // Mock social leaderboard
  const socialLeaderboard = [
    { rank: 1, displayName: 'CommunityKing', points: 2500, streak: 30 },
    { rank: 2, displayName: 'TaskMaster', points: 2200, streak: 25 },
    { rank: 3, displayName: 'SocialGuru', points: 1900, streak: 20 },
    { rank: 4, displayName: 'EngagementPro', points: 1600, streak: 15 },
    { rank: 5, displayName: 'CommunityHero', points: 1400, streak: 12 }
  ];

  useEffect(() => {
    async function fetchData() {
      try {
        const acts = await getRecentActivity();
        setActivities(acts);

        if (user) {
          const data = await loadGameData();
          setProfile(data);
          // Simulate loading community data
          setCommunityPoints(data?.communityPoints || 0);
          setLoginStreak(data?.loginStreak || 0);
          setLastLogin(data?.lastLogin || null);
        }
      } catch (err) {
        setError('Failed to load community data: ' + err.message);
      }
    }
    fetchData();
  }, [user]);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleDailyLogin = () => {
    const today = new Date().toDateString();
    if (lastLogin !== today) {
      const newStreak = loginStreak + 1;
      const bonusPoints = 10 + (newStreak * 2); // Streak bonus
      
      setLastLogin(today);
      setLoginStreak(newStreak);
      setCommunityPoints(prev => prev + bonusPoints);
      setMessage(`Daily login claimed! +${bonusPoints} points (${newStreak} day streak)`);
    } else {
      setMessage('Already claimed today! Come back tomorrow.');
    }
  };

  const handleTaskSubmit = (taskId) => {
    if (!dailyTasksCompleted.includes(taskId)) {
      const task = communityTasks.find(t => t.id === taskId);
      if (task) {
        setDailyTasksCompleted(prev => [...prev, taskId]);
        setCommunityPoints(prev => prev + task.points);
        setMessage(`Task completed! +${task.points} points earned`);
        
        // Open task URL if available
        if (task.url) {
          window.open(task.url, '_blank');
        }
      }
    }
  };

  const canClaimDaily = () => {
    const today = new Date().toDateString();
    return lastLogin !== today;
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a86ff]"></div>
    </div>
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] relative z-10">
      <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bebas mb-6 sm:mb-8 text-center animate-neon-glow">
        Community Hub
      </h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-md mb-6 text-center">
          {error}
        </div>
      )}
      
      {message && (
        <div className="bg-blue-500/20 border border-blue-500/50 text-blue-400 px-4 py-3 rounded-md mb-6 text-center animate-fade-in">
          {message}
        </div>
      )}

      {user && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto mb-8">
          {/* Daily Login Section */}
          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ff006e]/20 to-[#8338ec]/20 rounded-full blur-xl"></div>
            <h3 className="text-xl font-bold text-[#3a86ff] mb-4 flex items-center">
              <span className="mr-2">🎯</span> Daily Login
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-300">Current Streak: <span className="text-[#ff006e] font-bold">{loginStreak} days</span></p>
              <p className="text-sm text-gray-300">Community Points: <span className="text-[#3a86ff] font-bold">{communityPoints}</span></p>
              <button
                onClick={handleDailyLogin}
                disabled={!canClaimDaily()}
                className={`w-full py-3 px-4 rounded-lg font-bold transition-all transform hover:scale-105 ${
                  canClaimDaily()
                    ? 'bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white hover:shadow-lg hover:shadow-[#ff006e]/25'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {canClaimDaily() ? `Claim Daily Bonus (+${10 + (loginStreak + 1) * 2} pts)` : 'Claimed Today ✓'}
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-16 h-16 bg-gradient-to-br from-[#3a86ff]/20 to-[#8338ec]/20 rounded-full blur-xl"></div>
            <h3 className="text-xl font-bold text-[#3a86ff] mb-4 flex items-center">
              <span className="mr-2">📊</span> Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#ff006e]">{communityPoints}</p>
                <p className="text-xs text-gray-400">Community Points</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#3a86ff]">{loginStreak}</p>
                <p className="text-xs text-gray-400">Login Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#8338ec]">{dailyTasksCompleted.length}</p>
                <p className="text-xs text-gray-400">Tasks Done</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-[#ff006e]">{profile?.highScore || 0}</p>
                <p className="text-xs text-gray-400">Best Score</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Collapsible Sections */}
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Community Tasks */}
        {user && (
          <div className="glass-card border border-[#8338ec]/50 rounded-xl overflow-hidden">
            <button
              onClick={() => toggleSection('tasks')}
              className="w-full p-6 text-left flex justify-between items-center hover:bg-[#8338ec]/10 transition-colors"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">🎯</span>
                <h3 className="text-xl font-bold text-[#3a86ff]">Community Tasks</h3>
                <span className="ml-3 bg-[#ff006e] text-white text-xs px-2 py-1 rounded-full">
                  {communityTasks.length - dailyTasksCompleted.length} available
                </span>
              </div>
              <span className="text-[#3a86ff] text-xl">
                {expandedSection === 'tasks' ? '▲' : '▼'}
              </span>
            </button>
            
            {expandedSection === 'tasks' && (
              <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {communityTasks.map((task) => {
                  const completed = dailyTasksCompleted.includes(task.id);
                  return (
                    <div key={task.id} className={`p-4 rounded-lg border ${completed ? 'border-green-500/50 bg-green-500/10' : 'border-[#8338ec]/30 bg-[#1a1a2e]/50'}`}>
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-white flex-1">{task.title}</h4>
                        <span className="text-[#ff006e] font-bold text-sm">+{task.points}pts</span>
                      </div>
                      <button
                        onClick={() => handleTaskSubmit(task.id)}
                        disabled={completed}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                          completed
                            ? 'bg-green-500/20 text-green-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white hover:shadow-lg hover:shadow-[#ff006e]/25 transform hover:scale-105'
                        }`}
                      >
                        {completed ? 'Completed ✓' : 'Complete Task'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}



        {/* Recent Activity */}
        <div className="glass-card border border-[#8338ec]/50 rounded-xl overflow-hidden">
          <button
            onClick={() => toggleSection('activity')}
            className="w-full p-6 text-left flex justify-between items-center hover:bg-[#8338ec]/10 transition-colors"
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚡</span>
              <h3 className="text-xl font-bold text-[#3a86ff]">Recent Activity</h3>
            </div>
            <span className="text-[#3a86ff] text-xl">
              {expandedSection === 'activity' ? '▲' : '▼'}
            </span>
          </button>
          
          {expandedSection === 'activity' && (
            <div className="px-6 pb-6">
              {activities.length === 0 ? (
                <p className="text-center text-gray-400 py-8">No recent activity.</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity, index) => (
                    <div key={activity.id || index} className="flex items-center justify-between p-3 bg-[#1a1a2e]/50 rounded-lg">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-r from-[#ff006e] to-[#8338ec] rounded-full flex items-center justify-center mr-3">
                          <span className="text-white text-xs font-bold">{activity.displayName?.[0] || 'P'}</span>
                        </div>
                        <span className="text-[#3a86ff] font-medium">{activity.displayName}</span>
                        <span className="text-gray-300 ml-2">{activity.action}</span>
                      </div>
                      <span className="text-gray-400 text-sm">{activity.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Social Links */}
        <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl text-center">
          <h3 className="text-xl font-bold text-[#3a86ff] mb-4 flex items-center justify-center">
            <span className="mr-2">🌐</span> Join Our Community
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://discord.gg/playrush"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-[#5865F2] hover:bg-[#4752C4] text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              <span className="mr-2">💬</span> Discord
            </a>
            <a
              href="https://twitter.com/playrushio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-[#1DA1F2] hover:bg-[#0d8bd9] text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              <span className="mr-2">🐦</span> Twitter
            </a>
            <button
              onClick={() => {
                if (!profile?.highScore) return;
                const tweet = `I scored ${profile.highScore} on Playrush.io! 🎮 Join the fun at https://playrush.vercel.app #Playrush #Gaming`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
              }}
              disabled={!profile?.highScore}
              className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 ${
                profile?.highScore 
                  ? 'bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white hover:shadow-lg'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="mr-2">📤</span> Share Score
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}