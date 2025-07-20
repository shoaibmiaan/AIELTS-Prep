'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);

  // Validate token on mount
  useEffect(() => {
    if (!token) {
      router.push('/forgot-password');
      return;
    }

    const checkToken = async () => {
      try {
        // Real implementation would verify token with backend
        // This is a simulation
        await new Promise(resolve => setTimeout(resolve, 500));
        setTokenValid(true);
      } catch (error) {
        toast.error('Invalid or expired token');
        router.push('/forgot-password');
      }
    };

    checkToken();
  }, [token]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      // Add password reset logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setIsSuccess(true);
    } catch (error) {
      toast.error('Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <Toaster />
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="••••••••"
                required
                minLength={8}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  ? 'bg-gray-700 cursor-not-allowed'
                  : 'bg-orange-500 hover:bg-orange-600'
              }`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        ) : (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <p className="mb-6">
              Your password has been successfully updated. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="inline-block w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 rounded-lg font-semibold transition"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </motion.div>
  );
}
