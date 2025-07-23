'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import useDarkMode from '@/hooks/useDarkMode';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // ... existing logic

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      user={null}
      isLoading={isLoading}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center min-h-[calc(100vh-160px)]"
      >
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700">
          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h1 className="text-2xl font-bold mb-4 dark:text-white">Reset Password</h1>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                }`}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <p className="mb-6 dark:text-gray-300">
                Your password has been successfully updated.
              </p>
              <a
                href="/login"
                className="inline-block w-full py-3 px-4 bg-amber-500 hover:bg-amber-600 rounded-lg font-semibold text-white transition"
              >
                Sign In
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}