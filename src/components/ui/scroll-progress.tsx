import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <>
      {/* Progress bar at top */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-gold-light to-primary origin-left z-[100]"
        style={{ scaleX }}
      />
      {/* Glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[6px] bg-gradient-to-r from-primary/50 via-gold-light/50 to-primary/50 blur-sm origin-left z-[99]"
        style={{ scaleX }}
      />
    </>
  );
}
