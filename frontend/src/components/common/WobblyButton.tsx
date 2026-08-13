import React from 'react';

export interface WobblyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'yellow' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const WobblyButton: React.FC<WobblyButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  fullWidth = false,
  className = '',
  disabled = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'danger':
        return 'bg-[#ff4d4d] text-white hover:bg-[#ff3333] active:bg-[#e60000]';
      case 'secondary':
        return 'bg-[#2d5da1] text-white hover:bg-[#244b82] active:bg-[#1b3a66]';
      case 'accent':
      case 'yellow':
        return 'bg-[#fff9c4] text-[#2d2d2d] hover:bg-[#fff59d] active:bg-[#fff176]';
      case 'outline':
        return 'bg-transparent text-[#2d2d2d] hover:bg-[#e5e0d8]/40';
      case 'primary':
      default:
        return 'bg-white text-[#2d2d2d] hover:bg-[#ff4d4d] hover:text-white';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm font-semibold gap-1.5 min-h-[38px]';
      case 'lg':
        return 'px-6 py-3.5 text-xl font-bold gap-3 min-h-[56px]';
      case 'md':
      default:
        return 'px-4 py-2.5 text-base font-bold gap-2 min-h-[48px]';
    }
  };

  return (
    <button
      disabled={disabled}
      className={`relative inline-flex items-center justify-center font-heading transition-all duration-150 border-[3px] border-[#2d2d2d] shadow-hand active:shadow-hand-active active:translate-x-1 active:translate-y-1 wobbly-btn cursor-pointer ${
        disabled ? 'opacity-50 cursor-not-allowed shadow-none translate-x-0 translate-y-0' : ''
      } ${fullWidth ? 'w-full' : ''} ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      {...props}
    >
      {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
