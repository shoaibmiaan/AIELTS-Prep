// src/components/Layout.tsx

import Head from 'next/head';
import { ThemeProvider } from '@/context/ThemeContext';
import Footer from '@/components/home/Footer'; // Ensure Footer is imported

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

// This component only handles the visual layout
function LayoutContent({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Head>
        <title>{title || 'IELTS Master - AI-Powered Preparation'}</title>
        <meta name="description" content={description || 'Personalized IELTS preparation with AI feedback and expert strategies'} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      {/* Removed Navbar as it no longer exists */}

      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}

// This wrapper provides the Theme context
export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <ThemeProvider>
      <LayoutContent title={title} description={description}>
        {children}
      </LayoutContent>
    </ThemeProvider>
  );
}
