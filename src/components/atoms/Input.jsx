import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text", 
  placeholder,
  label,
  error,
  ...props 
}, ref) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "w-full px-4 py-3 bg-background border border-gray-300 rounded-xl text-primary placeholder-gray-500 transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent",
          "hover:border-gray-400",
          error && "border-error focus:ring-error focus:border-error",
          className
        )}
        placeholder={placeholder}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;