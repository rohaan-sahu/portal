// src/App.jsx (Updated with Header and responsive nav)
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Header from './components/Header'; // New component
import Games from './components/Games';
import Community from './components/Community';
import Profile from './components/Profile';
import Leaderboard from './components/Leaderboard';

const BottomNav = () => {
  const location = useLocation();
  const getTabClass = (path) => 
    `flex flex-col items-center text-sm sm:text-base font-orbitron transition-colors ${
      location.pathname === path ? 'text-[#3a86ff]' : 'text-gray-400 hover:text-[#ff006e]'
    }`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#0A0A0A] border-t border-[#8338ec]/50 flex justify-around py-3 z-50 sm:hidden">
      <Link to="/games" className={getTabClass('/games')}>
        Games
      </Link>
      <Link to="/community" className={getTabClass('/community')}>
        Community
      </Link>
      <Link to="/profile" className={getTabClass('/profile')}>
        Profile
      </Link>
      <Link to="/leaderboard" className={getTabClass('/leaderboard')}>
        Leaderboard
      </Link>
    </nav>
  );
};

export default function App() {
  return (
    <Router>
      <div className="bg-[#0A0A0A] text-white min-h-screen relative font-orbitron">
        <Header /> {/* New: Always show header */}
        <div className="pb-16 sm:pb-0 pt-16"> {/* Padding for header */}
          <Routes>
            <Route path="/" element={<Games />} />
            <Route path="/games" element={<Games />} />
            <Route path="/community" element={<Community />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  );
}