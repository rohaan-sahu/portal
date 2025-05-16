import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signOut } from '../firebase';
import SignInModal from './SignInModal';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function NavBar() {
  const [user] = useAuthState(auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const toggleNav = () => {
    setIsNavOpen(!isNavOpen);
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Games', href: '/games' },
    { name: 'Roadmap', href: '/roadmap' },
    { name: 'Token', href: '/token' },
    { name: 'Community', href: '/community' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Profile', href: '/profile' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/90 backdrop-blur-md border-b border-[#00CCFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <a
              href="/"
              className="text-2xl sm:text-3xl font-bebas text-[#00CCFF] animate-neon-glow"
              aria-label="Playrush Home"
            >
              Playrush
            </a>
          </div>
          <div className="hidden md:flex space-x-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#00CCFF] px-3 py-2 text-sm sm:text-base font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-[#00CCFF] text-sm sm:text-base font-orbitron">
                  {user.displayName || user.email?.slice(0, 6) + '...' || 'Player'}
                </span>
                <button
                  onClick={handleSignOut}
                  className="bg-[#FF00FF] text-[#0A0A0A] px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#00CCFF] text-sm sm:text-base font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#00CCFF] text-[#0A0A0A] px-3 py-1 sm:px-4 sm:py-2 rounded hover:bg-[#FF00FF] text-sm sm:text-base font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              >
                Sign In
              </button>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleNav}
              className="text-[#00CCFF] focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              aria-label={isNavOpen ? 'Close menu' : 'Open menu'}
            >
              {isNavOpen ? <FaTimes size="24" /> : <FaBars size="24" />}
            </button>
          </div>
        </div>
        <div
          className={`md:hidden fixed top-16 left-0 right-0 bg-[#0A0A0A]/95 backdrop-blur-md transform ${
            isNavOpen ? 'nav-open' : 'translate-x-full'
          } transition-transform duration-300`}
        >
          <div className="flex flex-col items-center py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-[#00CCFF] py-2 text-lg font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
                onClick={toggleNav}
              >
                {link.name}
              </a>
            ))}
            {user ? (
              <>
                <span className="text-[#00CCFF] py-2 text-lg font-orbitron">
                  {user.displayName || user.email?.slice(0, 6) + '...' || 'Player'}
                </span>
                <button
                  onClick={() => {
                    handleSignOut();
                    toggleNav();
                  }}
                  className="bg-[#FF00FF] text-[#0A0A0A] px-4 py-2 rounded hover:bg-[#00CCFF] mt-2 text-lg font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsModalOpen(true);
                  toggleNav();
                }}
                className="bg-[#00CCFF] text-[#0A0A0A] px-4 py-2 rounded hover:bg-[#FF00FF] mt-2 text-lg font-orbitron focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
      <SignInModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </nav>
  );
}