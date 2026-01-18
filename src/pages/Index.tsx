import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Code, Zap, BookOpen, Trophy, Sparkles, ExternalLink, Github, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { eventsAPI, projectsAPI } from "@/lib/api";
import { cn } from "@/lib/utils";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";
import { LiveBadge } from "@/components/ui/badge";
import { GoldenICSquare } from "@/components/ui/golden-ic-square";
import { AnimatedCard, FeatureCard, StatsCard } from "@/components/ui/animated-card";

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeInOut" as const }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.08
    }
  },
  viewport: { once: true }
};

const staggerItem = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" as const }
};

export default function Index() {
  const { data: events } = useQuery({
    queryKey: ["featured-events"],
    queryFn: () => eventsAPI.getAll({ limit: 3 }),
  });

  const { data: projects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: () => projectsAPI.getAll({ featured: true, limit: 4 }),
  });

  return (
    <PageLayout>
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO SECTION — Grand & Confident
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Gold gradient from left to black right - premium hero */}
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(43,65%,56%,0.12)] via-[hsl(220,15%,5%)] to-[hsl(220,15%,4%)]" />
        {/* Extra gold glow on left side */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_80%_100%_at_0%_30%,hsl(43,65%,56%,0.15),transparent_70%)]" />
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(212,168,75,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(212,168,75,0.02)_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,black,transparent)]" />

        {/* New premium ambient effects */}
        <GlowingOrbs />
        <FloatingParticles count={15} />

        <div className="container mx-auto px-6 lg:px-8 relative z-10 pt-20 lg:pt-32">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Premium Badge */}
              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: "easeInOut" }}
                className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.05] tracking-tight mb-8"
              >
                Welcome to INFO CLUB
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35, ease: "easeInOut" }}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 max-w-xl"
              >
                An exclusive community for ambitious minds pushing the boundaries of technology and innovation.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45, ease: "easeInOut" }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/events">
                  <Button size="xl" variant="premium" className="group">
                    Explore Events
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="xl" variant="outline" className="group">
                    Learn More
                    <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse-soft" />
                  </Button>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-6 mt-16 pt-10 border-t border-border/30"
              >
                {[
                  { value: "50+", label: "Events Hosted" },
                  { value: "200+", label: "Active Members" },
                  { value: "30+", label: "Projects Built" },
                ].map((stat, i) => (
                  <StatsCard
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    delay={0.7 + i * 0.1}
                    className="flex-1 min-w-[120px]"
                  />
                ))}
              </motion.div>
            </div>

            {/* Right - Premium 3D Flame Centerpiece */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeInOut" }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Outer rotating ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-[400px] h-[400px] rounded-full border border-primary/10 animate-rotate-slow"
                    style={{ animationDuration: '30s' }}
                  />
                </div>

                {/* Middle pulsing ring */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-72 h-72 rounded-full border-2 border-primary/20 animate-glow-pulse" />
                </div>

                {/* Inner glow */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-56 h-56 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 backdrop-blur-xl shadow-glow" />
                </div>

                {/* Floating feature cards */}
                <motion.div
                  animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-8 right-8 w-16 h-16 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-card flex items-center justify-center"
                >
                  <Code className="w-7 h-7 text-primary" />
                </motion.div>

                <motion.div
                  animate={{ y: [8, -8, 8], rotate: [2, -2, 2] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-16 left-4 w-16 h-16 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/50 shadow-card flex items-center justify-center"
                >
                  <Users className="w-7 h-7 text-primary" />
                </motion.div>

                <motion.div
                  animate={{ y: [-6, 6, -6] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-1/3 -left-4 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-gold-dark shadow-gold flex items-center justify-center"
                >
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </motion.div>

                <motion.div
                  animate={{ y: [6, -6, 6], x: [-4, 4, -4] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-1/4 right-0 w-14 h-14 rounded-xl bg-card/80 backdrop-blur-xl border border-primary/30 shadow-gold-soft flex items-center justify-center"
                >
                  <Trophy className="w-6 h-6 text-primary" />
                </motion.div>

                {/* Golden IC Square Centerpiece - The Heart of Infoclub */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{
                      y: [0, -12, 0],
                      scale: [1, 1.03, 1],
                      rotate: [-1.5, 1.5, -1.5]
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="relative"
                  >
                    <div className="absolute inset-0 bg-primary/40 rounded-3xl blur-2xl animate-glow-pulse" />
                    <div className="relative w-28 h-28 rounded-3xl shadow-gold-intense overflow-hidden border border-primary/20 bg-background/50 backdrop-blur-sm">
                      <img
                        src="/INFOCLUB[1].jpg"
                        alt="INFO CLUB Logo"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 rounded-full bg-primary"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          ABOUT SECTION — Value Proposition (Dark)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 lg:py-36 bg-[hsl(220,15%,4%)] relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(43,74%,49%,0.05),transparent_40%)]" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div {...fadeUp}>
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-6">
                <span className="w-8 h-px bg-primary" />
                About Us
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight mb-8">
                The Premier Hub for{" "}
                <span className="text-gradient-gold">Tech Excellence</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                INFO CLUB is the official student organization of the Information Technology department,
                dedicated to fostering technical excellence, innovation, and professional growth among students.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-10">
                We bridge the gap between academic learning and industry requirements through workshops,
                hackathons, tech talks, and collaborative projects that prepare students for real-world challenges.
              </p>
              <Link to="/about">
                <Button variant="outline" size="lg" className="group">
                  Discover Our Story
                  <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>

            <motion.div
              {...fadeUp}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { icon: BookOpen, title: "Learn", desc: "Hands-on workshops and intensive bootcamps" },
                { icon: Code, title: "Build", desc: "Real-world projects and competitive hackathons" },
                { icon: Users, title: "Connect", desc: "Network with industry professionals" },
                { icon: Trophy, title: "Grow", desc: "Leadership and career development" },
              ].map((item, i) => (
                <FeatureCard
                  key={item.title}
                  icon={item.icon}
                  title={item.title}
                  description={item.desc}
                  delay={i * 0.1}
                  className="bg-gradient-to-br from-card/80 to-card/40"
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FEATURES SECTION — What We Do (Grey)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 lg:py-36 bg-[hsl(220,12%,8%)] relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp} className="max-w-2xl mb-20">
            <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-6">
              <span className="w-8 h-px bg-primary" />
              What We Do
            </span>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Building Tomorrow's{" "}
              <span className="text-gradient-gold">Tech Leaders</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              From intensive coding workshops to exclusive industry networking events, we create
              transformative opportunities for ambitious minds.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Code, title: "Tech Workshops", desc: "Deep-dive sessions on cutting-edge technologies and industry frameworks" },
              { icon: Trophy, title: "Hackathons", desc: "High-stakes competitive coding events solving real-world challenges" },
              { icon: Users, title: "Tech Talks", desc: "Exclusive insights from industry leaders and successful founders" },
              { icon: Zap, title: "Projects", desc: "Collaborative initiatives building portfolio-worthy solutions" },
            ].map((feature, i) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.desc}
                delay={i * 0.1}
                className="h-full"
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          EVENTS SECTION — Social Proof (Dark)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 lg:py-36 bg-[hsl(220,15%,4%)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(43,65%,56%,0.04),transparent)]" />

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-6">
                <span className="w-8 h-px bg-primary" />
                Events
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                Upcoming <span className="text-gradient-gold">Events</span>
              </h2>
            </div>
            <Link to="/events">
              <Button variant="outline" className="group">
                View All Events
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(events && events.length > 0 ? events : [
              { id: 1, title: "Web Development Bootcamp", event_date: "2026-02-15", venue: "IT Lab 1", description: "Master modern web development with React, Node.js, and cloud deployment" },
              { id: 2, title: "AI/ML Workshop Series", event_date: "2026-02-22", venue: "Seminar Hall", description: "Hands-on introduction to machine learning with real-world applications" },
              { id: 3, title: "Hackathon 2026", event_date: "2026-03-10", venue: "Main Auditorium", description: "48-hour coding marathon with industry mentors and exciting prizes" },
            ]).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeInOut" }}
                className="group"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 bg-card border border-border/50 group-hover:border-primary/30 transition-all duration-500">
                  {event.banner_image ? (
                    <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/15 via-card to-card flex items-center justify-center">
                      <Calendar className="w-14 h-14 text-primary/30" />
                    </div>
                  )}

                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-gold-light text-primary-foreground font-bold text-sm shadow-gold-soft">
                    {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>

                <div>
                  <p className="text-sm text-primary font-medium mb-2">{event.venue || "TBA"}</p>
                  <h3 className="font-heading text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PROJECTS SECTION — Proof of Excellence (Grey)
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 lg:py-36 bg-[hsl(220,12%,8%)] relative">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="inline-flex items-center gap-2 text-primary font-semibold text-sm uppercase tracking-widest mb-6">
                <span className="w-8 h-px bg-primary" />
                Projects
              </span>
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground">
                Featured <span className="text-gradient-gold">Projects</span>
              </h2>
            </div>
            <Link to="/projects">
              <Button variant="outline" className="group">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          <div className="space-y-4">
            {(projects && projects.length > 0 ? projects : [
              { id: 1, title: "Campus Connect", description: "A comprehensive student networking platform for college events and cross-department collaborations", tech_stack: ["React", "Node.js", "MongoDB"], github_url: "#", demo_url: "#" },
              { id: 2, title: "Smart Attendance", description: "AI-powered facial recognition attendance management system with real-time analytics", tech_stack: ["Python", "OpenCV", "Flask"], github_url: "#", demo_url: "#" },
              { id: 3, title: "CodeShare", description: "Real-time collaborative code editor enabling seamless pair programming sessions", tech_stack: ["React", "Socket.io", "Express"], github_url: "#", demo_url: "#" },
              { id: 4, title: "EcoTrack", description: "Carbon footprint calculator and sustainability tracker for eco-conscious individuals", tech_stack: ["Next.js", "Supabase", "Tailwind"], github_url: "#", demo_url: "#" },
            ]).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: "easeInOut" }}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl border border-border/50 bg-gradient-to-r from-card/50 to-transparent hover:border-primary/30 hover:bg-card/50 transition-all duration-500 relative overflow-hidden"
              >
                {/* Hover accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-gold-dark opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="flex-1 pl-4">
                  <h3 className="font-heading text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{project.description}</p>
                </div>

                <div className="flex items-center gap-6 pl-4 md:pl-0">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-muted/50 backdrop-blur-sm border border-border/50 text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors group/link">
                        <Github className="w-5 h-5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors group/link">
                        <ExternalLink className="w-5 h-5 text-muted-foreground group-hover/link:text-primary transition-colors" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          CTA SECTION — Call to Action
          ═══════════════════════════════════════════════════════════════════════ */}
      <section className="py-28 lg:py-36 relative overflow-hidden">
        {/* Premium gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-gold-dark to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(0,0%,100%,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,hsl(0,0%,0%,0.2),transparent_50%)]" />

        {/* Noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` }} />

        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            {...fadeUp}
            className="max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary-foreground" />
              <span className="text-sm font-semibold text-primary-foreground">Get In Touch</span>
            </motion.div>

            <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-[1.1] mb-8">
              Have questions or<br />want to collaborate?
            </h2>

            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-xl leading-relaxed">
              Reach out to INFO CLUB for collaborations, event inquiries,
              or to learn more about what we do.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="xl" variant="secondary" className="bg-background text-foreground hover:bg-background/90 shadow-lg group">
                  Contact Us
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="xl" variant="ghost" className="text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10 hover:border-primary-foreground/50">
                  View Projects
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />
      </section>
    </PageLayout>
  );
}
