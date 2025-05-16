import { useEffect, useRef } from 'react';

export default function Roadmap() {
  const roadmapItems = [
    {
      quarter: 'Q1 2025',
      title: 'Platform Launch',
      description: 'Launch Playrush.io with StarRush and Web3 rewards.',
    },
    {
      quarter: 'Q2 2025',
      title: 'New Games & Auth',
      description: 'Add NeonBlitz, Web2/Web3 auth, and mobile support.',
    },
    {
      quarter: 'Q3 2025',
      title: 'Multiplayer Hub',
      description: 'Introduce multiplayer modes and leaderboards.',
    },
    {
      quarter: 'Q4 2025',
      title: 'Creator Portals',
      description: 'Enable creators to build and monetize games.',
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
      { threshold: 0.1, rootMargin: '100px' }
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
        Roadmap
      </h2>
      <div className="relative max-w-3xl mx-auto">
        <div className="timeline-connector"></div>
        {roadmapItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="glass-card mb-8 ml-12 p-6 touch-manipulation bg-[#0A0A0A]"
            style={{ opacity: 0 }}
          >
            <div className="timeline-dot" style={{ top: '24px' }}></div>
            <h3 className="text-2xl font-bold text-[#FF00FF] font-bebas mb-2">
              {item.quarter}: {item.title}
            </h3>
            <p className="text-white font-orbitron">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}