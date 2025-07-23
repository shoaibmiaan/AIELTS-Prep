// components/Layout.tsx
import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';

export default function Layout({
  children,
  darkMode,
  toggleDarkMode,
  user,
  isLoading = false
}: {
  children: ReactNode;
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: any;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        user={user}
      />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}