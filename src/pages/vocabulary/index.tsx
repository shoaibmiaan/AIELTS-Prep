'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const VocabularyPage = () => {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [showMeaning, setShowMeaning] = useState(false);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizResult, setQuizResult] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample vocabulary data
  const vocabulary = [
    { word: 'Eloquent', meaning: 'Fluent or persuasive in speaking or writing', example: 'Her eloquent speech captivated the audience.' },
    { word: 'Mitigate', meaning: 'Make less severe, serious, or painful', example: 'They took steps to mitigate the environmental impact.' },
    { word: 'Pragmatic', meaning: 'Dealing with things sensibly and realistically', example: 'His pragmatic approach solved the issue efficiently.' },
    { word: 'Ubiquitous', meaning: 'Present, appearing, or found everywhere', example: 'Smartphones are now ubiquitous in modern society.' },
  ];

  // Initialize dark mode and login state from localStorage
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

  // Toggle dark mode
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

  // Handle navigation
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

  // Handle protected routes
  const handleProtectedClick = (route: string) => {
    setCurrentPage(route);
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      router.push(route);
    }
  };

  // Handle login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setShowLoginModal(false);
    router.push(currentPage || '/');
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsPremium(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('isPremium');
    router.push('/');
  };

  // Handle free plan selection
  const handleFreePlan = () => {
    setIsLoggedIn(true);
    setIsPremium(false);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('isPremium', 'false');
    setShowLoginModal(false);
    router.push(currentPage || '/');
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

  // Flashcard navigation
  const nextWord = () => {
    setCurrentWordIndex((prev) => (prev + 1) % vocabulary.length);
    setShowMeaning(false);
  };

  const prevWord = () => {
    setCurrentWordIndex((prev) => (prev - 1 + vocabulary.length) % vocabulary.length);
    setShowMeaning(false);
  };

  // Quiz handling
  const handleQuizSubmit = (word: string) => {
    if (quizAnswer.toLowerCase() === word.toLowerCase()) {
      setQuizResult('Correct!');
    } else {
      setQuizResult(`Incorrect! The correct word is "${word}".`);
    }
    setTimeout(() => {
      setQuizResult(null);
      setQuizAnswer('');
      nextWord();
    }, 2000);
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-black transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Vocabulary Builder - IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      {/* Vocabulary Page Content */}
      <main className="container mx-auto px-6 py-10">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 dark:text-white">Vocabulary Builder</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Master IELTS-specific vocabulary with interactive flashcards and quizzes
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium"
                onClick={() => router.push('/vocabulary/flashcards')}  // Navigate to the flashcards page
              >
                <i className="fas fa-book mr-2"></i> Start Flashcards
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

        {/* Flashcard Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Interactive Flashcards</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div
                className="w-full max-w-md bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center cursor-pointer"
                onClick={() => setShowMeaning(!showMeaning)}
              >
                <h3 className="text-2xl font-semibold mb-4 dark:text-white">{vocabulary[currentWordIndex].word}</h3>
                {showMeaning && (
                  <>
                    <p className="text-gray-600 dark:text-gray-300 mb-2">{vocabulary[currentWordIndex].meaning}</p>
                    <p className="text-gray-500 dark:text-gray-400 italic">"{vocabulary[currentWordIndex].example}"</p>
                  </>
                )}
              </div>
              <div className="flex justify-between w-full max-w-md mt-4">
                <button
                  onClick={prevWord}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  <i className="fas fa-arrow-left mr-2"></i> Previous
                </button>
                <button
                  onClick={nextWord}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
                >
                  Next <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Vocabulary Quiz Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Vocabulary Quiz</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                What is the word for: <span className="font-semibold">{vocabulary[currentWordIndex].meaning}</span>?
              </p>
              <input
                type="text"
                value={quizAnswer}
                onChange={(e) => setQuizAnswer(e.target.value)}
                className="w-full max-w-md px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white mb-4"
                placeholder="Type the word"
              />
              <button
                onClick={() => handleQuizSubmit(vocabulary[currentWordIndex].word)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md font-medium"
              >
                Submit Answer
              </button>
              {quizResult && (
                <p className={`mt-4 text-lg ${quizResult.includes('Correct') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {quizResult}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Vocabulary List */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Vocabulary List</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Word</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Meaning</th>
                  <th className="py-3 px-4 text-left text-sm font-semibold text-gray-500 dark:text-gray-300">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {vocabulary.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="py-4 px-4 text-gray-700 dark:text-gray-300">{item.word}</td>
                    <td className="py-4 px-4 text-gray-600 dark:text-gray-300">{item.meaning}</td>
                    <td className="py-4 px-4 text-gray-500 dark:text-gray-400 italic">"{item.example}"</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips & Strategies */}
        <section className="bg-gray-50 dark:bg-gray-900 rounded-xl p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">Vocabulary Learning Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-start mb-6">
                <div className="flex-shrink-0 w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-lightbulb text-yellow-600 dark:text-yellow-400"></i>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 dark:text-white">Effective Vocabulary Techniques</h3>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-300">
                    <li>Use flashcards daily to reinforce memory</li>
                    <li>Practice words in context with example sentences</li>
                    <li>Group related words by theme (e.g., environment, education)</li>
                    <li>Review words regularly to ensure retention</li>
                    <li>Incorporate new words into your writing and speaking</li>
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-yellow-50 dark:bg-yellow-900 border-l-4 border-yellow-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <i className="fas fa-exclamation-circle text-yellow-500 dark:text-yellow-400 mt-1"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      <span className="font-medium">Pro Tip:</span> Learn 5-10 new words daily and use them in sentences to improve retention and application in IELTS tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default VocabularyPage;
