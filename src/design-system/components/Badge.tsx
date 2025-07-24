import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { colorTokens } from '../theme/colors';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-3 py-1 text-sm font-medium',
  {
    variants: {
      variant: {
        default: `bg-${colorTokens.primary} text-white`,
        featured: `bg-${colorTokens.featured} text-white`,
        success: `bg-${colorTokens.success} text-white`,
        accent: `bg-${colorTokens.accent} text-white`,
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant,
  ...props
}) => {
  return (
    <div
      className={badgeVariants({ variant, className })}
      {...props}
    />
  );
};