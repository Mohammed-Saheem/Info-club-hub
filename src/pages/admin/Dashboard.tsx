import { useQuery } from "@tanstack/react-query";
import { Calendar, Code, Users, Image } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "@/components/ui/stats-card";

export default function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [events, projects, team, gallery] = await Promise.all([
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("team_members").select("id", { count: "exact", head: true }),
        supabase.from("gallery_photos").select("id", { count: "exact", head: true }),
      ]);
      return { events: events.count || 0, projects: projects.count || 0, team: team.count || 0, gallery: gallery.count || 0 };
    },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Calendar} value={String(stats?.events || 0)} label="Events" />
        <StatsCard icon={Code} value={String(stats?.projects || 0)} label="Projects" />
        <StatsCard icon={Users} value={String(stats?.team || 0)} label="Team Members" />
        <StatsCard icon={Image} value={String(stats?.gallery || 0)} label="Photos" />
      </div>
    </div>
  );
}
