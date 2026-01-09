import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Users, Award, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader } from "@/components/ui/section";
import { AnimatedCard, FeatureCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We encourage creative thinking and novel approaches to problem-solving in every challenge.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description: "Working together to achieve more than what's possible individually.",
  },
  {
    icon: BookOpen,
    title: "Learning",
    description: "Continuous growth through hands-on experience and knowledge sharing.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "Striving for the highest standards in everything we pursue.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }
};

export default function About() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-28 pb-20 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-30%,hsl(43,74%,49%,0.12),transparent_70%)]" />
        <GlowingOrbs />
        <FloatingParticles count={12} />
        
        <div className="container mx-auto px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm mb-8"
            >
              <motion.span
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="w-4 h-4 text-primary" />
              </motion.span>
              <span className="text-sm font-semibold text-primary">Our Story</span>
            </motion.div>
            
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1]">
              About <GradientText>INFO CLUB</GradientText>
            </h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
            >
              Discover our story, mission, and the values that drive us to create an exceptional community for tech enthusiasts.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <Section variant="gradient" spacing="lg">
        <div className="grid lg:grid-cols-2 gap-8">
          <AnimatedCard variant="premium" className="p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Eye className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To be the premier student technical community that empowers future technology leaders,
              fostering an ecosystem where innovation thrives and every ambitious mind has the opportunity
              to transform ideas into impactful solutions that shape tomorrow.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.1} variant="premium" className="p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To bridge the gap between academic learning and industry requirements by providing
              students with practical exposure, expert mentorship, and transformative opportunities 
              to work on real-world projects that make a meaningful difference.
            </p>
          </AnimatedCard>
        </div>
      </Section>

      {/* Story */}
      <Section variant="dark" spacing="lg">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="The Journey"
            title="Our Story"
            subtitle="From a small group of passionate students to a thriving community of innovators"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              INFO CLUB was founded with a simple yet powerful idea: create an exclusive space where students
              passionate about technology could come together, learn from the best, and build extraordinary things.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              What started as informal coding sessions has evolved into a comprehensive platform
              offering intensive workshops, high-stakes hackathons, exclusive industry talks, and collaborative projects. 
              Our members have gone on to work at leading tech companies and launch successful startups.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Today, INFO CLUB stands as a testament to what's possible when motivated individuals
              come together with a shared vision of learning, innovation, and excellence.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Values */}
      <Section variant="gradient" spacing="lg">
        <SectionHeader
          badge="Our Principles"
          title="Core Values"
          subtitle="The principles that guide everything we do and shape our community"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <FeatureCard 
              key={value.title} 
              delay={i * 0.1} 
              icon={value.icon}
              title={value.title}
              description={value.description}
            />
          ))}
        </div>
      </Section>

      {/* Role in Department */}
      <Section variant="dark" spacing="lg">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            badge="Our Impact"
            title="Role in the Department"
            subtitle="How INFO CLUB contributes to student success and departmental growth"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Technical Training", desc: "Regular workshops on trending technologies and industry best practices" },
              { title: "Industry Connect", desc: "Exclusive guest lectures from industry professionals and successful founders" },
              { title: "Project Mentorship", desc: "Expert guidance on academic and personal projects from experienced mentors" },
            ].map((item, i) => (
              <AnimatedCard key={item.title} delay={i * 0.1} variant="glass" className="p-8 text-center">
                <h3 className="font-heading text-lg font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="gold" spacing="lg">
        <motion.div {...fadeUp} className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
            Want to Know More?
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Explore our projects, attend our events, and see what INFO CLUB is all about.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/events">
              <Button size="xl" variant="premium" className="group">
                Explore Events
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/projects">
              <Button size="xl" variant="outline" className="group">
                View Projects
              </Button>
            </Link>
          </div>
        </motion.div>
      </Section>
    </PageLayout>
  );
}
