// Container.tsx
import React from 'react';

interface ContainerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ size = 'md', className, children }) => {
  const containerSizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-7xl',
  };

  return (
    <div className={`${containerSizeClasses[size]} mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
