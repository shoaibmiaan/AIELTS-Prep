'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/home/LoginModal';

interface ReadingTest {
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

export default function ReadingAssessmentRoom() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode === 'true' || (!savedMode && prefersDark);
    setDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

  // Fetch reading tests from Supabase
  useEffect(() => {
    const fetchTests = async () => {
      try {
        setLoading(true);

        const { data: testsData, error } = await supabase
          .from('reading_papers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (user) {
          const { data: userProgress } = await supabase
            .from('user_reading_progress')
            .select('test_id, completed, score')
            .eq('user_id', user.id);

          const testsWithProgress = testsData.map(test => {
            const progress = userProgress?.find(p => p.test_id === test.id);
            return {
              ...test,
              completed: progress?.completed || false,
              best_score: progress?.score
            };
          });

          setTests(testsWithProgress);
        } else {
          setTests(testsData.map(test => ({
            ...test,
            completed: false,
            best_score: undefined
          })));
        }
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTests();
  }, [user]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Handle navigation
  const handleNavigation = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank');
      return;
    }

    if (route === '/logout') {
      supabase.auth.signOut();
      return;
    }

    router.push(route);
  };

  // Handle protected routes
  const handleProtectedClick = (route: string) => {
    setCurrentPage(route);
    if (!user) {
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  // Close dropdown when clicking outside
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

  // Start reading test
  const startTest = (testId: string) => {
    // console.log('startTest called:', { testId, user }); // Debug log
    const route = `/assessmentRoom/reading/${testId}`;
    if (user) {
      router.push(route);
    } else {
      setCurrentPage(route);
      sessionStorage.setItem('redirectUrl', route);
      setShowLoginModal(true);
    }
  };

  // Filter tests based on active tab
  const filteredTests = tests.filter(test => {
    if (!user) return activeTab === 'all' || activeTab === 'incomplete';
    return activeTab === 'all' ||
           (activeTab === 'completed' && test.completed) ||
           (activeTab === 'incomplete' && !test.completed);
  });

  // Get difficulty color classes
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Reading Assessment Room - IELTS Master</title>
        <meta name="description" content="Practice IELTS reading tests with authentic questions and detailed feedback" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Reading Assessment Room</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
              Practice with authentic IELTS reading passages and questions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => startTest('new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start New Test
              </button>
              <button
                className="bg-white hover:bg-gray-50 text-yellow-600 border border-yellow-600 px-6 py-3 rounded-md font-medium transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-yellow-400 dark:border-yellow-400 duration-200 flex items-center"
                onClick={() => router.push('/strategies/reading')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Reading Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold dark:text-white">Available Reading Tests</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'all' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                onClick={() => setActiveTab('all')}
              >
                All Tests
              </button>
              {user && (
                <>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'completed' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'incomplete' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => setActiveTab('incomplete')}
                  >
                    Incomplete
                  </button>
                </>
              )}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center border border-gray-100 dark:border-gray-700">
              <i className="fas fa-book-open text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <h3 className="text-xl font-medium dark:text-white">No tests found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {activeTab === 'all'
                  ? 'There are currently no reading tests available.'
                  : 'No tests match your current filters.'}
              </p>
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center mx-auto"
                onClick={() => startTest('new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start New Test
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold dark:text-white">{test.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{test.description}</p>
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
                    {test.completed && test.best_score !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium dark:text-white">Your Best Score:</span>
                          <span className="font-bold dark:text-white">{test.best_score}/40</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-yellow-600 h-2 rounded-full"
                            style={{ width: `${(test.best_score / 40) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startTest(test.id)}
                    className={`w-full py-3 px-4 font-medium transition-colors duration-200 flex items-center justify-center ${
                      test.completed
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-200 dark:hover:bg-yellow-900/50'
                        : 'bg-yellow-600 text-white hover:bg-yellow-700'
                    }`}
                  >
                    {test.completed ? (
                      <>
                        <i className="fas fa-redo mr-2"></i> Retake Test
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play mr-2"></i> Start Test
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Reading Practice Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-search text-yellow-600 dark:text-yellow-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Skimming & Scanning</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Skim first for main ideas (1-2 minutes per passage)</li>
                    <li>Scan for specific information when answering questions</li>
                    <li>Highlight keywords in both questions and text</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-clock text-yellow-600 dark:text-yellow-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Time Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Allocate 20 minutes per passage. Don't spend more than 1-1.5 minutes per question. If stuck, mark it and move on.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-5 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Recommended Practice Schedule</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Beginner (5.0 target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">3-4 hours weekly: Focus on vocabulary and basic comprehension</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Intermediate (6.5 target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">5-6 hours weekly: Practice different question types</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Advanced (7.5+ target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">7-8 hours weekly: Focus on speed and accuracy</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0 text-yellow-500 dark:text-yellow-400 mt-1">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <span className="font-medium">Pro Tip:</span> Practice reading academic articles daily to improve speed and comprehension.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        currentPage={currentPage}
      />

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