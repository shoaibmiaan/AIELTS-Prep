'use client';

import { ReactNode } from 'react';
import Link from 'next/link';

type NavLinkProps = {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  className?: string;
};

export const NavLink = ({
  href,
  children,
  isActive = false,
  className = '',
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`font-medium transition-colors duration-200 ${
        isActive
          ? 'text-amber-600 dark:text-amber-400 underline underline-offset-4'
          : 'text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400'
      } ${className}`}
    >
      {children}
    </Link>
  );
};