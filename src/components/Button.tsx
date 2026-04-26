import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  children: ReactNode;
  to?: string;
  className?: string;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  to, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-300 rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary active:scale-95";
  
  const variants = {
    primary: "bg-brand-primary text-white hover:bg-orange-600 hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(255,91,26,0.25)]",
    secondary: "bg-transparent text-brand-blue border-2 border-brand-blue hover:bg-brand-blue/5 hover:-translate-y-0.5",
    ghost: "bg-transparent text-brand-charcoal hover:bg-brand-charcoal/5"
  };

  const sizes = "px-6 py-3 text-sm md:text-base";

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClassName} {...props}>
      {children}
    </button>
  );
}
