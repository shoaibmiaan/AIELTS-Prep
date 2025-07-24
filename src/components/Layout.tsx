import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { ThemeProvider } from './ThemeProvider';

export default function Layout({
  children,
  user,
  isLoading = false
}: {
  children: ReactNode;
  user: any;
  isLoading?: boolean;
}) {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ThemeProvider>
        <div className="font-sans bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
          <Header user={user} />
          <main className="container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </NextThemesProvider>
  );
}