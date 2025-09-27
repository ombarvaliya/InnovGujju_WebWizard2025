import React, { useState } from 'react';

interface PasswordInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  autoComplete?: string;
}

// Custom CSS properties type to allow WebkitTextSecurity
interface CustomCSSProperties extends React.CSSProperties {
  WebkitTextSecurity?: 'disc' | 'circle' | 'square' | 'none';
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  name,
  id,
  required = false,
  autoComplete = 'current-password',
}) => {
  const [showPassword, setShowPassword] = useState(false);
  
  const inputId = id || name || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1" htmlFor={inputId}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          id={inputId}
          name={name || inputId}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="w-full px-4 py-2 border border-neutral-mid/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-neutral-dark dark:border-neutral-dark-lighter [color-scheme:dark]"
          style={{ 
            // Cast to CustomCSSProperties to allow WebkitTextSecurity
            WebkitTextSecurity: !showPassword ? 'disc' : 'none',
            // Make password dots darker
            textShadow: !showPassword ? '0 0 0 #000' : 'none'
          } as CustomCSSProperties}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-dark/70 dark:text-neutral-light/70 hover:text-primary transition-colors"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput; 