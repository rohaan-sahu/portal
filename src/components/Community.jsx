import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, getLeaderboard, getRecentActivity, claimReward, loadGameData } from '../firebase';

export default function Community() {
  const [user, loading] = useAuthState(auth);
  const [leaderboard, setLeaderboard] = useState([]);
  const [activities, setActivities] = useState([]);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
      
        const lb = await getLeaderboard();
        setLeaderboard(lb);

    
        const acts = await getRecentActivity();
        setActivities(acts);

        if (user) {
          const data = await loadGameData();
          setProfile(data);
        }
      } catch (err) {
        setError('Failed to load community data: ' + err.message);
      }
    }
    fetchData();
  }, [user]);

  const handleClaimReward = async () => {
    if (!user || !profile?.solanaPublicKey) {
      setError('Please sign in with Solana to claim rewards');
      return;
    }
    try {
      setError(null);
      setMessage(null);
      const result = await claimReward(profile.solanaPublicKey);
      setMessage(`Successfully claimed ${result.amount} Playrush coins!`);
      
      const updatedData = await loadGameData();
      setProfile(updatedData);
    } catch (err) {
      setError('Failed to claim reward: ' + err.message);
    }
  };

  const handleShareScore = () => {
    if (!profile?.highScore) return;
    const tweet = `I scored ${profile.highScore} on Playrush.io! Join the fun at https://playrush.vercel.app #Playrush`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, '_blank');
  };

  if (loading) return <p className="text-white font-orbitron text-center p-8 pt-20">Loading...</p>;

  return (
    <div className="p-8 pt-20 text-white font-orbitron min-h-screen bg-gradient-to-b from-[#1a1a2e] to-[#16213e]">
      <h2 className="text-4xl font-bold text-[#00CCFF] font-bebas mb-8 text-center">
        Playrush Community
      </h2>
      {error && <p className="text-[#FF00FF] text-center mb-4">{error}</p>}
      {message && <p className="text-[#00CCFF] text-center mb-4">{message}</p>}

      <div className="glass-card p-6 border border-[#00CCFF] rounded-md max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-[#00CCFF] mb-4">Leaderboard</h3>
        {leaderboard.length === 0 ? (
          <p>No leaderboard data available.</p>
        ) : (
          <ul>
            {leaderboard.map((player, index) => (
              <li key={player.uid} className="flex justify-between py-2">
                <span>
                  {index + 1}. {player.displayName}
                  {player.solanaPublicKey && (
                    <span className="ml-2 text-[#00CCFF] text-sm">[Solana]</span>
                  )}
                </span>
                <span>{player.highScore} points</span>
              </li>
            ))}
          </ul>
        )}
      </div>

 
      <div className="glass-card p-6 border border-[#00CCFF] rounded-md max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-[#00CCFF] mb-4">Recent Activity</h3>
        {activities.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <ul>
            {activities.map((activity) => (
              <li key={activity.id} className="py-2">
                <span className="text-[#00CCFF]">{activity.displayName}</span>{' '}
                {activity.action} at {activity.timestamp}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Reward Claim */}
      {user && profile?.solanaPublicKey && (
        <div className="glass-card p-6 border border-[#00CCFF] rounded-md max-w-2xl mx-auto mb-8">
          <h3 className="text-2xl font-bold text-[#00CCFF] mb-4">Claim Rewards</h3>
          <p>Total Coins: {profile?.totalCoinsClaimed || 0}</p>
          <button
            onClick={handleClaimReward}
            className="mt-4 bg-[#00CCFF] text-[#1a1a2e] font-bold py-2 px-4 rounded hover:bg-[#FF00FF] transition"
          >
            Claim 10 Coins
          </button>
        </div>
      )}

      {/* Social Integrations */}
      <div className="glass-card p-6 border border-[#00CCFF] rounded-md max-w-2xl mx-auto mb-8">
        <h3 className="text-2xl font-bold text-[#00CCFF] mb-4">Join the Conversation</h3>
        <p>Join our Discord or follow us on Twitter!</p>
        <div className="flex space-x-4 mt-4">
          <a
            href="https://discord.gg/playrush"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00CCFF] text-[#1a1a2e] font-bold py-2 px-4 rounded hover:bg-[#FF00FF] transition"
          >
            Discord
          </a>
          <a
            href="https://twitter.com/playrushio"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#00CCFF] text-[#1a1a2e] font-bold py-2 px-4 rounded hover:bg-[#FF00FF] transition"
          >
            Twitter
          </a>
          {profile?.highScore && (
            <button
              onClick={handleShareScore}
              className="bg-[#00CCFF] text-[#1a1a2e] font-bold py-2 px-4 rounded hover:bg-[#FF00FF] transition"
            >
              Share Score
            </button>
          )}
        </div>
      </div>

      {/* Feedback Form Placeholder */}
      <div className="glass-card p-6 border border-[#00CCFF] rounded-md max-w-2xl mx-auto">
        <h3 className="text-2xl font-bold text-[#00CCFF] mb-4">Feedback</h3>
        <p>
          Have ideas for Playrush?{' '}
          <a
            href="https://forms.gle/your-feedback-form"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00CCFF] hover:text-[#FF00FF]"
          >
            Submit feedback
          </a>
          .
        </p>
      </div>
    </div>
  );
}