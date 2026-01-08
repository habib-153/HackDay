"use client";

import { cn } from "@/lib/utils";
import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type = "text", id, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            type={type}
            className={cn(
              "w-full h-10 px-3 rounded-md border border-slate-200 bg-white",
              "text-slate-900 placeholder:text-slate-400 text-sm",
              "transition-colors duration-150",
              "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
              "hover:border-slate-300",
              icon && "pl-9",
              error && "border-red-400 focus:ring-red-400/20 focus:border-red-400",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
