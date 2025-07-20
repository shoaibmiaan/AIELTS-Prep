'use client';
import { ReactNode } from 'react';

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-white transition-all">
      {/* Main content container */}
      <main className="w-full p-6">{children}</main>
    </div>
  );
}
