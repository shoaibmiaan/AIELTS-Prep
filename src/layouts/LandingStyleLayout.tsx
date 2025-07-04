// src/layouts/LandingStyleLayout.tsx
'use client';

import { ReactNode } from 'react';
import Head from 'next/head';
import Breadcrumb from '@/components/Breadcrumb';

export default function LandingStyleLayout({
  children,
  title = 'AIELTS Prep',
  description = 'Master IELTS with AI-Powered Feedback',
}: {
  children: ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="follow, index" />
      </Head>

      <div className="bg-black text-white font-sans min-h-screen">
        {/* Header */}
        <header className="sticky top-0 left-0 w-full bg-[#1E1F25] z-50 px-6 py-4 shadow">
          <div className="flex items-center justify-between">
            <a href="/" className="text-2xl font-bold tracking-wide text-white">
              AIELTS
              <span className="bg-gradient-to-r from-orange-500 to-yellow-400 bg-clip-text text-transparent">
                Prep
              </span>
            </a>
          </div>
          <div className="mt-1">
            <Breadcrumb />
          </div>
        </header>

        <main className="pt-10">{children}</main>

        <footer className="bg-black text-gray-400 text-center py-6 border-t border-gray-800">
          © 2025 AIELTS Prep. All rights reserved.
        </footer>
      </div>
    </>
  );
}
