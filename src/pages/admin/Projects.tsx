import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminProjects() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: projects } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => { const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false }); return data || []; },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const techStack = (formData.get("tech_stack") as string).split(",").map(t => t.trim()).filter(Boolean);
      await supabase.from("projects").insert({ title: formData.get("title") as string, description: formData.get("description") as string, tech_stack: techStack, github_url: formData.get("github_url") as string, demo_url: formData.get("demo_url") as string });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Project created!"); setOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await supabase.from("projects").delete().eq("id", id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-projects"] }); toast.success("Project deleted!"); },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Projects</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Project</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add New Project</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(new FormData(e.currentTarget)); }} className="space-y-4">
              <Input name="title" placeholder="Project Title" required />
              <Textarea name="description" placeholder="Description" />
              <Input name="tech_stack" placeholder="Tech Stack (comma separated)" />
              <Input name="github_url" placeholder="GitHub URL" />
              <Input name="demo_url" placeholder="Demo URL" />
              <Button type="submit" className="w-full">Create Project</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted"><tr><th className="text-left p-4">Title</th><th className="text-left p-4">Tech Stack</th><th className="p-4"></th></tr></thead>
          <tbody>{projects?.map((p) => (<tr key={p.id} className="border-t border-border"><td className="p-4 font-medium">{p.title}</td><td className="p-4 text-muted-foreground">{p.tech_stack?.join(", ")}</td><td className="p-4"><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></td></tr>))}</tbody>
        </table>
        {!projects?.length && <div className="p-8 text-center text-muted-foreground">No projects yet</div>}
      </div>
    </div>
  );
}
