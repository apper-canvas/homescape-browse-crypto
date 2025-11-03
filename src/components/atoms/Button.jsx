import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  disabled = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-accent to-yellow-500 hover:from-yellow-500 hover:to-accent text-white shadow-md hover:shadow-lg focus:ring-accent",
    secondary: "bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white shadow-md hover:shadow-lg focus:ring-primary",
    outline: "border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary",
    ghost: "text-primary hover:bg-primary hover:bg-opacity-10 focus:ring-primary",
    danger: "bg-gradient-to-r from-error to-red-600 hover:from-red-600 hover:to-error text-white shadow-md hover:shadow-lg focus:ring-error"
  };
  
  const sizes = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        disabled && "transform-none",
        className
      )}
      ref={ref}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;