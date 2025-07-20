import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PaymentPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [trialSelected, setTrialSelected] = useState(false);

  // Handle free trial selection
  const handleStartTrial = () => {
    if (!user) {
      router.push('/login?redirect=/payment');
      return;
    }

    setTrialSelected(true);
    // In a real app, you would call your API here to start the trial
  };

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Redirect to success page
      router.push(trialSelected ? '/payment/success?trial=true' : '/payment/success');
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>{trialSelected ? 'Start Free Trial' : 'Payment'} | IELTS Master</title>
      </Head>

      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          <div className={`flex flex-col items-center ${trialSelected ? 'opacity-50' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2">
              1
            </div>
            <span className="text-sm font-medium">Select Plan</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center mb-2">
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
          <div className="flex flex-col items-center opacity-50">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-2">
              3
            </div>
            <span className="text-sm font-medium">Complete</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {trialSelected ? 'Start Your 7-Day Free Trial' : 'Complete Your Purchase'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {trialSelected
                ? 'No payment required now. Get full access to all premium features for 7 days.'
                : 'Enter your payment details to get instant access to all premium features.'}
            </p>

            {trialSelected ? (
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-6">
                <h3 className="font-bold text-lg text-amber-800 dark:text-amber-200 mb-2">
                  Free Trial Summary
                </h3>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-amber-500 mr-2"></i>
                    <span>7 days of full premium access</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-amber-500 mr-2"></i>
                    <span>Cancel anytime during trial</span>
                  </li>
                  <li className="flex items-center">
                    <i className="fas fa-check-circle text-amber-500 mr-2"></i>
                    <span>No payment required now</span>
                  </li>
                </ul>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  After 7 days, your subscription will automatically continue at $9.99/month unless canceled.
                </p>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                  Payment Method
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <button
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      paymentMethod === 'card'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <i className="far fa-credit-card mr-2"></i>
                    Credit Card
                  </button>
                  <button
                    onClick={() => setPaymentMethod('paypal')}
                    className={`p-4 border rounded-lg flex items-center justify-center ${
                      paymentMethod === 'paypal'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    <i className="fab fa-paypal mr-2"></i>
                    PayPal
                  </button>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="4242 4242 4242 4242"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mb-6">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">
                Order Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Premium Membership</span>
                  <span className="font-medium">
                    {trialSelected ? '$0.00 for 7 days' : '$9.99/month'}
                  </span>
                </div>
                {!trialSelected && (
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Tax</span>
                    <span className="font-medium">$0.00</span>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">
                    {trialSelected ? '$0.00' : '$9.99'}
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="terms"
                  required
                  className="w-4 h-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500 mr-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-300">
                  I agree to the <a href="/terms" className="text-amber-500 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-amber-500 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Processing...
                  </>
                ) : trialSelected ? (
                  'Start 7-Day Free Trial'
                ) : (
                  'Complete Payment'
                )}
              </button>

              {!trialSelected && (
                <button
                  type="button"
                  onClick={handleStartTrial}
                  className="w-full mt-4 py-3 border border-amber-500 text-amber-500 font-bold rounded-lg hover:bg-amber-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Start 7-Day Free Trial Instead
                </button>
              )}
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}