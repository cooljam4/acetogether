import { HTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  isActive?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, hoverEffect = true, isActive = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={clsx(
          'bg-primary-light rounded-lg p-6 shadow-md transition-all duration-300',
          {
            'hover:shadow-lg hover:scale-[1.01] cursor-pointer': hoverEffect,
            'border-2 border-accent': isActive,
            'border border-primary-light': !isActive,
          },
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;