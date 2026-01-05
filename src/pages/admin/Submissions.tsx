import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function AdminSubmissions() {
  const { data: contacts } = useQuery({
    queryKey: ["admin-contacts"],
    queryFn: async () => { const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }); return data || []; },
  });

  const { data: applications } = useQuery({
    queryKey: ["admin-applications"],
    queryFn: async () => { const { data } = await supabase.from("join_applications").select("*").order("created_at", { ascending: false }); return data || []; },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Submissions</h1>
      <Tabs defaultValue="contacts">
        <TabsList><TabsTrigger value="contacts">Contact Messages</TabsTrigger><TabsTrigger value="applications">Join Applications</TabsTrigger></TabsList>
        <TabsContent value="contacts" className="mt-6">
          <div className="space-y-4">
            {contacts?.map((c) => (
              <div key={c.id} className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between mb-2"><span className="font-medium">{c.name}</span><span className="text-muted-foreground text-sm">{format(new Date(c.created_at), "MMM d, yyyy")}</span></div>
                <p className="text-muted-foreground text-sm mb-2">{c.email}</p>
                <p className="text-foreground">{c.message}</p>
              </div>
            ))}
            {!contacts?.length && <div className="text-center py-16 text-muted-foreground">No messages yet</div>}
          </div>
        </TabsContent>
        <TabsContent value="applications" className="mt-6">
          <div className="space-y-4">
            {applications?.map((a) => (
              <div key={a.id} className="bg-card rounded-xl border border-border p-6">
                <div className="flex justify-between mb-2"><span className="font-medium">{a.name}</span><span className="text-muted-foreground text-sm">{format(new Date(a.created_at), "MMM d, yyyy")}</span></div>
                <p className="text-muted-foreground text-sm">{a.email} • {a.department} • {a.year_of_study}</p>
                {a.why_join && <p className="text-foreground mt-2">{a.why_join}</p>}
              </div>
            ))}
            {!applications?.length && <div className="text-center py-16 text-muted-foreground">No applications yet</div>}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
