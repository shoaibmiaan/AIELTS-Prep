// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const protectedRoutes = ['/dashboard', '/profile', '/courses', '/practice'];
  const isProtected = protectedRoutes.includes(router.pathname);

  const Wrapped = (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );

  return isProtected ? <Layout>{Wrapped}</Layout> : Wrapped;
}
