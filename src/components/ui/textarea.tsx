import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  charCount?: boolean;
  maxLength?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, charCount, maxLength, onChange, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [count, setCount] = React.useState(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <div className="relative w-full">
        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-xl border-2 bg-card/50 backdrop-blur-sm",
            "px-4 py-3 text-base text-foreground leading-relaxed",
            "ring-offset-background transition-all duration-300 ease-out",
            "placeholder:text-muted-foreground/60",
            "hover:border-primary/30 hover:bg-card/70",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:ring-offset-0",
            "focus-visible:border-primary/50 focus-visible:bg-card/80",
            "focus-visible:shadow-[0_0_20px_hsl(43,74%,49%,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "resize-none md:text-sm",
            error ? "border-destructive/50 focus-visible:border-destructive" : "border-border/50",
            className,
          )}
          ref={ref}
          maxLength={maxLength}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChange={handleChange}
          {...props}
        />
        
        {/* Focus line animation */}
        <motion.div
          initial={false}
          animate={{
            scaleX: isFocused ? 1 : 0,
            opacity: isFocused ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-16px)] h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent origin-center rounded-full"
        />
        
        <div className="flex justify-between items-center mt-1.5">
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-destructive"
            >
              {error}
            </motion.p>
          )}
          {charCount && maxLength && (
            <p className={cn(
              "text-xs ml-auto",
              count >= maxLength ? "text-destructive" : "text-muted-foreground"
            )}>
              {count}/{maxLength}
            </p>
          )}
        </div>
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
