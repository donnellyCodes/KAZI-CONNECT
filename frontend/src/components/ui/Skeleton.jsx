import React from 'react';

const Skeleton = React.forwardRef(({
  className = '',
  variant = 'default',
  ...props
}, ref) => {
  const variantClasses = {
    default: 'h-4 w-full',
    text: 'h-4 w-full',
    circular: 'h-12 w-12 rounded-full',
    rectangular: 'h-24 w-full',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-20',
    input: 'h-10 w-full',
  };

  const baseClasses = 'animate-pulse rounded-md bg-gray-200';
  const variantClass = variantClasses[variant] || variantClasses.default;
  
  const classes = `${baseClasses} ${variantClass} ${className}`;

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

export default Skeleton;
