import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [gradientPos, setGradientPos] = useState({ x: 50, y: 50 });
  const router = useRouter();
  const { register } = useAuth();

  // Track mouse for dynamic gradient
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setGradientPos({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      setSuccess(true);
      setTimeout(() => router.push('/dashboard'), 2000);
    } catch (error) {
      setErrors({ form: 'Registration failed. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Head>
        <title>Sign Up | IELTS Master</title>
        <meta name="description" content="Create your IELTS Master account" />
      </Head>

      <Header darkMode={false} toggleDarkMode={() => {}} />

      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 transition-all duration-300">
          {/* Animated Gradient Header */}
          <div
            className="relative p-6 text-center overflow-hidden"
            style={{
              background: `radial-gradient(circle at ${gradientPos.x}% ${gradientPos.y}%,
                rgba(234, 179, 8, 0.15) 0%,
                rgba(234, 179, 8, 0.1) 30%,
                rgba(234, 179, 8, 0.05) 60%,
                transparent 100%)`,
              transition: 'background 0.3s ease-out'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-30"></div>
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Join IELTS Master</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">Create your account to get started</p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            {success ? (
              <div className="text-center py-8 animate-[fadeIn_0.5s_ease-in-out]">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Account Created!</h3>
                <p className="text-gray-600 dark:text-gray-300">Redirecting you to your dashboard...</p>
                <div className="mt-6">
                  <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-500 rounded-full animate-[progressBar_2s_linear_forwards]"
                      style={{ width: '0%' }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {errors.form && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-lg text-sm border border-red-100 dark:border-red-800/50 animate-[fadeIn_0.3s_ease-in-out]">
                    {errors.form}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${errors.name ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-[fadeIn_0.3s_ease-in-out]">{errors.name}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email Address
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
                        value={formData.email}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${errors.email ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200`}
                        placeholder="your@email.com"
                      />
                    </div>
                    {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-[fadeIn_0.3s_ease-in-out]">{errors.email}</p>}
                  </div>

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
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${errors.password ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-[fadeIn_0.3s_ease-in-out]">{errors.password}</p>}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Confirm Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-yellow-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`block w-full pl-10 pr-3 py-2.5 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-200 dark:border-gray-700'} rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 dark:bg-gray-700/50 dark:text-white transition-all duration-200`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-[fadeIn_0.3s_ease-in-out]">{errors.confirmPassword}</p>}
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700/50 transition-colors"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      I agree to the{' '}
                      <Link href="/terms" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-yellow-600 dark:text-yellow-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full relative overflow-hidden py-3 px-4 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 group"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-r from-yellow-600 to-yellow-500 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          backgroundSize: '200% 200%',
                          animation: 'gradientWave 3s ease infinite'
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
                            Creating Account...
                          </>
                        ) : (
                          'Sign Up'
                        )}
                      </div>
                    </button>
                  </div>
                </form>

                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-3 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                        Already have an account?
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/signin"
                      className="w-full flex justify-center py-2.5 px-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-all duration-200"
                    >
                      Sign In
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Security Badges */}
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

        @keyframes progressBar {
          0% { width: 0%; }
          100% { width: 100%; }
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