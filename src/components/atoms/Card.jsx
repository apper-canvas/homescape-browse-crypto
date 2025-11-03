import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  hover = true,
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "bg-surface rounded-xl shadow-md border border-gray-100 transition-all duration-300",
        hover && "hover:shadow-xl hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;