import React from 'react';

const cardVariants = {
  variant: {
    default: 'border border-gray-200 bg-white shadow-sm',
    elevated: 'border-0 bg-white shadow-lg',
    outlined: 'border-2 border-gray-200 bg-white',
    ghost: 'border-0 bg-gray-50',
  },
  padding: {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },
  rounded: {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-lg',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  },
};

const Card = React.forwardRef(({
  className = '',
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  children,
  hover = false,
  ...props
}, ref) => {
  const baseClasses = 'transition-all duration-200';
  const variantClasses = cardVariants.variant[variant];
  const paddingClasses = cardVariants.padding[padding];
  const roundedClasses = cardVariants.rounded[rounded];
  const hoverClasses = hover ? 'hover:shadow-md hover:border-gray-300' : '';
  
  const classes = `${baseClasses} ${variantClasses} ${paddingClasses} ${roundedClasses} ${hoverClasses} ${className}`;

  return (
    <div
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </div>
  );
});

const CardHeader = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex flex-col space-y-1.5 pb-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardTitle = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <h3
      ref={ref}
      className={`text-2xl font-semibold leading-none tracking-tight text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </h3>
  );
});

const CardDescription = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <p
      ref={ref}
      className={`text-sm text-gray-600 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
});

const CardContent = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`pt-0 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

const CardFooter = React.forwardRef(({
  className = '',
  children,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={`flex items-center pt-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';
CardHeader.displayName = 'CardHeader';
CardTitle.displayName = 'CardTitle';
CardDescription.displayName = 'CardDescription';
CardContent.displayName = 'CardContent';
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
export default Card;
