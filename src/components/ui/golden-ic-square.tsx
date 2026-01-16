import { motion } from "framer-motion";

export function GoldenICSquare() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 bg-primary/20 rounded-3xl blur-3xl animate-pulse-glow" />
      </div>
      
      {/* Secondary outer glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-40 h-40 bg-gold-light/30 rounded-2xl blur-2xl animate-pulse-glow-delayed" />
      </div>

      {/* Rotating corner accents */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="w-44 h-44 relative">
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-primary/60" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-primary/60" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-primary/60" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-primary/60" />
        </div>
      </motion.div>

      {/* Main golden square */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative"
      >
        {/* Border glow layer */}
        <div className="absolute -inset-1 bg-gradient-to-br from-gold-light via-primary to-gold-dark rounded-2xl blur-sm opacity-60" />
        
        {/* Main square container */}
        <div className="relative w-36 h-36 bg-gradient-to-br from-card via-dark-lighter to-card rounded-2xl border border-primary/30 shadow-gold-intense overflow-hidden">
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent -translate-x-full animate-shimmer-slow" />
          
          {/* IC Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.span 
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(43, 74%, 49%, 0.5), 0 0 40px hsl(43, 74%, 49%, 0.3)",
                  "0 0 30px hsl(43, 74%, 49%, 0.7), 0 0 60px hsl(43, 74%, 49%, 0.4)",
                  "0 0 20px hsl(43, 74%, 49%, 0.5), 0 0 40px hsl(43, 74%, 49%, 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="font-heading text-5xl font-bold text-gradient-gold select-none"
            >
              IC
            </motion.span>
          </div>
          
          {/* Corner decorations */}
          <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-primary/50 rounded-tl" />
          <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-primary/50 rounded-tr" />
          <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-primary/50 rounded-bl" />
          <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-primary/50 rounded-br" />
        </div>
      </motion.div>

      {/* Floating particles around the square */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <div className="relative w-52 h-52">
          <motion.div 
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 -left-1 w-2 h-2 bg-primary rounded-full shadow-gold-soft"
          />
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-gold-light rounded-full shadow-gold-soft"
          />
          <motion.div 
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-1/2 -right-1 w-2 h-2 bg-primary rounded-full shadow-gold-soft"
          />
          <motion.div 
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-gold-light rounded-full shadow-gold-soft"
          />
        </div>
      </motion.div>
    </div>
  );
}
