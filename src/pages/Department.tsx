import { motion } from "framer-motion";
import { 
  Code, Database, Cloud, Smartphone, Brain, Shield, 
  Globe, Server, Cpu, Layers, Sparkles, GraduationCap
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader, SectionDivider } from "@/components/ui/section";
import { AnimatedCard, FeatureCard, StatsCard } from "@/components/ui/animated-card";

const technologies = [
  { icon: Code, name: "Web Development", desc: "HTML, CSS, JavaScript, React" },
  { icon: Database, name: "Database Systems", desc: "SQL, MongoDB, PostgreSQL" },
  { icon: Cloud, name: "Cloud Computing", desc: "AWS, Azure, Google Cloud" },
  { icon: Smartphone, name: "Mobile Development", desc: "React Native, Flutter" },
  { icon: Brain, name: "AI & Machine Learning", desc: "Python, TensorFlow, PyTorch" },
  { icon: Shield, name: "Cybersecurity", desc: "Network Security, Ethical Hacking" },
  { icon: Globe, name: "Internet of Things", desc: "Arduino, Raspberry Pi" },
  { icon: Server, name: "DevOps", desc: "Docker, Kubernetes, CI/CD" },
];

const focusAreas = [
  {
    title: "Academic Excellence",
    description: "Supporting curriculum learning with practical applications and project-based learning.",
    icon: GraduationCap,
  },
  {
    title: "Industry Readiness",
    description: "Preparing students for real-world challenges through internships and industry projects.",
    icon: Cpu,
  },
  {
    title: "Research & Innovation",
    description: "Encouraging research initiatives and participation in national and international competitions.",
    icon: Brain,
  },
];

const stats = [
  { value: "500+", label: "Students" },
  { value: "25+", label: "Faculty Members" },
  { value: "10+", label: "Labs" },
  { value: "95%", label: "Placement Rate" },
];

export default function Department() {
  return (
    <PageLayout>
      {/* Hero - Gold gradient from left to black right */}
      <Section variant="hero" spacing="hero">
        {/* Extra gold glow on left side */}
        <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[radial-gradient(ellipse_80%_100%_at_0%_30%,hsl(43,65%,56%,0.12),transparent_70%)] pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-[1.1]">
            Department of{" "}
            <span className="text-gradient-gold">Information Technology</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
            Shaping future technologists with cutting-edge education and practical training.
          </p>
        </motion.div>
      </Section>

      {/* Overview - Dark section */}
      <Section variant="dark" spacing="lg">
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Department Overview"
            subtitle="Excellence in IT education since establishment"
            badge="About Us"
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6 text-center"
          >
            <p className="text-muted-foreground text-lg leading-relaxed">
              The Department of Information Technology is committed to providing quality education
              that combines theoretical foundations with practical skills. Our curriculum is designed
              to meet the evolving demands of the IT industry while fostering innovation and creativity.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              With state-of-the-art laboratories, experienced faculty, and strong industry connections,
              we prepare our students to become leaders in the technology sector.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Technologies - Grey section */}
      <Section variant="grey" spacing="lg">
        <SectionHeader
          title="Technologies We Cover"
          subtitle="Stay updated with the latest in tech"
          badge="Curriculum"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="p-5 lg:p-6 rounded-2xl border border-primary/10 bg-[hsl(220,15%,6%)] text-center hover:border-primary/30 hover:shadow-gold-soft transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <tech.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-heading text-sm lg:text-base font-bold text-foreground mb-1">{tech.name}</h3>
                <p className="text-muted-foreground text-xs lg:text-sm">{tech.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Focus Areas - Dark section */}
      <Section variant="dark" spacing="lg">
        <SectionHeader
          title="Focus Areas"
          subtitle="Our approach to holistic IT education"
          badge="Approach"
        />
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {focusAreas.map((area, i) => (
            <FeatureCard
              key={area.title}
              icon={area.icon}
              title={area.title}
              description={area.description}
              delay={i * 0.1}
            />
          ))}
        </div>
      </Section>

      {/* Stats - Grey section */}
      <Section variant="grey" spacing="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <StatsCard
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={i * 0.1}
            />
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
