import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Skeleton, SkeletonText, SkeletonAvatar } from "./skeleton";

interface EventCardSkeletonProps {
  className?: string;
}

export function EventCardSkeleton({ className }: EventCardSkeletonProps) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/50 overflow-hidden", className)}>
      {/* Image placeholder */}
      <Skeleton className="aspect-[16/10] rounded-none" />
      
      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-5 w-16 rounded-lg" />
          <Skeleton className="h-5 w-24 rounded-lg" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <SkeletonText lines={2} />
      </div>
    </div>
  );
}

export function ProjectCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/50 p-6", className)}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1 space-y-3">
          <Skeleton className="h-6 w-48" />
          <SkeletonText lines={2} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-10 rounded-xl" />
            <Skeleton className="h-10 w-10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function TeamMemberSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/50 p-6 text-center", className)}>
      <SkeletonAvatar size="lg" className="mx-auto mb-4" />
      <Skeleton className="h-5 w-32 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto mb-4" />
      <div className="flex justify-center gap-2">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-lg" />
      </div>
    </div>
  );
}

export function GalleryImageSkeleton({ className }: { className?: string }) {
  return (
    <Skeleton className={cn("aspect-square rounded-2xl", className)} />
  );
}

export function StatsCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-border/50 bg-card/50 p-6 text-center", className)}>
      <Skeleton className="h-12 w-20 mx-auto mb-2" />
      <Skeleton className="h-4 w-24 mx-auto" />
    </div>
  );
}

// Full page loading skeleton
export function PageSkeleton() {
  return (
    <div className="container mx-auto px-6 lg:px-8 py-28">
      {/* Hero */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <Skeleton className="h-8 w-32 mx-auto mb-6 rounded-full" />
        <Skeleton className="h-14 w-96 mx-auto mb-4" />
        <SkeletonText lines={2} className="max-w-lg mx-auto" />
      </div>
      
      {/* Content grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <EventCardSkeleton />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
