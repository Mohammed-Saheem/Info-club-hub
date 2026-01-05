import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Code, Zap, BookOpen, Trophy, Sparkles, ExternalLink, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as const }
};

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  },
  viewport: { once: true }
};

const staggerItem = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Index() {
  const { data: events } = useQuery({
    queryKey: ["featured-events"],
    queryFn: async () => {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: false })
        .limit(3);
      return data || [];
    },
  });

  const { data: projects } = useQuery({
    queryKey: ["featured-projects"],
    queryFn: async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .eq("is_featured", true)
        .limit(4);
      return data || [];
    },
  });

  return (
    <PageLayout>
      {/* Hero Section - Left Aligned */}
      <section className="relative min-h-screen flex items-center bg-background overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,214,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,214,0,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Accent glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left Content */}
            <div className="max-w-2xl">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Student Developer Community</span>
              </motion.div>

              {/* Logo + Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex items-center gap-4 mb-6"
              >
                <div className="w-16 h-16 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                  <span className="font-display font-bold text-primary-foreground text-2xl">IC</span>
                </div>
                <span className="font-display text-xl font-semibold text-muted-foreground">INFO CLUB</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground leading-[1.1] tracking-tight mb-6"
              >
                Where{" "}
                <span className="text-primary">Information</span>
                <br />
                Meets Innovation
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg"
              >
                Empowering IT students through hands-on projects, tech workshops, 
                and a vibrant community of learners and innovators.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-4"
              >
                <Link to="/events">
                  <Button size="lg" className="text-base px-8 py-6 font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                    View Events
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline" className="text-base px-8 py-6 font-semibold border-2">
                    Join INFO CLUB
                  </Button>
                </Link>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex gap-10 mt-14 pt-8 border-t border-border"
              >
                {[
                  { value: "50+", label: "Events" },
                  { value: "200+", label: "Members" },
                  { value: "30+", label: "Projects" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="font-display text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right - Abstract Tech Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative"
            >
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                {/* Animated circles */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full border-2 border-primary/20 animate-[spin_20s_linear_infinite]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-primary/30 animate-[spin_15s_linear_infinite_reverse]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-primary/10 backdrop-blur-sm" />
                </div>
                
                {/* Floating icons */}
                <motion.div 
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-12 right-12 w-14 h-14 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center"
                >
                  <Code className="w-7 h-7 text-primary" />
                </motion.div>
                <motion.div 
                  animate={{ y: [10, -10, 10] }}
                  transition={{ duration: 5, repeat: Infinity }}
                  className="absolute bottom-20 left-8 w-14 h-14 rounded-xl bg-card border border-border shadow-lg flex items-center justify-center"
                >
                  <Users className="w-7 h-7 text-primary" />
                </motion.div>
                <motion.div 
                  animate={{ y: [-8, 8, -8] }}
                  transition={{ duration: 3.5, repeat: Infinity }}
                  className="absolute top-1/3 left-0 w-12 h-12 rounded-xl bg-primary shadow-lg flex items-center justify-center"
                >
                  <Zap className="w-6 h-6 text-primary-foreground" />
                </motion.div>
                
                {/* Center logo */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-primary shadow-2xl shadow-primary/30 flex items-center justify-center">
                    <span className="font-display font-bold text-primary-foreground text-4xl">IC</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What is INFO CLUB - Two Column */}
      <section className="py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div {...fadeUp}>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">About Us</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
                What is <span className="text-primary">INFO CLUB</span>?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                INFO CLUB is the official student organization of the Information Technology department, 
                dedicated to fostering technical excellence, innovation, and professional growth among students.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We bridge the gap between academic learning and industry requirements through workshops, 
                hackathons, tech talks, and collaborative projects that prepare students for real-world challenges.
              </p>
              <Link to="/about">
                <Button variant="outline" size="lg" className="font-semibold">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            <motion.div 
              {...fadeUp}
              className="grid grid-cols-2 gap-5"
            >
              {[
                { icon: BookOpen, title: "Learn", desc: "Hands-on workshops and bootcamps" },
                { icon: Code, title: "Build", desc: "Real-world projects and hackathons" },
                { icon: Users, title: "Connect", desc: "Network with industry professionals" },
                { icon: Trophy, title: "Grow", desc: "Leadership and career development" },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* What We Do - Horizontal Feature Cards */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="max-w-2xl mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">What We Do</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Building Tomorrow's Tech Leaders
            </h2>
            <p className="text-lg text-muted-foreground">
              From coding workshops to industry networking events, we create opportunities 
              for students to learn, grow, and excel in the tech world.
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
              { icon: Code, title: "Tech Workshops", desc: "Hands-on sessions on latest technologies and frameworks" },
              { icon: Trophy, title: "Hackathons", desc: "Competitive coding events to solve real-world problems" },
              { icon: Users, title: "Tech Talks", desc: "Industry experts sharing insights and experiences" },
              { icon: Zap, title: "Projects", desc: "Collaborative projects to build your portfolio" },
            ].map((feature) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/30 hover:bg-card/80 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Events Preview - Large Cards */}
      <section className="py-24 lg:py-32 bg-card/50">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Events</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Upcoming Events
              </h2>
            </div>
            <Link to="/events">
              <Button variant="outline" className="font-semibold">
                View All Events
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(events && events.length > 0 ? events : [
              { id: 1, title: "Web Development Bootcamp", event_date: "2026-02-15", venue: "IT Lab 1", description: "Learn modern web development with React and Node.js" },
              { id: 2, title: "AI/ML Workshop", event_date: "2026-02-22", venue: "Seminar Hall", description: "Introduction to machine learning and practical applications" },
              { id: 3, title: "Hackathon 2026", event_date: "2026-03-10", venue: "Main Auditorium", description: "24-hour coding competition with exciting prizes" },
            ]).map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-5 bg-muted">
                  {event.banner_image ? (
                    <img src={event.banner_image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Calendar className="w-12 h-12 text-primary/40" />
                    </div>
                  )}
                  {/* Date Badge */}
                  <div className="absolute top-4 left-4 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
                    {new Date(event.event_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{event.venue || "TBA"}</p>
                  <h3 className="font-display text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">{event.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Preview - Clean Rows */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div {...fadeUp} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider mb-4 block">Projects</span>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
                Featured Projects
              </h2>
            </div>
            <Link to="/projects">
              <Button variant="outline" className="font-semibold">
                View All Projects
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <div className="space-y-4">
            {(projects && projects.length > 0 ? projects : [
              { id: 1, title: "Campus Connect", description: "A student networking platform for college events and collaborations", tech_stack: ["React", "Node.js", "MongoDB"], github_url: "#", demo_url: "#" },
              { id: 2, title: "Smart Attendance", description: "Facial recognition based attendance management system", tech_stack: ["Python", "OpenCV", "Flask"], github_url: "#", demo_url: "#" },
              { id: 3, title: "CodeShare", description: "Real-time collaborative code editor for pair programming", tech_stack: ["React", "Socket.io", "Express"], github_url: "#", demo_url: "#" },
              { id: 4, title: "EcoTrack", description: "Carbon footprint calculator and sustainability tracker", tech_stack: ["Next.js", "Supabase", "Tailwind"], github_url: "#", demo_url: "#" },
            ]).map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="group flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-xl border border-border hover:border-primary/30 hover:bg-card/50 transition-all"
              >
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">{project.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex flex-wrap gap-2">
                    {project.tech_stack?.slice(0, 3).map((tech) => (
                      <span key={tech} className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <Github className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-muted transition-colors">
                        <ExternalLink className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA - High Contrast */}
      <section className="py-24 lg:py-32 bg-primary">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div 
            {...fadeUp}
            className="max-w-3xl"
          >
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6">
              Ready to be part of something amazing?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-xl">
              Join INFO CLUB and unlock opportunities for learning, networking, 
              and building your future in tech.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact">
                <Button size="lg" variant="secondary" className="text-base px-8 py-6 font-semibold bg-background text-foreground hover:bg-background/90">
                  Join INFO CLUB
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="ghost" className="text-base px-8 py-6 font-semibold text-primary-foreground border-2 border-primary-foreground/30 hover:bg-primary-foreground/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </PageLayout>
  );
}
