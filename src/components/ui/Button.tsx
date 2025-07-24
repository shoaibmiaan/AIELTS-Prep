'use client';

import { ReactNode } from 'react';
import { DesignSystem } from '@/constants/designSystem';  // Import the design system directly

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
    primary: `bg-[${DesignSystem.colors.primary[500]}] text-white hover:bg-[${DesignSystem.colors.primary[600]}] focus:ring-[${DesignSystem.colors.primary[500]}]`,
    secondary: `bg-[${DesignSystem.colors.secondary.purple[500]}] text-white hover:bg-[${DesignSystem.colors.secondary.purple[600]}] focus:ring-[${DesignSystem.colors.secondary.purple[500]}]`,
    accent: `bg-[${DesignSystem.colors.primary[500]}] text-white hover:bg-[${DesignSystem.colors.primary[600]}] focus:ring-[${DesignSystem.colors.primary[500]}]`,
    success: `bg-[${DesignSystem.colors.status.success}] text-white hover:bg-[${DesignSystem.colors.status.success}] focus:ring-[${DesignSystem.colors.status.success}]`,
    warning: `bg-[${DesignSystem.colors.status.warning}] text-white hover:bg-[${DesignSystem.colors.status.warning}] focus:ring-[${DesignSystem.colors.status.warning}]`,
    error: `bg-[${DesignSystem.colors.status.error}] text-white hover:bg-[${DesignSystem.colors.status.error}] focus:ring-[${DesignSystem.colors.status.error}]`,
    ghost: `bg-transparent text-[${DesignSystem.colors.gray[700]}] hover:bg-[${DesignSystem.colors.gray[100]}] dark:text-[${DesignSystem.colors.gray[300]}] dark:hover:bg-[${DesignSystem.colors.gray[700]}]`,
    link: `text-[${DesignSystem.colors.primary[500]}] dark:text-[${DesignSystem.colors.primary[400]}] hover:text-[${DesignSystem.colors.primary[600]}] dark:hover:text-[${DesignSystem.colors.primary[300]}] focus:ring-[${DesignSystem.colors.primary[500]}] underline-offset-4 hover:underline bg-transparent`,
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
