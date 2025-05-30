import { useEffect, useRef, Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import SignInModal from './SignIn';

function Model({ url, scrollY }) {
  try {
    const { scene } = useGLTF(url);
    useFrame(() => {
      if (scrollY !== undefined && scene) {
        scene.rotation.y = scrollY * 0.002;
        scene.position.y = Math.sin(scrollY * 0.001) * 0.2;
      }
    });
    return <primitive object={scene} scale={[0.25, 0.25, 0.25]} />;
  } catch (error) {
    console.error(`Failed to load model: ${url}`);
    return null;
  }
}

export default function Landing({ setActiveSection }) {
  const [scrollY, setScrollY] = useState(0);
  const [walletAddress, setWalletAddress] = useState(null);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);

  const games = [
    {
      id: 'tacRush',
      name: 'Tac-Rush',
      url: 'https://tacrush.playrush.io',
      model: 'assets/tic-tac-toe.glb',
      status: 'Live',
      image: 'assets/tic-tac-toe.png',
    },
    {
      id: 'cyberrush',
      name: 'CyberRush',
      url: 'https://cyberrush.playrush.io',
      model: 'assets/character.glb',
      status: 'Live',
      image: 'assets/character.png',
    },
  ];

  const valueProps = [
    {
      title: 'Modernized Classics',
      description: 'Rediscover Tic-Tac-Toe and more with a Web3 twist.',
    },
    {
      title: 'Play Together',
      description: 'Connect with friends and creators worldwide.',
    },
    {
      title: 'Global Community',
      description: 'Join players from around the world.',
    },
  ];

  const heroRef = useRef(null);
  const aboutRef = useRef(null);
  const valueRef = useRef(null);
  const gamesRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '100px' },
    );

    [heroRef, aboutRef, valueRef, gamesRef].forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      [heroRef, aboutRef, valueRef, gamesRef].forEach((ref) => {
        if (ref.current) observer.unobserve(ref.current);
      });
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative z-10">
      {/* Header */}
      <nav className="p-4 flex justify-between items-center bg-[#0A0A0A]" aria-label="Main navigation">
        <h1 className="text-3xl font-bold text-[#00CCFF] font-bebas">Playrush</h1>
        <div className="space-x-4">
          <button
            className="bg-[#00CCFF] text-[#0A0A0A] px-4 py-2 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
            onClick={() => setIsSignInModalOpen(true)}
            aria-label="Open sign-in modal"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Sign-In Modal */}
      <SignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        setWalletAddress={setWalletAddress}
      />

      {/* Hero Section */}
      <main
        ref={heroRef}
        className="relative p-12 flex-1 flex flex-col justify-center items-center text-center"
        style={{ opacity: 0, minHeight: '100vh' }}
        aria-labelledby="hero-title"
      >
        <div className="absolute inset-0 z-0">
          <Suspense fallback={null}>
            <Canvas camera={{ position: [0, 0, 2], fov: 50 }} aria-hidden="true">
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[0, 0, 2]} intensity={1} color="#00CCFF" />
              <Model url="assets/low_poly_gamepad.glb" scrollY={scrollY} />
              <OrbitControls enableZoom={false} enablePan={false} />
            </Canvas>
          </Suspense>
        </div>
        <div className="relative z-10">
          <h2 id="hero-title" className="text-6xl font-bold text-[#00CCFF] font-bebas mb-4 animate-neon-glow">
            Playrush
          </h2>
          <p className="text-xl text-white font-orbitron mb-8 max-w-2xl">
            Bringing life into old memories with Web3 gaming.
          </p>
          <div className="space-x-4">
            <button
              className="bg-[#00CCFF] text-[#0A0A0A] px-8 py-3 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              onClick={() => setActiveSection('games')}
              aria-label="Explore games"
            >
              Explore Games
            </button>
            <button
              className="bg-[#FF00FF] text-[#0A0A0A] px-8 py-3 rounded-md hover:bg-[#00CCFF] font-orbitron font-bold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
              onClick={() => setActiveSection('dashboard')}
              aria-label="Join now"
            >
              Join Now
            </button>
          </div>
        </div>
      </main>

      {/* About Us Section */}
      <section ref={aboutRef} className="p-8 bg-[#0A0A0A]" style={{ opacity: 0 }} aria-labelledby="about-title">
        <h2 id="about-title" className="text-4xl font-bold text-[#00CCFF] font-bebas mb-12 text-center animate-neon-glow">
          Bringing Life into Old Memories
        </h2>
        <div className="glass-card p-8 max-w-3xl mx-auto">
          <p className="text-white font-orbitron text-lg">
            At Playrush, we breathe new life into the games you grew up with, infusing classic titles like Tic-Tac-Toe with Web3 flair. Our neon-lit platform lets you play and connect with communities worldwide. Rediscover the joy of retro gaming, reimagined for today’s world.
          </p>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section ref={valueRef} className="p-8 bg-[#0A0A0A]" style={{ opacity: 0 }} aria-labelledby="value-title">
        <h2 id="value-title" className="text-4xl font-bold text-[#00CCFF] font-bebas mb-12 text-center animate-neon-glow">
          Why Playrush?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {valueProps.map((prop, index) => (
            <div
              key={index}
              ref={(el) => (cardsRef.current[index] = el)}
              className="glass-card p-6 touch-manipulation bg-[#0A0A0A]"
              style={{ opacity: 0 }}
            >
              <h3 className="text-2xl font-bold text-[#FF00FF] font-bebas mb-2">{prop.title}</h3>
              <p className="text-white font-orbitron">{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Games Section */}
      <section ref={gamesRef} className="p-8 bg-[#0A0A0A]" style={{ opacity: 0 }} aria-labelledby="games-title">
        <h2 id="games-title" className="text-4xl font-bold text-[#00CCFF] font-bebas mb-12 text-center animate-neon-glow">
          Featured Games
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {games.map((game, index) => (
            <div
              key={game.id}
              ref={(el) => (cardsRef.current[valueProps.length + index] = el)}
              className="glass-card p-6 touch-manipulation bg-[#0A0A0A] relative overflow-hidden"
              style={{ opacity: 0, height: '300px' }}
            >
              <Suspense fallback={null}>
                <Canvas
                  className="absolute inset-0"
                  camera={{ position: [0, 0, 1.5], fov: 50 }}
                  aria-hidden="true"
                >
                  <ambientLight intensity={0.5} />
                  <pointLight position={[10, 10, 10]} intensity={1} />
                  <Model url={game.model} />
                  <OrbitControls enableZoom={false} enablePan={false} />
                </Canvas>
              </Suspense>
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-[#FF00FF] font-bebas mb-2">{game.name}</h3>
                <button
                  className="bg-[#00CCFF] text-[#0A0A0A] px-6 py-2 rounded-md hover:bg-[#FF00FF] font-orbitron font-bold transition-colors touch-manipulation focus:outline-none focus:ring-2 focus:ring-[#00CCFF]"
                  onClick={() => (window.location.href = game.url)}
                  aria-label={`Play ${game.name}`}
                >
                  Play Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="p-8 bg-[#0A0A0A] text-center" aria-label="Footer navigation">
        <p className="text-white font-orbitron mb-4">Rediscover classics, connect globally.</p>
        <nav className="space-x-4 mb-4">
          <button
            className="text-[#00CCFF] hover:text-[#FF00FF] font-orbitron focus:outline-none focus:underline"
            onClick={() => setActiveSection('community')}
            aria-label="Go to community section"
          >
            Community
          </button>
          <button
            className="text-[#00CCFF] hover:text-[#FF00FF] font-orbitron focus:outline-none focus:underline"
            onClick={() => setActiveSection('roadmap')}
            aria-label="Go to roadmap section"
          >
            Roadmap
          </button>
          <button
            className="text-[#00CCFF] hover:text-[#FF00FF] font-orbitron focus:outline-none focus:underline"
            onClick={() => setActiveSection('profile')}
            aria-label="Go to profile section"
          >
            Profile
          </button>
          <a
            href="https://x.com/playrush_io"
            className="text-[#00CCFF] hover:text-[#FF00FF] font-orbitron focus:outline-none focus:underline"
            aria-label="Visit Playrush on X"
          >
            X
          </a>
        </nav>
        <div className="text-white font-orbitron">
          <p>
            Support:{' '}
            <a
              href="mailto:support@playrush.io"
              className="text-[#00CCFF] hover:text-[#FF00FF] focus:outline-none focus:underline"
              aria-label="Email support"
            >
              support@playrush.io
            </a>
          </p>
          <p>
            Partnership:{' '}
            <a
              href="mailto:partnership@playrush.io"
              className="text-[#00CCFF] hover:text-[#FF00FF] focus:outline-none focus:underline"
              aria-label="Email partnership"
            >
              partnership@playrush.io
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}