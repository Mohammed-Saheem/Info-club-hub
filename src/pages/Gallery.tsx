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
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

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
                onClick={() => setSelectedPhoto(photo)}
                className="group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3 border border-border/50">
                  <img
                    src={photo.image_url}
                    alt={photo.title || "Gallery photo"}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Hover Overlay: Description & Icon */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="mb-3 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary"
                    >
                      <ImageIcon className="w-5 h-5" />
                    </motion.div>

                    {photo.description ? (
                      <p className="text-white/90 text-sm leading-relaxed line-clamp-4">
                        {photo.description}
                      </p>
                    ) : (
                      <span className="text-white/50 text-xs uppercase tracking-widest">View Photo</span>
                    )}
                  </div>
                </div>

                {/* Text Content (Use "Thumbnail" style below image) */}
                <div className="space-y-1">
                  {photo.category && (
                    <div className="text-xs font-bold text-primary tracking-wider uppercase">
                      {photo.category}
                    </div>
                  )}
                  {photo.title && (
                    <h3 className="font-heading text-lg font-semibold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {photo.title}
                    </h3>
                  )}
                </div>
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
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:scale-110 z-50"
              whileHover={{ rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-5 h-5" />
            </motion.button>

            <div className="flex flex-col md:flex-row items-center gap-8 max-w-7xl w-full max-h-[90vh]">
              <motion.div
                className="relative flex-1 flex items-center justify-center w-full h-full min-h-0"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <img
                  src={selectedPhoto.image_url}
                  alt={selectedPhoto.title || "Gallery photo"}
                  className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-black/50 cursor-default"
                  onClick={(e) => e.stopPropagation()}
                />
              </motion.div>

              {(selectedPhoto.title || selectedPhoto.description) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.1 }}
                  className="w-full md:w-[350px] flex-shrink-0 bg-card/10 backdrop-blur-md border border-white/10 p-6 rounded-2xl md:self-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {selectedPhoto.title && (
                    <h3 className="text-2xl font-bold text-white mb-3 font-display">{selectedPhoto.title}</h3>
                  )}
                  {selectedPhoto.description && (
                    <p className="text-white/80 leading-relaxed text-sm md:text-base">
                      {selectedPhoto.description}
                    </p>
                  )}
                  {selectedPhoto.category && (
                    <div className="mt-4 inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                      {selectedPhoto.category}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
