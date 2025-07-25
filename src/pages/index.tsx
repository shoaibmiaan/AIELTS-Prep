import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';
import HomeContent from '@/components/home/homeContent';
import GuestContent from '@/components/home/GuestContent';
import LoginModal from '@/components/home/LoginModal';
import SkeletonLoader from '@/components/common/SkeletonLoader';

export default function IELTSMaster() {
  const router = useRouter();
  const { user, login, logout, isLoading: authLoading } = useAuth();
  const { theme } = useTheme(); // Access the current theme

  // UI State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // User Data State
  const userName = user?.name || user?.email?.split('@')[0] || '';
  const userAvatar = user?.avatar || null;

  const [userProgress, setUserProgress] = useState({
    writing: 0,
    listening: 0,
    speaking: 0,
    reading: 0,
    overall: 0,
    targetBand: 0
  });

  const [studyPlan, setStudyPlan] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [writingSamples, setWritingSamples] = useState([]);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [mockTests, setMockTests] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setDataLoading(true);
        setError(null);

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Set actual data
        setUserProgress({
          writing: 65,
          listening: 45,
          speaking: 30,
          reading: 70,
          overall: 6.5,
          targetBand: 7.5
        });

        setStudyPlan([
          { id: 1, title: 'Complex Sentences', module: 'Writing', duration: '25 min', progress: 65, locked: false },
          { id: 2, title: 'Map Labelling', module: 'Listening', duration: '35 min', progress: 45, locked: false },
          { id: 3, title: 'Part 3 Strategies', module: 'Speaking', duration: '45 min', progress: 30, locked: false },
          { id: 4, title: 'True/False/Not Given', module: 'Reading', duration: '40 min', progress: 0, locked: true }
        ]);

        setRecentActivities([
          { id: 1, type: 'writing', title: 'Writing Task 2 Evaluation', score: 6.0, date: '2 hours ago', improvement: '+0.5 from last' },
          { id: 2, type: 'mock', title: 'Full Mock Test', score: 6.5, date: '1 day ago', improvement: '+1.0 from last' },
          { id: 3, type: 'speaking', title: 'Speaking Part 2 Practice', score: 5.5, date: '3 days ago', improvement: '+0.5 from last' }
        ]);

        setWritingSamples([
          { id: 1, task: 'Task 2 - Opinion Essay', band: 6.0, date: 'Jul 15', wordCount: 265, feedback: true },
          { id: 2, task: 'Task 1 - Line Graph', band: 6.5, date: 'Jul 10', wordCount: 187, feedback: true },
          { id: 3, task: 'Task 2 - Discussion Essay', band: 5.5, date: 'Jul 5', wordCount: 243, feedback: false }
        ]);

        setCommunityPosts([
          { id: 1, title: 'How to improve speaking fluency quickly?', comments: 42, author: 'Rajesh', time: '2 hours ago' },
          { id: 2, title: 'Writing Task 2 sample answer review', comments: 18, author: 'Maria', time: '5 hours ago' },
          { id: 3, title: 'Listening section 3 strategies', comments: 7, author: 'Ahmed', time: '1 day ago' }
        ]);

        setMockTests([
          { id: 1, type: 'Full Test', date: 'Jul 16', score: 6.5, timeSpent: '2h 45m' },
          { id: 2, type: 'Reading Only', date: 'Jul 12', score: 7.0, timeSpent: '1h 05m' },
          { id: 3, type: 'Listening Only', date: 'Jul 8', score: 6.5, timeSpent: '40m' }
        ]);

      } catch (err) {
        setError('Failed to load dashboard data');
        toast.error('Could not load your data. Please try again later.');
      } finally {
        setDataLoading(false);
        setIsPageLoading(false);
      }
    };

    // Initial page load
    if (authLoading) {
      setIsPageLoading(true);
    } else {
      fetchDashboardData();
    }

    // For guest users
    if (!user && !authLoading) {
      setIsPageLoading(false);
      setUserProgress({
        writing: 30,
        listening: 0,
        speaking: 0,
        reading: 45,
        overall: 5.0,
        targetBand: 6.0
      });
    }
  }, [user, authLoading]);

  // Navigation Handlers
  const handleNavigation = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank');
      return;
    }
    if (route === '/logout') {
      logout();
      return;
    }
    router.push(route);
  };

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

  // Feature Handlers
  const startMockTest = () => handleProtectedClick('/mock-test/start');
  const analyzeWriting = () => handleProtectedClick('/writing-evaluator');
  const startSpeakingPractice = () => handleProtectedClick('/speaking-simulator');
  const accessPremiumDashboard = () => handleProtectedClick('/premium-dashboard');

  const continueLesson = (id: number) => {
    const lesson = studyPlan.find(l => l.id === id);
    if (lesson && !lesson.locked) {
      router.push(`/lessons/${id}`);
    }
  };

  const viewWritingFeedback = (id: number) => handleProtectedClick(`/writing-feedback/${id}`);

  // Update target band
  const updateTargetBand = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUserProgress({
      ...userProgress,
      targetBand: parseFloat(e.target.value)
    });
    toast.success('Target band updated!');
  };

  // Auth Handlers
  const handleLogin = async () => {
    try {
      setDataLoading(true);
      await login(email, password);
      setShowLoginModal(false);
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl');
      await router.push(redirectUrl);
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setDataLoading(false);
    }
  };

  const handleFreePlan = () => {
    setShowLoginModal(false);
    router.push(currentPage || '/');
  };

  // Loading and error states
  if (authLoading || isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="bg-card p-6 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold mb-2 text-foreground">Error Loading Dashboard</h2>
          <p className="text-muted mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary hover:bg-primary-dark text-white py-2 px-4 rounded-md transition duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <Head>
        <title>{user ? 'Home | IELTS Master' : 'IELTS Master - AI-Powered Preparation'}</title>
      </Head>

      {user ? (
        <HomeContent
          userProgress={userProgress}
          studyPlan={studyPlan}
          recentActivities={recentActivities}
          writingSamples={writingSamples}
          communityPosts={communityPosts}
          mockTests={mockTests}
          theme={theme}
          navigateTo={navigateTo}
          startMockTest={startMockTest}
          analyzeWriting={analyzeWriting}
          startSpeakingPractice={startSpeakingPractice}
          continueLesson={continueLesson}
          viewWritingFeedback={viewWritingFeedback}
          updateTargetBand={updateTargetBand}
          isLoading={dataLoading}
        />
      ) : (
        <GuestContent
          startMockTest={startMockTest}
          handleProtectedClick={handleProtectedClick}
          accessPremiumDashboard={accessPremiumDashboard}
          userProgress={userProgress}
          isLoading={dataLoading}
        />
      )}

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        handleLogin={handleLogin}
        handleFreePlan={handleFreePlan}
        isLoading={dataLoading}
      />
    </div>
  );
}
