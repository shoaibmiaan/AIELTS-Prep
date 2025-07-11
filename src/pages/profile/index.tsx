'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import LandingDashboardLayout from '@/layouts/LandingDashboardLayout';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

type Profile = {
  id: string;
  email: string;
  created_at: string;
  role: 'admin' | 'teacher' | 'student' | string;
  goal_band: string;
  country: string;
  level: string;
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [goalBand, setGoalBand] = useState<string>('');
  const [country, setCountry] = useState<string>('');
  const [level, setLevel] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      return;
    }
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router, isMounted]);

  // Fetch profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('users')
          .select('id, email, created_at, role, goal_band, country, level')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setProfile(data);
          setGoalBand(data.goal_band || '');
          setCountry(data.country || '');
          setLevel(data.level || '');
        }
      } catch (error: any) {
        toast.error(error.message || 'Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  // Handle role update
  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value;
    if (!profile) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, role: newRole });
      toast.success('Role updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Permission denied or error occurred.');
    }
  };

  // Handle profile field updates
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('users')
        .update({ goal_band: goalBand, country, level })
        .eq('id', profile.id);

      if (error) throw error;

      setProfile({ ...profile, goal_band: goalBand, country, level });
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted || authLoading) {
    return (
      <LandingDashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-600 dark:text-gray-300">Loading...</div>
        </div>
      </LandingDashboardLayout>
    );
  }

  if (!user) return null; // Redirect handled by useEffect

  if (loading) {
    return (
      <LandingDashboardLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="text-gray-600 dark:text-gray-300">Loading profile...</div>
        </div>
      </LandingDashboardLayout>
    );
  }

  return (
    <LandingDashboardLayout>
      <motion.div
        className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mt-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Your Profile</h1>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <strong>Email:</strong> {profile?.email || 'N/A'}
          </p>
          <p>
            <strong>Joined:</strong>{' '}
            {profile?.created_at
              ? new Date(profile.created_at).toLocaleDateString()
              : 'N/A'}
          </p>
          <p className="mt-4">
            <strong>Role:</strong>
            {profile?.role === 'admin' ? (
              <select
                value={profile.role}
                onChange={handleRoleChange}
                className="ml-2 border px-2 py-1 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
                aria-label="Select user role"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            ) : (
              <span className="ml-2 capitalize">{profile?.role || 'N/A'}</span>
            )}
          </p>
        </div>

        {/* Profile Update Form */}
        <form onSubmit={handleProfileUpdate} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Goal Band
            </label>
            <input
              type="text"
              value={goalBand}
              onChange={(e) => setGoalBand(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Enter your goal band (e.g., 7+)"
              aria-label="Goal Band"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Enter your country"
              aria-label="Country"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Level
            </label>
            <input
              type="text"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
              placeholder="Enter your level (Beginner, Intermediate, Advanced)"
              aria-label="Level"
            />
          </div>
          <div>
            <motion.button
              type="submit"
              disabled={loading}
              className={`w-full py-2 bg-blue-500 text-white rounded-lg transition ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              }`}
              whileHover={{ scale: loading ? 1 : 1.05 }}
              whileTap={{ scale: loading ? 1 : 0.95 }}
              aria-label="Save profile changes"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>

        {/* Link to Progress */}
        <div className="mt-6 text-center">
          <Link
            href="/practice/reading/history"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition"
            aria-label="View your progress"
          >
            View Your Progress
          </Link>
        </div>
      </motion.div>
    </LandingDashboardLayout>
  );
}
