import { ReactNode } from 'react';
import { useTheme } from '@/context/ThemeContext';

export default function Container({
  children,
  className = ''
}: {
  children: ReactNode;
  className?: string;
}) {
  const { theme } = useTheme();  // Get the current theme (light or dark)

  return (
    <div
      className={`bg-card dark:bg-card-dark rounded-xl shadow-md p-6 border border-border dark:border-border-dark transition-colors duration-200 ${className}`}
    >
      {children}
    </div>
  );
}
