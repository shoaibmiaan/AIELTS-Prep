// src/pages/_app.tsx
import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Toaster } from 'react-hot-toast';
import { pdfjs } from 'pdfjs-dist';

// Add PDF.js worker configuration
<script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@4.2.67/build/pdf.min.js"></script>

type PageWithLayout = AppProps['Component'] & {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
};

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const Page = Component as PageWithLayout;

  const protectedPrefixes = [
    '/dashboard',
    '/profile',
    '/courses',
    '/practice',
  ];

  const isProtected = protectedPrefixes.some(prefix =>
    router.pathname.startsWith(prefix)
  );

  const page = (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );

  const getLayout = Page.getLayout ?? ((page) => (isProtected ? <Layout>{page}</Layout> : page));

  return getLayout(page);
}