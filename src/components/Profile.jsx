import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, loadGameData, updateProfile } from '../firebase'

export default function Profile() {
  const [user, loading] = useAuthState(auth);
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isValid, setIsValid] = useState(true);

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

  if (loading) return <p className="text-white font-orbitron text-center p-4 sm:p-8 pt-20">Loading...</p>;
  if (!user) return <p className="text-white font-orbitron text-center p-4 sm:p-8 pt-20">Please sign in.</p>;

  return (
    <div className="p-4 sm:p-8 pt-20 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] relative z-10">
      <h2
        id="profile-title"
        className="text-3xl sm:text-4xl font-bold text-[#00CCFF] font-bebas mb-6 sm:mb-8 text-center animate-neon-glow"
      >
        {profile?.displayName || 'Player'}'s Profile
      </h2>
      {error && (
        <p
          id="error-message"
          className="text-[#FF00FF] font-orbitron text-center mb-4 text-sm sm:text-base"
        >
          {error}
        </p>
      )}
      {success && (
        <p
          id="success-message"
          className="text-[#00CCFF] font-orbitron text-center mb-4 text-sm sm:text-base"
        >
          {success}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
        <div
          className="glass-card p-4 sm:p-6 border border-[#00CCFF] rounded-md animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={profile?.photoURL || 'https://via.placeholder.com/64'}
              alt="Profile picture"
              className="w-16 h-16 rounded-full border border-[#00CCFF]"
            />
            <div>
              <p className="text-white font-orbitron text-sm sm:text-base">
                Wallet: {profile?.solanaPublicKey ? `${profile.solanaPublicKey.slice(0, 4)}...${profile.solanaPublicKey.slice(-4)}` : 'Not linked'}
              </p>
              <p className="text-white font-orbitron text-sm sm:text-base">
                Email: {profile?.email || 'Not linked'}
              </p>
            </div>
          </div>
          <label
            htmlFor="displayName"
            className="text-white font-orbitron block mt-2 text-sm sm:text-base"
          >
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
            className={`bg-[#0A0A0A] text-white font-orbitron p-2 rounded-md mt-1 w-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF] ${!isValid ? 'border-[#FF00FF]' : ''}`}
            placeholder="Enter display name"
            aria-required="true"
            aria-invalid={!isValid}
            aria-describedby={error ? 'error-message' : undefined}
          />
          <button
            className="bg-[#00CCFF] text-[#0A0A0A] px-4 sm:px-6 py-2 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors mt-4 w-full focus:outline-none focus:ring-2 focus:ring-[#00CCFF] text-sm sm:text-base"
            onClick={handleUpdateProfile}
            aria-label="Update profile"
          >
            Update Profile
          </button>
        </div>
        <div
          className="glass-card p-4 sm:p-6 border border-[#00CCFF] rounded-md animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <h3 className="text-xl sm:text-2xl font-bold text-[#FF00FF] font-bebas mb-4">
            Game Stats
          </h3>
          <p className="text-white font-orbitron text-sm sm:text-base">
            Tac-Rush Plays: {profile?.timesPlayed || 0}
          </p>
          <p className="text-white font-orbitron text-sm sm:text-base">
            Tac-Rush High Score: {profile?.highScore || 0}
          </p>
          <p className="text-white font-orbitron text-sm sm:text-base">
            Cyberrush Plays: {profile?.cyberrushPlays || 0}
          </p>
          <p className="text-white font-orbitron text-sm sm:text-base">
            Cyberrush High Score: {profile?.cyberrushHighScore || 0}
          </p>
        </div>
      </div>
    </div>
  );
}