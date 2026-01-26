import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/department", label: "Department" },
  { href: "/events", label: "Events" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
        ? "bg-[hsl(220,15%,6%)]/80 backdrop-blur-md border-b border-primary/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)] py-2"
        : "bg-transparent py-4"
        }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-center relative">

          {/* Mobile Logo - Left side */}
          <Link to="/" className="lg:hidden absolute left-0 flex items-center gap-2">
            <img
              src="/INFOCLUB[1].jpg"
              alt="IC"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-primary/30 shadow-gold-soft"
            />
          </Link>

          {/* Centered Navigation - Modern Pill Style */}
          <div className="hidden lg:flex items-center">
            <div className={`flex items-center gap-1 p-1.5 rounded-full transition-all duration-500 ${isScrolled
              ? "bg-[hsl(220,12%,10%)]/90 border border-primary/10 shadow-lg shadow-black/20"
              : "bg-[hsl(220,12%,8%)]/70 backdrop-blur-md border border-white/5"
              }`}>
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.04 }}
                >
                  <Link
                    to={link.href}
                    className={`relative px-5 py-2 text-sm font-medium transition-all duration-300 rounded-full block group overflow-hidden ${location.pathname === link.href
                      ? "text-background font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {location.pathname === link.href && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary rounded-full"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    {/* Hover effect for non-active links */}
                    {location.pathname !== link.href && (
                      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 rounded-full transition-opacity duration-300" />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </Link>
                </motion.div>
              ))}

              {/* Join Us Button inside pill */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.04 }}
                className="ml-2 pl-2 border-l border-white/10"
              >
                <Link to="/contact">
                  <Button
                    size="sm"
                    className="rounded-full px-6 h-9 bg-gradient-to-r from-primary to-[hsl(40,70%,45%)] hover:from-[hsl(40,70%,45%)] hover:to-primary text-background font-bold shadow-[0_0_20px_hsl(43,65%,56%,0.3)] hover:shadow-[0_0_30px_hsl(43,65%,56%,0.5)] transition-all duration-300 transform hover:scale-105"
                  >
                    Join Us
                  </Button>
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Admin Link - Positioned Absolute Right */}
          {isAdmin && (
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
                  Admin
                </Button>
              </Link>
            </div>
          )}
          {!isAdmin && user && (
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              {user.email} (Not Admin)
            </div>
          )}
          {!user && (
            <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2">
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-full">
                  Admin
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden absolute right-0 top-1/2 -translate-y-1/2 p-2.5 text-foreground rounded-full hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className="lg:hidden overflow-hidden bg-[hsl(220,15%,6%)]/95 backdrop-blur-3xl border-b border-primary/20 shadow-2xl"
          >
            <div className="container mx-auto px-6 py-8 space-y-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 group ${location.pathname === link.href
                      ? "text-primary-foreground bg-primary shadow-gold-soft"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent hover:border-white/10"
                      }`}
                  >
                    <span>{link.label}</span>
                    {location.pathname === link.href ? (
                      <span className="w-2 h-2 rounded-full bg-background animate-pulse" />
                    ) : (
                      <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">→</span>
                    )}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                className="pt-6 mt-6 border-t border-white/10 space-y-3"
              >
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center h-12 text-base rounded-xl border-primary/30 hover:bg-primary/5 hover:text-primary">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center h-12 text-base rounded-xl bg-gradient-to-r from-primary to-[hsl(40,70%,45%)] shadow-gold-soft">
                    Join INFO CLUB
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
