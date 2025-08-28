
import { useState } from 'react';
import { useAuth } from '../PrivyAuth';
import { Link } from 'react-router-dom';
import SignInModal from './SignInModal';

export default function Header() {
  const { authenticated, user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#8338ec]/50 z-50">
      <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bebas bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] text-transparent bg-clip-text">
          Playrush
        </Link>
        <div className="hidden sm:flex space-x-6">
          <Link to="/games" className="text-white hover:text-[#ff006e] transition">Games</Link>
          <Link to="/community" className="text-white hover:text-[#ff006e] transition">Community</Link>
          <Link to="/leaderboard" className="text-white hover:text-[#ff006e] transition">Leaderboard</Link>
          <Link to="/profile" className="text-white hover:text-[#ff006e] transition">Profile</Link>
        </div>
        <div>
          {authenticated && user ? (
            <div className="flex items-center space-x-4">
              <span className="text-[#3a86ff]">
                {user.google?.name || user.wallet?.address ? 
                 (user.google?.name || `${user.wallet?.address?.substring(0, 6)}...${user.wallet?.address?.substring(user.wallet?.address?.length - 4)}`) : 
                 'Player'}
              </span>
              <button onClick={handleSignOut} className="bg-[#ff006e] text-white px-4 py-1 rounded hover:bg-[#8338ec] transition">
                Sign Out
              </button>
            </div>
          ) : (
            <button onClick={() => setIsModalOpen(true)} className="bg-gradient-to-r from-[#ff006e] to-[#8338ec] text-white px-4 py-1 rounded hover:shadow-lg transition">
              Sign In
            </button>
          )}
        </div>
      </nav>
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} setWalletAddress={setWalletAddress} />
    </header>
  );
}