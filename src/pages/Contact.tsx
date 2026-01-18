import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Sparkles, ArrowRight } from "lucide-react";
import { contactAPI } from "@/lib/api";
import PageLayout from "@/components/layout/PageLayout";
import { Section } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { GlowingOrbs, FloatingParticles } from "@/components/ui/ambient-effects";
import { GradientText } from "@/components/ui/animated-text";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await contactAPI.submit({
        name: formData.get("name") as string,
        email: formData.get("email") as string,
        message: formData.get("message") as string,
      });
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
    setIsSubmitting(false);
  };

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
            Get in <GradientText>Touch</GradientText>
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
          >
            Have questions or want to collaborate? We'd love to hear from you.
          </motion.p>
        </motion.div>
      </Section>

      {/* Contact Form - Dark section */}
      <Section variant="dark" spacing="lg">
        <div className="max-w-2xl mx-auto">
          {/* Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="rounded-2xl border border-border/50 bg-gradient-to-b from-card to-card/80 p-8 md:p-10 relative overflow-hidden"
          >
            {/* Accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">Send a Message</h2>
                <p className="text-muted-foreground text-sm">We'll get back to you soon</p>
              </div>
            </div>
            
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <Input name="name" placeholder="Your Name" required />
              <Input name="email" type="email" placeholder="Your Email" required />
              <Textarea name="message" placeholder="Your Message" rows={5} required />
              <Button type="submit" disabled={isSubmitting} size="lg" className="w-full group">
                <Send className="w-4 h-4 mr-2" /> 
                {isSubmitting ? "Sending..." : "Send Message"}
                <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Button>
            </form>
          </motion.div>
        </div>
        
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid md:grid-cols-3 gap-6"
        >
          {[
            { icon: MapPin, title: "Location", info: "Department of Information Technology, College Campus" },
            { icon: Mail, title: "Email", info: "infoclub@college.edu" },
            { icon: Phone, title: "Phone", info: "+91 XXXXX XXXXX" },
          ].map((item, i) => (
            <div 
              key={item.title}
              className="p-6 rounded-2xl border border-border/50 bg-card/30 backdrop-blur-sm text-center hover:border-primary/30 hover:bg-card/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground text-sm">{item.info}</p>
            </div>
          ))}
        </motion.div>
      </Section>
    </PageLayout>
  );
}
