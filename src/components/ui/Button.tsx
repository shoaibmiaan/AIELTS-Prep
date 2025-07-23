import { cva, type VariantProps } from 'class-variance-authority';
import { useTheme } from '@/context/ThemeContext';

const buttonVariants = cva(
  'rounded-lg font-medium transition-colors focus:outline-none flex items-center justify-center',
  {
    variants: {
      variant: {
        primary: '',
        secondary: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
        outline: 'border bg-transparent'
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button = ({
  className,
  variant,
  size,
  icon,
  loading,
  children,
  ...props
}: ButtonProps) => {
  const { colors } = useTheme();

  return (
    <button
      className={buttonVariants({ variant, size, className })}
      style={{
        backgroundColor: variant === 'primary' ? colors.primary : undefined,
        borderColor: variant === 'outline' ? colors.border : undefined,
        color: variant === 'primary' ? 'white' : undefined
      }}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <span className="animate-spin mr-2">↻</span>
      ) : icon ? (
        <span className="mr-2">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};