import { useEffect, useRef } from 'react';

export default function Community() {
  const communities = [
    { id: 1, name: 'StarRush Guild', description: 'Join the StarRush community for exclusive events.', url: '#' },
    { id: 2, name: 'CyberRush Clan', description: 'Compete in CyberRush tournaments.', url: '#' },
    { id: 3, name: 'Discord', description: 'Chat with players on our Discord server.', url: 'https://discord.gg/playrush' },
  ];

  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-4xl font-bold text-[#00CCFF] font-bebas mb-12 text-center animate-neon-glow">
        Community
      </h2>
      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        {communities.map((community, index) => (
          <div
            key={community.id}
            ref={(el) => (cardsRef.current[index] = el)}
            className="glass-card p-6 opacity-0 touch-manipulation"
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <h3 className="text-2xl font-bold text-[#FF00FF] font-bebas mb-2">{community.name}</h3>
            <p className="text-white font-orbitron mb-4">{community.description}</p>
            <a
              href={community.url}
              className="bg-[#00CCFF] text-[#0A0A0A] px-6 py-2 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors touch-manipulation inline-block"
            >
              Join Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}