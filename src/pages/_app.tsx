import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeContext'; // Assuming the ThemeProvider is set up
import { AuthProvider, useAuth } from '@/context/AuthContext'; // Assuming AuthProvider is set up
import { DesignSystemProvider } from '@/design-system/providers/DesignSystem';  // Assuming DesignSystemProvider is set up
import ErrorBoundary from '@/components/ErrorBoundary'; // Add Error Boundary to catch any errors

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

// Route Guard Component to handle access control
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
        <p className="mt-2 text-white">Verifying your session...</p>
      </div>
    );
  }

  return <>{children}</>;
}

// Main App Content Component
function AppContent({ Component, pageProps }: AppProps) {
  return (
    <RouteGuard>
      <Toaster position="top-right" />
      <Component {...pageProps} />
    </RouteGuard>
  );
}

// Main App Wrapper that includes all the providers
export default function AppWrapper(props: AppProps) {
  return (
    <DesignSystemProvider>
      <ThemeProvider>
        <AuthProvider>
          <ErrorBoundary>
            <AppContent {...props} />
          </ErrorBoundary>
        </AuthProvider>
      </ThemeProvider>
    </DesignSystemProvider>
  );
}
