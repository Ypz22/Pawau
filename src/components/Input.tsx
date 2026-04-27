import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col w-full mb-4">
        {label && (
          <label className="mb-2 text-sm font-bold text-brand-charcoal tracking-wide">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full rounded-[1rem] border border-outline-variant bg-background px-4 py-3
            text-on-surface placeholder:text-on-surface-variant/55 outline-none
            transition-all duration-200 focus:border-primary-container focus:ring-4 focus:ring-primary-container/10
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : ''}
            ${className}
          `}
          {...props}
        />
        {hint && !error && <span className="mt-1 text-xs text-brand-charcoal/55 ml-4">{hint}</span>}
        {error && <span className="mt-1 text-xs font-bold text-red-500 ml-4">{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
