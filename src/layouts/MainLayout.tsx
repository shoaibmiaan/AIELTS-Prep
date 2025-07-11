'use client';

import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';

const MAIN_LAYOUT_CLASSES = {
  container: 'flex h-screen bg-[#f8f9fa] text-[#0f1f44]',
  main: 'flex-1 overflow-y-auto bg-white',
  content: 'p-8',
};

interface MainLayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export default function MainLayout({ children, showHeader = true }: MainLayoutProps) {
  return (
    <div className={MAIN_LAYOUT_CLASSES.container}>
      <Sidebar />
      <main className={MAIN_LAYOUT_CLASSES.main}>
        {showHeader && <Navbar />}
        <div className={MAIN_LAYOUT_CLASSES.content}>{children}</div>
      </main>
    </div>
  );
}