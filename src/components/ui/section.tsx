import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  variant?: "default" | "dark" | "gradient" | "gold";
  spacing?: "default" | "lg" | "xl";
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
    xl: "py-28 md:py-40"
  };

  const variantStyles = {
    default: "bg-background",
    dark: "bg-card/50 relative before:absolute before:inset-0 before:bg-gradient-to-b before:from-background/50 before:to-transparent before:pointer-events-none",
    gradient: "bg-gradient-to-b from-background via-card/30 to-background relative overflow-hidden",
    gold: "bg-gradient-to-b from-primary/5 via-background to-background relative overflow-hidden"
  };

  return (
    <section 
      id={id} 
      className={cn(spacingStyles[spacing], variantStyles[variant], "relative", className)}
    >
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
