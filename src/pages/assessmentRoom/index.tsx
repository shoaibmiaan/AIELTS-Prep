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

      <main className="container mx-auto px-6 py-10">
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">IELTS Practice Center</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Practice all four modules with authentic IELTS questions and get AI-powered feedback
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium"
                onClick={() => startPractice('full-test')}
              >
                <i className="fas fa-stopwatch mr-2"></i> Take Full Mock Test
              </button>
              <button
                className="bg-white hover:bg-gray-100 text-yellow-600 border border-yellow-600 px-6 py-3 rounded-md font-medium dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-yellow-400"
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
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-headphones text-blue-600 dark:text-blue-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Listening</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Practice with authentic recordings and questions from all sections.</p>
              <button
                onClick={() => startPractice('listening')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium"
              >
                Start Practice
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-book-open text-green-600 dark:text-green-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Reading</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Work on passages from academic journals, magazines, and newspapers.</p>
              <button
                onClick={() => startPractice('reading')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md font-medium"
              >
                Start Practice
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-edit text-yellow-600 dark:text-yellow-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Writing</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Get AI feedback on Task 1 reports and Task 2 essays with band score predictions.</p>
              <button
                onClick={() => startPractice('writing')}
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
              >
                Start Practice
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                <i className="fas fa-microphone-alt text-purple-600 dark:text-purple-400 text-2xl"></i>
              </div>
              <h3 className="text-xl font-semibold mb-3 dark:text-white">Speaking</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Practice with AI examiners and get feedback on fluency, pronunciation, and vocabulary.</p>
              <button
                onClick={() => startPractice('speaking')}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md font-medium"
              >
                Start Practice
              </button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-3xl font-bold dark:text-white">Your Practice History</h2>
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'all' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('all')}
              >
                All
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'listening' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('listening')}
              >
                Listening
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'reading' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('reading')}
              >
                Reading
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'writing' ? 'bg-yellow-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('writing')}
              >
                Writing
              </button>
              <button
                className={`px-4 py-2 rounded-md ${activeTab === 'speaking' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                onClick={() => setActiveTab('speaking')}
              >
                Speaking
              </button>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Type</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Task</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Date</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Score</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        item.type === 'Listening' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        item.type === 'Reading' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        item.type === 'Writing' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                      }`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{item.task}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400">{item.date}</td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-gray-900 dark:text-white">{item.score}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-sm ml-1">Band</span>
                    </td>
                    <td className="py-4 px-4">
                      <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                        <i className="fas fa-chart-line"></i> View Report
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-800 dark:text-yellow-400 dark:hover:text-yellow-300">
                        <i className="fas fa-redo"></i> Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredHistory.length === 0 && (
              <div className="text-center py-12">
                <i className="fas fa-inbox text-4xl text-gray-300 dark:text-gray-600 mb-4"></i>
                <p className="text-gray-500 dark:text-gray-400">No practice history found</p>
                <button
                  className="mt-4 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium"
                  onClick={() => startPractice('listening')}
                >
                  Start Practicing
                </button>
              </div>
            )}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Quick Practice Sessions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-bolt text-red-600 dark:text-red-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold dark:text-white">10-Minute Mini Test</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">A quick assessment with questions from all four modules.</p>
              <button
                onClick={() => startPractice('mini-test')}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-medium"
              >
                Start Now
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-book text-indigo-600 dark:text-indigo-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold dark:text-white">Vocabulary Builder</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Learn and practice IELTS-specific vocabulary with flashcards.</p>
              <button
                onClick={() => router.push('/vocabulary')}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-md font-medium"
              >
                Practice Words
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-pencil-alt text-pink-600 dark:text-pink-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold dark:text-white">Grammar Challenge</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">Test your grammar skills with timed challenges.</p>
              <button
                onClick={() => router.push('/grammar')}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-md font-medium"
              >
                Start Challenge
              </button>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Practice Tips & Strategies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-lightbulb text-yellow-600 dark:text-yellow-400"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Effective Practice Techniques</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Simulate exam conditions with timed practice sessions</li>
                    <li>Focus on your weaknesses but don't neglect your strengths</li>
                    <li>Review mistakes thoroughly and understand why you made them</li>
                    <li>Practice all modules regularly to maintain balance</li>
                    <li>Use authentic IELTS practice materials</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-chart-line text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Tracking Your Progress</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use our progress dashboard to monitor your scores over time. Set realistic goals and
                    celebrate small improvements. Consistent practice with regular feedback is key to
                    IELTS success.
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
                    <p className="text-gray-600 dark:text-gray-300 text-sm">4-5 hours daily: Focus on foundational skills and vocabulary</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Intermediate (6.5 target)</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">3-4 hours daily: Balanced practice with strategy implementation</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Advanced (7.5+ target)</h4>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">2-3 hours daily: Focused practice on weak areas and test simulation</p>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-yellow-500 dark:text-yellow-400 mt-1"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <span className="font-medium">Pro Tip:</span> Practice speaking out loud daily, even if just for 10 minutes.
                      This builds fluency and reduces hesitation during the actual test.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer handleNavigation={handleNavigation} handleProtectedClick={handleProtectedClick} />

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
                <button className="flex-1 py-2 font-medium text-yellow-600 dark:text-yellow-400 border-b-2 border-yellow-600 dark:border-yellow-400">
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
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>
                <a href="#" className="text-sm text-yellow-600 dark:text-yellow-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <button
                type="button"
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md font-medium"
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