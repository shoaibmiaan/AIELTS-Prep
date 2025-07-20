import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/home/Header';
import Footer from '@/components/home/Footer';

export default function SignInPage() {
  const [activeTab, setActiveTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [buttonHover, setButtonHover] = useState(false);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const router = useRouter();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  // Animated gradient position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const x = Math.round((clientX / window.innerWidth) * 100);
      const y = Math.round((clientY / window.innerHeight) * 100);
      setGradientPos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const credentials = activeTab === 'email' ? email : phone;
      await login(credentials, password, rememberMe, activeTab);
      const redirectUrl = router.query.redirect || '/dashboard';
      router.push(redirectUrl as string);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      router.push(router.query.redirect || '/dashboard');
    } catch (error) {
      setError('Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      setIsLoading(true);
      await loginWithFacebook();
      router.push(router.query.redirect || '/dashboard');
    } catch (error) {
      setError('Failed to sign in with Facebook');
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>Sign In | IELTS Master</title>
        <meta name="description" content="Sign in to your IELTS Master account" />
      </Head>

      <Header darkMode={false} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Animated Gradient Header */}
          <div
            className="relative p-6 text-center overflow-hidden"
            style={{
              background: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%,
                rgba(234, 179, 8, 0.15) 0%,
                rgba(234, 179, 8, 0.1) 30%,
                rgba(234, 179, 8, 0.05) 60%,
                transparent 100%)`
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Sign in to continue your IELTS preparation</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {/* Auth Method Tabs */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
              <button
                className={`flex-1 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'email' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('email')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Email</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'phone' ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                onClick={() => setActiveTab('phone')}
              >
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>Phone</span>
                </div>
              </button>
            </div>

            {/* Social Login with Animated Cards */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="relative group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden"
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google</span>
                  </div>
                </button>
                <button
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                  className="relative group p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-300 overflow-hidden"
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3b5998">
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Facebook</span>
                  </div>
                </button>
              </div>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 font-medium">
                    OR CONTINUE WITH {activeTab.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>

            {/* Error Message with Animation */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm border border-red-100 dark:border-red-800/50 animate-[fadeIn_0.3s_ease-in-out]">
                {error}
              </div>
            )}

            {/* Sign In Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {activeTab === 'email' ? (
                <div className="space-y-1">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone number
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700/50 transition-colors"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    href="/forgot-password"
                    className="font-medium text-gray-600 dark:text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              {/* Animated Gradient Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                  className={`w-full relative overflow-hidden py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 ${
                    isLoading ? 'cursor-not-allowed' : ''
                  }`}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 transition-all duration-500 ${
                      buttonHover ? 'opacity-100' : 'opacity-90'
                    }`}
                    style={{
                      backgroundSize: '200% 200%',
                      animation: buttonHover ? 'gradientWave 3s ease infinite' : 'none'
                    }}
                  ></div>
                  <div className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Signing in...
                      </>
                    ) : (
                      'Sign in'
                    )}
                  </div>
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    New to IELTS Master?
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/signup"
                  className="w-full flex justify-center py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all duration-200"
                >
                  Create your account
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Security Badges with Animation */}
        <div className="mt-8 flex flex-col items-center animate-[fadeInUp_0.5s_ease-in-out]">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <svg
                className="h-4 w-4 text-green-500 animate-pulse"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">256-bit SSL</span>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <svg
                className="h-4 w-4 text-green-500 animate-pulse"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">GDPR Compliant</span>
            </div>
            <div className="flex items-center px-3 py-1.5 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-100 dark:border-gray-700">
              <svg
                className="h-4 w-4 text-green-500 animate-pulse"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="ml-2 text-xs text-gray-600 dark:text-gray-300">Secure Data</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes gradientWave {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        body {
          background-color: #f9fafb;
        }
        .dark body {
          background-color: #111827;
        }
      `}</style>
    </div>
  );
}