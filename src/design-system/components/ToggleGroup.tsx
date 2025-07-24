import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { colorTokens } from '../theme/colors';

const toggleGroupVariants = cva(
  `flex bg-${colorTokens.gray200} dark:bg-${colorTokens.gray700} rounded-lg p-1`,
  {
    variants: {
      size: {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const toggleItemVariants = cva(
  'py-2 px-6 rounded-md font-medium transition-colors',
  {
    variants: {
      active: {
        true: `bg-${colorTokens.primary} text-white`,
        false: `text-${colorTokens.textSecondary}`,
      },
      size: {
        sm: 'py-1.5 px-4',
        md: 'py-2 px-6',
        lg: 'py-3 px-8',
      },
    },
    defaultVariants: {
      active: false,
      size: 'md',
    },
  }
);

export interface ToggleGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toggleGroupVariants> {
  value: string;
  onValueChange: (value: string) => void;
}

export const ToggleGroup: React.FC<ToggleGroupProps> = ({
  className,
  size,
  value,
  onValueChange,
  children,
  ...props
}) => {
  return (
    <div
      className={toggleGroupVariants({ size, className })}
      {...props}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            active: child.props.value === value,
            size,
            onClick: () => onValueChange(child.props.value)
          } as any);
        }
        return child;
      })}
    </div>
  );
};

interface ToggleItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof toggleItemVariants> {
  value: string;
  id?: string;
}

export const ToggleItem: React.FC<ToggleItemProps> = ({
  className,
  active,
  size,
  children,
  ...props
}) => {
  return (
    <button
      type="button"
      className={toggleItemVariants({ active, size, className })}
      {...props}
    >
      {children}
    </button>
  );
};