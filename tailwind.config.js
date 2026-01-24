// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kate: {
          dark: '#964B00',
          medium: '#A4550A',
          light: '#B5651D',
          cream: '#FAF9F6'
        }
      },
      fontFamily: {
        serif: ['var(--font-playfair)'],
        sans: ['var(--font-inter)'],
      }
    },
  },
  plugins: [],
}