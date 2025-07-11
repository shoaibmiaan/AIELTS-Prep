/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'light-bg': '#f3e7fa', // Light mode particle background
        'dark-bg': '#1a1a2e',  // Dark mode particle background
      },
    },
  },
  plugins: [],
};