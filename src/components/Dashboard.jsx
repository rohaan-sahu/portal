import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loadGameData } from '../firebase';

export default function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        try {
          const data = await loadGameData();
          if (data) {
            setProfile(data);
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

  if (loading) return <p className="text-white font-orbitron text-center p-8 pt-20">Loading...</p>;
  if (!user) return <p className="text-white font-orbitron text-center p-8 pt-20">Please sign in.</p>;

  return (
    <div className="p-8 pt-20 text-white font-orbitron">
      <h2 className="text-4xl font-bold text-[#00CCFF] font-bebas mb-8 text-center">
        Dashboard
      </h2>
      {error && <p className="text-[#FF00FF] font-orbitron text-center mb-4">{error}</p>}
      <div className="glass-card p-6 border border-[#00CCFF] rounded-md max-w-2xl mx-auto">
        <p className="text-lg">
          Welcome, {profile?.displayName || user.displayName || 'Player'}!
        </p>
        {profile?.solanaPublicKey && (
          <p className="mt-2">
            Wallet: {profile.solanaPublicKey.slice(0, 4)}...{profile.solanaPublicKey.slice(-4)}
          </p>
        )}
        {user.email && (
          <p className="mt-2">
            Email: {user.email.slice(0, 6)}...{user.email.split('@')[1]}
          </p>
        )}
        <p className="mt-2">High Score: {profile?.highScore || 0}</p>
        <p className="mt-2">Games Played: {profile?.timesPlayed || 0}</p>
      </div>
    </div>
  );
}