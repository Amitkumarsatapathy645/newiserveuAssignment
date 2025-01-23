import React from 'react';

export const Alert = ({ children, className = '', variant = 'default', ...props }) => {
  const baseStyles = 'relative w-full rounded-lg border p-4 my-2';
  const variantStyles = {
    default: 'bg-background text-foreground',
    destructive: 'border-red-500 text-red-600 bg-red-50',
    success: 'border-green-500 text-green-600 bg-green-50',
  };

  return (
    <div
      role="alert"
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const AlertTitle = ({ children, className = '', ...props }) => (
  <h5 className={`mb-1 font-medium leading-none tracking-tight ${className}`} {...props}>
    {children}
  </h5>
);

export const AlertDescription = ({ children, className = '', ...props }) => (
  <div className={`text-sm [&_p]:leading-relaxed ${className}`} {...props}>
    {children}
  </div>
);