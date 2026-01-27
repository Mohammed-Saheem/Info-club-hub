import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Linkedin, Github, Mail, Users, Sparkles } from "lucide-react";
import { teamAPI } from "@/lib/api";
import PageLayout from "@/components/layout/PageLayout";
import { Section } from "@/components/ui/section";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";

export default function Team() {
  const { data: members, isLoading } = useQuery({
    queryKey: ["team-members"],
    queryFn: () => teamAPI.getAll(),
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
            Meet Our <GradientText>Team</GradientText>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            The passionate individuals driving INFO CLUB forward.
          </motion.p>
        </motion.div>
      </Section>

      {/* Team Grid - Dark section */}
      <Section variant="dark" spacing="lg">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-pulse">
                <div className="aspect-square bg-muted" />
                <div className="p-4 space-y-2">
                  <div className="h-5 bg-muted rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : members && members.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 lg:gap-6">
            {members.map((member, i) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] }}
                className="group h-full"
              >
                <div className="h-full flex flex-col rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-gold-glow">
                  {/* Photo */}
                  <div className="aspect-square bg-muted overflow-hidden relative flex-shrink-0">
                    {member.photo_url ? (
                      <img
                        src={member.photo_url}
                        alt={member.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <Users className="w-12 h-12 text-primary/50 group-hover:text-primary/70 transition-colors" />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Info */}
                  <div className="p-4 text-center relative flex-1 flex flex-col justify-between">
                    {/* Top accent */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent group-hover:via-primary/50 transition-all duration-300" />

                    <h3 className="font-heading text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-primary text-sm font-medium mb-4">{member.role}</p>

                    {/* Social Links */}
                    <div className="flex justify-center gap-2">
                      {member.linkedin_url && (
                        <motion.a
                          href={member.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-gold-soft"
                        >
                          <Linkedin className="w-4 h-4" />
                        </motion.a>
                      )}
                      {member.github_url && (
                        <motion.a
                          href={member.github_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-gold-soft"
                        >
                          <Github className="w-4 h-4" />
                        </motion.a>
                      )}
                      {member.email && (
                        <motion.a
                          href={`mailto:${member.email}`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-9 h-9 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-gold-soft"
                        >
                          <Mail className="w-4 h-4" />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              Team information coming soon
            </h3>
            <p className="text-muted-foreground">
              Our team page is being updated.
            </p>
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
