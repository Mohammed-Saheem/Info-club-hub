import * as React from "react";

import { cn } from "@/lib/utils";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-2xl border bg-gradient-to-b from-card to-card/80 text-card-foreground",
      "shadow-card backdrop-blur-sm",
      "border-border/50 hover:border-primary/20",
      "transition-all duration-300 ease-out",
      "hover:shadow-card-hover hover:-translate-y-1",
      "relative overflow-hidden",
      // Subtle inner glow
      "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-300",
      "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
      "hover:before:opacity-100",
      className
    )} 
    {...props} 
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2 p-6 pb-4 relative z-10", className)} {...props} />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn(
      "text-2xl font-bold leading-tight tracking-tight font-heading",
      "bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text",
      className
    )} {...props} />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground leading-relaxed", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-6 pt-0 relative z-10", className)} {...props} />,
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-4 relative z-10", className)} {...props} />
  ),
);
CardFooter.displayName = "CardFooter";

// Premium Card Variant
const PremiumCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-2xl border text-card-foreground relative overflow-hidden",
      "bg-gradient-to-br from-card via-card to-card/90",
      "border-primary/10 hover:border-primary/30",
      "shadow-card hover:shadow-gold-soft",
      "transition-all duration-500 ease-out",
      "hover:-translate-y-2",
      // Glass overlay
      "backdrop-blur-xl",
      // Gold accent line
      "before:absolute before:inset-x-0 before:top-0 before:h-px",
      "before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent",
      // Glow effect
      "after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition-opacity after:duration-500",
      "after:bg-gradient-to-b after:from-primary/5 after:via-transparent after:to-transparent",
      "hover:after:opacity-100",
      className
    )} 
    {...props} 
  />
));
PremiumCard.displayName = "PremiumCard";

// Glass Card Variant
const GlassCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div 
    ref={ref} 
    className={cn(
      "rounded-2xl border text-card-foreground relative overflow-hidden",
      "bg-card/40 backdrop-blur-2xl",
      "border-border/30 hover:border-primary/20",
      "shadow-lg shadow-black/20",
      "transition-all duration-300 ease-out",
      className
    )} 
    {...props} 
  />
));
GlassCard.displayName = "GlassCard";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, PremiumCard, GlassCard };
