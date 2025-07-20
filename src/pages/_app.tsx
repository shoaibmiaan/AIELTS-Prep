import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../components/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const PUBLIC_ROUTES = [
  '/', '/login', '/signup', '/reset-password',
  '/forgot-password', '/phone-login', '/thank-you',
  '/about', '/contact', '/privacy', '/terms'
];

const PROTECTED_ROUTES = [
  '/profile', '/courses', '/assessmentRoom',
  '/simulation', '/learn-prepare', '/learnLab',
  '/adminDashboard', '/adminDashboard'
];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [routeChecked, setRouteChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || isLoading) return;

    const currentPath = router.pathname;
    const isPublic = PUBLIC_ROUTES.includes(currentPath);
    const isProtected = PROTECTED_ROUTES.some(path => currentPath.startsWith(path));

    if (isProtected && !user) {
      sessionStorage.setItem('redirectUrl', currentPath);
      router.push('/login');
    } else if (user && !isPublic && currentPath === '/login') {
      const redirectUrl = sessionStorage.getItem('redirectUrl') || '/';
      sessionStorage.removeItem('redirectUrl');
      router.push(redirectUrl);
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