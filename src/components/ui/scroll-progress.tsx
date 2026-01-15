import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Minimal, elegant scroll indicator - only visible at the very edge
  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent origin-left z-[100]"
      style={{ scaleX, opacity: scaleX }}
    />
  );
}
