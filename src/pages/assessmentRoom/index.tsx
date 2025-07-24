'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { colors } from '@/styles/theme';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PracticePage() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [practiceHistory, setPracticeHistory] = useState([
    { id: 1, type: 'Writing', task: 'Task 2: Opinion Essay', date: '2023-06-15', score: 6.5 },
    { id: 2, type: 'Reading', task: 'Passage 3: Scientific Research', date: '2023-06-12', score: 7.0 },
    { id: 3, type: 'Listening', task: 'Section 4: Lecture', date: '2023-06-10', score: 7.5 },
    { id: 4, type: 'Speaking', task: 'Part 2: Describe an Event', date: '2023-06-08', score: 6.0 },
  ]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const savedLogin = localStorage.getItem('isLoggedIn');
    const savedPremium = localStorage.getItem('isPremium');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    if (savedLogin === 'true') {
      setIsLoggedIn(true);
    }

    if (savedPremium === 'true') {
      setIsPremium(true);
    }
  }, []);

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

  const handleNavigation = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank');
      return;
    }

    if (route === '/logout') {
      handleLogout();
      return;
    }

    router.push(route);
  };

  const handleProtectedClick = (route: string) => {
    if (!isLoggedIn) {
      setCurrentPage(route);
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowLoginModal(false);
    if (currentPage) {
      router.push(currentPage);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsPremium(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isPremium');
    router.push('/');
  };

  const handleFreePlan = () => {
    setIsLoggedIn(true);
    setIsPremium(false);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isPremium', 'false');
    setShowLoginModal(false);
    if (currentPage) {
      router.push(currentPage);
    }
  };

  const startPractice = (type: string) => {
    handleProtectedClick(`/assessmentRoom/${type.toLowerCase()}`);
  };

  const filteredHistory = activeTab === 'all'
    ? practiceHistory
    : practiceHistory.filter(item => item.type.toLowerCase() === activeTab);

  return (
    <div className={`font-sans bg-${colors.backgroundLight} dark:bg-${colors.backgroundDark} transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Practice - IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <Header
        isLoggedIn={isLoggedIn}
        isPremium={isPremium}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleNavigation={handleNavigation}
        handleProtectedClick={handleProtectedClick}
      />

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">IELTS Practice Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Practice all four modules with authentic IELTS questions and get AI-powered feedback
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {isPremium && (
                <button
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                  onClick={() => startPractice('full-test')}
                >
                  <i className="fas fa-stopwatch mr-2"></i> Take Full Mock Test
                </button>
              )}
              <button
                className="bg-white hover:bg-gray-100 text-yellow-600 border border-yellow-600 px-6 py-3 rounded-md font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-yellow-400 dark:border-yellow-400 transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies')}
              >
                <i className="fas fa-lightbulb mr-2"></i> View Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Practice Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: 'Listening',
                icon: 'headphones',
                color: 'blue',
                description: 'Practice with authentic recordings and questions from all sections.'
              },
              {
                type: 'Reading',
                icon: 'book-open',
                color: 'green',
                description: 'Work on passages from academic journals, magazines, and newspapers.'
              },
              {
                type: 'Writing',
                icon: 'edit',
                color: 'yellow',
                description: 'Get AI feedback on Task 1 reports and Task 2 essays with band score predictions.'
              },
              {
                type: 'Speaking',
                icon: 'microphone-alt',
                color: 'purple',
                description: 'Practice with AI examiners and get feedback on fluency, pronunciation, and vocabulary.'
              }
            ].map((module) => (
              <div
                key={module.type}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 bg-${module.color}-100 dark:bg-${module.color}-900 rounded-full flex items-center justify-center mb-4 mx-auto`}>
                  <i className={`fas fa-${module.icon} text-${module.color}-600 dark:text-${module.color}-400 text-2xl`}></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 dark:text-white text-center">{module.type}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">{module.description}</p>
                <button
                  onClick={() => startPractice(module.type.toLowerCase())}
                  className={`w-full bg-${module.color}-600 hover:bg-${module.color}-700 text-white py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center`}
                >
                  <i className="fas fa-play mr-2"></i> Start Practice
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Rest of the sections remain the same as in your original code */}
        {/* Practice History, Quick Practice Sessions, Tips & Strategies sections */}

      </main>

      <Footer handleNavigation={handleNavigation} handleProtectedClick={handleProtectedClick} />

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full shadow-xl animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Welcome to IELTSMaster</h2>
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