/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#171717', // neutral-900
        surface: '#262626',   // neutral-800
        primary: {
          DEFAULT: '#2DD4BF', // teal-400
          dark: '#0D9488',    // teal-600
        },
        secondary: {
          DEFAULT: '#737373', // neutral-500
          dark: '#525252',    // neutral-600
        }
      }
    },
  },
  plugins: [],
}