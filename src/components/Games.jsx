
import { useState } from 'react';

export default function Games() {
  const [search, setSearch] = useState('');
  
  const games = [
    { 
      name: 'Chain Bros', 
      url: 'https://chainbros.playrush.io', 
      description: 'Fast-paced chain adventure game.',
      icon: '⛓️',
      players: '1.2k',
      status: 'Live'
    },
    { 
      name: 'Pixel Hunt', 
      url: 'https://pixelhunt.playrush.io', 
      description: 'Pixelated hunting challenge.',
      icon: '🎯',
      players: '890',
      status: 'Live'
    },
    { 
      name: 'Think Tac Toe', 
      url: 'https://thinktactoe.playrush.io', 
      description: 'Strategic tic-tac-toe variant.',
      icon: '🧩',
      players: '650',
      status: 'Live'
    },
    { 
      name: 'Tank City', 
      url: 'https://tankcity.playrush.io', 
      description: 'Urban tank battle arena.',
      icon: '🚗',
      players: '1.5k',
      status: 'Live'
    },
  ];

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e] relative z-10">
     
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff006e] via-[#8338ec] to-[#3a86ff] font-bebas mb-4 animate-neon-glow">
          Playrush Games
        </h2>
        <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
          Compete in our skill-based games and climb the leaderboards to earn rewards
        </p>
      </div>

    
      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search games..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a2e] text-white p-3 pl-10 rounded-xl border border-[#8338ec]/30 focus:outline-none focus:ring-2 focus:ring-[#8338ec] focus:border-transparent transition-all"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">🔍</span>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {filteredGames.map((game, index) => (
          <a
            key={game.name}
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group glass-card p-6 border border-[#8338ec]/50 rounded-xl hover:border-[#ff006e] hover:shadow-lg hover:shadow-[#ff006e]/20 transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            style={{
              animationDelay: `${index * 0.1}s`,
              animation: 'fadeInUp 0.6s ease-out forwards'
            }}
          >
          
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#ff006e]/10 to-[#8338ec]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
           
            <div className="flex items-center justify-between mb-4">
              <div className="text-3xl">{game.icon}</div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs font-medium">{game.status}</span>
              </div>
            </div>

        
            <h3 className="text-xl font-bold text-[#3a86ff] mb-2 group-hover:text-[#ff006e] transition-colors">
              {game.name}
            </h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {game.description}
            </p>

       
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
              <div className="flex items-center">
                <span className="mr-1">👥</span>
                <span>{game.players} players</span>
              </div>
              <div className="flex items-center">
                <span className="mr-1">🏆</span>
                <span>Leaderboard</span>
              </div>
            </div>

          
            <div className="w-full bg-gradient-to-r from-[#8338ec]/20 to-[#ff006e]/20 rounded-lg p-3 text-center border border-[#8338ec]/30 group-hover:border-[#ff006e]/50 transition-all">
              <span className="text-white font-medium text-sm">Play Now →</span>
            </div>

          
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#ff006e] to-[#8338ec] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </a>
        ))}
      </div>

      
      {filteredGames.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🎮</div>
          <p className="text-gray-400 text-lg">No games found matching your search.</p>
          <button 
            onClick={() => setSearch('')}
            className="mt-4 text-[#3a86ff] hover:text-[#ff006e] font-medium transition-colors"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="glass-card p-6 border border-[#8338ec]/50 rounded-xl max-w-4xl mx-auto mt-12">
        <h3 className="text-xl font-bold text-[#3a86ff] mb-6 text-center flex items-center justify-center">
          <span className="mr-2">📊</span> Platform Stats
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-2xl font-bold text-[#ff006e]">4</p>
            <p className="text-sm text-gray-400">Games Live</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#3a86ff]">3.9k+</p>
            <p className="text-sm text-gray-400">Active Players</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#8338ec]">100 SOL</p>
            <p className="text-sm text-gray-400">Prize Pool</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#ff006e]">Daily</p>
            <p className="text-sm text-gray-400">Tournaments</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}