/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'bebas': ['Bebas Neue', 'sans-serif'],
      },
      animation: {
        'neon-glow': 'neon-glow 1.5s ease-in-out infinite alternate',
        'fade-in-up': 'fade-in-up 0.5s ease-out forwards',
      },
      keyframes: {
        'neon-glow': {
          from: { textShadow: '0 0 5px #3a86ff, 0 0 10px #3a86ff' },
          to: { textShadow: '0 0 10px #ff006e, 0 0 20px #ff006e' },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}