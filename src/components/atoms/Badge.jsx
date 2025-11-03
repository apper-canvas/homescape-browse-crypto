import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-gray-100 text-gray-800",
    primary: "bg-gradient-to-r from-primary to-secondary text-white",
    accent: "bg-gradient-to-r from-accent to-yellow-500 text-white",
    success: "bg-gradient-to-r from-success to-green-500 text-white",
    warning: "bg-gradient-to-r from-warning to-orange-500 text-white",
    error: "bg-gradient-to-r from-error to-red-600 text-white"
  };
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium shadow-sm",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;