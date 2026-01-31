import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed button-hover-scale';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary: 'bg-athletic-blue text-white hover:bg-blue-600 focus:ring-blue-500 active:bg-blue-700',
    outline: 'border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50 focus:ring-primary-500 active:bg-primary-100'
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  const spinnerColor = variant === 'outline' ? 'primary' : 'white';
  const spinnerSize = size === 'lg' ? 'md' : 'sm';
  
  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      <div className="flex items-center justify-center">
        {loading && (
          <div className="mr-2 transition-all duration-200 ease-in-out">
            <LoadingSpinner size={spinnerSize} color={spinnerColor} />
          </div>
        )}
        <span className={`transition-all duration-200 ease-in-out ${loading ? 'opacity-75' : 'opacity-100'}`}>
          {children}
        </span>
      </div>
    </button>
  );
};

export default Button;