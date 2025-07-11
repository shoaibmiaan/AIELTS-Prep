'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    goal_band: '',
    country: '',
    level: '',
    role: 'student',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, full_name, goal_band, country, level, role } = form;

    // Validate form
    if (!email || !password || !full_name || !goal_band || !country || !level) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    // Sign up the user with Supabase Authentication
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          goal_band: parseFloat(goal_band),
          country,
          level,
          role
        }
      }
    });

    if (signUpError || !data.user) {
      console.error('SignUp Error:', signUpError);
      setError(signUpError?.message || 'Signup failed. Please try again.');
      setLoading(false);
      return;
    }

    toast.success('Account created successfully!');
    router.push('/dashboard');
  };

  return (
    <div className={`${darkMode ? 'bg-black text-white' : 'bg-white text-black'} min-h-screen flex items-center justify-center px-4 transition`}>
      <div className={`max-w-md w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-100'} p-8 rounded-xl shadow-lg`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create Your Account</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="text-xs border px-2 py-1 rounded hover:opacity-80 transition"
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={form.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="••••••••"
            />
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium mb-1">
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              name="full_name"
              required
              value={form.full_name}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="John Doe"
            />
          </div>

          <div>
            <label htmlFor="goal_band" className="block text-sm font-medium mb-1">
              Goal Band Score
            </label>
            <input
              id="goal_band"
              type="number"
              name="goal_band"
              step="0.5"
              min="1"
              max="9"
              required
              value={form.goal_band}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="e.g. 7.5"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium mb-1">
              Country
            </label>
            <input
              id="country"
              type="text"
              name="country"
              required
              value={form.country}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
              placeholder="Your country"
            />
          </div>

          <div>
            <label htmlFor="level" className="block text-sm font-medium mb-1">
              English Level
            </label>
            <select
              id="level"
              name="level"
              required
              value={form.level}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="" disabled>Select your level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              required
              value={form.role}
              onChange={handleChange}
              className={`w-full px-3 py-2 rounded border focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300'
              }`}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold py-2 rounded transition disabled:opacity-50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                Creating Account...
              </span>
            ) : 'Sign Up'}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-orange-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}