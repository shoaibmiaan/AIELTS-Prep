import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { colorTokens } from '../theme/colors';

const listVariants = cva('space-y-2', {
  variants: {
    variant: {
      default: '',
      disabled: `text-${colorTokens.textDisabled}`,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const listItemVariants = cva('flex items-start', {
  variants: {
    variant: {
      default: '',
      disabled: `text-${colorTokens.textDisabled}`,
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

interface ListProps extends React.HTMLAttributes<HTMLUListElement>,
  VariantProps<typeof listVariants> {}

export const List: React.FC<ListProps> = ({
  className,
  variant,
  ...props
}) => {
  return (
    <ul
      className={listVariants({ variant, className })}
      {...props}
    />
  );
};

interface ListItemProps extends React.HTMLAttributes<HTMLLIElement>,
  VariantProps<typeof listItemVariants> {
  icon?: 'check' | 'close';
}

export const ListItem: React.FC<ListItemProps> = ({
  className,
  variant,
  icon,
  children,
  ...props
}) => {
  const renderIcon = () => {
    if (!icon) return null;

    if (icon === 'check') {
      return (
        <svg
          className={`h-5 w-5 flex-shrink-0 mr-2 ${
            variant === 'disabled'
              ? `text-${colorTokens.textDisabled}`
              : `text-${colorTokens.success}`
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      );
    }

    return (
      <svg
        className={`h-5 w-5 flex-shrink-0 mr-2 ${
          variant === 'disabled'
            ? `text-${colorTokens.textDisabled}`
            : `text-${colorTokens.error}`
        }`}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clipRule="evenodd"
        />
      </svg>
    );
  };

  return (
    <li
      className={listItemVariants({ variant, className })}
      {...props}
    >
      {renderIcon()}
      <span>{children}</span>
    </li>
  );
};