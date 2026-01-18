import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { X, Image as ImageIcon, Sparkles } from "lucide-react";
import { galleryAPI } from "@/lib/api";
import PageLayout from "@/components/layout/PageLayout";
import { Section } from "@/components/ui/section";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data: photos, isLoading } = useQuery({
    queryKey: ["gallery-photos"],
    queryFn: () => galleryAPI.getAll(),
  });

  return (
    <PageLayout>
      {/* Hero - Gold gradient from left to black right */}
      <Section variant="hero" spacing="hero">
        {/* Extra gold glow on left side */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_80%_100%_at_0%_30%,hsl(43,65%,56%,0.12),transparent_70%)] pointer-events-none" />
        <GlowingOrbs />
        <FloatingParticles count={12} />
        
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1]">
            Photo <GradientText>Gallery</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Memories from our events, workshops, and team activities.
          </motion.p>
        </motion.div>
      </Section>

      {/* Gallery Grid - Dark section */}
      <Section variant="dark" spacing="lg">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
              <div key={i} className="aspect-square bg-muted rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : photos && photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                onClick={() => setSelectedImage(photo.image_url)}
                className="aspect-square rounded-2xl overflow-hidden cursor-pointer group relative border border-border/30 hover:border-primary/40 hover:shadow-gold-soft transition-all duration-300"
              >
                <img
                  src={photo.image_url}
                  alt={photo.title || "Gallery photo"}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/40 flex items-center justify-center shadow-gold-glow"
                    whileHover={{ rotate: 15 }}
                  >
                    <ImageIcon className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
                {/* Title overlay */}
                {photo.title && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-card/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-sm font-medium text-foreground truncate">{photo.title}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <ImageIcon className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              Gallery coming soon
            </h3>
            <p className="text-muted-foreground">
              Photos will be added after our upcoming events.
            </p>
          </div>
        )}
      </Section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-110"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.button>
            <motion.img
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={selectedImage}
              alt="Gallery photo"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl shadow-black/50 cursor-default ring-1 ring-white/10"
              onClick={(e) => e.stopPropagation()}
            />
            {/* Click anywhere hint */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm"
            >
              Click anywhere to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
