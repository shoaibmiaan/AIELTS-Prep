import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/home/LoginModal';

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
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        activeTab={activeTab}
        navigateTo={(route) => setActiveTab(route)}
        handleProtectedClick={() => {}}
        handleNavigation={() => {}}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            AI-Powered IELTS Tools
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Leverage cutting-edge artificial intelligence to improve your IELTS skills faster
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiTools.map((tool) => (
            <div
              key={tool.id}
              onClick={() => handleToolClick(tool.id, tool.premium, tool.comingSoon)}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer ${
                tool.comingSoon ? 'opacity-70' : 'hover:-translate-y-1'
              }`}
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                    tool.premium ? 'bg-amber-100 dark:bg-amber-900' : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    <i className={`${tool.icon} text-xl ${
                      tool.premium ? 'text-amber-500 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400'
                    }`}></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                      {tool.title}
                      {tool.premium && (
                        <span className="ml-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-xs">
                          Premium
                        </span>
                      )}
                      {tool.comingSoon && (
                        <span className="ml-2 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-xs">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {tool.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${
                    tool.comingSoon ? 'text-gray-500 dark:text-gray-400' :
                    tool.premium ? 'text-amber-500 dark:text-amber-400' : 'text-blue-500 dark:text-blue-400'
                  }`}>
                    {tool.comingSoon ? 'Available soon' : tool.premium ? 'Premium feature' : 'Try now'}
                  </span>
                  <i className={`fas fa-chevron-right ${
                    tool.comingSoon ? 'text-gray-400' :
                    tool.premium ? 'text-amber-500' : 'text-blue-500'
                  }`}></i>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            What Our Students Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: "The AI writing evaluator helped me improve from 6.0 to 7.5 in just 3 weeks!",
                author: "Priya K., India",
                score: "7.5"
              },
              {
                quote: "The speaking simulator is like having a personal IELTS examiner available 24/7.",
                author: "Carlos M., Spain",
                score: "8.0"
              },
              {
                quote: "Vocabulary builder identified my weak words and helped me master them quickly.",
                author: "Linh T., Vietnam",
                score: "7.0"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star ${i < Math.floor(Number(testimonial.score)) ? 'text-amber-500' : 'text-gray-300'} mr-1`}
                    ></i>
                  ))}
                  <span className="ml-2 font-bold text-gray-900 dark:text-white">{testimonial.score}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                <p className="text-gray-700 dark:text-gray-200 font-medium">— {testimonial.author}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Boost Your IELTS Score?</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Unlock all premium AI tools and get personalized feedback from our experts
          </p>
          <button
            onClick={() => user ? router.push('/premium') : setShowLoginModal(true)}
            className="px-8 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Upgrade to Premium
          </button>
        </div>
      </main>

      <LoginModal
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
        email={""}
        setEmail={() => {}}
        password={""}
        setPassword={() => {}}
        handleLogin={() => {
          setShowLoginModal(false);
          if (selectedTool) {
            router.push(`/ai-tools/${selectedTool}`);
          }
        }}
        handleFreePlan={() => {
          setShowLoginModal(false);
          router.push('/pricing');
        }}
        darkMode={darkMode}
      />

      <Footer
        handleNavigation={() => {}}
        handleProtectedClick={() => {}}
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