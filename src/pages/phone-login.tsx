import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function PhoneLoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);

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

  // Redirect if logged in
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const sendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        setError(error.message);
      } else {
        setIsOtpSent(true);
        toast.success('OTP sent successfully!');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const { user, error } = await supabase.auth.verifyOtp({
        phone: phoneNumber,
        token: otp,
      });

      if (error) {
        setError(error.message);
      } else {
        toast.success('Successfully logged in!');
        router.push('/dashboard');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      user={user}
      title="Phone Login - IELTS Master"
      description="Log in to IELTS Master using your phone number"
    >
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Log In with Phone</h2>
          <button
            onClick={() => router.back()}
            className="text-sm text-amber-500 hover:text-amber-600 dark:text-amber-400 dark:hover:text-amber-500"
          >
            Back
          </button>
        </div>
        <form className="space-y-4">
          {!isOtpSent ? (
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending OTP…' : 'Send OTP'}
              </button>
            </div>
          ) : (
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Enter OTP
              </label>
              <input
                type="text"
                id="otp"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full mt-1 px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg border border-gray-300 dark:border-gray-600 focus:border-amber-500 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={verifyOtp}
                disabled={loading}
                className="w-full mt-4 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying OTP…' : 'Verify OTP'}
              </button>
            </div>
          )}
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </Layout>
  );
}