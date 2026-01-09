import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Github, Linkedin, Instagram, Mail, ArrowUpRight, Sparkles } from "lucide-react";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Our Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

const socialLinks = [
  { href: "#", icon: Github, label: "GitHub" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Instagram, label: "Instagram" },
  { href: "#", icon: Mail, label: "Email" },
];

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-card via-card to-background border-t border-border/30 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(var(--primary)/0.08),transparent)]" />
      <div className="absolute inset-0 bg-noise opacity-[0.02]" />
      
      <div className="container mx-auto px-6 lg:px-8 py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-gold-dark flex items-center justify-center shadow-gold-soft">
                <span className="font-heading font-bold text-primary-foreground text-lg">IC</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading font-bold text-xl tracking-tight">INFO CLUB</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Tech & Innovation</span>
              </div>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              Where Information Meets Innovation. Empowering the next generation of tech leaders through collaboration and creativity.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -3, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary/10 hover:border-primary/30 hover:text-primary hover:shadow-gold-soft transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h4 className="font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.15 + index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="group text-muted-foreground hover:text-primary transition-colors text-sm flex items-center gap-1 hover:translate-x-1 duration-300"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-primary rounded-full transition-all duration-300" />
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h4 className="font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
              />
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <motion.li 
                className="flex items-start gap-2 group"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0 group-hover:bg-primary transition-colors" />
                Department of Information Technology
              </motion.li>
              <motion.li 
                className="flex items-start gap-2 group"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0 group-hover:bg-primary transition-colors" />
                College Campus
              </motion.li>
              <motion.li 
                className="flex items-start gap-2 group"
                whileHover={{ x: 3 }}
                transition={{ duration: 0.2 }}
              >
                <span className="w-1 h-1 rounded-full bg-primary/50 mt-2 flex-shrink-0 group-hover:bg-primary transition-colors" />
                <a href="mailto:infoclub@college.edu" className="hover:text-primary transition-colors">
                  infoclub@college.edu
                </a>
              </motion.li>
            </ul>
          </motion.div>

          {/* Newsletter / Join CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h4 className="font-heading font-semibold text-foreground mb-6 flex items-center gap-2">
              <motion.span 
                className="w-1.5 h-1.5 rounded-full bg-primary"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
              />
              Stay Connected
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Follow our journey and stay updated with the latest from INFO CLUB.
            </p>
            <Link 
              to="/events"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-gold-light text-primary-foreground text-sm font-semibold hover:shadow-gold transition-all duration-300 hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              View Events
            </Link>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-border/30"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} INFO CLUB. All rights reserved.
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-1.5">
              Crafted with 
              <motion.span 
                className="text-primary"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ♥
              </motion.span>
              by INFO CLUB Team
            </p>
          </div>
        </motion.div>
      </div>
      
      {/* Decorative bottom gradient line with animation */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)"
        }}
        animate={{
          backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </footer>
  );
}
