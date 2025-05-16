import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Landing from './components/Landing';
import Games from './components/Games';
import Roadmap from './components/Roadmap';
import Token from './components/Token';
import Community from './components/Community';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';

export default function App() {
  return (
    <Router>
      <div className="bg-[#0A0A0A] text-white min-h-screen relative">
        <NavBar />
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/games" element={<Games />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/token" element={<Token />} />
            <Route path="/community" element={<Community />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}