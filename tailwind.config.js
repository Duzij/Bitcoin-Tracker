/**  @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bitcoin: {
          primary: '#f7931a',
          secondary: '#4d4d4d',
          light: '#ffedd5',
          dark: '#292524'
        }
      },
    },
  },
  plugins: [],
};