'use client';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export default function Layout({ children, title, description }: LayoutProps) {
  const { user } = useAuth();
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode
  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedMode === 'true' || (!savedMode && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Navigation handlers
  const handleNavigation = (route: string) => {
    if (route.startsWith('http')) {
      window.open(route, '_blank');
      return;
    }
    window.location.href = route;
  };

  const handleProtectedClick = (route: string) => {
    if (user) {
      handleNavigation(route);
    } else {
      handleNavigation('/login');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };

  return (
    <div className={`font-sans min-h-screen flex flex-col ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <Head>
        <title>{title || 'IELTS Master - AI-Powered Preparation'}</title>
        <meta name="description" content={description || 'Personalized IELTS preparation with AI feedback and expert strategies'} />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </Head>

      <Header 
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        handleNavigation={handleNavigation}
        handleProtectedClick={handleProtectedClick}
      />

      <main className="flex-grow">
        {children}
      </main>

      <Footer 
        handleNavigation={handleNavigation}
        handleProtectedClick={handleProtectedClick}
      />

      <style jsx global>{`
        html {
          transition: background-color 0.3s ease;
        }
        body {
          transition: background-color 0.3s ease;
          margin: 0;
          padding: 0;
        }
      `}</style>
    </div>
  );
}