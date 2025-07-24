'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

export default function PageNotFound() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [joke, setJoke] = useState('');

  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Joke or fun fact generator
  useEffect(() => {
    const jokes = [
      "404: Not Found... Maybe it's on a coffee break?",
      "Oops! Looks like you found a hidden Easter egg. Are you a hacker?",
      "404: Page not found. But hey, at least you’re one step ahead!",
      "Well, that was a dead end. Like my career as a rockstar!",
      "404: Looks like this page has gone for a walk. Try another link!",
      "Oops! Page not found, but at least you're an explorer now!"
    ];
    setJoke(jokes[Math.floor(Math.random() * jokes.length)]);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-800 text-center p-6">
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Centered content */}
        <div className="mb-4 text-5xl font-bold text-amber-500 dark:text-amber-400">
          4
          <motion.span
            animate={{ rotate: [0, 20, 0, -20, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block"
          >
            0
          </motion.span>
          4
        </div>

        <motion.h2
          className="text-2xl font-bold mb-4 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Page Not Found
        </motion.h2>

        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="font-semibold text-amber-500 dark:text-amber-400">404 Error:</span>
          {/* Display random joke */}
          <span className="block mt-2 text-lg font-semibold text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-700 dark:text-white p-2 rounded-lg">
            {joke}
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <button
            onClick={() => router.push('/')}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Return to Home Page
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
