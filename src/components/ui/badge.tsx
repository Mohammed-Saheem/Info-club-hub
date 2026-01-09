import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/90 shadow-gold-soft",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-border/50 text-foreground hover:border-primary/30 hover:bg-primary/5",
        premium: "border-primary/30 bg-gradient-to-r from-primary/15 to-primary/5 text-primary backdrop-blur-sm hover:border-primary/50 hover:shadow-gold-soft",
        gold: "border-transparent bg-gradient-to-r from-primary to-gold-light text-primary-foreground shadow-gold-soft hover:shadow-gold",
        glass: "border-border/30 bg-card/50 backdrop-blur-xl text-foreground hover:bg-card/70",
        success: "border-transparent bg-green-500/20 text-green-400 hover:bg-green-500/30",
        warning: "border-transparent bg-amber-500/20 text-amber-400 hover:bg-amber-500/30",
        info: "border-transparent bg-blue-500/20 text-blue-400 hover:bg-blue-500/30",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1 text-xs",
        lg: "px-4 py-1.5 text-sm",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {
  animated?: boolean;
  pulse?: boolean;
}

function Badge({ className, variant, size, animated, pulse, ...props }: BadgeProps) {
  const badgeContent = (
    <div className={cn(
      badgeVariants({ variant, size }), 
      pulse && "relative",
      className
    )} {...props}>
      {pulse && (
        <span className="absolute -left-0.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-current animate-pulse-soft" />
      )}
      {pulse && <span className="pl-2">{props.children}</span>}
      {!pulse && props.children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {badgeContent}
      </motion.div>
    );
  }

  return badgeContent;
}

// Animated badge with live indicator
function LiveBadge({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(
      "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
      "bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/25",
      "backdrop-blur-sm text-sm font-semibold text-primary",
      className
    )}>
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
      </span>
      {children}
    </div>
  );
}

// Count badge for notifications
function CountBadge({ count, className }: { count: number; className?: string }) {
  return (
    <motion.div
      key={count}
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full",
        "bg-destructive text-destructive-foreground text-xs font-bold",
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </motion.div>
  );
}

export { Badge, badgeVariants, LiveBadge, CountBadge };
