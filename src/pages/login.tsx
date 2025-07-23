import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all hover:shadow-2xl">
          <div className="text-center">
            <div className="mx-auto bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Welcome to IELTS Master
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to access your personalized dashboard
            </p>
          </div>

          <LoginForm />

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Don't have an account? {' '}
              <a
                href="/signup"
                className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Register now
              </a>
            </p>
            <a
              href="/forgot-password"
              className="mt-2 block text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Forgot your password?
            </a>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}