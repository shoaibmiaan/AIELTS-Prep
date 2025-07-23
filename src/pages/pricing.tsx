import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function PricingPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const [isYearly, setIsYearly] = useState(false);

  // Dark mode initialization
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Dark mode toggle
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  const plans = [
    {
      name: 'Free',
      price: isYearly ? '$0' : '$0',
      period: isYearly ? '/year' : '/forever',
      description: 'Basic access to get started',
      features: [
        '1 Full Mock Test',
        'Basic Writing Feedback',
        'Grammar Lessons',
        'Limited AI Tools',
        'Community Access'
      ],
      missingFeatures: [
        'Speaking Evaluation',
        'Teacher Review',
        'Priority Support'
      ],
      cta: user?.subscription === 'free' ? 'Current Plan' : 'Get Started',
      ctaAction: () => {
        if (!user) {
          router.push('/signup');
        }
      },
      featured: false
    },
    {
      name: 'Premium',
      price: isYearly ? '$50' : '$5',
      period: isYearly ? '/year' : '/month',
      description: 'For serious IELTS candidates',
      features: [
        '10 Full Mock Tests',
        'Detailed Writing Feedback',
        'Speaking Evaluation (5/month)',
        'All Lessons & Strategies',
        'Advanced AI Tools'
      ],
      missingFeatures: [
        'Teacher Review',
        'Personalized Coaching'
      ],
      cta: user?.subscription === 'premium' ? 'Current Plan' : 'Start Free Trial',
      ctaAction: () => {
        if (!user) {
          router.push('/signup');
        } else if (user.subscription !== 'premium') {
          router.push('/checkout?plan=premium');
        }
      },
      featured: true
    },
    {
      name: 'Pro',
      price: isYearly ? '$120' : '$12',
      period: isYearly ? '/year' : '/month',
      description: 'For fastest band improvement',
      features: [
        'Unlimited Mock Tests',
        'Priority Writing Feedback',
        'Unlimited Speaking Evaluation',
        '2 Teacher Reviews/month',
        'Personalized Study Plan',
        'Dedicated Support'
      ],
      missingFeatures: [],
      cta: 'Start Free Trial',
      ctaAction: () => {
        if (!user) {
          router.push('/signup');
        } else {
          router.push('/checkout?plan=pro');
        }
      },
      featured: false
    }
  ];

  return (
    <Layout
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
      user={user}
      title="Pricing - IELTS Master"
      description="Choose the right plan for your IELTS preparation"
    >
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center mb-6 dark:text-white">Simple, Transparent Pricing</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center">
          85% of our users improve by 1+ band score within 3 months
        </p>
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              type="button"
              className={`py-2 px-6 rounded-md font-medium ${
                !isYearly ? 'bg-amber-500 text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`py-2 px-6 rounded-md font-medium ${
                isYearly ? 'bg-amber-500 text-white' : 'text-gray-500 dark:text-gray-400'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yearly <span className="ml-1 text-amber-300">(Save 20%)</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-6 transition-transform transform hover:scale-105 ${
                plan.featured ? 'border-4 border-amber-500 bg-yellow-50' : 'border-2 border-gray-200 dark:border-gray-700'
              } hover:shadow-xl`}
            >
              {plan.featured && (
                <div className="bg-amber-500 text-white text-center py-2 text-sm font-medium rounded-t-lg">
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-xl font-semibold mb-3 dark:text-white">{plan.name}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{plan.description}</p>
              <div className="flex items-end mb-6">
                <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
              </div>
              <button
                onClick={plan.ctaAction}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  plan.featured
                    ? 'bg-amber-500 hover:bg-amber-600 text-white'
                    : plan.name === 'Free'
                    ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    : 'bg-amber-500 hover:bg-amber-600 text-white'
                } ${user?.subscription === 'premium' && plan.name === 'Premium' ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={user?.subscription === 'premium' && plan.name === 'Premium'}
              >
                {plan.cta}
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2 dark:text-white">What's included</h4>
                <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <svg
                        className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {plan.missingFeatures.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                  <h4 className="text-sm font-medium mb-2 dark:text-white">What's not included</h4>
                  <ul className="space-y-2 text-gray-600 dark:text-gray-300 text-sm">
                    {plan.missingFeatures.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
