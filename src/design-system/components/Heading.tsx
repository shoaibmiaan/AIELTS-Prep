// Heading.tsx (simplified example)
import React from 'react';

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
  children: React.ReactNode;
}

const Heading: React.FC<HeadingProps> = ({ level, className, children }) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements; // Dynamically set the tag (h1, h2, etc.)

  return <Tag className={className}>{children}</Tag>;
};

export default Heading;
