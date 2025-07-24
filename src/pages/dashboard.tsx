// pages/dashboard.tsx
import { useState } from 'react';
import { useUser } from '../context/UserContext';
import Leaderboard from '../components/Leaderboard';
import ProgressTracker from '../components/ProgressTracker';
import Flashcard from '../components/Flashcard';

const Dashboard = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('study');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-24 bg-white dark:bg-gray-800 shadow-md z-10 flex items-center px-6">
        <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">FlashMaster</h1>
        <nav className="ml-auto flex gap-4">
          <button
            onClick={() => setActiveTab('study')}
            className={`px-4 py-2 rounded-full ${
              activeTab === 'study'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Study Mode
          </button>
          <button
            onClick={() => setActiveTab('quick')}
            className={`px-4 py-2 rounded-full ${
              activeTab === 'quick'
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Quick Review
          </button>
        </nav>
      </header>

      <main className="pt-24 max-w-7xl mx-auto px-4 pb-8">
        {activeTab === 'study' ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Study Area */}
            <div className="flex-1">
              <FlashcardsPage />
            </div>

            {/* Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
              {user && <ProgressTracker userId={user.id} />}
              <Leaderboard />
            </div>
          </div>
        ) : (
          <QuickReviewTab />
        )}
      </main>
    </div>
  );
};

const QuickReviewTab = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Sample data for quick review
  const quickCards = [
    {
      term: "Ephemeral",
      definition: "Lasting for a very short time",
      example: "The ephemeral beauty of cherry blossoms"
    },
    {
      term: "Ubiquitous",
      definition: "Present, appearing, or found everywhere",
      example: "Mobile phones are now ubiquitous"
    }
  ];

  const handleFlip = () => setIsFlipped(!isFlipped);
  const handleCorrect = () => setCurrentCard(prev => (prev + 1) % quickCards.length);
  const handleIncorrect = () => setIsFlipped(false);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Quick Review
        <span className="ml-4 text-sm font-normal text-gray-500">
          Card {currentCard + 1} of {quickCards.length}
        </span>
      </h2>

      <Flashcard
        term={quickCards[currentCard].term}
        definition={quickCards[currentCard].definition}
        onFlip={handleFlip}
        isFlipped={isFlipped}
        onCorrect={handleCorrect}
        onIncorrect={handleIncorrect}
      />

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setCurrentCard(prev => (prev - 1 + quickCards.length) % quickCards.length)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentCard(prev => (prev + 1) % quickCards.length)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Dashboard;