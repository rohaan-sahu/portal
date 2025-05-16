import { useState, useEffect } from 'react';
import NavBar from './components/NavBar';
import Landing from './components/Landing';
import Dashboard from './components/Dashboard';
import Games from './components/Games';
import Roadmap from './components/Roadmap';
import Token from './components/Token';
import Community from './components/Community';
import Profile from './components/Profile';
import { initBackground } from './scenes/BackgroundScene';
import { auth, handleRedirectResult } from './firebase';

export default function App() {
  const [account, setAccount] = useState(null);
  const [activeSection, setActiveSection] = useState('landing');

  useEffect(() => {
    const cleanup = initBackground();
    return cleanup;
  }, []);

  useEffect(() => {
    handleRedirectResult()
      .then((user) => {
        if (user) {
          setAccount(user);
        }
      })
      .catch((err) => console.error('Redirect result error:', err.message));

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAccount(user);
    });
    return unsubscribe;
  }, []);

  return (
    <div className="bg-[#0A0A0A] text-white min-h-screen relative">
      <div id="background-canvas" className="absolute inset-0 z-0"></div>
      <div className="relative z-10">
        <NavBar setActiveSection={setActiveSection} account={account} setAccount={setAccount} />
        <div className="min-h-screen">
          {activeSection === 'landing' && <Landing setActiveSection={setActiveSection} />}
          {activeSection === 'dashboard' && <Dashboard account={account} />}
          {activeSection === 'games' && <Games />}
          {activeSection === 'roadmap' && <Roadmap />}
          {activeSection === 'token' && <Token />}
          {activeSection === 'community' && <Community />}
          {activeSection === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
}