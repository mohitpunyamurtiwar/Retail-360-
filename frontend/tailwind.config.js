/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'hindi': ['Noto Sans Devanagari', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#ecfdf5',
          500: '#10b981',
          600: '#059669',
          700: '#047857'
        }
      }
    },
  },
  plugins: [],
}
