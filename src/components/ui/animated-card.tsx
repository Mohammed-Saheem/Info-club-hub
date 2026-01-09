import { motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "default" | "premium" | "glass" | "minimal" | "interactive";
  hoverEffect?: boolean;
}

export function AnimatedCard({ 
  children, 
  className = "", 
  delay = 0,
  variant = "default",
  hoverEffect = true
}: AnimatedCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseStyles = "rounded-2xl overflow-hidden transition-all duration-500 ease-out";
  
  const variants = {
    default: cn(
      baseStyles,
      "bg-gradient-to-b from-card to-card/80 border border-border/50",
      hoverEffect && "hover:border-primary/30 hover:shadow-card-hover hover:-translate-y-2",
      "relative",
      // Inner glow effect
      "before:absolute before:inset-0 before:rounded-2xl before:opacity-0 before:transition-opacity before:duration-500",
      "before:bg-gradient-to-b before:from-primary/5 before:to-transparent",
      hoverEffect && "hover:before:opacity-100"
    ),
    premium: cn(
      baseStyles,
      "bg-gradient-to-br from-card via-card to-dark-elevated border border-primary/10",
      hoverEffect && "hover:border-primary/30 hover:shadow-gold-soft hover:-translate-y-2",
      "backdrop-blur-xl relative",
      // Gold accent line at top
      "before:absolute before:inset-x-0 before:top-0 before:h-px",
      "before:bg-gradient-to-r before:from-transparent before:via-primary/50 before:to-transparent",
      // Glow overlay on hover
      "after:absolute after:inset-0 after:rounded-2xl after:opacity-0 after:transition-opacity after:duration-500",
      "after:bg-gradient-to-b after:from-primary/8 after:via-transparent after:to-transparent",
      hoverEffect && "hover:after:opacity-100"
    ),
    glass: cn(
      baseStyles,
      "bg-card/40 backdrop-blur-2xl border border-border/30",
      hoverEffect && "hover:bg-card/60 hover:border-primary/20 hover:-translate-y-1",
      "shadow-lg shadow-black/10"
    ),
    minimal: cn(
      baseStyles,
      "bg-transparent border border-border/30",
      hoverEffect && "hover:bg-card/30 hover:border-primary/20 hover:-translate-y-1"
    ),
    interactive: cn(
      baseStyles,
      "bg-gradient-to-br from-card via-card to-card/90 border border-border/50",
      "backdrop-blur-xl relative cursor-pointer",
      hoverEffect && "hover:border-primary/40 hover:shadow-gold hover:-translate-y-3",
      // Animated border gradient
      "before:absolute before:inset-0 before:rounded-2xl before:p-[1px] before:opacity-0 before:transition-opacity before:duration-500",
      "before:bg-gradient-to-r before:from-primary/50 before:via-gold-light/50 before:to-primary/50",
      hoverEffect && "hover:before:opacity-100"
    )
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      whileHover={hoverEffect ? { scale: 1.01 } : undefined}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(variants[variant], className)}
    >
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle animated gradient border on hover */}
      {variant === "interactive" && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)",
            backgroundSize: "200% 100%",
            animation: "shimmer 2s infinite linear",
          }}
        />
      )}
    </motion.div>
  );
}

// Feature Card - for showcasing features with icon
interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export function FeatureCard({ icon: Icon, title, description, delay = 0, className }: FeatureCardProps) {
  return (
    <AnimatedCard delay={delay} variant="premium" className={cn("group p-8", className)}>
      <motion.div 
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:shadow-gold-soft transition-all duration-500"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Icon className="w-7 h-7 text-primary" />
      </motion.div>
      <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed">
        {description}
      </p>
    </AnimatedCard>
  );
}

// Stats Card - for displaying statistics
interface StatsCardProps {
  value: string;
  label: string;
  delay?: number;
  className?: string;
}

export function StatsCard({ value, label, delay = 0, className }: StatsCardProps) {
  return (
    <AnimatedCard delay={delay} variant="glass" className={cn("p-6 text-center group", className)}>
      <motion.div 
        className="font-heading text-4xl md:text-5xl font-bold text-gradient-gold mb-2"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {value}
      </motion.div>
      <div className="text-sm text-muted-foreground uppercase tracking-wider group-hover:text-primary/70 transition-colors duration-300">
        {label}
      </div>
    </AnimatedCard>
  );
}
