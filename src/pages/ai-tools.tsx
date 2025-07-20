import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header'; // Make sure this exists at src/components/Header.tsx
import Footer from '@/components/Footer'; // Make sure this exists at src/components/Footer.tsx

// Create a simple LoginModal component if missing
const LoginModal = ({
  showLoginModal,
  setShowLoginModal,
  darkMode,
  handleLogin
}: {
  showLoginModal: boolean;
  setShowLoginModal: (show: boolean) => void;
  darkMode: boolean;
  handleLogin: () => void;
}) => {
  if (!showLoginModal) return null;

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Login Required</h3>
        <p className="mb-4 dark:text-gray-300">
          Please login to access this premium feature.
        </p>
        <div className="flex space-x-4">
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
          <button
            onClick={() => setShowLoginModal(false)}
            className="px-4 py-2 border border-gray-300 rounded dark:text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default function AIToolsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('ai-tools');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  // AI Tools Data
  const aiTools = [
    {
      id: 'writing-evaluator',
      title: 'Writing Evaluator',
      description: 'Get instant feedback on your IELTS writing tasks with AI scoring',
      icon: 'fas fa-pen-fancy',
      premium: false,
      comingSoon: false
    },
    {
      id: 'speaking-simulator',
      title: 'Speaking Simulator',
      description: 'Practice IELTS speaking with AI that evaluates your fluency and pronunciation',
      icon: 'fas fa-comment-dots',
      premium: true,
      comingSoon: false
    },
    {
      id: 'reading-analyzer',
      title: 'Reading Analyzer',
      description: 'Analyze your reading comprehension with AI-generated questions',
      icon: 'fas fa-book-open',
      premium: true,
      comingSoon: true
    },
    {
      id: 'listening-trainer',
      title: 'Listening Trainer',
      description: 'AI-powered listening exercises with adaptive difficulty',
      icon: 'fas fa-headphones',
      premium: true,
      comingSoon: false
    },
    {
      id: 'grammar-checker',
      title: 'Grammar Checker',
      description: 'Advanced grammar and syntax analysis for your writing',
      icon: 'fas fa-spell-check',
      premium: false,
      comingSoon: false
    },
    {
      id: 'vocabulary-builder',
      title: 'Vocabulary Builder',
      description: 'AI-curated word lists based on your weaknesses',
      icon: 'fas fa-language',
      premium: false,
      comingSoon: true
    }
  ];

  const handleToolClick = (toolId: string, isPremium: boolean, isComingSoon: boolean) => {
    if (isComingSoon) return;

    if (isPremium && !user) {
      setSelectedTool(toolId);
      setShowLoginModal(true);
      return;
    }

    router.push(`/ai-tools/${toolId}`);
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>AI Tools | IELTS Master</title>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <Header
        isLoggedIn={!!user}
        isPremium={user?.isPremium || false}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleNavigation={(route) => router.push(route)}
        handleProtectedClick={(route) => {
          if (user) {
            router.push(route);
          } else {
            setShowLoginModal(true);
          }
        }}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Rest of your existing JSX remains the same */}
        {/* ... */}
      </main>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        darkMode={darkMode}
        handleLogin={() => {
          setShowLoginModal(false);
          if (selectedTool) {
            router.push(`/ai-tools/${selectedTool}`);
          }
        }}
      />

      <Footer
        darkMode={darkMode}
        handleNavigation={(route) => router.push(route)}
        handleProtectedClick={(route) => {
          if (user) {
            router.push(route);
          } else {
            setShowLoginModal(true);
          }
        }}
      />

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