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
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-full font-bold tracking-tight transition-all duration-200 cursor-pointer active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#FF5B1A]/15";
  
  const variants = {
    primary: "bg-[#FF5B1A] text-white shadow-[0_4px_12px_rgba(255,91,26,0.3)] hover:bg-[#ff6a30] hover:-translate-y-0.5",
    secondary: "bg-white text-[#FF5B1A] border border-[#E4BEB3] hover:border-[#FF5B1A] hover:-translate-y-0.5",
    ghost: "bg-transparent text-[#5B4138] hover:bg-[#FFF1ED]"
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
