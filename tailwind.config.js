/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './pages/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          primary: '#6366f1',
          secondary: '#10b981',
          background: '#ffffff',
          foreground: '#171717',
        },
        dark: {
          primary: '#6366f1',
          secondary: '#10b981',
          background: '#0a0a0a',
          foreground: '#ededed',
        },
        'light-bg': '#f3e7fa',
        'dark-bg': '#1a1a2e',
        custom: {
          gray: {
            700: '#374151',
            300: '#d1d5db',
          },
          slate: '#1a202c',
          bluegray: '#2d3748',
          offwhite: '#f7fafc',
          lightgray: '#e2e8f0',
          softgray: '#cbd5e0',
          orange: '#f97316',
        },
      },
    },
  },
  plugins: [],
};