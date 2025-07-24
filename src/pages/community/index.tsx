'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Community() {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const features = [
    {
      title: 'Discussion Forum',
      description: 'Join conversations, ask questions, and share IELTS tips with our global community.',
      link: '/community/forum',
      buttonText: 'Visit Forum',
      icon: '💬'
    },
    {
      title: 'Success Stories',
      description: 'Get inspired by real success stories from IELTS achievers who used our platform.',
      link: '/community/stories',
      buttonText: 'Read Stories',
      icon: '🏆'
    },
    {
      title: 'Study Groups',
      description: 'Connect with peers for collaborative learning and practice sessions.',
      link: '/community/groups',
      buttonText: 'Find Groups',
      icon: '👥'
    },
    {
      title: 'Expert Q&A',
      description: 'Get answers to your IELTS questions from our team of certified instructors.',
      link: '/community/ask',
      buttonText: 'Ask Questions',
      icon: '🎓'
    }
  ];

  return (
    <motion.section
      className="px-4 sm:px-6 md:px-12 lg:px-20 py-16 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <motion.h1
          className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          IELTS Community Hub
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Connect with thousands of IELTS aspirants worldwide to share knowledge, gain inspiration, and achieve your goals together.
        </motion.p>
      </div>

      {/* Dark Mode Toggle */}
      <div className="mb-10 flex justify-end">
        <motion.button
          onClick={toggleDarkMode}
          className="relative inline-flex items-center p-1 rounded-full bg-gray-200 dark:bg-gray-700 transition-all duration-300 shadow-sm hover:shadow-md"
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="w-8 h-8 flex items-center justify-center text-xl">
            {darkMode ? '☀️' : '🌙'}
          </span>
        </motion.button>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            className="relative bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            viewport={{ once: true }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent dark:from-gray-900/20 dark:to-transparent opacity-50" />
            <div className="relative flex flex-col h-full">
              <span className="text-4xl mb-4">{feature.icon}</span>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 flex-grow">{feature.description}</p>
              <Link href={feature.link}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-sm"
                >
                  {feature.buttonText}
                </motion.button>
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Community Guidelines */}
      <motion.div
        className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 mb-16"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Community Guidelines</h2>
        <ul className="text-gray-600 dark:text-gray-300 space-y-3">
          {[
            'Be respectful and supportive of all community members',
            'Share authentic experiences and avoid misinformation',
            'Keep discussions relevant to IELTS preparation',
            'No spam or self-promotion without permission',
            'Report any inappropriate content to moderators'
          ].map((guideline, i) => (
            <li key={i} className="flex items-start">
              <span className="text-yellow-600 dark:text-yellow-400 mr-3">•</span>
              <span>{guideline}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* CTA Section */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <Link href={user ? '/community/forum' : '/signup'}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {user ? 'Enter Community' : 'Join Our Community'}
          </motion.button>
        </Link>
      </motion.div>
    </motion.section>
  );
}
