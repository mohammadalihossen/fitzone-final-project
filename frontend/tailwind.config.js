/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#C8FF00',
        'primary-dark': '#A8D900',
        dark: '#0A0A0A',
        'dark-2': '#111111',
        'dark-3': '#1A1A1A',
        'dark-4': '#222222',
        'dark-5': '#2A2A2A',
        muted: '#666666',
        border: '#2A2A2A',
      },
      fontFamily: {
        heading: ['var(--font-barlow-condensed)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-inter)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
