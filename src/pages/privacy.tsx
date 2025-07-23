import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { motion } from 'framer-motion';

export default function Privacy() {
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
      title="AIELTS Prep – Privacy Policy"
      description="Read our Privacy Policy to understand how we handle your data at AIELTS Prep."
    >
      <motion.section
        className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="text-2xl font-bold text-center mb-6 dark:text-white">Privacy Policy</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm text-center">
          At AIELTS Prep, we value your privacy and are committed to protecting your personal information.
        </p>
        <div className="space-y-6 text-gray-600 dark:text-gray-300 text-sm">
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">1. Information We Collect</h3>
            <p>
              We collect information you provide, such as your name, email address, and performance data, to deliver personalized IELTS preparation services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Account information (name, email, password).</li>
              <li>Practice test results and AI-generated feedback.</li>
              <li>Usage data (e.g., pages visited, time spent on platform).</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">2. How We Use Your Information</h3>
            <p>Your data is used to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide AI-driven feedback and personalized study plans.</li>
              <li>Improve our platform and services.</li>
              <li>Communicate updates, promotions, or support messages.</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">3. Data Security</h3>
            <p>
              We implement industry-standard security measures, including encryption and secure servers, to protect your data from unauthorized access.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">4. Sharing Your Information</h3>
            <p>
              We do not sell or share your personal information with third parties, except as required by law or to provide our services (e.g., with trusted service providers under strict confidentiality agreements).
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">5. Your Rights</h3>
            <p>
              You have the right to access, update, or delete your personal information. Contact us at{' '}
              <span className="text-amber-500 hover:text-amber-600 cursor-pointer" onClick={() => router.push('mailto:support@aieltsprep.com')}>
                support@aieltsprep.com
              </span> to exercise these rights.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">6. Cookies</h3>
            <p>
              We use cookies to enhance your experience, such as remembering your preferences and tracking usage. You can manage cookie settings in your browser.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 dark:text-white">7. Contact Us</h3>
            <p>
              For questions about this Privacy Policy, reach us at{' '}
              <span className="text-amber-500 hover:text-amber-600 cursor-pointer" onClick={() => router.push('mailto:support@aieltsprep.com')}>
                support@aieltsprep.com
              </span> or{' '}
              <span className="text-amber-500 hover:text-amber-600 cursor-pointer" onClick={() => router.push('tel:+1-800-IELTS-AI')}>
                +1-800-IELTS-AI
              </span>.
            </p>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}