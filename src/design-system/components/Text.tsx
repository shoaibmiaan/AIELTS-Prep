import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { colorTokens } from '../theme/colors';

const textVariants = cva('', {
  variants: {
    variant: {
      body: `text-${colorTokens.textPrimary} dark:text-${colorTokens.textPrimaryDark}`,
      subtitle: `text-${colorTokens.textSecondary} dark:text-${colorTokens.textDisabled}`,
      lead: `text-lg text-${colorTokens.textSecondary} dark:text-${colorTokens.textDisabled}`,
      overline: 'uppercase tracking-wider text-xs font-semibold',
      caption: 'text-sm',
    },
    color: {
      primary: `text-${colorTokens.primary}`,
      primaryLight: `text-${colorTokens.primaryLight}`,
      accent: `text-${colorTokens.accent}`,
      accentLight: `text-${colorTokens.accentLight}`,
      success: `text-${colorTokens.success}`,
      error: `text-${colorTokens.error}`,
      warning: `text-${colorTokens.warning}`,
      disabled: `text-${colorTokens.textDisabled}`,
      inherit: 'text-current',
    },
  },
  compoundVariants: [
    {
      variant: 'body',
      color: undefined,
      class: `text-${colorTokens.textPrimary} dark:text-${colorTokens.textPrimaryDark}`,
    },
  ],
  defaultVariants: {
    variant: 'body',
  },
});

export interface TextProps
  extends React.HTMLAttributes<HTMLParagraphElement>,
    VariantProps<typeof textVariants> {
  as?: 'p' | 'span' | 'div' | 'label';
}

export const Text: React.FC<TextProps> = ({
  className,
  variant,
  color,
  as: Component = 'p',
  ...props
}) => {
  return (
    <Component
      className={textVariants({ variant, color, className })}
      {...props}
    />
  );
};