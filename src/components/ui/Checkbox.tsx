import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  ariaLabel,
  disabled = false,
  className = '',
}) => {
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`h-4 w-4 rounded border-[rgb(var(--color-border))] text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))] disabled:opacity-50 transition-colors duration-200 ${className}`}
      aria-label={ariaLabel}
      aria-disabled={disabled}
    />
  );
};

export default Checkbox;