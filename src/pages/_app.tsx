import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

// Public routes accessible to everyone (no authentication required)
const PUBLIC_ROUTES = [
  '/', '/login', '/signup', '/reset-password',
  '/forgot-password', '/phone-login', '/thank-you',
  '/about', '/contact', '/privacy', '/terms'
];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/profile', '/courses', '/assessmentRoom',
  '/simulation', '/learn-prepare', '/learnLab',
  '/adminDashboard', '/premium-dashboard', '/ai-tools',
  '/community', '/grammar', '/strategies',
  '/mock-test/start', '/writing-evaluator', '/speaking-simulator',
  '/writing-feedback'
];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [routeChecked, setRouteChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || isLoading) return;

    const currentPath = router.pathname;
    const isProtected = PROTECTED_ROUTES.some(path => currentPath.startsWith(path));

    if (isProtected && !user) {
      // Store the current route to redirect back to after login
      sessionStorage.setItem('redirectUrl', currentPath);
      router.push('/login');
    }

    setRouteChecked(true);
  }, [user, isLoading, router, router.isReady]);

  if (isLoading || !routeChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-dark">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent({ Component, pageProps }: AppProps) {
  return (
    <RouteGuard>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </RouteGuard>
  );
}

export default function AppWrapper(props: AppProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent {...props} />
      </AuthProvider>
    </ThemeProvider>
  );
}
