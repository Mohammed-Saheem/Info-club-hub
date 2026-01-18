import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "dark" | "gradient" | "gold" | "hero" | "grey";
  spacing?: "default" | "lg" | "xl" | "hero";
}

export function Section({ 
  children, 
  className = "", 
  id,
  variant = "default",
  spacing = "default"
}: SectionProps) {
  const spacingStyles = {
    default: "py-20 md:py-28",
    lg: "py-24 md:py-32",
    xl: "py-28 md:py-40",
    hero: "pt-28 pb-20 md:pt-36 md:pb-28"
  };

  const variantStyles = {
    // Pure black background
    default: "bg-[hsl(220,15%,4%)]",
    // Slightly elevated dark (for alternating)
    dark: "bg-[hsl(220,15%,4%)]",
    // Grey section (for alternating with dark)
    grey: "bg-[hsl(220,12%,8%)]",
    // Gradient background
    gradient: "bg-gradient-to-b from-[hsl(220,15%,4%)] via-[hsl(220,12%,7%)] to-[hsl(220,15%,4%)]",
    // Gold accent section
    gold: "bg-[hsl(220,15%,4%)] relative overflow-hidden before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(43,65%,56%,0.12),transparent_60%)] before:pointer-events-none",
    // Hero section with gold gradient from left to black on right
    hero: "relative overflow-hidden bg-gradient-to-r from-[hsl(43,65%,56%,0.08)] via-[hsl(220,15%,5%)] to-[hsl(220,15%,4%)]"
  };

  return (
    <section 
      id={id} 
      className={cn(spacingStyles[spacing], variantStyles[variant], "relative", className)}
    >
      {/* Add subtle top highlight for hero */}
      {variant === "hero" && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_0%_0%,hsl(43,65%,56%,0.15),transparent_50%)] pointer-events-none" />
      )}
      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        {children}
      </div>
    </section>
  );
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeader({ 
  title, 
  subtitle, 
  badge,
  centered = true,
  className 
}: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={cn(
        "mb-16",
        centered && "text-center",
        className
      )}
    >
      {badge && (
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-soft" />
          {badge}
        </motion.span>
      )}
      
      <h2 className={cn(
        "font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6",
        "leading-[1.15] tracking-tight"
      )}>
        {title}
      </h2>
      
      {subtitle && (
        <p className={cn(
          "text-muted-foreground text-lg md:text-xl leading-relaxed",
          centered && "max-w-2xl mx-auto"
        )}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

// Divider component for section separation
interface SectionDividerProps {
  variant?: "line" | "gold" | "fade" | "dots";
  className?: string;
}

export function SectionDivider({ variant = "gold", className }: SectionDividerProps) {
  const variants = {
    line: "h-px bg-border",
    gold: "h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent",
    fade: "h-px bg-gradient-to-r from-transparent via-border to-transparent",
    dots: "flex items-center justify-center gap-2"
  };

  if (variant === "dots") {
    return (
      <div className={cn("py-8", className)}>
        <div className={variants[variant]}>
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <span className="w-2 h-2 rounded-full bg-primary/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("py-8", className)}>
      <div className={cn("w-full max-w-xl mx-auto", variants[variant])} />
    </div>
  );
}
