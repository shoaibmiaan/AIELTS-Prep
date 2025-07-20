import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function PricingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [isYearly, setIsYearly] = useState(false);

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
      price: isYearly ? '$180' : '$19',
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
      price: isYearly ? '$480' : '$49',
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
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>Pricing - IELTS Master</title>
        <meta name="description" content="Choose the right plan for your IELTS preparation" />
      </Head>

      <Header />

      <main className="flex-grow py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-secondary">
              85% of our users improve by 1+ band score within 3 months
            </p>

            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center bg-muted rounded-lg p-1">
                <button
                  type="button"
                  className={`py-2 px-6 rounded-md font-medium ${
                    !isYearly ? 'bg-background shadow-sm text-foreground' : 'text-secondary'
                  }`}
                  onClick={() => setIsYearly(false)}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={`py-2 px-6 rounded-md font-medium ${
                    isYearly ? 'bg-background shadow-sm text-foreground' : 'text-secondary'
                  }`}
                  onClick={() => setIsYearly(true)}
                >
                  Yearly <span className="ml-1 text-primary">(Save 20%)</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl shadow-sm overflow-hidden ${
                  plan.featured ? 'border-2 border-primary' : 'border border-border'
                }`}
              >
                {plan.featured && (
                  <div className="bg-primary text-primary-foreground text-center py-2 text-sm font-medium">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6 bg-background">
                  <h2 className="text-lg font-semibold mb-1">{plan.name}</h2>
                  <p className="text-secondary mb-4">{plan.description}</p>

                  <div className="flex items-end mb-6">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-1">{plan.period}</span>
                  </div>

                  <button
                    onClick={plan.ctaAction}
                    className={`w-full py-3 rounded-md font-medium ${
                      plan.featured
                        ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
                        : plan.name === 'Free'
                        ? 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
                        : 'bg-accent hover:bg-accent/90 text-accent-foreground'
                    }`}
                    disabled={user?.subscription === 'premium' && plan.name === 'Premium'}
                  >
                    {plan.cta}
                  </button>
                </div>

                <div className="border-t border-border px-6 py-6 bg-background">
                  <h3 className="text-sm font-medium mb-4">What's included</h3>
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-success mt-0.5 mr-2 flex-shrink-0"
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
                        <span className="text-secondary">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {plan.missingFeatures.length > 0 && (
                  <div className="border-t border-border px-6 py-6 bg-muted">
                    <h3 className="text-sm font-medium mb-4">What's not included</h3>
                    <ul className="space-y-3">
                      {plan.missingFeatures.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <svg
                            className="h-5 w-5 text-muted-foreground mt-0.5 mr-2 flex-shrink-0"
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
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently asked questions</h2>

            <div className="space-y-6">
              {[
                {
                  question: "What payment methods do you accept?",
                  answer: "We accept all major credit cards (Visa, Mastercard, American Express) as well as PayPal. All payments are processed securely through Stripe."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period."
                },
                {
                  question: "Is there a free trial available?",
                  answer: "Yes! We offer a 7-day free trial for both Premium and Pro plans. No credit card is required to start the trial."
                },
                {
                  question: "How does the speaking evaluation work?",
                  answer: "Our AI-powered speaking simulator records your responses to IELTS-style questions and provides detailed feedback on fluency, pronunciation, grammar, and vocabulary."
                }
              ].map((faq, index) => (
                <div key={index} className="bg-background shadow rounded-lg overflow-hidden">
                  <button className="w-full px-6 py-4 text-left flex justify-between items-center">
                    <span className="text-lg font-medium">{faq.question}</span>
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="px-6 pb-4">
                    <p className="text-secondary">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary mt-24">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
            <h2 className="text-3xl font-extrabold tracking-tight text-primary-foreground sm:text-4xl">
              <span className="block">Ready to improve your IELTS score?</span>
              <span className="block text-primary-foreground/90">Start your free trial today.</span>
            </h2>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary bg-background hover:bg-background/90"
                >
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary/80 hover:bg-primary/70"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}