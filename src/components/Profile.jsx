import { useEffect, useState } from 'react';
import { useAuth } from '../PrivyAuth';
import { fetchUserProfile, updateProfileOnBackend } from '../api';

export default function Profile({ onOpenModal }) {
  const { user, loading, authenticated, accessToken, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isValid, setIsValid] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      if (authenticated && user && accessToken) {
        try {
          setError(null);
          // Fetch user profile from backend
          const profileData = await fetchUserProfile(user.id, accessToken);
          
          setProfile(profileData.data);
          setDisplayName(profileData.data.displayName || 
                       user.google?.name || 
                       user.wallet?.address || 
                       'Anonymous Player');
        } catch (err) {
          console.error('Failed to load profile:', err);
          setError('Failed to load profile: ' + (err.message || 'Unknown error'));
        }
      }
    }
    fetchProfile();
  }, [authenticated, user, accessToken]);

  const validateDisplayName = (name) => {
    const isValidName = name.length >= 3 && name.length <= 20;
    setIsValid(isValidName);
    return isValidName;
  };

  const handleUpdateProfile = async () => {
    if (!authenticated || !user || !accessToken) {
      setError('You must be logged in to update your profile');
      return;
    }

    if (!validateDisplayName(displayName)) {
      setError('Display name must be between 3 and 20 characters');
      return;
    }

    if (displayName === profile?.displayName) {
      return; // No changes to save
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      
      // Update user profile on backend
      const updatedProfile = await updateProfileOnBackend(
        user.id,
        { displayName },
        accessToken
      );
      
      setProfile(updatedProfile.data);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-10 w-10 text-[#8338ec] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-orbitron font-bold mb-6">Profile</h1>
          <p className="text-gray-400 mb-8">You need to sign in to view your profile.</p>
          <button
            onClick={onOpenModal}
            className="bg-[#8338ec] hover:bg-[#722ed1] text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-orbitron font-bold mb-8">Profile</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-200">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-900/30 border border-green-500/50 rounded-lg">
            <p className="text-green-200">{success}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <div className="bg-[#111111] rounded-xl p-6 border border-[#8338ec]/30">
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full bg-[#8338ec]/20 flex items-center justify-center mb-4">
                  <span className="text-3xl font-orbitron">
                    {profile?.displayName?.charAt(0)?.toUpperCase() || 
                     user?.google?.name?.charAt(0)?.toUpperCase() || 
                     user?.wallet?.address?.charAt(0)?.toUpperCase() || 'P'}
                  </span>
                </div>
                <h2 className="text-xl font-orbitron font-bold">
                  {profile?.displayName || 
                   user?.google?.name || 
                   (user?.wallet?.address ? 
                    `${user.wallet.address.substring(0, 6)}...${user.wallet.address.substring(user.wallet.address.length - 4)}` : 
                    'Anonymous Player')}
                </h2>
                {user?.google?.email && (
                  <p className="text-gray-400 text-sm mt-1">{user.google.email}</p>
                )}
                {user?.wallet?.address && (
                  <p className="text-gray-400 text-sm mt-1">
                    Wallet: {user.wallet.address.substring(0, 6)}...{user.wallet.address.substring(user.wallet.address.length - 4)}
                  </p>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Member since</span>
                  <span>
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString() 
                      : 'Unknown'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Total Points</span>
                  <span className="font-orbitron">
                    {profile?.totalPoints?.toLocaleString() || '0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Games Played</span>
                  <span>{profile?.gamesPlayed || '0'}</span>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
          
          {/* Edit Profile */}
          <div className="lg:col-span-2">
            <div className="bg-[#111111] rounded-xl p-6 border border-[#8338ec]/30">
              <h3 className="text-xl font-orbitron font-bold mb-6">Edit Profile</h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => {
                      setDisplayName(e.target.value);
                      validateDisplayName(e.target.value);
                    }}
                    className={`w-full bg-[#1a1a1a] border ${
                      isValid ? 'border-[#8338ec]/30' : 'border-red-500'
                    } rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#8338ec]`}
                    disabled={saving}
                  />
                  {!isValid && (
                    <p className="text-red-400 text-sm mt-1">
                      Display name must be between 3 and 20 characters
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateProfile}
                    disabled={!isValid || displayName === profile?.displayName || saving}
                    className="bg-[#8338ec] hover:bg-[#722ed1] disabled:bg-[#8338ec]/50 disabled:cursor-not-allowed text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Account Info */}
            <div className="bg-[#111111] rounded-xl p-6 border border-[#8338ec]/30 mt-6">
              <h3 className="text-xl font-orbitron font-bold mb-4">Account Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-400 text-sm">User ID</p>
                  <p className="font-mono text-sm break-all">{user?.id}</p>
                </div>
                
                {user?.google && (
                  <div>
                    <p className="text-gray-400 text-sm">Google Account</p>
                    <p>{user.google.email}</p>
                  </div>
                )}
                
                {user?.wallet && (
                  <div>
                    <p className="text-gray-400 text-sm">Wallet Address</p>
                    <p className="font-mono text-sm break-all">{user.wallet.address}</p>
                  </div>
                )}
                
                <div>
                  <p className="text-gray-400 text-sm">Account Created</p>
                  <p>{user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'Unknown'}</p>
                </div>
                
                {profile?.lastActive && (
                  <div>
                    <p className="text-gray-400 text-sm">Last Active</p>
                    <p>{new Date(profile.lastActive).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}