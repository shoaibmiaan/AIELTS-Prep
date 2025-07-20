'use client';

import { ReactNode } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { useAuthProfile } from '@/hooks/useAuthProfile';
import SubscribeForm from '@/components/SubscribeForm';
import Link from 'next/link';

const SIDEBAR_LAYOUT_CLASSES = {
  container: 'flex h-screen bg-[#f5f7fa] text-[#0f1f44]',
  main: 'flex-1 overflow-y-auto p-8',
  rightPanel: 'w-72 bg-white border-l shadow-lg p-6',
};

const RIGHT_PANEL_CLASSES = {
  title: 'text-lg font-semibold mb-3',
  link: (color: string) => `block px-4 py-2 bg-${color}-100 hover:bg-${color}-200 text-${color}-800 rounded`,
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
    <div className={SIDEBAR_LAYOUT_CLASSES.container}>
      <main className={SIDEBAR_LAYOUT_CLASSES.main}>
        {/* Conditionally render header */}
        {showHeader && (
          <div className="sticky top-0 z-40 bg-[#1E1F25] text-white px-4 py-2 flex items-center justify-between">
            <h1 className="text-lg font-bold">
              AIELTS <span className="text-orange-400">Prep</span>
            </h1>
            <Breadcrumb />
          </div>
        )}
        {/* Render the children passed to SidebarLayout */}
        {children}
      </main>

      {/* Conditionally render right panel */}
      {showRightPanel && (
        <aside className={SIDEBAR_LAYOUT_CLASSES.rightPanel}>
          {/* Admin panel links (only visible if the role is 'admin') */}
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
                <Link href="/admin/teacher-requests" className={RIGHT_PANEL_CLASSES.link('blue')}>
                  📩 Review Requests
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Free lessons subscription form for other roles */}
              <h3 className={RIGHT_PANEL_CLASSES.title}>Free IELTS Lessons</h3>
              <SubscribeForm />
            </>
          )}
        </aside>
      )}
    </div>
  );
}
