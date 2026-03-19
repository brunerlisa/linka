/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#00aeef', dark: '#0099d6', light: '#33c1f5' },
        dark: { DEFAULT: '#050a14', card: '#0a0f1a', border: '#1e293b' },
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
