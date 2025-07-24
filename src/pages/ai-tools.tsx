'use client';
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
    <div className={`font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>AI Tools</title>
        <meta name="description" content="Explore our collection of powerful AI tools" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Browse by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${
                  activeCategory === category.id
                    ? 'bg-yellow-600 text-white border-yellow-600'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold dark:text-white">
              {activeCategory === 'all' ? 'Featured AI Tools' : `${categories.find(c => c.id === activeCategory)?.name} Tools`}
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search for AI tools..."
                  className="w-full px-6 py-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute right-2 top-1.5 bg-yellow-600 text-white px-4 py-1 rounded-md hover:bg-yellow-700 transition-colors duration-200">
                  <i className="fas fa-search"></i>
                </button>
              </div>
              {user && (
                <button
                  onClick={() => handleProtectedClick('/ai-tools/new')}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-plus mr-2"></i> Add Tool
                </button>
              )}
            </div>
          </div>

          {filteredTools.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-300 text-lg">No tools found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <div
                  key={tool.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  onClick={() => openTool(tool.id)}
                >
                  <div className={`w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4 mx-auto ${
                    tool.locked ? 'opacity-80' : ''
                  }`}>
                    <i className={`fas fa-${tool.categories[0] === 'text' ? 'edit' : tool.categories[0] === 'image' ? 'image' : tool.categories[0] === 'code' ? 'code' : tool.categories[0] === 'video' ? 'video' : tool.categories[0] === 'audio' ? 'microphone-alt' : 'tools'} text-yellow-600 dark:text-yellow-400 text-2xl`}></i>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 dark:text-white text-center">{tool.name}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{tool.description}</p>
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
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
                          className="bg-yellow-600 h-2.5 rounded-full"
                          style={{ width: `${tool.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  {tool.score && (
                    <div className="mb-4 text-center">
                      <span className="text-sm bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-3 py-1 rounded-full">
                        Score: {tool.score}
                      </span>
                    </div>
                  )}
                  <button
                    className={`w-full py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center ${
                      tool.locked
                        ? 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                    }`}
                    disabled={tool.locked}
                  >
                    <i className={`fas fa-${tool.locked ? 'lock' : 'play'} mr-2`}></i>
                    {tool.locked ? 'Unlock Tool' : 'Open Tool'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity (for logged-in users) */}
        {user && recentActivities.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Your Recent Activity</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                    <i className={`fas fa-${activity.type === 'text' ? 'edit' : activity.type === 'code' ? 'code' : activity.type === 'image' ? 'image' : 'tools'} text-yellow-600 dark:text-yellow-400 text-xl`}></i>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white text-center">{activity.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-center">{activity.details}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center">{activity.date}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Welcome to AI Tools Portal</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors duration-200"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-6">
              <div className="flex border-b">
                <button className="flex-1 py-2 font-medium text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400">
                  Sign In
                </button>
                <button
                  className="flex-1 py-2 font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={() => router.push('/signup')}
                >
                  Sign Up
                </button>
              </div>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                  placeholder="your@email.com"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline transition-colors duration-200">
                  Forgot password?
                </a>
              </div>
              <button
                type="button"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium transition-colors duration-200"
                onClick={handleLogin}
              >
                Sign In
              </button>
            </form>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-3">
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                  <i className="fab fa-google mr-2"></i> Google
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors duration-200">
                  <i className="fab fa-facebook-f mr-2"></i> Facebook
                </button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                className="text-sm text-gray-600 dark:text-gray-300 font-medium hover:underline transition-colors duration-200"
                onClick={handleFreePlan}
              >
                Continue with free plan
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        html {
          transition: background-color 0.3s ease;
        }
        body {
          transition: background-color 0.3s ease;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}