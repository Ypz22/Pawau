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
            w-full px-4 py-3 rounded-full bg-[#FFF3E6] border-2 border-[#E6D8CA]
            text-brand-charcoal placeholder-brand-charcoal/40
            transition-all duration-300 outline-none
            focus:border-brand-primary focus:shadow-[0_0_15px_rgba(255,91,26,0.15)]
            ${error ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_15px_rgba(255,0,0,0.15)]' : ''}
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
