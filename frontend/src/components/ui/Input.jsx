import React from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const inputVariants = {
  variant: {
    default: 'border-gray-300 focus:border-primary-500 focus:ring-primary-500',
    error: 'border-error-300 focus:border-error-500 focus:ring-error-500',
    success: 'border-success-300 focus:border-success-500 focus:ring-success-500',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  },
};

const Input = React.forwardRef(({
  className = '',
  variant = 'default',
  size = 'md',
  error,
  success,
  label,
  helperText,
  required = false,
  type = 'text',
  showPasswordToggle = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const baseClasses = 'w-full border rounded-lg transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = inputVariants.variant[error ? 'error' : success ? 'success' : variant];
  const sizeClasses = inputVariants.size[size];
  
  const classes = `${baseClasses} ${variantClasses} ${sizeClasses} ${className}`;

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const renderPasswordToggle = () => {
    if (type !== 'password' || !showPasswordToggle) return null;

    return (
      <button
        type="button"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    );
  };

  const renderIcon = () => {
    if (error) {
      return <AlertCircle className="text-error-500" size={20} />;
    }
    return null;
  };

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          type={inputType}
          className={`${classes} ${error || success ? 'pr-10' : ''}`}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {renderPasswordToggle()}
        
        {(error || success) && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {renderIcon()}
          </div>
        )}
      </div>

      {helperText && (
        <p className={`text-sm ${error ? 'text-error-600' : success ? 'text-success-600' : 'text-gray-500'}`}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
