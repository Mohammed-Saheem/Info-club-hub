import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminEvents() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
      return data || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const { error } = await supabase.from("events").insert({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        event_date: formData.get("date") as string,
        venue: formData.get("venue") as string,
      });
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-events"] }); toast.success("Event created!"); setOpen(false); },
    onError: () => toast.error("Failed to create event"),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from("events").delete().eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-events"] }); toast.success("Event deleted!"); },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Events</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Event</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(new FormData(e.currentTarget)); }} className="space-y-4">
              <Input name="title" placeholder="Event Title" required />
              <Input name="date" type="date" required />
              <Input name="venue" placeholder="Venue" />
              <Textarea name="description" placeholder="Description" />
              <Button type="submit" className="w-full">Create Event</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted"><tr><th className="text-left p-4">Title</th><th className="text-left p-4">Date</th><th className="text-left p-4">Venue</th><th className="p-4"></th></tr></thead>
          <tbody>{events?.map((event) => (<tr key={event.id} className="border-t border-border"><td className="p-4 font-medium">{event.title}</td><td className="p-4 text-muted-foreground">{event.event_date}</td><td className="p-4 text-muted-foreground">{event.venue}</td><td className="p-4"><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(event.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></td></tr>))}</tbody>
        </table>
        {!events?.length && <div className="p-8 text-center text-muted-foreground">No events yet</div>}
      </div>
    </div>
  );
}
