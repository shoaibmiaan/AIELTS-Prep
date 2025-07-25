'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import LoginModal from '@/components/home/LoginModal';
import Container from '@/components/Container';
import PageSection from '@/components/PageSection';
import ThemeToggle from '@/components/ThemeToggle';

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
  const { theme, toggleTheme } = useTheme();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tests, setTests] = useState<ReadingTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'incomplete'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="min-h-screen">
      <Head>
        <title>Reading Assessment Room - IELTS Master</title>
        <meta name="description" content="Practice IELTS reading tests with authentic questions and detailed feedback" />
      </Head>

      <div className="px-4 py-10">
        <PageSection title="Reading Assessment Room">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-lg text-muted mb-6">
              Practice with authentic IELTS reading passages and questions
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => startTest('new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start New Test
              </button>
              <button
                className="bg-card hover:bg-card-hover text-foreground border border-border px-6 py-3 rounded-md font-medium transition-colors duration-200 flex items-center"
                onClick={() => router.push('/strategies/reading')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Reading Strategies
              </button>
            </div>
          </div>
        </PageSection>

        <PageSection title="Available Reading Tests">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'all' ? 'bg-primary text-white' : 'bg-card text-muted hover:bg-card-hover'}`}
                onClick={() => setActiveTab('all')}
              >
                All Tests
              </button>
              {user && (
                <>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'completed' ? 'bg-primary text-white' : 'bg-card text-muted hover:bg-card-hover'}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'incomplete' ? 'bg-primary text-white' : 'bg-card text-muted hover:bg-card-hover'}`}
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : filteredTests.length === 0 ? (
            <Container className="text-center">
              <i className="fas fa-book-open text-4xl text-muted mb-4"></i>
              <h3 className="text-xl font-medium text-foreground">No tests found</h3>
              <p className="text-muted mb-4">
                {activeTab === 'all'
                  ? 'There are currently no reading tests available.'
                  : 'No tests match your current filters.'}
              </p>
              <button
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center mx-auto"
                onClick={() => startTest('new')}
              >
                <i className="fas fa-book-open mr-2"></i> Start New Test
              </button>
            </Container>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTests.map((test) => (
                <Container
                  key={test.id}
                  className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-foreground">{test.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(test.difficulty)}`}>
                        {test.difficulty}
                      </span>
                    </div>
                    <p className="text-muted text-sm mb-4 line-clamp-2">{test.description}</p>
                    <div className="flex justify-between text-sm text-muted mb-4">
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
                          <span className="font-medium text-foreground">Your Best Score:</span>
                          <span className="font-bold text-foreground">{test.best_score}/40</span>
                        </div>
                        <div className="w-full bg-muted-light dark:bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
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
                        : 'bg-primary text-white hover:bg-primary-dark'
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
                </Container>
              ))}
            </div>
          )}
        </PageSection>

        <PageSection title="Reading Practice Tips">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-light dark:bg-primary-dark rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-search text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Skimming & Scanning</h3>
                  <ul className="list-disc pl-5 space-y-1 text-muted">
                    <li>Skim first for main ideas (1-2 minutes per passage)</li>
                    <li>Scan for specific information when answering questions</li>
                    <li>Highlight keywords in both questions and text</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-primary-light dark:bg-primary-dark rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-clock text-primary"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">Time Management</h3>
                  <p className="text-muted">
                    Allocate 20 minutes per passage. Don't spend more than 1-1.5 minutes per question.
                    If stuck, mark it and move on.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Container>
                <h3 className="text-lg font-semibold mb-3 text-foreground">Recommended Practice Schedule</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Beginner (5.0 target)</h4>
                    <p className="text-sm text-muted">3-4 hours weekly: Focus on vocabulary and basic comprehension</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Intermediate (6.5 target)</h4>
                    <p className="text-sm text-muted">5-6 hours weekly: Practice different question types</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Advanced (7.5+ target)</h4>
                    <p className="text-sm text-muted">7-8 hours weekly: Focus on speed and accuracy</p>
                  </div>
                </div>
              </Container>
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
        </PageSection>
      </div>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        currentPage={currentPage}
      />

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}