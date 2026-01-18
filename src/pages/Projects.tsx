import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Github, ExternalLink, Search, Code, Sparkles } from "lucide-react";
import { projectsAPI } from "@/lib/api";
import PageLayout from "@/components/layout/PageLayout";
import { Section } from "@/components/ui/section";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => projectsAPI.getAll(),
  });

  const filteredProjects = projects?.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.tech_stack?.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
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
            Our <GradientText>Projects</GradientText>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Explore the innovative projects built by our talented members.
          </motion.p>
        </motion.div>
      </Section>

      {/* Projects List - Dark section */}
      <Section variant="dark" spacing="lg">
        <div className="max-w-lg mx-auto mb-14">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5 group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search projects or technologies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-card rounded-2xl border border-border/50 overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted" />
                <div className="p-6 space-y-3">
                  <div className="h-6 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="flex gap-2">
                    <div className="h-6 bg-muted rounded w-16" />
                    <div className="h-6 bg-muted rounded w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects && filteredProjects.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, i) => (
              <AnimatedCard key={project.id} delay={i * 0.05} variant="premium">
                <div className="aspect-video bg-muted overflow-hidden relative group/image">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                      <Code className="w-12 h-12 text-primary/50" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-foreground mb-2">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech_stack.map((tech) => (
                        <Badge 
                          key={tech} 
                          variant="secondary" 
                          className="text-xs bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-3">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <Github className="w-4 h-4" />
                          Code
                        </Button>
                      </a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="gap-2">
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6">
              <Code className="w-10 h-10 text-primary/50" />
            </div>
            <h3 className="font-heading text-xl font-bold text-foreground mb-3">
              No projects found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery ? "Try a different search term" : "Projects coming soon!"}
            </p>
          </div>
        )}
      </Section>
    </PageLayout>
  );
}
