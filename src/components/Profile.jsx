
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loadGameData, updateProfile } from '../firebase';
import SignInModal from './SignInModal';

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const data = await loadGameData();
          if (data) {
            setProfile(data);
            setDisplayName(data.displayName || '');
          } else {
            setError('No profile data found.');
          }
        } catch (err) {
          setError('Failed to load profile: ' + err.message);
        }
      }
    }
    fetchProfile();
  }, [user]);

  const validateDisplayName = (name) => {
    const isValidName = name.length >= 3 && name.length <= 20;
    setIsValid(isValidName);
    return isValidName;
  };

  const handleUpdateProfile = async () => {
    if (user && displayName && displayName !== profile?.displayName && validateDisplayName(displayName)) {
      try {
        await updateProfile(user, { displayName });
        setProfile({ ...profile, displayName });
        setError(null);
        setSuccess('Profile updated successfully!');
      } catch (err) {
        setError('Failed to update profile: ' + err.message);
        setSuccess(null);
      }
    } else if (!isValid) {
      setError('Display name must be 3–20 characters.');
      setSuccess(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3a86ff]"></div>
    </div>
  );

  if (!user) {
    return (
      <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] relative z-10 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bebas mb-6 sm:mb-8">
          Sign In to Access Profile
        </h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white px-6 py-3 rounded-md hover:bg-[#3a86ff] font-orbitron font-bold transition-colors"
        >
          Sign In Now
        </button>
        <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setWalletAddress={setWalletAddress} />
      </div>
    );
  }

  const totalPoints = (profile?.communityPoints || 0) + (profile?.gamePoints || 0);
  const estimatedIncome = (totalPoints * 0.001).toFixed(3); // Mock conversion rate

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] relative z-10">
      <h2
        id="profile-title"
        className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bebas mb-6 sm:mb-8 text-center animate-neon-glow"
      >
        {profile?.displayName || 'Player'}'s Profile
      </h2>
      
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl mb-6 text-center max-w-2xl mx-auto">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/20 border border-green-500/50 text-green-400 px-4 py-3 rounded-xl mb-6 text-center max-w-2xl mx-auto animate-fade-in">
          {success}
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
   
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         
          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#3a86ff]/20 to-[#8338ec]/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Total Points</h3>
              <p className="text-3xl font-bold text-[#3a86ff]">{totalPoints.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">Community + Game Points</p>
            </div>
          </div>

          <div className="glass-card p-6 border border-[#ff006e]/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#ff006e]/20 to-[#8338ec]/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Estimated Income</h3>
              <p className="text-3xl font-bold text-[#ff006e]">{estimatedIncome} SOL</p>
              <p className="text-xs text-gray-500 mt-1">Based on current points</p>
            </div>
          </div>

        
          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#8338ec]/20 to-[#ff006e]/20 rounded-full blur-xl"></div>
            <div className="relative z-10">
              <h3 className="text-sm font-medium text-gray-400 mb-1">Global Rank</h3>
              <p className="text-3xl font-bold text-[#8338ec]">#{Math.floor(Math.random() * 100) + 1}</p>
              <p className="text-xs text-gray-500 mt-1">Out of all players</p>
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       
          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl">
            <h3 className="text-xl font-bold text-[#3a86ff] mb-6 flex items-center">
              <span className="mr-2">👤</span> Profile Settings
            </h3>
            
            <div className="flex items-center space-x-4 mb-6 p-4 bg-[#1a1a2e]/50 rounded-lg">
              <img
                src={profile?.photoURL || 'https://via.placeholder.com/64'}
                alt="Profile picture"
                className="w-16 h-16 rounded-full border-2 border-[#8338ec]/50"
              />
              <div className="flex-1">
                <p className="text-white font-medium text-sm">
                  {profile?.email || 'No email linked'}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Wallet: {profile?.solanaPublicKey 
                    ? `${profile.solanaPublicKey.slice(0, 4)}...${profile.solanaPublicKey.slice(-4)}` 
                    : 'Not connected'}
                </p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2">
                  Display Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    validateDisplayName(e.target.value);
                  }}
                  className={`w-full bg-[#1a1a2e] text-white p-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#8338ec] ${
                    !isValid ? 'border-[#ff006e]' : 'border-[#8338ec]/30'
                  }`}
                  placeholder="Enter display name (3-20 chars)"
                />
              </div>
              
              <button
                onClick={handleUpdateProfile}
                disabled={!displayName || displayName === profile?.displayName || !isValid}
                className="w-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg hover:shadow-[#ff006e]/25 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Update Profile
              </button>
            </div>
          </div>

          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl">
            <h3 className="text-xl font-bold text-[#ff006e] mb-6 flex items-center">
              <span className="mr-2">🎮</span> Game Statistics
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1a1a2e]/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[#3a86ff]">{profile?.timesPlayed || 0}</p>
                  <p className="text-xs text-gray-400">Tac-Rush Plays</p>
                </div>
                <div className="bg-[#1a1a2e]/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[#ff006e]">{profile?.highScore || 0}</p>
                  <p className="text-xs text-gray-400">Tac-Rush High Score</p>
                </div>
                <div className="bg-[#1a1a2e]/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[#8338ec]">{profile?.cyberrushPlays || 0}</p>
                  <p className="text-xs text-gray-400">Cyberrush Plays</p>
                </div>
                <div className="bg-[#1a1a2e]/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-[#3a86ff]">{profile?.cyberrushHighScore || 0}</p>
                  <p className="text-xs text-gray-400">Cyberrush High Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
          <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl">
            <h3 className="text-xl font-bold text-[#3a86ff] mb-6 flex items-center">
              <span className="mr-2">🏆</span> Community Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-[#1a1a2e]/50 rounded-lg">
                <span className="text-gray-300">Community Points</span>
                <span className="text-[#3a86ff] font-bold">{profile?.communityPoints || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#1a1a2e]/50 rounded-lg">
                <span className="text-gray-300">Login Streak</span>
                <span className="text-[#ff006e] font-bold">{profile?.loginStreak || 0} days</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#1a1a2e]/50 rounded-lg">
                <span className="text-gray-300">Tasks Completed</span>
                <span className="text-[#8338ec] font-bold">{profile?.tasksCompleted || 0}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#1a1a2e]/50 rounded-lg">
                <span className="text-gray-300">Referrals</span>
                <span className="text-[#ff006e] font-bold">{profile?.referrals || 0}</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 border border-[#ff006e]/50 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#ff006e]/20 to-[#8338ec]/20 rounded-full blur-xl"></div>
            <h3 className="text-xl font-bold text-[#ff006e] mb-6 flex items-center relative z-10">
              <span className="mr-2">💰</span> Rewards & Earnings
            </h3>
            
            <div className="space-y-4 relative z-10">
              <div className="bg-gradient-to-r from-[#ff006e]/10 to-[#8338ec]/10 p-4 rounded-lg border border-[#ff006e]/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-300">Total Claimable</span>
                  <span className="text-[#ff006e] font-bold text-lg">{estimatedIncome} SOL</span>
                </div>
                <div className="w-full bg-[#1a1a2e] rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-[#ff006e] to-[#8338ec] h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((totalPoints / 10000) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  {totalPoints >= 10000 ? 'Ready to claim!' : `${10000 - totalPoints} points until next threshold`}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-[#1a1a2e]/50 rounded-lg">
                  <span className="text-gray-300">Season Rewards</span>
                  <span className="text-[#3a86ff] font-bold">Coming Soon</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-[#1a1a2e]/50 rounded-lg">
                  <span className="text-gray-300">Referral Bonus</span>
                  <span className="text-[#8338ec] font-bold">{((profile?.referrals || 0) * 0.1).toFixed(2)} SOL</span>
                </div>
              </div>
              
              <button 
                className="w-full bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white py-3 px-6 rounded-lg font-bold hover:shadow-lg hover:shadow-[#ff006e]/25 transition-all transform hover:scale-105"
                disabled={totalPoints < 1000}
              >
                {totalPoints >= 1000 ? 'Claim Rewards' : 'Not Enough Points'}
              </button>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl">
          <h3 className="text-xl font-bold text-[#3a86ff] mb-6 flex items-center">
            <span className="mr-2">⚙️</span> Account Actions
          </h3>
          
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center bg-[#1a1a2e] hover:bg-[#8338ec]/20 text-[#3a86ff] px-4 py-2 rounded-lg border border-[#8338ec]/30 transition-colors">
              <span className="mr-2">🔗</span> Connect Wallet
            </button>
            <button className="flex items-center bg-[#1a1a2e] hover:bg-[#ff006e]/20 text-[#ff006e] px-4 py-2 rounded-lg border border-[#ff006e]/30 transition-colors">
              <span className="mr-2">📤</span> Export Data
            </button>
            <button className="flex items-center bg-[#1a1a2e] hover:bg-[#8338ec]/20 text-[#8338ec] px-4 py-2 rounded-lg border border-[#8338ec]/30 transition-colors">
              <span className="mr-2">🎯</span> Refer Friends
            </button>
            <button 
              onClick={() => auth.signOut()}
              className="flex items-center bg-red-500/20 hover:bg-red-500/30 text-red-400 px-4 py-2 rounded-lg border border-red-500/30 transition-colors"
            >
              <span className="mr-2">🚪</span> Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}