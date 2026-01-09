import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContextAPI";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/department", label: "Department" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin } = useAuth();

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-background/80 backdrop-blur-2xl border-b border-border/30 shadow-lg shadow-black/10" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 via-gold-light/20 to-primary/20 opacity-0 group-hover:opacity-100"
                animate={{ 
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ backgroundSize: "200% 200%" }}
              />
              <img 
                src="/INFOCLUB[1].jpg" 
                alt="INFO CLUB Logo" 
                className="w-11 h-11 md:w-12 md:h-12 rounded-xl object-cover relative z-10 ring-2 ring-primary/20 group-hover:ring-primary/50 transition-all duration-300 group-hover:shadow-gold-soft"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-heading font-bold text-lg md:text-xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">INFO CLUB</span>
              <span className="text-[10px] text-muted-foreground/60 uppercase tracking-widest hidden md:block group-hover:text-muted-foreground transition-colors duration-300">Tech & Innovation</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Link
                  to={link.href}
                  className="relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group block"
                >
                  {/* Background on hover/active */}
                  <motion.span 
                    className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                      location.pathname === link.href
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-transparent group-hover:bg-muted/50"
                    }`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  />
                  
                  {/* Text */}
                  <span className={`relative z-10 transition-colors duration-300 ${
                    location.pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  }`}>
                    {link.label}
                  </span>
                  
                  {/* Active indicator line */}
                  {location.pathname === link.href && (
                    <motion.span 
                      layoutId="navbar-indicator"
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-gradient-to-r from-primary/50 via-primary to-primary/50 rounded-full"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover glow effect */}
                  <motion.span
                    className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300"
                    initial={false}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {isAdmin && (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Admin
                </Button>
              </Link>
            )}
            <Link to="/contact">
              <Button size="sm" className="group">
                <Sparkles className="w-4 h-4 mr-1.5 group-hover:animate-pulse-soft" />
                Contact Us
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 text-foreground rounded-xl hover:bg-muted/50 transition-colors"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
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
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="lg:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-t border-border/30"
          >
            <div className="container mx-auto px-6 py-6 space-y-2">
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
                    className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-300 ${
                      location.pathname === link.href
                        ? "text-primary bg-primary/10 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                  >
                    {link.label}
                    {location.pathname === link.href && (
                      <span className="ml-auto w-2 h-2 rounded-full bg-primary animate-pulse-soft" />
                    )}
                  </Link>
                </motion.div>
              ))}
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: navLinks.length * 0.05 }}
                className="pt-4 mt-4 border-t border-border/30 space-y-3"
              >
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsOpen(false)}>
                    <Button variant="outline" className="w-full justify-center">
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Link to="/contact" onClick={() => setIsOpen(false)}>
                  <Button className="w-full justify-center">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Contact Us
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
