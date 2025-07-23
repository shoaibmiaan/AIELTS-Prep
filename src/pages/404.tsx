'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function PageNotFound() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      user={user}
      title="Page Not Found - IELTS Master"
      description="The page you are looking for cannot be found"
    >
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-6xl font-bold text-amber-500 dark:text-amber-400 mb-6">
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
        </motion.div>
        <motion.h2
          className="text-2xl font-bold mb-6 dark:text-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Oops! Page Not Found
        </motion.h2>
        <motion.p
          className="text-gray-600 dark:text-gray-300 mb-6 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          This page seems to be more elusive than band 9 vocabulary. Try one of these alternatives:
        </motion.p>
        <div className="space-y-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-amber-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Writing Evaluator</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Get instant band score feedback on your essays
            </p>
            <button
              onClick={() => router.push('/writing')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Now
            </button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-amber-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Speaking Simulator</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Practice with our AI examiner
            </p>
            <button
              onClick={() => router.push('/speaking')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Start Practice
            </button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-amber-500 transition"
          >
            <h3 className="text-lg font-semibold mb-2 dark:text-white">Mock Test</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm">
              Full IELTS practice test with scoring
            </p>
            <button
              onClick={() => router.push('/test')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Take Test
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <button
              onClick={() => router.push('/')}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Return to Home Page
            </button>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}