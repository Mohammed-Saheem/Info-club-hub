import { ReactNode, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { CursorGlow } from "@/components/ui/cursor-glow";

interface PageLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
}

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

// Loading screen component
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      className="fixed inset-0 z-[200] bg-background flex items-center justify-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        {/* Pulsing glow */}
        <div className="absolute inset-0 bg-primary/30 rounded-3xl blur-3xl animate-glow-pulse" />
        
        {/* Logo */}
        <div className="relative w-24 h-24 rounded-3xl shadow-gold-intense overflow-hidden">
          <img 
            src="/INFOCLUB[1].jpg" 
            alt="INFO CLUB Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Loading bar */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-6 h-1 w-24 bg-gradient-to-r from-primary via-gold-light to-primary rounded-full origin-left"
        />
      </motion.div>
    </motion.div>
  );
}

export default function PageLayout({ children, showFooter = true }: PageLayoutProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    // Only show loading on first page load
    if (isFirstLoad) {
      setIsFirstLoad(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Loading screen for first visit */}
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      
      {/* Scroll progress indicator - moved to bottom, very subtle */}
      <ScrollProgress />
      
      {/* Cursor glow effect (desktop only) - refined */}
      <CursorGlow />
      
      {/* Background ambient effects - subtle and refined */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Cinematic top vignette */}
        <div className="absolute inset-x-0 top-0 h-[400px] bg-gradient-to-b from-background via-background/50 to-transparent" />
        {/* Very subtle ambient glow - top center */}
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/[0.02] rounded-full blur-[180px]" />
        {/* Subtle corner accents */}
        <div className="absolute -bottom-60 -right-60 w-[500px] h-[500px] bg-primary/[0.015] rounded-full blur-[150px]" />
        <div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] bg-primary/[0.01] rounded-full blur-[120px]" />
        {/* Refined noise texture overlay */}
        <div className="absolute inset-0 bg-noise opacity-[0.012]" />
      </div>
      
      <Navbar />
      
      <motion.main 
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="flex-1 relative z-10"
      >
        {children}
      </motion.main>
      
      {showFooter && <Footer />}
      
      {/* Scroll to top button */}
      <ScrollToTop />
    </div>
  );
}
