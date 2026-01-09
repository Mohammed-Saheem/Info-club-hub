import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, error, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);

    return (
      <div className="relative w-full overflow-hidden rounded-xl">
        {icon && (
          <div className={cn(
            "absolute left-4 top-1/2 -translate-y-1/2 transition-colors duration-300 z-10",
            isFocused ? "text-primary" : "text-muted-foreground/60"
          )}>
            {icon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-12 w-full rounded-xl border-2 bg-card/50 backdrop-blur-sm",
            "px-4 py-3 text-base text-foreground",
            "ring-offset-background transition-all duration-300 ease-out",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
            "placeholder:text-muted-foreground/60",
            "hover:border-primary/30 hover:bg-card/70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
            "focus-visible:border-primary/50 focus-visible:bg-card/80",
            "focus-visible:shadow-[0_0_20px_hsl(43,74%,49%,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "md:text-sm",
            icon ? "pl-12" : "",
            error ? "border-destructive/50 focus-visible:border-destructive focus-visible:ring-destructive/20" : "border-border/50",
            className,
          )}
          ref={ref}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
