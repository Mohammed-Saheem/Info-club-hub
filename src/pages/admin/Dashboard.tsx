import { useQuery } from "@tanstack/react-query";
import { Calendar, Users, Image, Mail, UserCog } from "lucide-react";
import { statsAPI } from "@/lib/api";
import { StatsCard } from "@/components/ui/stats-card";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => statsAPI.getAdminStats(),
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Calendar} value={String(stats?.events || 0)} label="Events" />
        <StatsCard icon={Users} value={String(stats?.team || 0)} label="Team Members" />
        <StatsCard icon={Image} value={String(stats?.gallery || 0)} label="Photos" />
        <StatsCard icon={Mail} value={String(stats?.submissions || 0)} label="Submissions" />
        <StatsCard icon={UserCog} value={String(stats?.users || 0)} label="Total Users" />
      </div>
    </div>
  );
}
