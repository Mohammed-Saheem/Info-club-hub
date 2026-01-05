import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Users, Award, BookOpen } from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader } from "@/components/ui/section";
import { AnimatedCard } from "@/components/ui/animated-card";

const values = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We encourage creative thinking and novel approaches to problem-solving.",
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
    description: "Striving for the highest standards in everything we do.",
  },
];

export default function About() {
  return (
    <PageLayout>
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              About <span className="text-primary">INFO CLUB</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Discover our story, mission, and the values that drive us forward.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-8">
          <AnimatedCard className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Eye className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Our Vision</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To be the leading student technical club that empowers future technology leaders,
              fostering an ecosystem where innovation thrives and every student has the opportunity
              to transform ideas into impactful solutions.
            </p>
          </AnimatedCard>

          <AnimatedCard delay={0.1} className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground">Our Mission</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              To bridge the gap between academic learning and industry requirements by providing
              students with practical exposure, mentorship, and opportunities to work on real-world
              projects that make a difference.
            </p>
          </AnimatedCard>
        </div>
      </Section>

      {/* Story */}
      <Section className="bg-card">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Our Story"
            subtitle="From a small group of passionate students to a thriving community"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-invert max-w-none"
          >
            <p className="text-muted-foreground text-lg mb-6">
              INFO CLUB was founded with a simple yet powerful idea: create a space where students
              passionate about technology could come together, learn, and build amazing things.
            </p>
            <p className="text-muted-foreground text-lg mb-6">
              What started as informal coding sessions has evolved into a comprehensive platform
              offering workshops, hackathons, industry talks, and collaborative projects. Our members
              have gone on to work at leading tech companies and launch successful startups.
            </p>
            <p className="text-muted-foreground text-lg">
              Today, INFO CLUB stands as a testament to what's possible when motivated individuals
              come together with a shared vision of learning and innovation.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Values */}
      <Section>
        <SectionHeader
          title="Our Values"
          subtitle="The principles that guide everything we do"
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, i) => (
            <AnimatedCard key={value.title} delay={i * 0.1} className="p-6 text-center">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <value.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-2">{value.title}</h3>
              <p className="text-muted-foreground text-sm">{value.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </Section>

      {/* Role in Department */}
      <Section className="bg-card">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeader
            title="Role in the Department"
            subtitle="How INFO CLUB contributes to student success"
          />
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Technical Training", desc: "Regular workshops on trending technologies" },
              { title: "Industry Connect", desc: "Guest lectures from industry professionals" },
              { title: "Project Mentorship", desc: "Guidance on academic and personal projects" },
            ].map((item, i) => (
              <AnimatedCard key={item.title} delay={i * 0.1} className="p-6">
                <h3 className="font-display text-lg font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
