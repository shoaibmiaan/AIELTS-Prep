import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUserProfile } = useAuth();
  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');
  const [activeSettingsTab, setActiveSettingsTab] = useState('account');

  // Form State
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [targetBand, setTargetBand] = useState(user?.targetBand || 7.0);
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    push: true,
    reminders: true,
    promotions: false
  });
  const [language, setLanguage] = useState('english');

  // Initialize dark mode (same as other pages)
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    // Load saved preferences
    const savedPrefs = localStorage.getItem('notificationPrefs');
    if (savedPrefs) {
      setNotificationPrefs(JSON.parse(savedPrefs));
    }

    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Toggle dark mode (same as other pages)
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Navigation handlers (similar to other pages)
  const navigateTo = (route: string) => {
    setActiveTab(route);
    router.push(`/${route}`);
  };

  // Settings handlers
  const handleSaveProfile = async () => {
    try {
      await updateUserProfile({ name, email });
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // await changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error('Failed to change password');
    }
  };

  const handleNotificationPrefChange = (key: string) => {
    const newPrefs = {
      ...notificationPrefs,
      [key]: !notificationPrefs[key as keyof typeof notificationPrefs]
    };
    setNotificationPrefs(newPrefs);
    localStorage.setItem('notificationPrefs', JSON.stringify(newPrefs));
    toast.success('Notification preferences saved');
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
    localStorage.setItem('language', e.target.value);
    toast.success('Language preference saved');
  };

  const handleDeleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      // deleteAccount();
      logout();
      router.push('/');
    }
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Settings | IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        navigateTo={navigateTo}
        handleProtectedClick={() => {}}
        handleNavigation={() => {}}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Settings Sidebar */}
          <div className="md:w-64 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Settings</h2>
            <nav className="space-y-1">
              <button
                onClick={() => setActiveSettingsTab('account')}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  activeSettingsTab === 'account'
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-user-circle mr-2"></i>
                Account
              </button>
              <button
                onClick={() => setActiveSettingsTab('security')}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  activeSettingsTab === 'security'
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-shield-alt mr-2"></i>
                Security
              </button>
              <button
                onClick={() => setActiveSettingsTab('notifications')}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  activeSettingsTab === 'notifications'
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-bell mr-2"></i>
                Notifications
              </button>
              <button
                onClick={() => setActiveSettingsTab('preferences')}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  activeSettingsTab === 'preferences'
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-cog mr-2"></i>
                Preferences
              </button>
              <button
                onClick={() => setActiveSettingsTab('subscription')}
                className={`w-full text-left px-4 py-2 rounded-lg font-medium ${
                  activeSettingsTab === 'subscription'
                    ? 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <i className="fas fa-crown mr-2"></i>
                Subscription
              </button>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-grow">
            {/* Account Settings */}
            {activeSettingsTab === 'account' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Account Information</h3>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Target IELTS Band
                    </label>
                    <select
                      value={targetBand}
                      onChange={(e) => setTargetBand(parseFloat(e.target.value))}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                    >
                      {[5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(band => (
                        <option key={band} value={band}>{band}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveProfile}
                      className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSettingsTab === 'security' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h3>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Change Password</h4>

                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          onClick={handleChangePassword}
                          className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Danger Zone</h4>

                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-red-800 dark:text-red-200">Delete Account</h5>
                          <p className="text-sm text-red-600 dark:text-red-300">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <button
                          onClick={handleDeleteAccount}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeSettingsTab === 'notifications' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Receive important updates via email
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationPrefChange('email')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationPrefs.email ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationPrefs.email ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Get alerts on your device
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationPrefChange('push')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationPrefs.push ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationPrefs.push ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Study Reminders</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Daily practice reminders
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationPrefChange('reminders')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationPrefs.reminders ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationPrefs.reminders ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Promotional Offers</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Special deals and course offers
                      </p>
                    </div>
                    <button
                      onClick={() => handleNotificationPrefChange('promotions')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        notificationPrefs.promotions ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          notificationPrefs.promotions ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Settings */}
            {activeSettingsTab === 'preferences' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">App Preferences</h3>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={language}
                      onChange={handleLanguageChange}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-amber-500 focus:border-amber-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="chinese">Chinese</option>
                      <option value="arabic">Arabic</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Dark Mode</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Switch between light and dark theme
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        darkMode ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription Settings */}
            {activeSettingsTab === 'subscription' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Subscription</h3>

                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-4">
                      <i className="fas fa-crown text-amber-500 dark:text-amber-300"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">IELTS Master Premium</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        Unlimited mock tests, personalized feedback, and advanced analytics
                      </p>
                      <p className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-2">
                        $9.99/month
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors">
                      Upgrade to Premium
                    </button>
                    <button className="w-full mt-3 py-2 text-amber-600 dark:text-amber-400 font-medium">
                      View Plan Details
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Payment Methods</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <i className="fab fa-cc-visa text-2xl text-blue-600 mr-3"></i>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Expires 05/2025</p>
                        </div>
                      </div>
                      <button className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                        Edit
                      </button>
                    </div>
                  </div>

                  <button className="mt-4 text-amber-600 dark:text-amber-400 font-medium">
                    + Add Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer
        handleNavigation={() => {}}
        handleProtectedClick={() => {}}
      />

      <style jsx global>{`
        html {
          transition: background-color 0.3s ease;
        }
        body {
          transition: background-color 0.3s ease;
        }
      `}</style>
    </div>
  );
}