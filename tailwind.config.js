/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
  safelist: [
    'flex', 'items-center', 'justify-center', 'justify-between', 'w-full', 'max-w-md', 'px-6', 'py-2', 'py-3', 'py-4', 'px-4', 'px-3', 'p-6', 'p-8',
    'mb-4', 'mb-8', 'mb-16', 'mt-4', 'mt-1', 'mr-2', 'ml-2', 'ml-3', 'mr-4', 'gap-4', 'gap-8', 'text-center', 'cursor-pointer',
    'rounded-md', 'rounded-lg', 'rounded-xl', 'font-medium', 'font-semibold', 'font-bold', 'text-sm', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'md:text-5xl',
    'grid', 'grid-cols-1', 'md:grid-cols-2', 'shadow-md', 'overflow-hidden', 'border', 'divide-y', 'list-disc', 'pl-5', 'space-y-2', 'transition', 'min-h-screen',
  ],
};