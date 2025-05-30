import { useEffect, useRef } from 'react';

export default function Games() {
  const games = [
    {
      id: 1,
      name: 'Tac-Rush',
      image: 'assets/tictactoe.png',
      status: 'Live',
      url: 'https://tictactoe.playrush.io',
    },
    {
      id: 2,
      name: 'CyberRush',
      image: 'assets/cyberrush.png',
      status: 'Live',
      url: 'https://cyberrush.playrush.io',
    },
    {
      id: 3,
      name: 'CyberRun',
      image: 'assets/CyberRun.png',
      status: 'Live',
      url: 'https://cyberrun.playrush.io',
    },
  ];

  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    cardsRef.current.forEach((card, index) => {
      if (card) {
        observer.observe(card);
      } else {
        console.warn(`Card ref is null at index: ${index}`);
      }
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <div className="p-8 min-h-screen relative z-10 bg-[#0A0A0A]">
      <h2 className="text-4xl font-bold text-[#00CCFF] font-bebas mb-12 text-center animate-neon-glow">
        Our Games
      </h2>
      {games.length === 0 ? (
        <p className="text-white font-orbitron text-center">No games available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {games.map((game, index) => (
            <div
              key={game.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="glass-card p-6 touch-manipulation bg-[#0A0A0A]"
              style={{ opacity: 0 }}
            >
              <img
                src={game.image}
                alt={game.name}
                className="w-full h-48 object-cover rounded-md mb-4"
                onError={(e) => {
                  console.error(`Failed to load image for ${game.name}: ${game.image}`);
                  e.target.src = 'https://via.placeholder.com/150';
                }}
              />
              <h3 className="text-2xl font-bold text-[#FF00FF] font-bebas mb-2">{game.name}</h3>
              <p className="text-white font-orbitron mb-4">Status: {game.status}</p>
              <button
                className="bg-[#00CCFF] text-[#0A0A0A] px-6 py-2 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors touch-manipulation"
                onClick={() => {
                  if (game.status === 'Live') {
                    window.location.href = game.url;
                  } else {
                    alert('Learn more about ' + game.name);
                  }
                }}
              >
                {game.status === 'Live' ? 'Play Now' : 'Learn More'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}