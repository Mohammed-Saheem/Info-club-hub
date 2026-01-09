import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-xl bg-gradient-to-r from-muted via-muted/70 to-muted",
        "bg-[length:200%_100%] animate-shimmer",
        "relative overflow-hidden",
        className
      )} 
      {...props} 
    />
  );
}

// Premium skeleton with shimmer effect
function SkeletonCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        "rounded-2xl border border-border/50 bg-card/50",
        "relative overflow-hidden",
        className
      )} 
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-primary/5 to-transparent" />
      {props.children}
    </div>
  );
}

// Text skeleton with varying widths
function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  const widths = ["100%", "85%", "70%", "90%", "60%"];
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-4" 
          style={{ width: widths[i % widths.length] }} 
        />
      ))}
    </div>
  );
}

// Avatar skeleton
function SkeletonAvatar({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizes = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16"
  };
  return <Skeleton className={cn("rounded-full", sizes[size], className)} />;
}

// Button skeleton
function SkeletonButton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <Skeleton className={cn("h-11 w-32 rounded-xl", className)} {...props} />;
}

export { Skeleton, SkeletonCard, SkeletonText, SkeletonAvatar, SkeletonButton };
