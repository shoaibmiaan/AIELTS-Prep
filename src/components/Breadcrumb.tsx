'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Breadcrumb() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean); // removes empty

  const buildPath = (i: number) => '/' + segments.slice(0, i + 1).join('/');

  return (
    <nav className="text-sm text-gray-500 mb-4">
      <ol className="flex flex-wrap items-center space-x-1">
        <li>
          <Link href="/" className="hover:underline text-gray-400">Home</Link>
        </li>
        {segments.map((seg, i) => {
          const isLast = i === segments.length - 1;
          return (
            <li key={i} className="flex items-center">
              <span className="px-1">/</span>
              <Link
                href={buildPath(i)}
                className={`capitalize ${isLast ? 'text-gray-700 font-medium' : 'hover:underline text-gray-500'}`}
              >
                {decodeURIComponent(seg.replace(/-/g, ' '))}
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
