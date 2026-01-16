import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export function FloatingParticles({ count = 20, className }: FloatingParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5, // Smaller, subtler particles
      duration: Math.random() * 30 + 25, // Slower movement
      delay: Math.random() * 8,
    }));
    setParticles(newParticles);
  }, [count]);

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-primary/10" // Softer opacity
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [-10, 10, -10], // Smaller movement range
            x: [-5, 5, -5],
            opacity: [0.1, 0.3, 0.1], // Much softer opacity range
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated grid pattern background
export function GridPattern({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="hsl(var(--primary) / 0.05)"
              strokeWidth="1"
            />
          </pattern>
          <linearGradient id="fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id="gridMask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" mask="url(#gridMask)" />
      </svg>
    </div>
  );
}

// Animated spotlight effect
export function Spotlight({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        animate={{
          x: ["-20%", "120%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeInOut",
        }}
        className="absolute top-0 left-0 w-[40%] h-full bg-gradient-to-r from-transparent via-primary/10 to-transparent skew-x-12"
      />
    </div>
  );
}

// Floating orbs with glow - refined and subtle
export function GlowingOrbs({ className }: { className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 right-1/4 w-80 h-80 bg-primary/[0.04] rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, -10, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
        className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-primary/[0.03] rounded-full blur-[80px]"
      />
      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 6,
        }}
        className="absolute top-1/2 left-1/2 w-96 h-96 bg-gold-dark/[0.02] rounded-full blur-[120px]"
      />
    </div>
  );
}

// Animated noise texture
export function AnimatedNoise({ className }: { className?: string }) {
  return (
    <div 
      className={cn("absolute inset-0 pointer-events-none opacity-[0.015]", className)}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    >
      <motion.div
        animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="w-full h-full"
      />
    </div>
  );
}

// Meteor shower effect
export function MeteorShower({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-[2px] bg-gradient-to-b from-primary/80 to-transparent"
          style={{
            left: `${Math.random() * 100}%`,
            top: "-20px",
            height: `${Math.random() * 80 + 40}px`,
            rotate: "45deg",
          }}
          animate={{
            y: ["0vh", "120vh"],
            x: ["0vw", "20vw"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: Math.random() * 2 + 1,
            repeat: Infinity,
            repeatDelay: Math.random() * 10 + 5,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}
