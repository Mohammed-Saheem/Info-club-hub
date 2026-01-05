import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Lightbulb, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader } from "@/components/ui/section";
import { StatsCard } from "@/components/ui/stats-card";
import { AnimatedCard } from "@/components/ui/animated-card";

export default function Index() {
  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-primary/10 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-primary/5 rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="w-24 h-24 rounded-2xl bg-primary mx-auto flex items-center justify-center shadow-gold animate-glow-pulse">
                <span className="font-display font-bold text-primary-foreground text-4xl">IC</span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6"
            >
              <span className="text-primary">INFO CLUB</span>
              <br />
              <span className="text-2xl md:text-3xl lg:text-4xl font-medium text-muted-foreground">
                Where Information Meets Innovation
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              Empowering students through technology, collaboration, and hands-on learning.
              Join us to explore, create, and innovate together.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/events">
                <Button size="lg" className="shadow-gold text-lg px-8">
                  View Events
                  <ArrowRight className="ml-2" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Join INFO CLUB
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-3 bg-primary rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <Section className="bg-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatsCard icon={Calendar} value="50+" label="Events Conducted" delay={0} />
          <StatsCard icon={Users} value="200+" label="Active Members" delay={0.1} />
          <StatsCard icon={Code} value="30+" label="Projects Completed" delay={0.2} />
          <StatsCard icon={Lightbulb} value="100+" label="Ideas Generated" delay={0.3} />
        </div>
      </Section>

      {/* About Preview */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
              About <span className="text-primary">INFO CLUB</span>
            </h2>
            <p className="text-muted-foreground mb-6 text-lg">
              INFO CLUB is the premier student organization of the Information Technology department,
              dedicated to fostering technical excellence and innovation among students.
            </p>
            <p className="text-muted-foreground mb-8">
              We organize workshops, hackathons, tech talks, and collaborative projects
              that help students develop practical skills and stay updated with the latest technologies.
            </p>
            <Link to="/about">
              <Button variant="outline">
                Learn More About Us
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { title: "Learn", desc: "Hands-on workshops" },
              { title: "Build", desc: "Real-world projects" },
              { title: "Connect", desc: "Industry networking" },
              { title: "Grow", desc: "Career development" },
            ].map((item, i) => (
              <AnimatedCard key={item.title} delay={i * 0.1} className="p-6">
                <h3 className="font-display text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </AnimatedCard>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* Featured Events Preview */}
      <Section className="bg-card">
        <SectionHeader
          title="Upcoming Events"
          subtitle="Join our exciting events and expand your horizons"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <AnimatedCard key={i} delay={i * 0.1}>
              <div className="aspect-video bg-muted" />
              <div className="p-6">
                <div className="text-primary text-sm font-medium mb-2">Coming Soon</div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Tech Event {i}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Join us for an exciting learning experience with industry experts.
                </p>
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </div>
            </AnimatedCard>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/events">
            <Button size="lg">
              View All Events
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </div>
      </Section>

      {/* CTA Section */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-8 md:p-12 text-center shadow-glow"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Join the Club?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
            Become a part of our vibrant community and unlock endless opportunities for growth and learning.
          </p>
          <Link to="/contact">
            <Button size="lg" className="shadow-gold">
              Join INFO CLUB Today
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
        </motion.div>
      </Section>
    </PageLayout>
  );
}
