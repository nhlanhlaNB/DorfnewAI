/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}', // Include all files in app directory
    './components/**/*.{js,ts,jsx,tsx}', // Include components
    './pages/**/*.{js,ts,jsx,tsx}', // Include pages if used
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};