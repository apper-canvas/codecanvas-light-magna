import React from "react";
import { cn } from "@/utils/cn";

const Avatar = React.forwardRef(({ className, src, alt, size = "default", ...props }, ref) => {
  const sizes = {
    sm: "w-6 h-6",
    default: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  return (
    <div
      className={cn(
        "rounded-full bg-slate-600 flex items-center justify-center overflow-hidden",
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-slate-300 font-medium text-sm">
          {alt?.charAt(0)?.toUpperCase() || "U"}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;