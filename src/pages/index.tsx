import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';
import HomeContent from '@/components/home/homeContent';
import GuestContent from '@/components/home/GuestContent';
import LoginModal from '@/components/home/LoginModal';

export default function IELTSMaster() {
  const router = useRouter();
  const { user, login, logout } = useAuth();

  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [currentPage, setCurrentPage] = useState('');
  const [activeTab, setActiveTab] = useState('');

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // User Data State
  const userName = user?.name || user?.email?.split('@')[0] || '';
  const userAvatar = user?.avatar || null; // Assume avatar is provided by useAuth, or null if not available

  const [userProgress, setUserProgress] = useState({
    writing: user ? 65 : 30,
    listening: user ? 45 : 0,
    speaking: user ? 30 : 0,
    reading: user ? 70 : 45,
    overall: user ? 6.5 : 5.0,
    targetBand: user ? 7.5 : 6.0
  });

  const [studyPlan, setStudyPlan] = useState([
    { id: 1, title: 'Complex Sentences', module: 'Writing', duration: '25 min', progress: user ? 65 : 30, locked: false },
    { id: 2, title: 'Map Labelling', module: 'Listening', duration: '35 min', progress: user ? 45 : 0, locked: !user },
    { id: 3, title: 'Part 3 Strategies', module: 'Speaking', duration: '45 min', progress: user ? 30 : 0, locked: false },
    { id: 4, title: 'True/False/Not Given', module: 'Reading', duration: '40 min', progress: 0, locked: true }
  ]);

  const [recentActivities, setRecentActivities] = useState(
    user ? [
      { id: 1, type: 'writing', title: 'Writing Task 2 Evaluation', score: 6.0, date: '2 hours ago', improvement: '+0.5 from last' },
      { id: 2, type: 'mock', title: 'Full Mock Test', score: 6.5, date: '1 day ago', improvement: '+1.0 from last' },
      { id: 3, type: 'speaking', title: 'Speaking Part 2 Practice', score: 5.5, date: '3 days ago', improvement: '+0.5 from last' }
    ] : []
  );

  const [writingSamples, setWritingSamples] = useState(
    user ? [
      { id: 1, task: 'Task 2 - Opinion Essay', band: 6.0, date: 'Jul 15', wordCount: 265, feedback: true },
      { id: 2, task: 'Task 1 - Line Graph', band: 6.5, date: 'Jul 10', wordCount: 187, feedback: true },
      { id: 3, task: 'Task 2 - Discussion Essay', band: 5.5, date: 'Jul 5', wordCount: 243, feedback: false }
    ] : []
  );

  const [communityPosts, setCommunityPosts] = useState([
    { id: 1, title: 'How to improve speaking fluency quickly?', comments: 42, author: 'Rajesh', time: '2 hours ago' },
    { id: 2, title: 'Writing Task 2 sample answer review', comments: 18, author: 'Maria', time: '5 hours ago' },
    { id: 3, title: 'Listening section 3 strategies', comments: 7, author: 'Ahmed', time: '1 day ago' }
  ]);

  const [mockTests, setMockTests] = useState(
    user ? [
      { id: 1, type: 'Full Test', date: 'Jul 16', score: 6.5, timeSpent: '2h 45m' },
      { id: 2, type: 'Reading Only', date: 'Jul 12', score: 7.0, timeSpent: '1h 05m' },
      { id: 3, type: 'Listening Only', date: 'Jul 8', score: 6.5, timeSpent: '40m' }
    ] : []
  );

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

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
      await login(email, password);
      setShowLoginModal(false);
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl');
      await router.push(redirectUrl);
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
    }
  };

  const handleFreePlan = () => {
    setShowLoginModal(false);
    router.push(currentPage || '/');
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>{user ? 'Home | IELTS Master' : 'IELTS Master - AI-Powered Preparation'}</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      {user ? (
        <HomeContent
          userProgress={userProgress}
          studyPlan={studyPlan}
          recentActivities={recentActivities}
          writingSamples={writingSamples}
          communityPosts={communityPosts}
          mockTests={mockTests}
          darkMode={darkMode}
          navigateTo={navigateTo}
          startMockTest={startMockTest}
          analyzeWriting={analyzeWriting}
          startSpeakingPractice={startSpeakingPractice}
          continueLesson={continueLesson}
          viewWritingFeedback={viewWritingFeedback}
          updateTargetBand={updateTargetBand}
        />
      ) : (
        <GuestContent
          startMockTest={startMockTest}
          handleProtectedClick={handleProtectedClick}
          accessPremiumDashboard={accessPremiumDashboard}
          userProgress={userProgress}
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
        darkMode={darkMode}
      />

      <style jsx global>{`
        html {
          transition: background-color 0.3s ease;
        }
        body {
          transition: background-color 0.3s ease;
        }
        .hero-bg {
          background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
                      url('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
        }
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        .progress-ring__circle {
          transition: stroke-dashoffset 0.35s;
          transform: rotate(-90deg);
          transform-origin: 50% 50%;
        }
      `}</style>
    </div>
  );
}