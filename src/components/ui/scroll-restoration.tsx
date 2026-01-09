import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollRestoration component
 * Automatically scrolls to top when navigating between routes
 */
export function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top immediately when route changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant", // Use instant to avoid visible scrolling
    });
  }, [pathname]);

  return null;
}
