import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold ring-offset-background transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 relative overflow-hidden group/btn",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-primary via-gold-light to-primary bg-[length:200%_100%] text-primary-foreground shadow-gold-soft hover:shadow-gold hover:bg-[position:100%_0] active:scale-[0.98] border border-gold-light/20 hover:-translate-y-0.5",
        destructive: 
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.98] hover:-translate-y-0.5",
        outline: 
          "border-2 border-primary/50 bg-transparent text-primary hover:bg-primary/10 hover:border-primary hover:shadow-gold-soft active:scale-[0.98] backdrop-blur-sm hover:-translate-y-0.5",
        secondary: 
          "bg-secondary text-secondary-foreground border border-border/50 hover:bg-secondary/80 hover:border-primary/30 active:scale-[0.98] hover:-translate-y-0.5",
        ghost: 
          "hover:bg-primary/10 hover:text-primary active:scale-[0.98]",
        link: 
          "text-primary underline-offset-4 hover:underline decoration-primary/50 hover:decoration-primary",
        premium:
          "bg-gradient-to-r from-gold-dark via-primary to-gold-light bg-[length:200%_100%] text-primary-foreground shadow-gold hover:shadow-gold-intense hover:bg-[position:100%_0] active:scale-[0.98] border border-gold-light/30 hover:-translate-y-0.5",
        glass:
          "bg-card/50 backdrop-blur-xl border border-border/50 text-foreground hover:bg-card/70 hover:border-primary/30 hover:shadow-gold-soft active:scale-[0.98] hover:-translate-y-0.5",
      },
      size: {
        default: "h-11 px-6 py-2.5 rounded-xl",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-12 rounded-xl px-8 py-3 text-base",
        xl: "h-14 rounded-2xl px-10 py-4 text-lg font-semibold",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shimmer?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, shimmer = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp 
        className={cn(buttonVariants({ variant, size, className }))} 
        ref={ref} 
        {...props}
      >
        {/* Shimmer effect overlay */}
        {shimmer && (
          <span className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        )}
        {props.children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
