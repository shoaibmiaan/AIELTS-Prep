'use client';
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '@/layouts/MainLayout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

type PageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

function InnerApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const Page = Component as PageWithLayout;

  // Define public and protected routes
  const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/phone-login'];
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/courses',
    '/practice/reading',
    '/practice/listening',
    '/practice/speaking',
    '/practice/writing',
    '/practice/reading/history',
    '/admin',
  ];

  // Check if the current route is public or protected
  const isPublic = publicRoutes.includes(router.pathname) || publicRoutes.some((path) => router.pathname.startsWith(path));
  const isProtected = protectedRoutes.some((path) => router.pathname.startsWith(path));

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || loading) return;

    // Redirect to login if the user is not logged in and tries to access protected routes
    if (isProtected && user === null) {
      router.push('/login');
    }
  }, [user, loading, router, isProtected, isMounted]);

  if (!isMounted || loading) {
    return (
      <motion.div
        className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-gray-600 dark:text-gray-300">Loading...</div>
      </motion.div>
    );
  }

  // Page component with Toaster (for notifications) and layout wrapping
  const page = (
    <>
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
      <Component {...pageProps} />
    </>
  );

  // Apply layout for protected routes
  const getLayout = Page.getLayout ?? ((page) =>
    isProtected ? <Layout>{page}</Layout> : page
  );

  return isPublic ? page : getLayout(page);
}

export default function AppWrapper(props: AppProps) {
  return (
    <AuthProvider>
      <InnerApp {...props} />
    </AuthProvider>
  );
}