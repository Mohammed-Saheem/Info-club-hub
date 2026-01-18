import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, MapPin, Search, Sparkles } from "lucide-react";
import { eventsAPI } from "@/lib/api";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader } from "@/components/ui/section";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Input } from "@/components/ui/input";
import { EventCardSkeleton } from "@/components/ui/loading-skeletons";
import { LiveBadge } from "@/components/ui/badge";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";
import { format } from "date-fns";

export default function Events() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: events, isLoading } = useQuery({
    queryKey: ["events"],
    queryFn: () => eventsAPI.getAll(),
  });

  const filteredEvents = events?.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            Our <GradientText>Events</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Explore our exclusive workshops, hackathons, and tech talks designed to elevate your skills.
          </motion.p>
        </motion.div>
      </Section>

      {/* Events List - Dark section */}
      <Section variant="dark" spacing="lg">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg mx-auto mb-16"
        >
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-base"
            />
          </div>
        </motion.div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <EventCardSkeleton />
              </motion.div>
            ))}
          </div>
        ) : filteredEvents && filteredEvents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, i) => (
              <AnimatedCard key={event.id} delay={i * 0.05} variant="premium">
                <div className="aspect-video bg-card overflow-hidden relative group">
                  {event.banner_image ? (
                    <img
                      src={event.banner_image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/15 via-card to-card">
                      <Calendar className="w-14 h-14 text-primary/30" />
                    </div>
                  )}
                  
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold text-sm shadow-gold-soft">
                    {format(new Date(event.event_date), "MMM d, yyyy")}
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    {event.venue && (
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-primary" />
                        {event.venue}
                      </span>
                    )}
                  </div>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              No events found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {searchQuery ? "Try a different search term" : "Check back soon for upcoming exclusive events!"}
            </p>
          </motion.div>
        )}
      </Section>
    </PageLayout>
  );
}
