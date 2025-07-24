import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

type Tool = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  imageUrl?: string;
  locked?: boolean;
  score?: number;
  progress?: number;
};

type Category = {
  id: string;
  name: string;
};

export default function AIToolsPortal() {
  const router = useRouter();
  const { user, login } = useAuth();

  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [activeTab, setActiveTab] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Data State
  const [activeCategory, setActiveCategory] = useState('all');
  const userName = user?.name || user?.email?.split('@')[0] || '';
  const userAvatar = user?.avatar || null;

  const categories: Category[] = [
    { id: 'all', name: 'All' },
    { id: 'text', name: 'Text Generation' },
    { id: 'image', name: 'Image Generation' },
    { id: 'code', name: 'Code Assistants' },
    { id: 'video', name: 'Video Tools' },
    { id: 'audio', name: 'Audio Tools' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'business', name: 'Business' },
  ];

  const [tools, setTools] = useState<Tool[]>([
    {
      id: '1',
      name: 'AI Writer Pro',
      description: 'Advanced text generation tool for content creators with multiple writing styles.',
      categories: ['text', 'productivity'],
      progress: user ? 65 : 30,
      locked: !user,
    },
    {
      id: '2',
      name: 'CodeGenius',
      description: 'AI-powered coding assistant that helps developers write better code faster.',
      categories: ['code'],
      progress: user ? 45 : 0,
      locked: !user,
    },
    {
      id: '3',
      name: 'Artificion',
      description: 'Create stunning digital art with simple text prompts using our image generator.',
      categories: ['image', 'design'],
      progress: user ? 30 : 0,
      locked: false,
    },
    {
      id: '4',
      name: 'VideoAI Studio',
      description: 'Automate video editing, generate voiceovers, and create professional videos in minutes.',
      categories: ['video', 'audio'],
      locked: true,
    },
    {
      id: '5',
      name: 'DataMind',
      description: 'Powerful AI analytics platform that transforms raw data into actionable insights.',
      categories: ['business', 'productivity'],
      score: user ? 6.5 : 0,
      locked: !user,
    },
    {
      id: '6',
      name: 'VoiceClone',
      description: 'Create realistic voice clones and generate natural-sounding speech from text.',
      categories: ['audio'],
      locked: !user,
    },
  ]);

  const [recentActivities, setRecentActivities] = useState(
    user ? [
      { id: 1, type: 'text', title: 'Used AI Writer Pro', details: 'Generated blog post', date: '2 hours ago' },
      { id: 2, type: 'code', title: 'CodeGenius Session', details: 'Fixed 15 bugs', date: '1 day ago' },
      { id: 3, type: 'image', title: 'Artificion Creation', details: 'Generated 5 images', date: '3 days ago' }
    ] : []
  );

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Filter tools based on search and category
  const filteredTools = tools.filter((tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' ||
                           tool.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  // Navigation Handlers
  const handleProtectedClick = async (route: string) => {
    setCurrentPage(route);
    if (!user) {
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    } else {
      await router.push(route);
    }
  };

  const navigateTo = (route: string) => {
    setActiveTab(route);
    router.push(route);
  };

  // Tool Handlers
  const openTool = (id: string) => {
    const tool = tools.find(t => t.id === id);
    if (tool && !tool.locked) {
      handleProtectedClick(`/ai-tools/${id}`);
    } else if (tool?.locked) {
      toast.error('This tool requires an account. Please sign in.');
      setShowLoginModal(true);
    }
  };

  // Auth Handlers
  const handleLogin = async () => {
    try {
      await login(email, password);
      setShowLoginModal(false);
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/ai-tools';
      sessionStorage.removeItem('redirectUrl');
      await router.push(redirectUrl);
      // Update tools to unlock those available to users
      setTools(prevTools => prevTools.map(tool => ({
        ...tool,
        locked: tool.id === '4' ? true : false // Keep VideoAI locked for all
      })));
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleFreePlan = () => {
    setShowLoginModal(false);
    router.push(currentPage || '/ai-tools');
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>{user ? 'AI Tools Portal' : 'Discover AI Tools'}</title>
        <meta name="description" content="Explore our collection of powerful AI tools" />
      </Head>

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">AI Tools Portal</h1>
          <div className="flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Home</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">Categories</a></li>
                <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">New Tools</a></li>
                {user && (
                  <li><a href="#" className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium">My Tools</a></li>
                )}
              </ul>
            </nav>
            {user ? (
              <div className="flex items-center space-x-4">
                <button onClick={toggleDarkMode} className="text-gray-700 dark:text-gray-300">
                  {darkMode ? '☀️' : '🌙'}
                </button>
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="w-full h-full rounded-full" />
                  ) : (
                    userName.charAt(0).toUpperCase()
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
              {user ? `Welcome back, ${userName}!` : 'Discover Powerful AI Tools'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6">
              {user ? 'Continue your AI journey with these tools' : 'Explore our curated collection to boost your productivity'}
            </p>
            <div className="max-w-lg mx-auto relative">
              <input
                type="text"
                placeholder="Search for AI tools..."
                className="w-full px-6 py-3 rounded-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button className="absolute right-2 top-2 bg-blue-600 text-white px-4 py-1 rounded-full hover:bg-blue-700 transition">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Browse by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-full border transition ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {activeCategory === 'all' ? 'Featured AI Tools' : `${categories.find(c => c.id === activeCategory)?.name} Tools`}
            </h3>
            {user && (
              <button
                onClick={() => handleProtectedClick('/ai-tools/new')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
              >
                + Add Tool
              </button>
            )}
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
              <p className="text-gray-500 dark:text-gray-400 text-lg">No tools found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className={`bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow ${
                    tool.locked ? 'opacity-80' : 'cursor-pointer hover:border-blue-500'
                  }`}
                  onClick={() => openTool(tool.id)}
                >
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center relative">
                    {tool.locked && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">Premium Tool</span>
                      </div>
                    )}
                    <span className="text-gray-500 dark:text-gray-400">Tool Preview</span>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">{tool.name}</h4>
                      {tool.score && (
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-sm">
                          Score: {tool.score}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.categories.map((catId) => {
                        const catName = categories.find(c => c.id === catId)?.name;
                        return catName ? (
                          <span
                            key={catId}
                            className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full"
                          >
                            {catName}
                          </span>
                        ) : null;
                      })}
                    </div>
                    {tool.progress !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{tool.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${tool.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    <button
                      className={`w-full py-2 rounded-md ${
                        tool.locked
                          ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                      disabled={tool.locked}
                    >
                      {tool.locked ? 'Unlock Tool' : 'Open Tool'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity (for logged-in users) */}
        {user && recentActivities.length > 0 && (
          <section className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Your Recent Activity</h3>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {recentActivities.map((activity) => (
                  <li key={activity.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mr-4">
                        {activity.type === 'text' && '✍️'}
                        {activity.type === 'code' && '💻'}
                        {activity.type === 'image' && '🖼️'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {activity.details}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {activity.date}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">AI Tools Portal</h4>
              <p className="text-gray-400">
                Your gateway to the best artificial intelligence tools on the market.
              </p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition">Submit a Tool</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.slice(0, 4).map((category) => (
                  <li key={category.id}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{category.name}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Contact Us</h4>
              <ul className="text-gray-400 space-y-2">
                <li>Email: info@aitoolsportal.com</li>
                <li>Phone: (123) 456-7890</li>
                <li>Address: 123 AI Street, Tech City</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} AI Tools Portal. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Sign In</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-between items-center">
                <button
                  onClick={handleLogin}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
                >
                  Login
                </button>
                <button
                  onClick={handleFreePlan}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Continue as Guest
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}