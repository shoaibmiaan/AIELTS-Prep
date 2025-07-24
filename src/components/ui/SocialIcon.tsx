'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

type SocialIconProps = {
  href: string;
  children: ReactNode;
  className?: string;
};

export const SocialIcon = ({
  href,
  children,
  className = '',
}: SocialIconProps) => {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center hover:bg-amber-500 dark:hover:bg-amber-400 text-gray-600 dark:text-gray-300 hover:text-white transition-colors ${className}`}
    >
      {children}
    </Link>
  );
};