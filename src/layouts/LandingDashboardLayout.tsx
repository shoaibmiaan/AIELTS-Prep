'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Constants for Tailwind classes
const LAYOUT_CLASSES = {
  container: 'min-h-screen bg-gradient-to-br from-white via-gray-50 to-blue-50 text-gray-900',
  main: 'max-w-7xl mx-auto p-5 space-y-6',
  watermark: 'fixed bottom-4 right-4 text-xs text-gray-400 opacity-50 select-none',
};

interface LandingDashboardLayoutProps {
  children: ReactNode;
}

export default function LandingDashboardLayout({ children }: LandingDashboardLayoutProps) {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>AIELTS Prep Dashboard</title>
        <meta name="description" content="Explore your IELTS preparation dashboard with AI-powered insights." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="follow, index" />
      </Head>
      <div className={LAYOUT_CLASSES.container}>
        <main className={LAYOUT_CLASSES.main}>{children}</main>
        <div className={LAYOUT_CLASSES.watermark}>© Learn with Solvio</div>
      </div>
    </>
  );
}
