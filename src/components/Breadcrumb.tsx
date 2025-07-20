'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import StudyStreak from '@/components/StudyStreak'; // Import StudyStreak component
import { useTheme } from '@/components/ThemeContext'; // Import the useTheme hook

type BreadcrumbProps = {
  userId: string | null; // Accept userId as a prop
};

export default function Breadcrumb({ userId }: BreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // removes empty segments
  const { colors } = useTheme(); // Access theme colors from the context

  const buildPath = (i: number) => '/' + segments.slice(0, i + 1).join('/');

  const formatSegment = (seg: string) =>
    seg
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  return (
    <nav
      className="text-sm mb-6 overflow-x-auto whitespace-nowrap px-4 py-3 rounded-md shadow sticky top-0 z-30"
      aria-label="Breadcrumb"
      style={{ backgroundColor: colors.background }}
    >
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="hover:underline text-orange-400 flex items-center gap-1">
            <span>🏠</span>
            <span className="font-medium">Home</span>
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
                    ? 'text-white font-semibold'
                    : 'hover:underline text-gray-300'
                }`}
                style={{ color: colors.textPrimary }}
              >
                {formatSegment(decodeURIComponent(seg))}
              </Link>
            </li>
          );
        })}
      </ol>

      {/* Display Study Streak */}
      {userId && (
        <div className="mt-2 text-white">
          <StudyStreak userId={userId} /> {/* Display streak if userId exists */}
        </div>
      )}
    </nav>
  );
}
