import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import LoadingSpinner from './LoadingSpinner';
import Breadcrumb from './Breadcrumb';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function Layout({
  children,
  user,
  isLoading = false
}: {
  children: ReactNode;
  user: any;
  isLoading?: boolean;
}) {
  const { user: authUser } = useAuth();
  const { theme } = useTheme();
  const currentUser = user || authUser;

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={`font-sans min-h-screen transition-colors duration-200 flex flex-col ${
      theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header user={currentUser} />
      <div className="container mx-auto px-4">
        <Breadcrumb userId={currentUser?.id} />
      </div>
      <main className="container mx-auto px-4 py-4 flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}