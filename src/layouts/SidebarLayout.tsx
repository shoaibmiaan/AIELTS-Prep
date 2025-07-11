'use client';

import { ReactNode } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import SubscribeForm from '@/components/SubscribeForm';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { useAuthProfile } from '@/hooks/useAuthProfile';

const RIGHT_PANEL_CLASSES = {
  container: 'w-72 bg-white border-l shadow-lg p-6',
  title: 'text-lg font-semibold mb-3',
  link: (color: string) => `block px-4 py-2 bg-${color}-100 hover:bg-${color}-200 text-${color}-800 rounded`,
  badge: 'ml-2 bg-red-600 text-white text-xs px-2 py-0.5 rounded-full',
};

interface SidebarLayoutProps {
  children: ReactNode;
  showRightPanel?: boolean;
  showHeader?: boolean;
}

export default function SidebarLayout({
  children,
  showRightPanel = true,
  showHeader = false,
}: SidebarLayoutProps) {
  const { role, pendingRequests } = useAuthProfile();

  return (
    <div className="flex h-screen bg-[#f5f7fa] text-[#0f1f44]">
      <Sidebar collapsedByDefault={role === 'admin'} />
      <main className="flex-1 overflow-y-auto p-8">
        {showHeader && (
          <div className="sticky top-0 z-40 bg-[#1E1F25] text-white px-4 py-2 flex items-center justify-between">
            <h1 className="text-lg font-bold">
              AIELTS <span className="text-orange-400">Prep</span>
            </h1>
            <Breadcrumb />
          </div>
        )}
        <div className={showHeader ? 'pt-2' : 'pb-2'}>
          <Breadcrumb />
        </div>
        {children}
      </main>
      {showRightPanel && (
        <aside className={RIGHT_PANEL_CLASSES.container}>
          {role === 'admin' ? (
            <>
              <h3 className={RIGHT_PANEL_CLASSES.title}>Admin Panel</h3>
              <div className="space-y-3 text-sm">
                <Link href="/adminDashboard" className={RIGHT_PANEL_CLASSES.link('gray')}>
                  🛠 Full Admin Panel
                </Link>
                <Link href="/admin/users" className={RIGHT_PANEL_CLASSES.link('red')}>
                  👥 Manage Users
                </Link>
                <Link
                  href="/admin/teacher-requests"
                  className={RIGHT_PANEL_CLASSES.link('blue') + ' flex justify-between'}
                >
                  📩 Review Requests
                  {pendingRequests > 0 && (
                    <span className={RIGHT_PANEL_CLASSES.badge}>{pendingRequests}</span>
                  )}
                </Link>
                <Link href="/admin/pdf-importer" className={RIGHT_PANEL_CLASSES.link('indigo')}>
                  📘 Upload Reading
                </Link>
                <Link href="/admin/reading-library" className={RIGHT_PANEL_CLASSES.link('green')}>
                  📚 Reading Library
                </Link>
                <Link href="/admin/manual-upload" className={RIGHT_PANEL_CLASSES.link('yellow')}>
                  🔼 Manual Upload
                </Link>
              </div>
            </>
          ) : (
            <>
              <h3 className={RIGHT_PANEL_CLASSES.title}>Free IELTS Lessons</h3>
              <SubscribeForm />
            </>
          )}
        </aside>
      )}
    </div>
  );
}
