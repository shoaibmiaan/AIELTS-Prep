import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function VocabularyPage() {
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

      {/* Header - Consistent with assessmentRoom */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <i className="fas fa-book-open text-yellow-600 text-2xl"></i>
            <span className="text-xl font-bold text-yellow-800 dark:text-yellow-400">IELTSMaster</span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <div className="dropdown relative" ref={dropdownRef}>
              <button
                className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                Learn <i className="fas fa-chevron-down ml-1 text-xs"></i>
              </button>
              <div className={`dropdown-menu absolute ${dropdownOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48`}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProtectedClick('/courses');
                  }}
                  className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  Courses
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProtectedClick('/grammar');
                  }}
                  className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  Grammar/Vocabulary
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleProtectedClick('/strategies');
                  }}
                  className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  Strategies
                </a>
              </div>
            </div>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/assessmentRoom');
              }}
              className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
            >
              Practice
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/ai-tools');
              }}
              className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
            >
              AI Tools
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/community');
              }}
              className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
            >
              Community
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/premium-dashboard');
              }}
              className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
            >
              Premium Dashboard
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/pricing');
              }}
              className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium"
            >
              Pricing
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
            </button>

            {isLoggedIn ? (
              <div className="dropdown relative" ref={dropdownRef}>
                <button
                  className="flex items-center space-x-2 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-label="User profile"
                >
                  <i className="fas fa-user"></i>
                  <span className="hidden md:inline-block text-sm">My Account</span>
                </button>
                <div className={`dropdown-menu absolute right-0 ${dropdownOpen ? 'block' : 'hidden'} bg-white dark:bg-gray-800 shadow-lg rounded-md mt-2 w-48`}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/profile');
                    }}
                    className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <i className="fas fa-user-circle mr-2"></i> Profile
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/progress');
                    }}
                    className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <i className="fas fa-chart-line mr-2"></i> Progress
                  </a>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/settings');
                    }}
                    className="block px-4 py-2 hover:bg-yellow-50 dark:hover:bg-gray-700 dark:text-white"
                  >
                    <i className="fas fa-cog mr-2"></i> Settings
                  </a>
                  <div className="border-t dark:border-gray-700"></div>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation('/logout');
                    }}
                    className="block px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-gray-700"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> Logout
                  </a>
                </div>
              </div>
            ) : (
              <button
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-white"
                onClick={() => handleNavigation('/login')}
                aria-label="Login"
              >
                <i className="fas fa-user"></i>
              </button>
            )}

            <button
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium"
              onClick={() => handleNavigation(isPremium ? '/premium-dashboard' : '/pricing')}
            >
              {isPremium ? 'Premium Dashboard' : 'Go Premium'}
            </button>
            <button
              className="md:hidden text-gray-600 dark:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mobile menu"
            >
              <i className="fas fa-bars text-xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div id="mobileMenu" className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700`}>
          <div className="container mx-auto px-6 py-3 flex flex-col space-y-3">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/courses');
              }}
              className="py-2 border-b dark:border-gray-700 dark:text-white"
            >
              Learn
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/assessmentRoom');
              }}
              className="py-2 border-b dark:border-gray-700 dark:text-white"
            >
              Practice
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/ai-tools');
              }}
              className="py-2 border-b dark:border-gray-700 dark:text-white"
            >
              AI Tools
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/community');
              }}
              className="py-2 border-b dark:border-gray-700 dark:text-white"
            >
              Community
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleProtectedClick('/premium-dashboard');
              }}
              className="py-2 border-b dark:border-gray-700 dark:text-white"
            >
              Premium Dashboard
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/pricing');
              }}
              className="py-2 border-b dark:border-gray-700 dark:text-white"
            >
              Pricing
            </a>
            {isLoggedIn && (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/profile');
                  }}
                  className="py-2 border-b dark:border-gray-700 dark:text-white"
                >
                  My Profile
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavigation('/logout');
                  }}
                  className="py-2 text-red-500"
                >
                  Logout
                </a>
              </>
            )}
          </div>
        </div>
      </header>

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
                onClick={() => handleProtectedClick('/vocabulary/flashcards')}
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

      {/* Footer - Consistent with assessmentRoom */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">IELTSMaster</h3>
              <p className="text-gray-400">AI-powered IELTS preparation with personalized feedback and expert strategies.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/'); }} className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProtectedClick('/courses'); }} className="text-gray-400 hover:text-white">Courses</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleProtectedClick('/mock-tests'); }} className="text-gray-400 hover:text-white">Mock Tests</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/pricing'); }} className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/faq'); }} className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/contact'); }} className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/privacy'); }} className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" onClick={(e) => { e.preventDefault(); handleNavigation('/terms'); }} className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/solvio-advisors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://www.instagram.com/solvioadvisors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <p className="text-gray-400">Email: support@ieltsmaster.com</p>
              <p className="text-gray-400">WhatsApp: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2023 IELTSMaster. All rights reserved.</p>
            <p className="mt-2 text-sm">This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal - Consistent with assessmentRoom */}
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
            <div className="space-y-4">
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
            </div>
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