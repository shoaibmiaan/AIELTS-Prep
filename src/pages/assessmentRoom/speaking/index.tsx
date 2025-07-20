'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

interface SpeakingTest {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  duration_minutes: number;
  question_count: number;
  description: string;
  created_at: string;
  completed: boolean;
  best_score?: number;
}

export default function SpeakingAssessmentRoom() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tests, setTests] = useState<SpeakingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);

        const { data: testsData, error } = await supabase
          .from('speaking_tests')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        const { data: userProgress } = await supabase
          .from('user_speaking_progress')
          .select('test_id, completed, score');

        const testsWithProgress = testsData.map(test => {
          const progress = userProgress?.find(p => p.test_id === test.id);
          return {
            ...test,
            completed: progress?.completed || false,
            best_score: progress?.score
          };
        });

        setTests(testsWithProgress);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
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
    setCurrentPage(route);
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowLoginModal(false);
    router.push(currentPage || '/');
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
    router.push(currentPage || '/');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const startTest = (testId: string) => {
    handleProtectedClick(`/assessmentRoom/speaking/${testId}`);
  };

  const filteredTests = tests.filter(test => {
    return activeTab === 'all' ||
           (activeTab === 'completed' && test.completed) ||
           (activeTab === 'incomplete' && !test.completed);
  });

  return (
    <div className={`font-sans bg-gray-50 dark:bg-black transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Speaking Assessment Room - IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <Header
        isLoggedIn={isLoggedIn}
        isPremium={isPremium}
        darkMode={darkMode}
        mobileMenuOpen={mobileMenuOpen}
        dropdownOpen={dropdownOpen}
        toggleDarkMode={toggleDarkMode}
        handleNavigation={handleNavigation}
        handleProtectedClick={handleProtectedClick}
        setMobileMenuOpen={setMobileMenuOpen}
        setDropdownOpen={setDropdownOpen}
        dropdownRef={dropdownRef}
      />

      <main className="container mx-auto px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Speaking Assessment Room</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Practice with AI examiners and get feedback on fluency, pronunciation, and vocabulary
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md font-medium"
                onClick={() => startTest('new')}
              >
                <i className="fas fa-microphone-alt mr-2"></i> Start New Test
              </button>
              <button
                className="bg-white hover:bg-gray-100 text-purple-600 border border-purple-600 px-6 py-3 rounded-md font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-purple-400"
                onClick={() => router.push('/strategies')}
              >
                <i className="fas fa-lightbulb mr-2"></i> View Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-3xl font-bold dark:text-white">Available Speaking Tests</h2>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'completed' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('completed')}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'incomplete' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('incomplete')}
              >
                Incomplete
              </button>
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium dark:text-white">View:</label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    aria-label="Grid view"
                  >
                    <i className="fas fa-th"></i>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                    aria-label="List view"
                  >
                    <i className="fas fa-list"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <i className="fas fa-microphone-alt text-4xl text-gray-400 mb-4"></i>
              <h3 className="text-xl font-medium dark:text-white">No tests found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                {activeTab === 'all'
                  ? 'There are currently no speaking tests available.'
                  : 'No tests match your current filters.'}
              </p>
              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium"
                onClick={() => startTest('new')}
              >
                Start New Test
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold dark:text-white">{test.title}</h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        test.difficulty === 'Easy'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : test.difficulty === 'Medium'
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}
                    >
                      {test.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{test.description}</p>
                  <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <span>
                      <i className="far fa-clock mr-1"></i>
                      {test.duration_minutes} mins
                    </span>
                    <span>
                      <i className="far fa-question-circle mr-1"></i>
                      {test.question_count} questions
                    </span>
                  </div>
                  {test.completed && test.best_score && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium dark:text-white">Your Best Score:</span>
                        <span className="font-bold dark:text-white">{test.best_score}/9</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${(test.best_score / 9) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => startTest(test.id)}
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      test.completed
                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {test.completed ? 'Retake Test' : 'Start Test'}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Title</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Difficulty</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Duration</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Questions</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Best Score</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{test.title}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            test.difficulty === 'Easy'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              : test.difficulty === 'Medium'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}
                        >
                          {test.difficulty}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{test.duration_minutes} mins</td>
                      <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{test.question_count}</td>
                      <td className="py-4 px-4 text-gray-500 dark:text-gray-400">
                        {test.completed && test.best_score ? `${test.best_score}/9` : '-'}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => startTest(test.id)}
                          className={`py-2 px-4 rounded-lg font-medium ${
                            test.completed
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-200 dark:hover:bg-purple-800'
                              : 'bg-purple-600 text-white hover:bg-purple-700'
                          }`}
                        >
                          {test.completed ? 'Retake' : 'Start'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Speaking Practice Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-lightbulb text-purple-600 dark:text-purple-400"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Effective Speaking Techniques</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Practice speaking daily to build fluency</li>
                    <li>Use a variety of vocabulary and sentence structures</li>
                    <li>Record yourself to evaluate pronunciation</li>
                    <li>Simulate exam conditions with timed responses</li>
                    <li>Seek feedback from AI or native speakers</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-chart-line text-purple-600 dark:text-purple-400"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Tracking Your Progress</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Track your speaking scores to focus on improving fluency, coherence, vocabulary, and pronunciation. Regular practice is key to confidence.
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4 dark:text-white">Recommended Practice Schedule</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Beginner (5.0 target)</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">3-4 hours daily: Focus on basic phrases and pronunciation</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Intermediate (6.5 target)</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">2-3 hours daily: Practice structured responses and varied vocabulary</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Advanced (7.5+ target)</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">1-2 hours daily: Focus on fluency and complex ideas</p>
                  </div>
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 border-l-4 border-purple-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-purple-500 dark:text-purple-400 mt-1"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      <span className="font-medium">Pro Tip:</span> Practice speaking out loud daily, even for 10 minutes, to reduce hesitation and improve fluency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold dark:text-white">Welcome to IELTSMaster</h2>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mb-6">
              <div className="flex border-b">
                <button className="flex-1 py-2 font-medium text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400">
                  Sign In
                </button>
                <button
                  className="flex-1 py-2 font-medium text-gray-500 dark:text-gray-400"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                  className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="••••••••"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <button
                type="button"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium"
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
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <i className="fab fa-google mr-2"></i> Google
                </button>
                <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <i className="fab fa-facebook-f mr-2"></i> Facebook
                </button>
              </div>
            </div>
            <div className="mt-6 text-center">
              <button
                className="text-sm text-gray-600 dark:text-gray-300 font-medium hover:underline"
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
      `}</style>
    </div>
  );
}