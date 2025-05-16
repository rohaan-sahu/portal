/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{jsx,js,ts,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        bebas: ['Bebas Neue', 'sans-serif'],
      },
    },
  },
  safelist: [
    'text-white',
    'bg-[#0A0A0A]',
    'text-[#00CCFF]',
    'hover:text-[#00CCFF]',
    'bg-[#00CCFF]',
    'hover:bg-[#FF00FF]',
    'text-[#FF00FF]',
    'font-orbitron',
    'font-bebas',
  ],
  plugins: [],
};