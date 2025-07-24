'use client';

import { ReactNode } from 'react';
import { theme } from '@/styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'ghost' | 'link';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  fullWidth = false,
  leftIcon,
  rightIcon,
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `bg-${theme.colors.primary[500]} text-white hover:bg-${theme.colors.primary[600]} focus:ring-${theme.colors.primary[500]}`,
    secondary: `bg-${theme.colors.secondary[500]} text-white hover:bg-${theme.colors.secondary[600]} focus:ring-${theme.colors.secondary[500]}`,
    accent: `bg-${theme.colors.accent.writing} text-white hover:bg-${theme.colors.primary[600]} focus:ring-${theme.colors.primary[500]}`,
    success: `bg-${theme.colors.success[500]} text-white hover:bg-${theme.colors.success[600]} focus:ring-${theme.colors.success[500]}`,
    warning: `bg-${theme.colors.warning[500]} text-white hover:bg-${theme.colors.warning[600]} focus:ring-${theme.colors.warning[500]}`,
    error: `bg-${theme.colors.error[500]} text-white hover:bg-${theme.colors.error[600]} focus:ring-${theme.colors.error[500]}`,
    ghost: `bg-transparent text-${theme.colors.gray[700]} hover:bg-${theme.colors.gray[100]} dark:text-${theme.colors.gray[300]} dark:hover:bg-${theme.colors.gray[700]}`,
    link: `text-${theme.colors.primary[500]} dark:text-${theme.colors.primary[400]} hover:text-${theme.colors.primary[600]} dark:hover:text-${theme.colors.primary[300]} focus:ring-${theme.colors.primary[500]} underline-offset-4 hover:underline bg-transparent`,
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};