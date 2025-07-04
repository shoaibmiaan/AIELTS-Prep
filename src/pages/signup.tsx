'use client';

import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import LandingStyleLayout from '@/layouts/LandingStyleLayout';

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    goal_band: '',
    country: '',
    level: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { email, password, full_name, goal_band, country, level, role } = form;

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError || !data.user) {
      console.error('SignUp Error:', signUpError);
      setError(signUpError?.message || 'Signup failed');
      setLoading(false);
      return;
    }

    const profilePayload = {
      id: data.user.id,
      email, // ✅ This was missing — now included
      full_name,
      goal_band: parseFloat(goal_band),
      country,
      level,
      role,
    };

    console.log('🟢 Attempting to insert into profiles:', profilePayload);

    const { error: profileError } = await supabase.from('profiles').insert(profilePayload);

    if (profileError) {
      console.error('🔴 Supabase insert error:', profileError);
      setError(profileError.message);
      setLoading(false);
      return;
    }

    router.push('/thank-you');
  };

  return (
    <LandingStyleLayout title="Sign Up">
      <div className="max-w-md mx-auto mt-10 p-6 bg-white text-black shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-6">Create Your Free Account</h1>
        <form onSubmit={handleSignup} className="space-y-5">
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Password"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="text"
            name="full_name"
            required
            placeholder="Full Name"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="number"
            name="goal_band"
            step="0.5"
            required
            placeholder="Goal Band (e.g. 7.5)"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <input
            type="text"
            name="country"
            required
            placeholder="Country"
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded"
          />
          <select
            name="level"
            required
            value={form.level}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-white"
          >
            <option value="" disabled>Select your level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
          <select
            name="role"
            required
            value={form.role}
            onChange={handleChange}
            className="w-full border border-gray-300 px-4 py-2 rounded bg-white"
          >
            <option value="" disabled>Choose role</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white w-full py-2 rounded font-semibold transition"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </LandingStyleLayout>
  );
}
