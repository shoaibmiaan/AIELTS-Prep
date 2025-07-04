'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // removes empty segments

  const buildPath = (i: number) => '/' + segments.slice(0, i + 1).join('/');

  const formatSegment = (seg: string) =>
    seg
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');

  return (
    <nav
      className="text-sm text-white mb-6 overflow-x-auto whitespace-nowrap bg-[#1E1F25] px-4 py-3 rounded-md shadow sticky top-0 z-30"
      aria-label="Breadcrumb"
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
              >
                {formatSegment(decodeURIComponent(seg))}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
