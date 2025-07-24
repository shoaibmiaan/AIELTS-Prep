'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiSun, FiMoon, FiMail, FiPhone } from 'react-icons/fi';

export default function Privacy() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    setIsMounted(true);
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode === null ? prefersDark : savedMode === 'true';

    setDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  if (isLoading || !isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>

          <button
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
          </button>
        </header>

        <motion.article
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
            <h1 className="text-3xl font-bold">Privacy Policy</h1>
            <p className="mt-2 opacity-90">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="p-6 md:p-8">
            <p className="text-lg mb-8 text-center text-gray-700 dark:text-gray-300">
              At AIELTS Prep, we value your privacy and are committed to protecting your personal information.
            </p>

            <div className="space-y-8">
              {[
                {
                  title: "1. Information We Collect",
                  content: "We collect information you provide, such as your name, email address, and performance data, to deliver personalized IELTS preparation services. This includes:",
                  items: [
                    "Account information (name, email, password)",
                    "Practice test results and AI-generated feedback",
                    "Usage data (pages visited, time spent on platform)"
                  ]
                },
                {
                  title: "2. How We Use Your Information",
                  content: "Your data is used to:",
                  items: [
                    "Provide AI-driven feedback and personalized study plans",
                    "Improve our platform and services",
                    "Communicate updates, promotions, or support messages"
                  ]
                },
                {
                  title: "3. Data Security",
                  content: "We implement industry-standard security measures, including encryption and secure servers, to protect your data from unauthorized access. All sensitive data is encrypted both in transit and at rest."
                },
                {
                  title: "4. Sharing Your Information",
                  content: "We do not sell or share your personal information with third parties, except as required by law or to provide our services (e.g., with trusted service providers under strict confidentiality agreements)."
                },
                {
                  title: "5. Your Rights",
                  content: `You have the right to access, update, or delete your personal information. Contact us at support@aieltsprep.com to exercise these rights.`
                },
                {
                  title: "6. Cookies",
                  content: "We use cookies to enhance your experience, such as remembering your preferences and tracking usage. You can manage cookie settings in your browser."
                },
                {
                  title: "7. Policy Updates",
                  content: "We may update this policy periodically. Significant changes will be notified through our platform or via email."
                },
                {
                  title: "8. Contact Us",
                  content: "For questions about this Privacy Policy:"
                }
              ].map((section, index) => (
                <motion.section
                  key={index}
                  className="border-l-4 border-amber-500 pl-4 py-1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-3 dark:text-white">{section.title}</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{section.content}</p>

                  {section.items && (
                    <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}

                  {section.title === "8. Contact Us" && (
                    <div className="mt-4 flex flex-col sm:flex-row gap-4">
                      <a
                        href="mailto:support@aieltsprep.com"
                        className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        <FiMail className="flex-shrink-0" />
                        support@aieltsprep.com
                      </a>
                      <a
                        href="tel:+1-800-IELTS-AI"
                        className="flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
                      >
                        <FiPhone className="flex-shrink-0" />
                        +1-800-IELTS-AI
                      </a>
                    </div>
                  )}
                </motion.section>
              ))}
            </div>

            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} AIELTS Prep. All rights reserved.
            </div>
          </div>
        </motion.article>
      </div>
    </div>
  );
}