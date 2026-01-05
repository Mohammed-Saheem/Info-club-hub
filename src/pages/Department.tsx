import { motion } from "framer-motion";
import { 
  Code, Database, Cloud, Smartphone, Brain, Shield, 
  Globe, Server, Cpu, Layers
} from "lucide-react";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader } from "@/components/ui/section";
import { AnimatedCard } from "@/components/ui/animated-card";

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
    icon: Layers,
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

export default function Department() {
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
              Department of <span className="text-primary">Information Technology</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">
              Shaping future technologists with cutting-edge education and practical training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <Section>
        <div className="max-w-4xl mx-auto">
          <SectionHeader
            title="Department Overview"
            subtitle="Excellence in IT education since establishment"
          />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground text-lg mb-6 text-center">
              The Department of Information Technology is committed to providing quality education
              that combines theoretical foundations with practical skills. Our curriculum is designed
              to meet the evolving demands of the IT industry while fostering innovation and creativity.
            </p>
            <p className="text-muted-foreground text-lg text-center">
              With state-of-the-art laboratories, experienced faculty, and strong industry connections,
              we prepare our students to become leaders in the technology sector.
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Technologies */}
      <Section className="bg-card">
        <SectionHeader
          title="Technologies We Cover"
          subtitle="Stay updated with the latest in tech"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {technologies.map((tech, i) => (
            <AnimatedCard key={tech.name} delay={i * 0.05} className="p-4 text-center">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <tech.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display text-sm font-bold text-foreground mb-1">{tech.name}</h3>
              <p className="text-muted-foreground text-xs">{tech.desc}</p>
            </AnimatedCard>
          ))}
        </div>
      </Section>

      {/* Focus Areas */}
      <Section>
        <SectionHeader
          title="Focus Areas"
          subtitle="Our approach to holistic IT education"
        />
        <div className="grid md:grid-cols-3 gap-6">
          {focusAreas.map((area, i) => (
            <AnimatedCard key={area.title} delay={i * 0.1} className="p-8">
              <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                <area.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-3">{area.title}</h3>
              <p className="text-muted-foreground">{area.description}</p>
            </AnimatedCard>
          ))}
        </div>
      </Section>

      {/* Stats */}
      <Section className="bg-card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "500+", label: "Students" },
            { value: "25+", label: "Faculty Members" },
            { value: "10+", label: "Labs" },
            { value: "95%", label: "Placement Rate" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>
    </PageLayout>
  );
}
