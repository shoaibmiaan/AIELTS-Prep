import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Checkout() {
  const router = useRouter();
  const { plan } = router.query;
  const [selectedPlan, setSelectedPlan] = useState<string>(plan as string || 'premium');

  const handlePlanChange = (newPlan: string) => {
    setSelectedPlan(newPlan);
  };

  const handleCheckout = () => {
    if (selectedPlan === 'premium') {
      router.push('/checkout/premium');
    } else {
      router.push('/checkout/free');
    }
  };

  return (
    <div className={`font-sans bg-gray-50 dark:bg-black transition-colors duration-300 min-h-screen`}>
      <Head>
        <title>Checkout - IELTS Master</title>
      </Head>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-md">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
            <i className="fas fa-book-open text-yellow-600 text-2xl"></i>
            <span className="text-xl font-bold text-yellow-800 dark:text-yellow-400">IELTSMaster</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium">Home</a>
            <a href="#" className="text-gray-700 dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 font-medium">Pricing</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-bg text-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Checkout</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">Choose your plan and get started with IELTS Master today!</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 dark:text-white">Choose Your Plan</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">Free</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Basic access to get started</p>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold dark:text-white">$0</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/forever</span>
                </div>
                <button
                  onClick={() => handlePlanChange('free')}
                  className={`w-full ${selectedPlan === 'free' ? 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'} py-2 rounded-md font-medium`}
                >
                  Select Free Plan
                </button>
              </div>
            </div>

            {/* Premium Plan */}
            <div className="border-2 border-yellow-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow transform scale-105">
              <div className="bg-yellow-600 text-white p-3 text-center text-sm font-medium">
                MOST POPULAR
              </div>
              <div className="p-6 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">Premium</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">For serious IELTS candidates</p>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold dark:text-white">$19</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                </div>
                <button
                  onClick={() => handlePlanChange('premium')}
                  className={`w-full ${selectedPlan === 'premium' ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-yellow-600 hover:bg-yellow-700 text-white'} py-2 rounded-md font-medium`}
                >
                  Select Premium Plan
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="border dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6 border-b dark:border-gray-800">
                <h3 className="text-xl font-semibold mb-1 dark:text-white">Pro</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">For fastest band improvement</p>
                <div className="flex items-end mb-4">
                  <span className="text-3xl font-bold dark:text-white">$49</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-1">/month</span>
                </div>
                <button
                  onClick={() => handlePlanChange('pro')}
                  className={`w-full ${selectedPlan === 'pro' ? 'bg-gray-800 hover:bg-gray-900 text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400'} py-2 rounded-md font-medium`}
                >
                  Select Pro Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Button */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-6 text-center">
          <button
            onClick={handleCheckout}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-md font-medium text-lg"
          >
            Proceed to Payment
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">IELTSMaster</h3>
              <p className="text-gray-400">AI-powered IELTS preparation with personalized feedback and expert strategies.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Courses</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mock Tests</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4 mb-4">
                <a
                  href="https://www.facebook.com/people/Solvio-Advisors/100085154420700/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600"
                >
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a
                  href="https://www.linkedin.com/company/solvio-advisors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-400"
                >
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a
                  href="https://www.instagram.com/solvioadvisors/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center hover:bg-purple-600"
                >
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <p className="text-gray-400">Email: support@ieltsmaster.com</p>
              <p className="text-gray-400">WhatsApp: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>© 2023 IELTSMaster. All rights reserved.</p>
            <p className="mt-2 text-sm">This site is not affiliated with the British Council, IDP, or Cambridge Assessment English.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
