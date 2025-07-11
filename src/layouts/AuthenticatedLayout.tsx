'use client';

import { ReactNode } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SubscribeForm from '@/components/SubscribeForm';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useAuthProfile } from '@/hooks/useAuthProfile';

const LAYOUT_CLASSES = {
  container: 'flex h-screen bg-[#f5f7fa] text-[#0f1f44]',
  main: 'flex-1 overflow-y-auto bg-white',
  header: 'sticky top-0 z-40 bg-[#1E1F25] text-white px-4 py-2 flex items-center justify-between',
  title: 'text-lg font-bold',
  content: 'p-8',
  rightPanel: 'w-72 bg-white border-l shadow-lg p-6',
  rightPanelTitle: 'text-lg font-semibold mb-3',
  rightPanelLink: (color: string) => `block px-4 py-2 bg-${color}-100 hover:bg-${color}-200 text-${color}-800 rounded`,
  rightPanelBadge: 'ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full',
};

interface AuthenticatedLayoutProps {
  children: ReactNode;
  showRightPanel?: boolean;
  showHeader?: boolean;
  collapsedByDefault?: boolean;
}

export default function AuthenticatedLayout({
  children,
  showRightPanel = false,
  showHeader = true,
  collapsedByDefault = false,
}: AuthenticatedLayoutProps) {
  const { role, pendingRequests } = useAuthProfile();

  return (
    <div className={LAYOUT_CLASSES.container}>
      <Sidebar collapsedByDefault={collapsedByDefault || role === 'admin'} />
      <main className={LAYOUT_CLASSES.main}>
        {showHeader && (
          <div className={LAYOUT_CLASSES.header}>
            <h1 className={LAYOUT_CLASSES.title}>
              AIELTS <span className="text-orange-400">Prep</span>
            </h1>
            <Breadcrumb />
          </div>
        )}
        <div className={showHeader ? LAYOUT_CLASSES.content : 'pb-2'}>
          {showHeader ? children : <><Breadcrumb /> {children}</>}
        </div>
      </main>
      {showRightPanel && (
        <aside className={LAYOUT_CLASSES.rightPanel}>
          {role === 'admin' ? (
            <>
              <h3 className={LAYOUT_CLASSES.rightPanelTitle}>Admin Panel</h3>
              <div className="space-y-3 text-sm">
                <Link href="/adminDashboard" className={LAYOUT_CLASSES.rightPanelLink('gray')}>
                  🛠 Full Admin Panel
                </Link>
                <Link href="/admin/users" className={LAYOUT_CLASSES.rightPanelLink('red')}>
                  👥 Manage Users
                </Link>
                <Link
                  href="/admin/teacher-requests"
                  className={LAYOUT_CLASSES.rightPanelLink('blue') + ' flex justify-between'}
                >
                  📩 Review Requests
                  {pendingRequests > 0 && (
                    <span className={LAYOUT_CLASSES.rightPanelBadge}>{pendingRequests}</span>
                  )}
                </Link>
                <Link href="/admin/pdf-importer" className={LAYOUT_CLASSES.rightPanelLink('indigo')}>
                  📘 Upload Reading
                </Link>
                <Link href="/admin/reading-library" className={LAYOUT_CLASSES.rightPanelLink('green')}>
                  📚 Reading Library
                </Link>
                <Link href="/admin/manual-upload" className={LAYOUT_CLASSES.rightPanelLink('yellow')}>
                  🔼 Manual Upload
                </Link>
              </div>
            </>
          ) : (
            <>
              <h3 className={LAYOUT_CLASSES.rightPanelTitle}>Free IELTS Lessons</h3>
              <SubscribeForm />
            </>
          )}
        </aside>
      )}
    </div>
  );
}