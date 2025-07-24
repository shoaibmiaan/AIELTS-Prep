'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button'; // Importing the updated Button component

export default function Strategies() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialMode = savedMode === 'true' || (!savedMode && prefersDark);
    setDarkMode(initialMode);
    document.documentElement.classList.toggle('dark', initialMode);
  }, []);

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

  return (
    <div className={`font-sans bg-background dark:bg-background-dark transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>IELTS Strategies - IELTS Master</title>
        <meta name="description" content="Master IELTS with proven strategies for reading, writing, listening, and speaking sections" />
      </Head>

      <main className="container mx-auto px-6 sm:px-8 py-12">
        <section className="mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-6 text-primary dark:text-primary-dark">IELTS Strategies</h1>
            <p className="text-lg sm:text-xl text-muted dark:text-muted-dark mb-8">
              Discover effective strategies to excel in all IELTS sections
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <Button
                variant="primary"
                onClick={() => handleProtectedClick('/assessmentRoom/reading/new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start Reading Practice
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleProtectedClick('/assessmentRoom/writing/new')}
              >
                <i className="fas fa-pen mr-2"></i> Start Writing Practice
              </Button>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center dark:text-white">Strategies for Success</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {/* Reading Strategies */}
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-6 border border-card-dark">
              <div className="flex items-center mb-6">
                <i className="fas fa-book-open text-2xl text-accent dark:text-accent-dark mr-4"></i>
                <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">Reading</h3>
              </div>
              <ul className="list-disc pl-5 space-y-4 text-muted dark:text-muted-dark">
                <li>Skim passages for main ideas within 1-2 minutes</li>
                <li>Scan for specific details to answer questions efficiently</li>
                <li>Highlight keywords in questions and passages</li>
                <li>Practice time management: 20 minutes per passage</li>
                <li>Read academic articles daily to boost comprehension</li>
              </ul>
            </div>

            {/* Writing Strategies */}
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-6 border border-card-dark">
              <div className="flex items-center mb-6">
                <i className="fas fa-pen text-2xl text-accent dark:text-accent-dark mr-4"></i>
                <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">Writing</h3>
              </div>
              <ul className="list-disc pl-5 space-y-4 text-muted dark:text-muted-dark">
                <li>Plan essays with clear introduction, body, and conclusion</li>
                <li>Use topic sentences to structure paragraphs</li>
                <li>Support arguments with examples or evidence</li>
                <li>Allocate 20 minutes for Task 1, 40 minutes for Task 2</li>
                <li>Review high-scoring essays to understand expectations</li>
              </ul>
            </div>

            {/* Listening Strategies */}
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-6 border border-card-dark">
              <div className="flex items-center mb-6">
                <i className="fas fa-headphones text-2xl text-accent dark:text-accent-dark mr-4"></i>
                <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">Listening</h3>
              </div>
              <ul className="list-disc pl-5 space-y-4 text-muted dark:text-muted-dark">
                <li>Preview questions before the audio starts</li>
                <li>Focus on keywords and synonyms in questions</li>
                <li>Take brief notes while listening to key details</li>
                <li>Practice with varied accents (British, Australian, etc.)</li>
                <li>Simulate test conditions with timed practice</li>
              </ul>
            </div>

            {/* Speaking Strategies */}
            <div className="bg-card dark:bg-card-dark rounded-lg shadow-lg p-6 border border-card-dark">
              <div className="flex items-center mb-6">
                <i className="fas fa-microphone text-2xl text-accent dark:text-accent-dark mr-4"></i>
                <h3 className="text-lg font-semibold text-primary dark:text-primary-dark">Speaking</h3>
              </div>
              <ul className="list-disc pl-5 space-y-4 text-muted dark:text-muted-dark">
                <li>Practice fluency with timed 1-2 minute responses</li>
                <li>Use a range of vocabulary and sentence structures</li>
                <li>Record yourself to evaluate pronunciation and coherence</li>
                <li>Engage in daily conversations in English</li>
                <li>Prepare for common topics like education and travel</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-8 text-center dark:text-white">General Practice Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-2 mr-6">
                  <i className="fas fa-clock text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">Time Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Simulate test conditions by practicing under timed constraints. Allocate specific times for each section and stick to them.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-2 mr-6">
                  <i className="fas fa-book text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">Resource Utilization</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Use authentic IELTS materials and online resources to familiarize yourself with question types and formats.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4 dark:text-white">Recommended Practice Schedule</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Beginner (5.0 target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">3-4 hours weekly: Focus on foundational skills and vocabulary</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Intermediate (6.5 target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">5-6 hours weekly: Practice all sections with varied question types</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Advanced (7.5+ target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">7-8 hours weekly: Focus on accuracy, speed, and advanced techniques</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-6 rounded">
                <div className="flex">
                  <div className="flex-shrink-0 text-green-500 dark:text-green-400 mt-1">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-medium">Pro Tip:</span> Join study groups or online forums to discuss strategies and share feedback.
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
}
