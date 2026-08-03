/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf6ec',
          100: '#f8e8cf',
          200: '#efc98a',
          300: '#e4a94d',
          400: '#d68b2b',
          500: '#b8701e',
          600: '#8f5518',
          700: '#6b3f14',
          800: '#4a2b0f',
          900: '#2e1a0a',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
