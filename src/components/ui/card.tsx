import { useTheme } from '@/context/ThemeContext';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = '', ...props }: CardProps) => {
  const { colors } = useTheme();

  return (
    <div
      className={`rounded-2xl shadow-lg p-6 ${className}`}
      style={{ backgroundColor: colors.cardBackground }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }: CardProps) => {
  const { colors } = useTheme();

  return (
    <div
      className={`mb-4 pb-3 border-b ${className}`}
      style={{ borderColor: colors.border }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '', ...props }: CardProps) => {
  const { colors } = useTheme();

  return (
    <div
      className={`${className}`}
      style={{ color: colors.textSecondary }}
      {...props}
    >
      {children}
    </div>
  );
};