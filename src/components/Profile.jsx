import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loadGameData, updateProfile } from '../firebase';

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);

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

  const handleUpdateProfile = async () => {
    if (user && displayName && displayName !== profile?.displayName) {
      try {
        await updateProfile(user, { displayName });
        setProfile({ ...profile, displayName });
        setError(null);
        alert('Profile updated successfully');
      } catch (err) {
        setError('Failed to update profile: ' + err.message);
      }
    }
  };

  if (loading) return <p className="text-white font-orbitron text-center p-8 pt-20">Loading...</p>;
  if (!user) return <p className="text-white font-orbitron text-center p-8 pt-20">Please sign in.</p>;

  return (
    <div className="p-8 pt-20 min-h-screen bg-[#0A0A0A] relative z-10">
      <h2 className="text-4xl font-bold text-[#00CCFF] font-bebas mb-8 text-center" id="profile-title">
        {profile?.displayName || 'Player'}'s Profile
      </h2>
      {error && <p className="text-[#FF00FF] font-orbitron text-center mb-4">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <div className="glass-card p-6 border border-[#00CCFF] rounded-md">
          <p className="text-white font-orbitron mt-4">
            Wallet: {profile?.solanaPublicKey ? `${profile.solanaPublicKey.slice(0, 4)}...${profile.solanaPublicKey.slice(-4)}` : 'Not linked'}
          </p>
          <p className="text-white font-orbitron">
            Email: {profile?.email || 'Not linked'}
          </p>
          <label htmlFor="displayName" className="text-white font-orbitron block mt-2">Display Name</label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="bg-[#0A0A0A] text-white font-orbitron p-2 rounded-md mt-1 w-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            placeholder="Enter display name"
            aria-required="true"
          />
          <button
            className="bg-[#00CCFF] text-[#0A0A0A] px-6 py-2 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors mt-4 w-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            onClick={handleUpdateProfile}
            aria-label="Update profile"
          >
            Update Profile
          </button>
        </div>
        <div className="glass-card p-6 border border-[#00CCFF] rounded-md">
          <h3 className="text-2xl font-bold text-[#FF00FF] font-bebas mb-4">Game Stats</h3>
          <p className="text-white font-orbitron">Tac-Rush Plays: {profile?.timesPlayed || 0}</p>
          <p className="text-white font-orbitron">High Score: {profile?.highScore || 0}</p>
        </div>
      </div>
    </div>
  );
}