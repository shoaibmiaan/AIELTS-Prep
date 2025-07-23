'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import Layout from '@/components/Layout';
import useDarkMode from '@/hooks/useDarkMode';

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, updateUser } = useAuth();
  const { darkMode, toggleDarkMode } = useDarkMode();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formData, setFormData] = useState({
    full_name: '',
    first_name: '',
    last_name: '',
    email: '',
    country: '',
    level: '',
    subject: '',
    current_band: '',
    target_band: 6.5,
    weaknesses: [],
    year_of_education: '',
    language_preference: 'en'
  });

  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  // ... (existing fetchProfile, setProfileData, etc. functions)

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      user={user}
      isLoading={loadingState}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 dark:text-white">Your Profile</h1>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={previewUrl || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                />
                <label className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 rounded-full p-2 cursor-pointer shadow-md">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-semibold dark:text-white">
                  {profile?.full_name || 'Your Name'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{profile?.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {/* ... other fields */}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4 dark:text-white">Education</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {/* ... other fields */}
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 dark:text-white">IELTS Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 dark:text-gray-300">Current Band</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  name="current_band"
                  value={formData.current_band}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              {/* ... other fields */}
            </div>
          </div>

          <div className="md:col-span-2 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loadingState}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg shadow transition disabled:opacity-50"
            >
              {loadingState ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}