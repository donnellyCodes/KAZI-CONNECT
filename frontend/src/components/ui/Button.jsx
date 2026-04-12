import React from 'react';
import { Loader2 } from 'lucide-react';

const buttonVariants = {
  variant: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    outline: 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-primary-500',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
    danger: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
};

const Button = React.forwardRef(({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = buttonVariants.variant[variant];
  const sizeClasses = buttonVariants.size[size];
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const renderIcon = () => {
    if (loading) {
      return <Loader2 className="animate-spin" size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} />;
    }
    if (icon) {
      return icon;
    }
    return null;
  };

  const iconElement = renderIcon();
  const showIcon = iconElement && (loading || icon);

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {showIcon && iconPosition === 'left' && (
        <span className={children ? 'mr-2' : ''}>
          {iconElement}
        </span>
      )}
      {children}
      {showIcon && iconPosition === 'right' && (
        <span className={children ? 'ml-2' : ''}>
          {iconElement}
        </span>
      )}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
