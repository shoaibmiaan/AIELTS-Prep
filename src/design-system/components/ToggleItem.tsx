// ToggleItem.tsx (simplified)
import React from 'react';

interface ToggleItemProps {
  value: string;
  id: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const ToggleItem: React.FC<ToggleItemProps> = ({ value, id, children, onClick }) => {
  return (
    <button
      id={id}
      value={value}
      onClick={onClick}
      className="px-4 py-2 text-lg font-medium"
    >
      {children}
    </button>
  );
};

export default ToggleItem;
