'use client';
import Image from 'next/image';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <Head>
        <title>AIELTS Prep – Master IELTS with AI</title>
        <meta name="description" content="Master IELTS with AI-powered feedback, mock tests, and personalized improvement plans." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="bg-black text-white min-h-screen font-sans relative overflow-hidden">
        {/* Simplified Gradient Background */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
          <div className="absolute inset-0 opacity-[0.15]">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid-pattern.svg')] bg-[length:100px_100px]"></div>
          </div>

          {/* Subtle Glow Effects */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-orange-500/10 blur-3xl"></div>
          <div className="absolute -left-20 -bottom-20 w-72 h-72 rounded-full bg-purple-500/10 blur-3xl"></div>
        </div>

        {/* Content */}
        <main className="relative z-10">
          {/* Navbar with Mobile Menu */}
          <header className="sticky top-0 z-50 w-full bg-black bg-opacity-80 backdrop-blur-sm border-b border-gray-800">
            <div className="flex items-center justify-between px-6 md:px-20 py-4">
              <h1 className="text-lg font-bold text-gray-100">AIELTS Prep</h1>

              <div className="hidden md:flex gap-6 items-center text-sm">
                {isMounted && user ? (
                  <>
                    <Link href="/dashboard" className="hover:text-orange-400 transition" aria-label="Go to Dashboard">
                      Dashboard
                    </Link>
                    <Link href="/logout" className="hover:text-orange-400 transition" aria-label="Log out">
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="hover:text-orange-400 transition" aria-label="Log in">
                      Login
                    </Link>
                    <Link href="/signup" className="hover:text-orange-400 transition" aria-label="Sign up">
                      Signup
                    </Link>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-gray-200"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? '✕' : '☰'}
              </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-black py-4 px-6 border-b border-gray-800">
                <div className="flex flex-col gap-4 text-sm">
                  {isMounted && user ? (
                    <>
                      <Link href="/dashboard" className="hover:text-orange-400 transition" aria-label="Go to Dashboard">
                        Dashboard
                      </Link>
                      <Link href="/logout" className="hover:text-orange-400 transition" aria-label="Log out">
                        Logout
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="hover:text-orange-400 transition" aria-label="Log in">
                        Login
                      </Link>
                      <Link href="/signup" className="hover:text-orange-400 transition" aria-label="Sign up">
                        Signup
                      </Link>
                    </>
                  )}
                  <Link href="/practice/reading" className="hover:text-orange-400 transition" aria-label="Assessment Room">
                    🧠 Assessment Room
                  </Link>
                  <Link href="/practice/reading/history" className="hover:text-orange-400 transition" aria-label="Prep Institute">
                    🏛️ Prep Institute
                  </Link>
                </div>
              </div>
            )}
          </header>

          {/* Hero Section */}
          <section className="relative flex flex-col justify-center items-start px-6 md:px-20 py-24 min-h-[80vh]">
            {!isMounted ? (
              // Skeleton Loader
              <div className="max-w-xl bg-gray-800/80 p-6 rounded-xl backdrop-blur-sm w-full">
                <div className="h-10 bg-gray-700 rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-gray-700 rounded mb-6 w-full"></div>
                <div className="flex gap-4">
                  <div className="h-12 bg-gray-700 rounded-lg w-1/3"></div>
                  <div className="h-12 bg-gray-700 rounded-lg w-1/3"></div>
                </div>
              </div>
            ) : (
              <motion.div
                className="max-w-xl bg-black/60 p-6 rounded-xl backdrop-blur-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-4 text-gray-100">
                  AI-Powered IELTS Mastery:<br />
                  <span className="text-orange-400">Band 7+ Guaranteed</span>
                </h1>
                <p className="text-lg text-gray-300 mb-6">
                  Get instant scoring, full mock tests, and personalized improvement plans.
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center mb-6 gap-4 text-gray-300 text-sm">
                  <div className="flex items-center">
                    <span className="text-yellow-400 mr-1">★</span>
                    <span>4.9/5 (2,300+ reviews)</span>
                  </div>
                  <div>•</div>
                  <div>95% Pass Rate</div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/practice/reading">
                      <button
                        className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition"
                        aria-label="Start Testing in the Assessment Room"
                      >
                        🧠 Start Testing
                      </button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/practice/reading/history">
                      <button
                        className="w-full px-6 py-3 border border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white font-semibold rounded-lg transition"
                        aria-label="Learn and Prepare in the Prep Institute"
                      >
                        🏛️ Learn & Prepare
                      </button>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup">
                      <button
                        className="w-full px-6 py-3 bg-white text-black font-semibold rounded-lg transition hover:bg-gray-200"
                        aria-label="Create a Free Account"
                      >
                        Create Free Account
                      </button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Features */}
          <motion.section
            className="px-6 md:px-20 py-16 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            aria-label="Key features"
          >
            <h2 className="text-3xl font-bold text-center mb-10 text-gray-100">
              Everything You Need to Succeed
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm text-gray-300">
              {[
                ['📊 AI Evaluation', 'Band scores with instant feedback on Writing & Speaking.'],
                ['📚 All 4 Modules', 'Practice Reading, Writing, Listening, and Speaking.'],
                ['🕒 Timed Tests', 'Real exam environment with tab-switch detection.'],
                ['📈 Progress Tracker', 'View your performance trends and weak areas.'],
              ].map(([icon, desc], i) => (
                <motion.div
                  key={i}
                  className="bg-gray-800/70 p-6 rounded-xl hover:border-orange-500 border border-transparent transition hover:bg-gray-800/90"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl mb-3">{icon}</div>
                  <p>{desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Why Choose Us */}
          <motion.section
            className="px-6 md:px-20 py-16 flex flex-col md:flex-row items-center gap-12 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            aria-label="Why choose us"
          >
            <div className="w-full md:w-1/2 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/why.jpg"
                alt="Student using AIELTS Prep on laptop"
                width={800}
                height={500}
                priority
                className="object-cover w-full hover:scale-105 transition duration-700 transition-opacity opacity-0 duration-300"
                onLoad={(e) => e.currentTarget.classList.remove('opacity-0')}
              />
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold mb-6 text-gray-100">Why AIELTS Prep?</h2>
              <ul className="space-y-5 text-gray-300 text-sm">
                <li>
                  <strong className="text-white">🚀 Fast Feedback:</strong>
                  <br />
                  Get AI-generated scores in seconds.
                </li>
                <li>
                  <strong className="text-white">🎯 Personalized Plans:</strong>
                  <br />
                  Target your weak areas with focused content.
                </li>
                <li>
                  <strong className="text-white">💬 Speaking Practice:</strong>
                  <br />
                  Record answers & get automatic feedback.
                </li>
                <li>
                  <strong className="text-white">🛡️ Reliable:</strong>
                  <br />
                  Built by experts with real IELTS test structures.
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Testimonials */}
          <motion.section
            className="bg-gray-900/80 px-6 md:px-20 py-16 text-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            aria-label="Student testimonials"
          >
            <h2 className="text-2xl font-bold mb-10 text-gray-100">What Students Say</h2>
            <div className="grid gap-8 md:grid-cols-3 text-sm text-gray-300">
              {[
                {
                  quote: 'The AI feedback on writing tasks is 🔥. I improved from Band 6 to 7.5 in 3 weeks!',
                  name: 'Fatima, Lahore',
                },
                {
                  quote: 'No other app gives full mock tests with real-time evaluation like this.',
                  name: 'Usman, Karachi',
                },
                {
                  quote: 'The speaking module is a game changer. I practiced every day with real feedback.',
                  name: 'Ayesha, Islamabad',
                },
              ].map((t, i) => (
                <motion.div
                  key={i}
                  className="bg-gray-800/70 p-6 rounded-xl shadow hover:bg-gray-800/90 transition"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="italic mb-4">"{t.quote}"</p>
                  <span className="font-semibold text-orange-400">{t.name}</span>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Pricing */}
          <motion.section
            className="text-center px-6 md:px-20 py-16 bg-gradient-to-b from-black/70 to-gray-900/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            aria-label="Pricing plans"
          >
            <h2 className="text-2xl font-bold mb-10 text-gray-100">Choose Your Plan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'Free Trial',
                  price: '$0',
                  features: ['2 practice tests', 'Limited AI feedback', 'Basic analytics'],
                },
                {
                  title: 'Standard',
                  price: '$5/mo',
                  features: ['Unlimited practice', 'Full AI scoring', 'Progress tracking'],
                  popular: false,
                },
                {
                  title: 'Pro',
                  price: '$12/mo',
                  features: ['Full mock exams', 'Speaking/Writing AI review', 'Priority support'],
                  popular: true,
                },
              ].map((plan, i) => (
                <motion.div
                  key={i}
                  className={`border border-white/10 p-6 rounded-xl bg-gray-800/70 hover:shadow-xl hover:border-orange-500 transition relative ${
                    plan.popular ? 'ring-2 ring-orange-500' : ''
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{plan.title}</h3>
                  <p className="text-orange-400 text-2xl font-bold mb-4">{plan.price}</p>
                  <ul className="space-y-2 text-gray-300 text-sm mb-6">
                    {plan.features.map((f, j) => (
                      <li key={j}>✔ {f}</li>
                    ))}
                  </ul>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/signup">
                      <button
                        className={`w-full px-4 py-2 text-sm font-medium rounded transition ${
                          plan.popular
                            ? 'bg-orange-500 hover:bg-orange-600'
                            : 'bg-gray-700 hover:bg-gray-600'
                        } text-white`}
                        aria-label={`Get started with ${plan.title} plan`}
                      >
                        Get Started
                      </button>
                    </Link>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Enhanced Footer */}
          <footer className="px-6 md:px-20 py-10 bg-black/70 backdrop-blur-sm border-t border-gray-700">
            <div className="w-full flex flex-col md:flex-row justify-between gap-10">
              <div className="mb-6 md:mb-0">
                <h3 className="text-lg font-bold mb-3 text-gray-100">AIELTS Prep</h3>
                <p className="text-gray-400 text-sm">
                  Band score improvement guaranteed<br /> or your money back
                </p>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-3 text-gray-100">Resources</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <Link href="/blog" className="hover:text-orange-400 transition">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/tips" className="hover:text-orange-400 transition">
                        IELTS Tips
                      </Link>
                    </li>
                    <li>
                      <Link href="/practice" className="hover:text-orange-400 transition">
                        Practice Materials
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-gray-100">Company</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>
                      <Link href="/about" className="hover:text-orange-400 transition">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact" className="hover:text-orange-400 transition">
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link href="/privacy" className="hover:text-orange-400 transition">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm text-gray-400 mb-4 md:mb-0">
                © 2025 AIELTS Prep. All rights reserved.
              </div>

              <div className="flex gap-6 text-gray-400">
                <Link href="#" aria-label="Facebook">
                  <span className="hover:text-orange-400 transition">FB</span>
                </Link>
                <Link href="#" aria-label="Twitter">
                  <span className="hover:text-orange-400 transition">TW</span>
                </Link>
                <Link href="#" aria-label="Instagram">
                  <span className="hover:text-orange-400 transition">IG</span>
                </Link>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}