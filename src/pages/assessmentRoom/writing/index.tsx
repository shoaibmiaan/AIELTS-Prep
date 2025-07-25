'use client';
import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/context/AuthContext';
import LoginModal from '@/components/home/LoginModal';

interface WritingTask {
  id: string;
  title: string;
  task_type: 'Task 1' | 'Task 2';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  word_count: number;
  time_limit_minutes: number;
  description: string;
  created_at: string;
  completed: boolean;
  best_score?: number;
}

export default function WritingAssessmentRoom() {
  const router = useRouter();
  const { user, profile, isLoading: authLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [tasks, setTasks] = useState<WritingTask[]>([]);
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

  // Fetch writing tasks from Supabase
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);

        const { data: tasksData, error } = await supabase
          .from('writing_tasks')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (user) {
          const { data: userProgress } = await supabase
            .from('user_writing_progress')
            .select('task_id, completed, score')
            .eq('user_id', user.id);

          const tasksWithProgress = tasksData.map(task => {
            const progress = userProgress?.find(p => p.task_id === task.id);
            return {
              ...task,
              completed: progress?.completed || false,
              best_score: progress?.score
            };
          });

          setTasks(tasksWithProgress);
        } else {
          setTasks(tasksData.map(task => ({
            ...task,
            completed: false,
            best_score: undefined
          })));
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
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

  // Start writing task
  const startTask = (taskId: string) => {
    handleProtectedClick(`/assessmentRoom/writing/${taskId}`);
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (!user) return activeTab === 'all' || activeTab === 'incomplete';
    return activeTab === 'all' ||
           (activeTab === 'completed' && task.completed) ||
           (activeTab === 'incomplete' && !task.completed);
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
        <title>Writing Assessment Room - IELTS Master</title>
        <meta name="description" content="Practice IELTS writing tasks with authentic prompts and detailed feedback" />
      </Head>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <section className="mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4 dark:text-white">Writing Assessment Room</h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6">
              Practice with authentic IELTS writing tasks and receive detailed feedback
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
                onClick={() => startTask('new')}
              >
                <i className="fas fa-pen mr-2"></i> Start New Task
              </button>
              <button
                className="bg-white hover:bg-gray-50 text-green-600 border border-green-600 px-6 py-3 rounded-md font-medium transition-colors dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-green-400"
                onClick={() => router.push('/strategies/writing')}
              >
                <i className="fas fa-lightbulb mr-2"></i> Writing Strategies
              </button>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold dark:text-white">Available Writing Tasks</h2>
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                onClick={() => setActiveTab('all')}
              >
                All Tasks
              </button>
              {user && (
                <>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'completed' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    onClick={() => setActiveTab('completed')}
                  >
                    Completed
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm rounded-md transition-colors ${activeTab === 'incomplete' ? 'bg-green-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
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
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
              <i className="fas fa-pen text-4xl text-gray-400 dark:text-gray-600 mb-4"></i>
              <h3 className="text-xl font-medium dark:text-white">No tasks found</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {activeTab === 'all'
                  ? 'There are currently no writing tasks available.'
                  : 'No tasks match your current filters.'}
              </p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
                onClick={() => startTask('new')}
              >
                Start New Task
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold dark:text-white">{task.title}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(task.difficulty)}`}>
                        {task.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{task.description}</p>
                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span>
                        <i className="far fa-clock mr-1"></i>
                        {task.time_limit_minutes} mins
                      </span>
                      <span>
                        <i className="fas fa-pen mr-1"></i>
                        {task.word_count} words
                      </span>
                    </div>
                    {task.completed && task.best_score !== undefined && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium dark:text-white">Your Best Score:</span>
                          <span className="font-bold dark:text-white">{task.best_score}/9</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(task.best_score / 9) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => startTask(task.id)}
                    className={`w-full py-3 px-4 font-medium transition-colors ${
                      task.completed
                        ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900/50'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {task.completed ? (
                      <>
                        <i className="fas fa-redo mr-2"></i> Retake Task
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play mr-2"></i> Start Task
                      </>
                    )}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 sm:p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">Writing Practice Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-pen text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Essay Structure</h3>
                  <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-300">
                    <li>Plan your essay with a clear introduction, body, and conclusion</li>
                    <li>Use topic sentences to start each paragraph</li>
                    <li>Support arguments with relevant examples or evidence</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mt-1 mr-4">
                  <i className="fas fa-clock text-green-600 dark:text-green-400"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 dark:text-white">Time Management</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Allocate 20 minutes for Task 1 and 40 minutes for Task 2. Spend 5-7 minutes planning before writing.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-700 rounded-lg shadow-sm p-5">
                <h3 className="text-lg font-semibold mb-3 dark:text-white">Recommended Practice Schedule</h3>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Beginner (5.0 target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">3-4 hours weekly: Focus on basic essay structure and vocabulary</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Intermediate (6.5 target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">5-6 hours weekly: Practice coherence and varied sentence structures</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">Advanced (7.5+ target)</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300">7-8 hours weekly: Focus on advanced vocabulary and complex arguments</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0 text-green-500 dark:text-green-400 mt-1">
                    <i className="fas fa-exclamation-circle"></i>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 dark:text-green-300">
                      <span className="font-medium">Pro Tip:</span> Review sample high-scoring essays to understand examiner expectations.
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
