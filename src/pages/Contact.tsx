import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PageLayout from "@/components/layout/PageLayout";
import { Section, SectionHeader } from "@/components/ui/section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("contact_submissions").insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    });

    if (error) {
      toast.error("Failed to send message. Please try again.");
    } else {
      toast.success("Message sent successfully!");
      (e.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  const handleJoinSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    const { error } = await supabase.from("join_applications").insert({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      year_of_study: formData.get("year") as string,
      department: formData.get("department") as string,
      why_join: formData.get("why_join") as string,
    });

    if (error) {
      toast.error("Failed to submit application. Please try again.");
    } else {
      toast.success("Application submitted successfully!");
      (e.target as HTMLFormElement).reset();
    }
    setIsSubmitting(false);
  };

  return (
    <PageLayout>
      <section className="pt-24 pb-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Get in <span className="text-primary">Touch</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl">Have questions or want to join? We'd love to hear from you!</p>
          </motion.div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-card rounded-2xl border border-border p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Send a Message</h2>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <Input name="name" placeholder="Your Name" required />
              <Input name="email" type="email" placeholder="Your Email" required />
              <Textarea name="message" placeholder="Your Message" rows={4} required />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                <Send className="w-4 h-4 mr-2" /> {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>

          {/* Join Form */}
          <div className="bg-card rounded-2xl border border-border p-8">
            <h2 className="font-display text-2xl font-bold text-foreground mb-6">Join INFO CLUB</h2>
            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <Input name="name" placeholder="Full Name" required />
              <Input name="email" type="email" placeholder="Email" required />
              <Input name="phone" placeholder="Phone Number" />
              <Input name="year" placeholder="Year of Study" />
              <Input name="department" placeholder="Department" />
              <Textarea name="why_join" placeholder="Why do you want to join?" rows={3} />
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>
            </form>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
