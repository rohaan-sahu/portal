import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOutUser } from '../firebase';
import SignInModal from './SignInModal';

export default function NavBar({ setActiveSection, account, setAccount }) {
  const [user, loading] = useAuthState(auth);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setAccount(null);
    } catch (error) {
      console.error('Sign-out error:', error.message);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-[#0A0A0A] border-b border-[#00CCFF] fixed top-0 w-full z-20">
      <h1 className="text-2xl font-bold text-[#00CCFF] font-bebas hover:text-[#FF00FF] transition-colors" aria-label="Playrush Home">
        Playrush.io
      </h1>
      <div className="flex space-x-4 items-center">
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('landing')}
          aria-label="Home"
        >
          Home
        </button>
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('dashboard')}
          aria-label="Dashboard"
        >
          Dashboard
        </button>
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('games')}
          aria-label="Games"
        >
          Games
        </button>
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('roadmap')}
          aria-label="Roadmap"
        >
          Roadmap
        </button>
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('token')}
          aria-label="Token"
        >
          Token
        </button>
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('community')}
          aria-label="Community"
        >
          Community
        </button>
        <button
          className="text-white hover:text-[#FF00FF] font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
          onClick={() => setActiveSection('profile')}
          aria-label="Profile"
        >
          Profile
        </button>
        {loading ? (
          <span className="text-white font-orbitron">Loading...</span>
        ) : user ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-[#00CCFF] font-orbitron">
              {user.displayName || account?.solanaPublicKey?.slice(0, 4) + '...' + account?.solanaPublicKey?.slice(-4) || user.email?.slice(0, 6) + '...' || 'Player'}
            </span>
            <button
              className="bg-[#FF00FF] text-[#0A0A0A] px-4 py-2 rounded-md font-orbitron font-bold hover:bg-[#00CCFF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              onClick={handleSignOut}
              aria-label={`Sign out ${user.displayName || 'Player'}`}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className="bg-[#00CCFF] text-[#0A0A0A] px-4 py-2 rounded-md font-orbitron font-bold hover:bg-[#FF00FF] transition-colors focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            onClick={() => setIsSignInModalOpen(true)}
            aria-label="Sign in"
          >
            Sign In
          </button>
        )}
      </div>
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        setAccount={setAccount}
      />
    </nav>
  );
}