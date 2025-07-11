'use client';

import { ReactNode } from 'react';
import Head from 'next/head';
import Breadcrumb from '@/components/Breadcrumb';

// Constants for Tailwind classes
const LAYOUT_CLASSES = {
  container: 'bg-black text-white font-sans min-h-screen',
  header: 'sticky top-0 left-0 w-full bg-[#1E1F25] z-50 px-6 py-4 shadow',
  logo: 'text-2xl font-bold tracking-wide text-white',
  logoHighlight: 'bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent',
  footer: 'bg-black text-gray-400 text-center py-6 border-t border-gray-800',
};

interface LandingStyleLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

function Header() {
  return (
    <header className={LAYOUT_CLASSES.header}>
      <div className="flex items-center justify-between">
        <a href="/" className={LAYOUT_CLASSES.logo}>
          AIELTS<span className={LAYOUT_CLASSES.logoHighlight}>Prep</span>
        </a>
      </div>
      <div className="mt-1">
        <Breadcrumb />
      </div>
    </header>
  );
}

export default function LandingStyleLayout({
  children,
  title = 'AIELTS Prep',
  description = 'Master IELTS with AI-Powered Feedback',
}: LandingStyleLayoutProps) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="follow, index" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
      </Head>
      <div className={LAYOUT_CLASSES.container}>
        <Header />
        <main className="pt-10">{children}</main>
        <footer className={LAYOUT_CLASSES.footer}>© 2025 AIELTS Prep. All rights reserved.</footer>
      </div>
    </>
  );
}
