// src/components/Breadcrumb.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StudyStreak from '@/components/StudyStreak';
import { useTheme } from '@/context/ThemeContext';

type BreadcrumbProps = {
  userId: string | null;
};

export default function Breadcrumb({ userId }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const { theme, toggleTheme } = useTheme();

  const buildPath = (i: number) => '/' + segments.slice(0, i + 1).join('/');

  const formatSegment = (seg: string) =>
    seg
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  return (
    <nav
      className="mb-4 overflow-x-auto whitespace-nowrap px-4 py-2 rounded-md shadow bg-white dark:bg-gray-800"
      aria-label="Breadcrumb"
    >
      <div className="flex items-center justify-between">
        <ol className="flex items-center space-x-1 text-sm">
          <li>
            <Link href="/" className="hover:underline text-orange-400 flex items-center gap-1">
              <span>🏠</span>
              <span className="font-medium hidden sm:inline">Home</span>
            </Link>
          </li>
          {segments.map((seg, i) => {
            const isLast = i === segments.length - 1;
            return (
              <li key={i} className="flex items-center">
                <span className="px-1 text-gray-500">/</span>
                <Link
                  href={buildPath(i)}
                  className={`capitalize ${
                    isLast
                      ? 'text-gray-900 dark:text-white font-semibold'
                      : 'hover:underline text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {formatSegment(decodeURIComponent(seg))}
                </Link>
              </li>
            );
          })}
        </ol>

        <div className="flex items-center gap-2">
          {userId && <StudyStreak userId={userId} />}
          <button
            onClick={toggleTheme}
            className="p-1 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </nav>
  );
}