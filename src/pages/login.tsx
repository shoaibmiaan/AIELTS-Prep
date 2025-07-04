import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
      } else {
        toast.success('Logged in successfully!');
        router.push('/dashboard'); // ✅ Go straight to dashboard
      }
    } catch (err) {
      console.error(err);
      setError('Unexpected error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) toast.error(error.message);
  };

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex items-center justify-center px-4 transition`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 rounded-lg shadow-lg`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Log In</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xs border px-2 py-1 rounded hover:opacity-80"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-3 py-2 rounded border focus:outline-none ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full px-3 py-2 rounded border focus:outline-none ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <div className="my-6 border-t border-gray-600 text-center text-sm py-2">or</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className={`w-full font-semibold py-2 rounded transition shadow ${
            darkMode
              ? 'bg-white text-black hover:bg-gray-200'
              : 'bg-black text-white hover:bg-gray-900'
          }`}
        >
          Continue with Google
        </button>

        <div className="mt-6 text-center text-sm text-gray-400">
          <Link href="/forgot-password" className="hover:underline text-orange-400">
            Forgot password?
          </Link>
        </div>

        <p className="mt-4 text-center text-sm">
          Don’t have an account?{' '}
          <Link href="/signup" className="text-orange-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
