'use client';

import { ReactNode } from 'react';

type DropdownItemProps = {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
};

export const DropdownItem = ({
  children,
  onClick,
  className = '',
  icon,
}: DropdownItemProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-amber-50 dark:hover:bg-gray-700 ${className}`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};