import React from 'react';
import { StickyTag, TapeStrip, ThumbTack } from './ScribbleDecorations';

export interface WobblyCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'paper' | 'postit' | 'muted' | 'white' | 'red' | 'blue' | 'green';
  decoration?: 'tape' | 'tack' | 'none';
  rotation?: 'left' | 'right' | 'slight-left' | 'slight-right' | 'none';
  shadow?: 'standard' | 'large' | 'small' | 'none';
  wobblyStyle?: 'wobbly-1' | 'wobbly-2' | 'wobbly-3';
  tag?: string;
  className?: string;
  hoverJiggle?: boolean;
}

export const WobblyCard: React.FC<WobblyCardProps> = ({
  children,
  variant = 'paper',
  decoration = 'none',
  rotation = 'none',
  shadow = 'standard',
  wobblyStyle = 'wobbly-1',
  tag,
  className = '',
  hoverJiggle = false,
  ...props
}) => {
  const getBgColor = () => {
    switch (variant) {
      case 'postit':
        return 'bg-[#fff9c4]';
      case 'muted':
        return 'bg-[#e5e0d8]';
      case 'white':
        return 'bg-white';
      case 'red':
        return 'bg-[#ffebee]';
      case 'blue':
        return 'bg-[#e3f2fd]';
      case 'green':
        return 'bg-[#e8f5e9]';
      case 'paper':
      default:
        return 'bg-[#ffffff]';
    }
  };

  const getRotationClass = () => {
    switch (rotation) {
      case 'left':
        return '-rotate-2';
      case 'right':
        return 'rotate-2';
      case 'slight-left':
        return '-rotate-1';
      case 'slight-right':
        return 'rotate-1';
      case 'none':
      default:
        return '';
    }
  };

  const getShadowClass = () => {
    switch (shadow) {
      case 'large':
        return 'shadow-hand-lg';
      case 'small':
        return 'shadow-hand-sm';
      case 'none':
        return '';
      case 'standard':
      default:
        return 'shadow-hand';
    }
  };

  return (
    <div
      className={`relative border-[3px] border-[#2d2d2d] transition-transform duration-200 ${getBgColor()} ${wobblyStyle} ${getRotationClass()} ${getShadowClass()} ${
        hoverJiggle ? 'hover:rotate-1 hover:-translate-y-1' : ''
      } ${className}`}
      {...props}
    >
      {decoration === 'tape' && <TapeStrip className="-top-3 left-1/2 -translate-x-1/2" />}
      {decoration === 'tack' && <ThumbTack className="-top-2.5 left-1/2 -translate-x-1/2" />}
      {tag && (
        <div className="absolute -top-3.5 right-4">
          <StickyTag text={tag} />
        </div>
      )}
      {children}
    </div>
  );
};
