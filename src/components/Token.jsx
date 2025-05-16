import { useEffect, useState } from 'react';
import { getTotalUsers } from '../firebase';

export default function Token() {
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    const unsubscribe = getTotalUsers((count) => {
      setUserCount(count);
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="p-4 sm:p-8 min-h-screen relative z-10 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] flex items-center justify-center">
      <div className="glass-card p-4 sm:p-6 border border-[#00CCFF] rounded-md text-center animate-fade-in-up">
        <h2
          id="token-title"
          className="text-3xl sm:text-4xl font-bold text-[#00CCFF] font-bebas mb-4 animate-neon-glow"
        >
          PlayRUSH (PR) Token
        </h2>
        <p className="text-white font-orbitron text-base sm:text-lg">
          Coming Soon in Q2 2025!
        </p>
        <p className="text-[#00CCFF] font-orbitron mt-4 text-sm sm:text-base">
          The PlayRUSH (PR) token will power the Playrush ecosystem, enabling in-game rewards, creator monetization, and more.
        </p>
        <p className="text-white font-orbitron mt-2 text-sm sm:text-base">
          Join {userCount.toLocaleString()}+ players preparing for the launch!
        </p>
        <a
          href="https://twitter.com/playrushio"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-[#00CCFF] text-[#0A0A0A] font-bold py-2 px-4 rounded hover:bg-[#FF00FF] focus:ring-2 focus:ring-[#00CCFF] transition font-orbitron text-sm sm:text-base"
          aria-label="Follow Playrush on Twitter"
        >
          Follow us on Twitter
        </a>
      </div>
    </div>
  );
}