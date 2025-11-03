import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default",
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-lg transition-colors duration-200",
    outline: "border border-slate-600 text-slate-200 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:border-primary-500 hover:text-primary-400"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    default: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button
      className={cn(variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;