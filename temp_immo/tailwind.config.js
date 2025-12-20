/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F4D06F',
          DEFAULT: '#D4AF37', // Standard Gold
          dark: '#AA8C2C',
        },
        black: {
          rich: '#0A0A0A', // Deep black
          DEFAULT: '#000000',
        },
        white: {
          creamy: '#F9F9F9',
          DEFAULT: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Body
        serif: ['Playfair Display', 'serif'], // Headings
      },
    },
  },
  plugins: [],
}
