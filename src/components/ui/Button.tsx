import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    fullWidth = false,
    disabled,
    ...props 
  }, ref) => {
    return (
      <button
        className={clsx(
          'relative inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          {
            'bg-accent text-primary-dark hover:bg-accent-light': variant === 'primary',
            'bg-primary-light text-white border border-accent hover:bg-primary-dark': variant === 'secondary',
            'border border-accent text-accent hover:bg-accent hover:text-primary-dark': variant === 'outline',
            'text-accent hover:bg-primary-light hover:text-accent-light': variant === 'ghost',
            'px-3 py-1 text-sm': size === 'sm',
            'px-4 py-2': size === 'md',
            'px-6 py-3 text-lg': size === 'lg',
            'w-full': fullWidth,
            'opacity-50 cursor-not-allowed pointer-events-none': disabled || isLoading,
          },
          className
        )}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        {isLoading && (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;