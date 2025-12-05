import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'gradient';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  icon,
  className = '',
  disabled,
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E1E1E]";
  
  const variants = {
    primary: "bg-accent-primary hover:bg-accent-hover text-white focus:ring-accent-primary",
    secondary: "border border-[#7C4DFF] text-[#7C4DFF] hover:bg-[#7C4DFF]/10 focus:ring-accent-primary",
    danger: "bg-transparent border border-danger text-danger hover:bg-danger/10 focus:ring-danger",
    gradient: "bg-gradient-to-r from-[#7C4DFF] to-[#651FFF] hover:from-[#651FFF] hover:to-[#5E35B1] text-white shadow-lg shadow-accent-primary/20",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;