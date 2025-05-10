import { forwardRef, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, fullWidth = true, ...props }, ref) => {
    return (
      <div className={clsx('mb-4', { 'w-full': fullWidth })}>
        {label && (
          <label htmlFor={props.id} className="block text-sm font-medium mb-1 text-gray-200">
            {label}
          </label>
        )}
        <input
          className={clsx(
            'bg-primary border rounded-md px-4 py-2 text-white transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent',
            {
              'border-primary-light': !error,
              'border-error': error,
              'w-full': fullWidth,
            },
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;