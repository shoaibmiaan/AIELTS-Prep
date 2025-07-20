import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginModal from '@/components/home/LoginModal';

export default function PremiumPage() {
  const router = useRouter();
  const { user } = useAuth();

  // UI State
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('premium');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'annual'>('monthly');

  // Premium Features
  const premiumFeatures = [
    { icon: 'fas fa-star', title: 'Unlimited AI Writing Evaluations', description: 'Get detailed feedback on all your writing tasks' },
    { icon: 'fas fa-robot', title: 'Speaking Simulator', description: 'Practice with our AI speaking partner 24/7' },
    { icon: 'fas fa-chart-line', title: 'Advanced Analytics', description: 'Track your progress with detailed performance insights' },
    { icon: 'fas fa-book', title: 'Premium Study Materials', description: 'Access exclusive practice tests and exercises' },
    { icon: 'fas fa-headset', title: 'Priority Support', description: 'Get faster responses from our expert team' },
    { icon: 'fas fa-gem', title: 'Ad-Free Experience', description: 'Focus without distractions' }
  ];

  // Pricing Plans
  const pricingPlans = {
    monthly: {
      price: '$9.99',
      period: 'month',
      savings: '',
      popular: false
    },
    annual: {
      price: '$89.99',
      period: 'year',
      savings: 'Save 25%',
      popular: true
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  const handleSubscribe = () => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }
    // Handle subscription logic here
    router.push('/payment');
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Premium Membership | IELTS Master</title>
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
          <div className="inline-block px-4 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full text-sm font-medium mb-4">
            PREMIUM MEMBERSHIP
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unlock Your Full IELTS Potential
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Join thousands of students who boosted their scores with our premium features
          </p>
        </div>

        {/* Pricing Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-full inline-flex">
            <button
              onClick={() => setSelectedPlan('monthly')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedPlan === 'monthly'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setSelectedPlan('annual')}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                selectedPlan === 'annual'
                  ? 'bg-amber-500 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Free Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">Basic access to get started</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$0</span>
              <span className="text-gray-500 dark:text-gray-400">/forever</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">Limited writing evaluations</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">Basic study materials</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">Community support</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/')}
              className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Current Plan
            </button>
          </div>

          {/* Premium Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-amber-500 relative overflow-hidden">
            {pricingPlans[selectedPlan].popular && (
              <div className="absolute top-0 right-0 bg-amber-500 text-white text-xs font-bold px-4 py-1 transform rotate-45 translate-x-8 translate-y-4">
                POPULAR
              </div>
            )}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Everything you need to succeed</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  {pricingPlans[selectedPlan].price}
                </span>
                <span className="text-gray-500 dark:text-gray-400">/{pricingPlans[selectedPlan].period}</span>
                {pricingPlans[selectedPlan].savings && (
                  <span className="ml-2 text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded">
                    {pricingPlans[selectedPlan].savings}
                  </span>
                )}
              </div>
              <ul className="space-y-3 mb-8">
                {premiumFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <i className={`${feature.icon} text-amber-500 mr-2`}></i>
                    <span className="text-gray-700 dark:text-gray-300">
                      <span className="font-medium">{feature.title}</span> - {feature.description}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSubscribe}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors"
              >
                Get Premium
              </button>
            </div>
          </div>

          {/* Intensive Tier */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Intensive</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">For serious test-takers</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">$149</span>
              <span className="text-gray-500 dark:text-gray-400">/3 months</span>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">All Premium features</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">Weekly 1-on-1 coaching</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">Personalized study plan</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-check text-green-500 mr-2"></i>
                <span className="text-gray-700 dark:text-gray-300">Guaranteed score improvement</span>
              </li>
            </ul>
            <button
              onClick={() => router.push('/intensive')}
              className="w-full py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Success Stories from Our Premium Members
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Maria S.",
                score: "7.5",
                avatar: "👩",
                testimonial: "The unlimited writing evaluations helped me identify my weak points and improve my score by 1.5 bands in just 2 months!"
              },
              {
                name: "Ahmed K.",
                score: "8.0",
                avatar: "👨",
                testimonial: "The speaking simulator gave me the confidence I needed for my exam. Worth every penny!"
              },
              {
                name: "Linh T.",
                score: "7.0",
                avatar: "👩",
                testimonial: "I went from 5.5 to 7.0 using the premium materials. The detailed feedback made all the difference."
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-2xl mr-4">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${i < Math.floor(Number(testimonial.score)) ? 'text-amber-500' : 'text-gray-300'} mr-1`}
                        ></i>
                      ))}
                      <span className="ml-2 font-bold text-gray-900 dark:text-white">{testimonial.score}</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">"{testimonial.testimonial}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and bank transfers for annual payments."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              },
              {
                question: "Is there a free trial available?",
                answer: "We offer a 7-day free trial for our Premium membership so you can try all the features before committing."
              },
              {
                question: "How does the score improvement guarantee work?",
                answer: "Our Intensive program comes with a guarantee - if you don't improve your score after completing the program, you'll get a full refund."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">{faq.question}</h3>
                <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Transform Your IELTS Score?</h2>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Join thousands of successful students who achieved their target bands with our Premium features
          </p>
          <button
            onClick={handleSubscribe}
            className="px-8 py-3 bg-white text-amber-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Start 7-Day Free Trial
          </button>
          <p className="text-amber-100 text-sm mt-3">No credit card required</p>
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
          router.push('/payment');
        }}
        handleFreePlan={() => {
          setShowLoginModal(false);
          router.push('/');
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