import { useEffect, useState, useCallback, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const lastUpdate = useRef(0);

  // Much softer, slower spring for elegant movement
  const springConfig = { damping: 40, stiffness: 80, mass: 0.8 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Throttled cursor update for smoother, less sensitive movement
  const moveCursor = useCallback((e: MouseEvent) => {
    const now = Date.now();
    // Only update every 16ms (60fps) to reduce sensitivity
    if (now - lastUpdate.current > 16) {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      lastUpdate.current = now;
      if (!isVisible) setIsVisible(true);
    }
  }, [cursorX, cursorY, isVisible]);

  useEffect(() => {
    // Only show on devices with fine pointer (not touch)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    if (!mediaQuery.matches) return;

    const hideCursor = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [moveCursor]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="fixed pointer-events-none z-[9998]"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      {/* Subtle outer ambient glow - very soft */}
      <div className="w-[400px] h-[400px] rounded-full bg-gradient-radial from-primary/[0.03] to-transparent blur-[80px]" />
      {/* Inner subtle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-primary/[0.04] blur-[50px]" />
    </motion.div>
  );
}
