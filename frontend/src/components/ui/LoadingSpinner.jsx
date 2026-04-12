import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = React.forwardRef(({
  className = '',
  size = 'md',
  text,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  return (
    <div
      ref={ref}
      className={`flex items-center justify-center ${className}`}
      {...props}
    >
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && (
        <span className={`ml-2 text-gray-600 ${textSizes[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
