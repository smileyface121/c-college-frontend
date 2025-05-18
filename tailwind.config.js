/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-blue-200',
    'bg-red-200',
    'bg-green-200',
    'hover:bg-blue-100',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
