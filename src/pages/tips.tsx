import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Tips() {
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
      title="AIELTS Prep – IELTS Tips"
      description="Discover expert tips and AI-driven strategies to excel in your IELTS exam."
    >
      <motion.section
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">IELTS Tips & Strategies</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm text-center">
          Boost your IELTS performance with expert advice and AI-powered insights tailored to your needs.
        </p>
        <div className="space-y-6">
          {[
            {
              title: 'Mastering IELTS Writing',
              tips: [
                'Use AI feedback to refine your essays.',
                'Practice with timed tasks to improve speed.',
                'Focus on coherence and task response.',
              ],
            },
            {
              title: 'Excelling in IELTS Speaking',
              tips: [
                'Record and analyze your answers with AI tools.',
                'Practice common question types daily.',
                'Work on fluency and pronunciation.',
              ],
            },
            {
              title: 'Acing IELTS Reading',
              tips: [
                'Use AI to identify weak areas in comprehension.',
                'Practice skimming and scanning techniques.',
                'Manage your time effectively during tests.',
              ],
            },
            {
              title: 'Improving IELTS Listening',
              tips: [
                'Leverage AI to practice with diverse accents.',
                'Take notes while listening to mock tests.',
                'Review incorrect answers with detailed feedback.',
              ],
            },
          ].map((category, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-amber-500 transition"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="text-lg font-semibold mb-2 dark:text-white">{category.title}</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                {category.tips.map((tip, j) => (
                  <li key={j} className="flex items-start">
                    <span className="mr-2 text-amber-500">✔</span> {tip}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </Layout>
  );
}