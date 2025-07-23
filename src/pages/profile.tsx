'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ProfilePage = () => {
  const { user, profile, loading, updateUser } = useAuth();
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

  const fetchProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error('User not logged in');

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setProfileData(data);
      setPreviewUrl(data.avatar_url || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const setProfileData = (data: any) => {
    setFormData({
      full_name: data.full_name || '',
      first_name: data.first_name || '',
      last_name: data.last_name || '',
      email: data.email || '',
      country: data.country || '',
      level: data.level || '',
      subject: data.subject || '',
      current_band: data.current_band || '',
      target_band: data.target_band || 6.5,
      weaknesses: data.weaknesses || [],
      year_of_education: data.year_of_education || '',
      language_preference: data.language_preference || 'en'
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'target_band' || name === 'current_band') {
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0 || numValue > 9) {
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWeaknessesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map(opt => opt.value);
    setFormData(prev => ({ ...prev, weaknesses: values }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoadingState(true);
      const { data: { user } } = await supabase.auth.getUser();

      let avatarUrl = profile?.avatar_url || '';
      if (avatarFile) {
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}-${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, avatarFile);

        if (uploadError) throw uploadError;

        avatarUrl = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath).data.publicUrl;
      }

      const updates = {
        ...formData,
        avatar_url: avatarUrl,
        full_name: formData.first_name + ' ' + formData.last_name,
        updated_at: new Date().toISOString(),
        target_band: parseFloat(formData.target_band),
        current_band: parseFloat(formData.current_band)
      };

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      alert('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Update failed: ' + error.message);
    } finally {
      setLoadingState(false);
    }
  };

  if (loadingState) return <div>Loading profile...</div>;
  if (!profile) return <div>Profile not found</div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Header />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>

        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={previewUrl || '/default-avatar.png'}
                  alt="Avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                  onError={(e) => { e.currentTarget.src = 'https://via.placeholder.com/128'; }}
                />
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 cursor-pointer shadow-md">
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
                <h2 className="text-2xl font-semibold">
                  {profile.full_name || 'Your Name'}
                </h2>
                <p className="text-gray-600">{profile.email}</p>
                <p className="capitalize text-gray-500 mt-1">
                  {profile.role} • {profile.status}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-4">Education Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Year of Education</label>
                <input
                  type="text"
                  name="year_of_education"
                  value={formData.year_of_education}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Level</label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Language Preference</label>
                <select
                  name="language_preference"
                  value={formData.language_preference}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-4">IELTS Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Band Score</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  name="current_band"
                  value={formData.current_band}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Band Score</label>
                <input
                  type="number"
                  min="0"
                  max="9"
                  step="0.5"
                  name="target_band"
                  value={formData.target_band}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Weak Areas</label>
                <select
                  multiple
                  name="weaknesses"
                  value={formData.weaknesses}
                  onChange={handleWeaknessesChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-32"
                >
                  <option value="listening">Listening</option>
                  <option value="reading">Reading</option>
                  <option value="writing">Writing</option>
                  <option value="speaking">Speaking</option>
                  <option value="vocabulary">Vocabulary</option>
                  <option value="grammar">Grammar</option>
                  <option value="pronunciation">Pronunciation</option>
                  <option value="time_management">Time Management</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-2 border-t pt-6 flex justify-end">
            <button
              type="submit"
              disabled={loadingState}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loadingState ? 'Saving...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;