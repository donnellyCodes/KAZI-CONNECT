import React from 'react';

const badgeVariants = {
  variant: {
    default: 'bg-primary-100 text-primary-800 border-primary-200',
    secondary: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-success-100 text-success-800 border-success-200',
    warning: 'bg-warning-100 text-warning-800 border-warning-200',
    error: 'bg-error-100 text-error-800 border-error-200',
    outline: 'border border-gray-300 text-gray-700 bg-white',
    admin: 'bg-red-100 text-red-800 border-red-200',
    worker: 'bg-blue-100 text-blue-800 border-blue-200',
    employer: 'bg-green-100 text-green-800 border-green-200',
  },
  size: {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  },
};

const Badge = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'md',
  children,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full border transition-all duration-200';
  const variantClasses = badgeVariants.variant[variant];
  const sizeClasses = badgeVariants.size[size];
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  return (
    <span
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
