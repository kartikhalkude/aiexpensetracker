import React from 'react';

export const TapeStrip: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = 'rgba(229, 224, 216, 0.75)',
}) => (
  <div
    className={`absolute h-5 w-24 z-10 pointer-events-none ${className}`}
    style={{
      backgroundColor: color,
      border: '1px dashed rgba(45, 45, 45, 0.2)',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      transform: 'rotate(-2deg)',
      borderRadius: 0,
    }}
  />
);

export const ThumbTack: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#ff4d4d',
}) => (
  <div className={`absolute z-20 pointer-events-none flex items-center justify-center ${className}`}>
    <div
      className="w-5 h-5 border-2 border-[#2d2d2d] shadow-sm flex items-center justify-center"
      style={{ backgroundColor: color, borderRadius: 0 }}
    >
      <div className="w-1.5 h-1.5 bg-white opacity-80" />
    </div>
  </div>
);

export const ScribbleUnderline: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#ff4d4d',
}) => (
  <svg
    viewBox="0 0 200 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-3 pointer-events-none ${className}`}
    preserveAspectRatio="none"
  >
    <path
      d="M3 14C50 4 100 18 197 8"
      stroke={color}
      strokeWidth="3.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ScribbleCircle: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#2d5da1',
}) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
  >
    <path
      d="M15 50C12 25 35 10 60 12C85 14 92 38 88 62C84 86 58 92 32 88C12 84 8 60 15 50Z"
      stroke={color}
      strokeWidth="2.5"
      strokeDasharray="4 2"
      strokeLinecap="round"
    />
  </svg>
);

export const HandDrawnArrow: React.FC<{ className?: string; color?: string }> = ({
  className = '',
  color = '#ff4d4d',
}) => (
  <svg
    viewBox="0 0 80 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-16 h-8 pointer-events-none ${className}`}
  >
    <path
      d="M5 20 C25 5, 45 35, 70 15 M60 8 L72 16 L65 28"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const StickyTag: React.FC<{
  text: string;
  color?: string;
  className?: string;
}> = ({ text, color = '#fff9c4', className = '' }) => (
  <span
    className={`inline-block px-2.5 py-1 text-xs font-bold border-2 border-[#2d2d2d] shadow-hand-sm font-heading ${className}`}
    style={{ backgroundColor: color, borderRadius: 0 }}
  >
    {text}
  </span>
);
