'use client';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';
import Container from '@/components/Container';
import PageSection from '@/components/PageSection';

type Tool = {
  id: string;
  name: string;
  description: string;
  categories: string[];
  icon: string;
  color: string;
  locked: boolean;
};

export default function AIToolsPortal() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid' },
    { id: 'text', name: 'Text', icon: 'file-text' },
    { id: 'image', name: 'Image', icon: 'image' },
    { id: 'code', name: 'Code', icon: 'code' },
  ];

  const tools: Tool[] = [
    {
      id: '1',
      name: 'AI Essay Grader',
      description: 'Get instant feedback on your IELTS writing tasks with detailed scoring.',
      categories: ['text'],
      icon: 'edit-3',
      color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/30',
      locked: true,
    },
    {
      id: '2',
      name: 'Speaking Simulator',
      description: 'Practice IELTS speaking with AI-powered mock interviews and feedback.',
      categories: ['audio'],
      icon: 'mic',
      color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/30',
      locked: true,
    },
    {
      id: '3',
      name: 'Reading Analyzer',
      description: 'Improve reading comprehension with adaptive exercises and explanations.',
      categories: ['text'],
      icon: 'book-open',
      color: 'text-green-500 bg-green-50 dark:bg-green-900/30',
      locked: true,
    },
    {
      id: '4',
      name: 'Vocabulary Builder',
      description: 'Expand your academic vocabulary with personalized word lists and quizzes.',
      categories: ['text'],
      icon: 'bookmark',
      color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30',
      locked: true,
    },
    {
      id: '5',
      name: 'Grammar Checker',
      description: 'Identify and correct grammatical errors in your writing instantly.',
      categories: ['text'],
      icon: 'check-circle',
      color: 'text-red-500 bg-red-50 dark:bg-red-900/30',
      locked: true,
    },
    {
      id: '6',
      name: 'Listening Trainer',
      description: 'Practice IELTS listening tests with adjustable difficulty levels.',
      categories: ['audio'],
      icon: 'headphones',
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/30',
      locked: true,
    },
  ];

  const filteredTools = tools.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || tool.categories.includes(activeCategory);
    return matchesSearch && matchesCategory;
  });

  const handleToolClick = (tool: Tool) => {
    if (tool.locked) {
      setShowUpgradeModal(true);
    } else {
      router.push(`/ai-tools/${tool.id}`);
    }
  };

  const Icon = ({ name }: { name: string }) => {
    const icons: Record<string, JSX.Element> = {
      grid: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
      'file-text': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      image: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      code: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
      'edit-3': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
      mic: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>,
      'book-open': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
      bookmark: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>,
      'check-circle': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      headphones: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    };
    return icons[name] || <div className="h-5 w-5" />;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PageSection title="AI-Powered Learning Tools">
        <p className="text-muted text-center max-w-2xl mx-auto">
          Unlock premium AI tools to accelerate your IELTS preparation and achieve your target score
        </p>
      </PageSection>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Categories */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto mb-6">
            <input
              type="text"
              placeholder="Search tools..."
              className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-card text-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-3 top-2.5 text-muted">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-2 gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-card text-muted border border-border hover:bg-card-hover'
                }`}
              >
                <span className="mr-2">
                  <Icon name={category.icon} />
                </span>
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Container
              key={tool.id}
              onClick={() => handleToolClick(tool)}
              className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            >
              <div className="p-5">
                <div className={`w-12 h-12 rounded-lg ${tool.color.split(' ')[1]} flex items-center justify-center mb-4`}>
                  <Icon name={tool.icon} className={tool.color.split(' ')[0]} />
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2">{tool.name}</h3>
                <p className="text-muted mb-4">{tool.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {tool.categories.map((catId) => {
                    const catName = categories.find(c => c.id === catId)?.name;
                    return catName ? (
                      <span
                        key={catId}
                        className="text-xs bg-muted-light text-muted dark:bg-muted dark:text-muted-light px-2 py-1 rounded"
                      >
                        {catName}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="bg-card-hover px-5 py-3 border-t border-border flex justify-between items-center">
                <span className="text-sm font-medium text-muted">
                  {tool.locked ? 'Premium Feature' : 'Available'}
                </span>
                <button
                  className={`text-sm font-medium px-3 py-1 rounded transition-colors ${
                    tool.locked
                      ? 'bg-primary text-white hover:bg-primary-dark'
                      : 'text-primary hover:text-primary-dark'
                  }`}
                >
                  {tool.locked ? 'Upgrade to Access' : 'Open Tool'}
                </button>
              </div>
            </Container>
          ))}
        </div>
      </main>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Container className="max-w-md w-full shadow-lg">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-primary-light dark:bg-primary-dark mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Upgrade to Pro</h3>
              <p className="text-muted">
                Unlock all premium AI tools to accelerate your IELTS preparation
              </p>
            </div>

            <div className="mb-6">
              <div className="bg-primary-light dark:bg-primary-dark rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-foreground">Pro Features Include:</h4>
                    <ul className="list-disc list-inside text-muted text-sm mt-1">
                      <li>All AI-powered learning tools</li>
                      <li>Detailed feedback and analysis</li>
                      <li>Progress tracking</li>
                      <li>Priority support</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Container className="p-4">
                  <h4 className="font-medium text-foreground mb-1">Monthly</h4>
                  <p className="text-2xl font-bold text-primary">$19.99</p>
                  <p className="text-muted text-sm">per month</p>
                </Container>
                <Container className="p-4 border-2 border-primary bg-primary-light dark:bg-primary-dark">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Yearly</h4>
                      <p className="text-2xl font-bold text-primary">$149.99</p>
                      <p className="text-muted text-sm">per year</p>
                    </div>
                    <span className="bg-primary text-white text-xs px-2 py-1 rounded">Save 37%</span>
                  </div>
                </Container>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => router.push('/pricing')}
                className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg font-medium transition-colors"
              >
                Upgrade Now
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full bg-card hover:bg-card-hover text-foreground py-2.5 rounded-lg font-medium border border-border transition-colors"
              >
                Maybe Later
              </button>
            </div>
          </Container>
        </div>
      )}
    </div>
  );
}