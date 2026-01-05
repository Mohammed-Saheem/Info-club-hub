import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  icon: LucideIcon;
  value: string;
  label: string;
  delay?: number;
}

export function StatsCard({ icon: Icon, value, label, delay = 0 }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="glass rounded-2xl p-6 text-center hover:shadow-gold transition-shadow duration-300"
    >
      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
        <Icon className="w-7 h-7 text-primary" />
      </div>
      <div className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
        {value}
      </div>
      <div className="text-muted-foreground text-sm">{label}</div>
    </motion.div>
  );
}
