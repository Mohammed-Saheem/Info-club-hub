import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2 } from "lucide-react";
import { teamAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminTeam() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => teamAPI.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await teamAPI.create({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string || undefined,
        linkedin_url: formData.get("linkedin") as string || undefined,
        github_url: formData.get("github") as string || undefined,
      });
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-team"] }); queryClient.invalidateQueries({ queryKey: ["team-members"] }); toast.success("Member added!"); setOpen(false); },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await teamAPI.delete(id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-team"] }); queryClient.invalidateQueries({ queryKey: ["team-members"] }); toast.success("Member removed!"); },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Team Members</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(new FormData(e.currentTarget)); }} className="space-y-4">
              <Input name="name" placeholder="Name" required />
              <Input name="role" placeholder="Role" required />
              <Input name="email" placeholder="Email" />
              <Input name="linkedin" placeholder="LinkedIn URL" />
              <Input name="github" placeholder="GitHub URL" />
              <Button type="submit" className="w-full">Add Member</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted"><tr><th className="text-left p-4">Name</th><th className="text-left p-4">Role</th><th className="text-left p-4">Email</th><th className="p-4"></th></tr></thead>
          <tbody>{members?.map((m) => (<tr key={m.id} className="border-t border-border"><td className="p-4 font-medium">{m.name}</td><td className="p-4 text-primary">{m.role}</td><td className="p-4 text-muted-foreground">{m.email}</td><td className="p-4"><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></td></tr>))}</tbody>
        </table>
        {!members?.length && <div className="p-8 text-center text-muted-foreground">No team members yet</div>}
      </div>
    </div>
  );
}
