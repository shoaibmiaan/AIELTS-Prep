// Spinner.tsx
import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';  // Spinner size options
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md' }) => {
  const spinnerSizeClasses = {
    sm: 'w-6 h-6 border-4',
    md: 'w-12 h-12 border-4',
    lg: 'w-16 h-16 border-8',
  };

  return (
    <div
      className={`border-t-transparent border-solid border-blue-500 rounded-full animate-spin ${spinnerSizeClasses[size]}`}
      style={{ borderTopColor: 'transparent' }}
    />
  );
};

export default Spinner;
