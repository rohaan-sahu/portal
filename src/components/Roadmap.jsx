import { useEffect, useRef, useState, useMemo } from 'react';

export default function Roadmap() {
  const roadmapItems = useMemo(
    () => [
      {
        quarter: 'Q1 2025',
        title: 'Game Launch',
        description: 'Launched V1, V2 Demo, and Cyberrush on Playrush.',
        completed: true,
        details: ['V1 & V2 Demo released', 'Cyberrush integrated', 'Initial user onboarding'],
      },
      {
        quarter: 'Q2 2025',
        title: 'Game Launcher & Token',
        description: 'Develop game launcher, release new games, launch PlayRUSH (PR) token, expand team, and initiate marketing.',
        completed: false,
        details: ['Game launcher beta', 'Two new games', 'PlayRUSH (PR) token launch', 'Hire developers', 'Social media campaign'],
      },
      {
        quarter: 'Q3 2025',
        title: 'Multiplayer Hub',
        description: 'Introduce multiplayer modes, competitive gaming, and reward systems.',
        completed: false,
        details: ['Multiplayer lobbies', 'Ranked competitions', 'In-game rewards'],
      },
      {
        quarter: 'Q4 2025',
        title: 'Creator Portals',
        description: 'Enable creators to build and monetize games on Playrush.',
        completed: false,
        details: ['Creator SDK', 'Monetization tools', 'Community showcase'],
      },
    ],
    []
  );

  const cardsRef = useRef([]);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.animationDelay = `${idx * 0.2}s`;
            entry.target.classList.add('animate-fade-in-up');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
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

  const handleCardClick = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(index);
    }
  };

  const completedCount = roadmapItems.filter((item) => item.completed).length;
  const progressPercentage = (completedCount / roadmapItems.length) * 100;

  return (
    <div className="p-4 sm:p-8 min-h-screen relative z-10 bg-gradient-to-b from-[#0A0A0A] to-[#1a1a2e]">
      <h2
        id="roadmap-title"
        className="text-3xl sm:text-4xl font-bold text-[#00CCFF] font-bebas mb-8 sm:mb-12 text-center animate-neon-glow"
      >
        Playrush Roadmap
      </h2>

      {/* Progress Bar */}
      <div className="max-w-3xl mx-auto mb-8">
        <div className="w-full bg-[#1a1a2e] rounded-full h-4">
          <div
            className="bg-gradient-to-r from-[#00CCFF] to-[#FF00FF] h-4 rounded-full transition-all duration-1000"
            style={{ width: `${progressPercentage}%` }}
            role="progressbar"
            aria-valuenow={progressPercentage}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-label="Roadmap completion progress"
            aria-describedby="progress-description"
          ></div>
        </div>
        <p id="progress-description" className="text-center text-[#00CCFF] font-orbitron mt-2 text-sm sm:text-base">
          {completedCount}/{roadmapItems.length} Milestones Completed
        </p>
      </div>

      {/* Timeline */}
      <div className="relative max-w-3xl mx-auto">
        <div className="absolute left-4 sm:left-8 top-0 bottom-0 w-1 bg-[#00CCFF] animate-pulse timeline-connector"></div>
        {roadmapItems.map((item, index) => (
          <div
            key={index}
            ref={(el) => (cardsRef.current[index] = el)}
            className="glass-card mb-8 ml-8 sm:ml-16 p-4 sm:p-6 bg-[#0A0A0A] border border-[#00CCFF] rounded-md hover:shadow-[0_0_15px_#00CCFF] transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            style={{ opacity: 0 }}
            onClick={() => handleCardClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            tabIndex={0}
            role="button"
            aria-expanded={expandedIndex === index}
            aria-label={`Roadmap item: ${item.quarter} - ${item.title}`}
          >
            <div className="absolute -left-4 sm:-left-8 top-6 w-4 h-4 bg-[#FF00FF] rounded-full animate-pulse timeline-dot"></div>
            <div className="flex justify-between items-start">
              <h3 className="text-xl sm:text-2xl font-bold text-[#FF00FF] font-bebas mb-2">
                {item.quarter}: {item.title}
              </h3>
              {item.completed && (
                <span className="bg-[#00CCFF] text-[#0A0A0A] text-xs sm:text-sm font-bold px-2 py-1 rounded-full">
                  Completed
                </span>
              )}
            </div>
            <p className="text-white font-orbitron text-sm sm:text-base">{item.description}</p>
            {expandedIndex === index && (
              <ul className="mt-4 list-disc list-inside text-white font-orbitron text-sm sm:text-base">
                {item.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}