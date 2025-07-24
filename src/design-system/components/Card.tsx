import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { colorTokens } from '../theme/colors';

const cardVariants = cva(
  'rounded-lg p-6 transition-all',
  {
    variants: {
      highlight: {
        true: `ring-2 ring-${colorTokens.primary} bg-${colorTokens.backgroundCard} dark:bg-${colorTokens.backgroundCardDark}`,
        false: `bg-${colorTokens.backgroundCard} dark:bg-${colorTokens.backgroundCardDark} border border-${colorTokens.gray200} dark:border-${colorTokens.gray700}`,
      },
      shadow: {
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      },
    },
    defaultVariants: {
      highlight: false,
      shadow: 'md',
    },
  }
);

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export const Card: React.FC<CardProps> = ({
  className,
  highlight,
  shadow,
  ...props
}) => {
  return (
    <div
      className={cardVariants({ highlight, shadow, className })}
      {...props}
    />
  );
};