import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '@/layouts/MainLayout';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

type PageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

function InnerApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { user, loading } = useAuth();
  const Page = Component as PageWithLayout;

  const publicRoutes = ['/login', '/signup', '/reset-password'];
  const protectedRoutes = ['/dashboard', '/profile', '/courses', '/practice'];

  const isPublic = publicRoutes.includes(router.pathname);
  const isProtected = protectedRoutes.some((path) =>
    router.pathname.startsWith(path)
  );

  useEffect(() => {
    if (!router.isReady || loading) return;

    if (isProtected && user === null) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const page = (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );

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
