import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProvider } from '@/components/ThemeProvider';
import Layout from '@/components/Layout';

// Public routes accessible to everyone (no authentication required)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/reset-password',
  '/forgot-password',
  '/thank-you',
  '/about',
  '/contact',
  '/privacy',
  '/terms'
];

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/dashboard',
  '/practice',
  '/test',
  '/writing-analysis',
  '/speaking-practice',
  '/premium',
  '/lessons',
  '/progress',
  '/vocabulary' // Add new vocabulary route
];

function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [routeChecked, setRouteChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady || isLoading) return;

    const currentPath = router.pathname;
    const isProtected = PROTECTED_ROUTES.some(path => currentPath.startsWith(path));
    const isPublic = PUBLIC_ROUTES.some(path => currentPath.startsWith(path));

    if (isProtected && !user) {
      // Store the current route to redirect back to after login
      sessionStorage.setItem('redirectUrl', currentPath);
      router.push('/login');
      return;
    }

    if (!isPublic && !isProtected && !user) {
      sessionStorage.setItem('redirectUrl', currentPath);
      router.push('/login');
      return;
    }

    setRouteChecked(true);
  }, [user, isLoading, router, router.isReady]);

  if (isLoading || !routeChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 dark:border-indigo-400"></div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AppWrapper({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Pages that don't need the layout
  const barePages = [
    '/login',
    '/signup',
    '/forgot-password',
    '/reset-password',
    '/thank-you'
  ];
  const useLayout = !barePages.includes(router.pathname);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeProvider>
        <AuthProvider>
          <RouteGuard>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--background)',
                  color: 'var(--foreground)',
                  border: '1px solid var(--border)',
                },
              }}
            />
            {useLayout ? (
              <Layout>
                <Component {...pageProps} />
              </Layout>
            ) : (
              <Component {...pageProps} />
            )}
          </RouteGuard>
        </AuthProvider>
      </ThemeProvider>
    </NextThemesProvider>
  );
}