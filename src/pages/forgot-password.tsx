'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSuccess(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-black transition-colors duration-300 min-h-screen flex items-center justify-center p-6`}>
      <Toaster position="top-center" />
      <div className={`w-full max-w-md bg-gray-900/70 backdrop-blur-sm p-8 rounded-xl border border-gray-700`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-yellow-800 dark:text-yellow-400">Forgot Password</h1>
            <p className="text-gray-400">
              {isSuccess
                ? 'Check your email for the reset link'
                : 'Enter your email to reset your password'}
            </p>
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-gray-800 dark:text-gray-200">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="your@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition ${isLoading ? 'bg-gray-700 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-500 text-5xl mb-4">✓</div>
              <p className="mb-6">
                We've sent a password reset link to <span className="font-semibold">{email}</span>.
                Please check your inbox.
              </p>
              <button
                onClick={() => {
                  setEmail('');
                  setIsSuccess(false);
                }}
                className="text-orange-500 hover:text-orange-400 font-medium"
              >
                Resend Email
              </button>
            </div>
          )}

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-orange-500 hover:text-orange-400 font-medium">
              Back to Login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
