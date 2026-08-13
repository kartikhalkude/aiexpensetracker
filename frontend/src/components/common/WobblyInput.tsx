import React from 'react';

export interface WobblyInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const WobblyInput: React.FC<WobblyInputProps> = ({
  label,
  error,
  helperText,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label htmlFor={inputId} className="font-heading font-bold text-lg text-[#2d2d2d] flex items-center gap-1">
          {label}
        </label>
      )}
      <div className="relative flex items-center w-full">
        {icon && <div className="absolute left-3 text-[#2d2d2d] pointer-events-none z-10">{icon}</div>}
        <input
          id={inputId}
          className={`w-[#100%] w-full bg-white text-[#2d2d2d] font-body text-lg border-[3px] border-[#2d2d2d] wobbly-1 px-4 py-2.5 outline-none transition-colors placeholder:text-[#2d2d2d]/40 focus:border-[#2d5da1] focus:ring-2 focus:ring-[#2d5da1]/20 ${
            icon ? 'pl-10' : ''
          } ${error ? 'border-[#ff4d4d]' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <span className="text-[#ff4d4d] text-sm font-bold font-heading">{error}</span>}
      {helperText && !error && <span className="text-[#2d2d2d]/70 text-sm">{helperText}</span>}
    </div>
  );
};

export interface WobblySelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
  error?: string;
}

export const WobblySelect: React.FC<WobblySelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label htmlFor={selectId} className="font-heading font-bold text-lg text-[#2d2d2d]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full bg-white text-[#2d2d2d] font-body text-lg border-[3px] border-[#2d2d2d] wobbly-1 px-4 py-2.5 outline-none transition-colors focus:border-[#2d5da1] cursor-pointer ${
          error ? 'border-[#ff4d4d]' : ''
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[#ff4d4d] text-sm font-bold font-heading">{error}</span>}
    </div>
  );
};

export interface WobblyTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const WobblyTextArea: React.FC<WobblyTextAreaProps> = ({
  label,
  error,
  className = '',
  id,
  ...props
}) => {
  const areaId = id || (label ? `area-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className="flex flex-col gap-1 w-full text-left">
      {label && (
        <label htmlFor={areaId} className="font-heading font-bold text-lg text-[#2d2d2d]">
          {label}
        </label>
      )}
      <textarea
        id={areaId}
        rows={3}
        className={`w-full bg-white text-[#2d2d2d] font-body text-lg border-[3px] border-[#2d2d2d] wobbly-2 px-4 py-2.5 outline-none transition-colors placeholder:text-[#2d2d2d]/40 focus:border-[#2d5da1] ${
          error ? 'border-[#ff4d4d]' : ''
        } ${className}`}
        {...props}
      />
      {error && <span className="text-[#ff4d4d] text-sm font-bold font-heading">{error}</span>}
    </div>
  );
};
