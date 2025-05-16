export default function Token() {
  return (
    <div className="p-4 sm:p-8 min-h-screen relative z-10 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] flex items-center justify-center">
      <div className="glass-card p-6 sm:p-8 border border-[#00CCFF] rounded-md text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#00CCFF] font-bebas mb-4 animate-neon-glow">
          PlayRUSH(PR) Token
        </h2>
        <p className="text-white font-orbitron text-lg sm:text-xl">
          Coming Soon 
        </p>
        <p className="text-[#00CCFF] font-orbitron mt-4">
          Stay tuned
        </p>
        <a
          href="https://twitter.com/playrushio"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block bg-[#00CCFF] text-[#0A0A0A] font-bold py-2 px-4 rounded hover:bg-[#FF00FF] transition font-orbitron"
        >
          Follow us on Twitter
        </a>
      </div>
    </div>
  );
}