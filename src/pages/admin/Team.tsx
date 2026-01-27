import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, X, User, GripVertical } from "lucide-react";
import { teamAPI, uploadAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Reorder } from "framer-motion";

export default function AdminTeam() {
  const [open, setOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [orderedMembers, setOrderedMembers] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: members, isSuccess } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => teamAPI.getAll(),
  });

  useEffect(() => {
    if (isSuccess && members) {
      setOrderedMembers(members);
    }
  }, [members, isSuccess]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setIsUploading(true);
      let photoUrl: string | undefined;

      // Upload image first if selected
      if (imageFile) {
        try {
          const uploadResult = await uploadAPI.uploadImage(imageFile);
          photoUrl = uploadResult.url;
        } catch (error) {
          throw new Error("Failed to upload image");
        }
      }

      // Calculate next display_order
      const maxOrder = orderedMembers.length > 0
        ? Math.max(...orderedMembers.map(m => m.display_order || 0))
        : 0;

      await teamAPI.create({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string || undefined,
        linkedin_url: formData.get("linkedin") as string || undefined,
        github_url: formData.get("github") as string || undefined,
        display_order: maxOrder + 1,
        photo_url: photoUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Member added!");
      setOpen(false);
      clearImage();
      setIsUploading(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add member");
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await teamAPI.delete(id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-team"] }); queryClient.invalidateQueries({ queryKey: ["team-members"] }); toast.success("Member removed!"); },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!editingMember) return;
      setIsUploading(true);
      let photoUrl = editingMember.photo_url;

      if (imageFile) {
        try {
          const uploadResult = await uploadAPI.uploadImage(imageFile);
          photoUrl = uploadResult.url;
        } catch (error) {
          throw new Error("Failed to upload image");
        }
      }

      await teamAPI.update(editingMember.id, {
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string || undefined,
        linkedin_url: formData.get("linkedin") as string || undefined,
        github_url: formData.get("github") as string || undefined,
        // Keep existing order
        photo_url: photoUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
      queryClient.invalidateQueries({ queryKey: ["team-members"] });
      toast.success("Member updated!");
      setOpen(false);
      setEditingMember(null);
      clearImage();
      setIsUploading(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member");
      setIsUploading(false);
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async (newOrder: any[]) => {
      // Map to required format { id, display_order }
      const updates = newOrder.map((member, index) => ({
        id: member.id,
        display_order: index + 1
      }));
      await teamAPI.reorder(updates);
    },
    onError: () => {
      toast.error("Failed to save order");
      queryClient.invalidateQueries({ queryKey: ["admin-team"] });
    }
  });

  const handleReorder = (newOrder: any[]) => {
    setOrderedMembers(newOrder);
    reorderMutation.mutate(newOrder);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (editingMember) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      clearImage();
      setEditingMember(null);
    }
  };

  const handleEdit = (member: any) => {
    setEditingMember(member);
    setImagePreview(member.photo_url);
    setOpen(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Team Members</h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild><Button onClick={() => { setEditingMember(null); clearImage(); }}><Plus className="w-4 h-4 mr-2" /> Add Member</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editingMember ? "Edit Team Member" : "Add Team Member"}</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div
                    className={`relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed transition-all duration-200 ${imagePreview
                      ? "border-primary/50 bg-primary/5"
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                      }`}
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={clearImage}
                          className="absolute top-0 right-0 w-6 h-6 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                        <User className="w-8 h-8 text-muted-foreground" />
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                  {!imagePreview && (
                    <div className="text-sm text-muted-foreground">
                      <p>Click to upload photo</p>
                      <p className="text-xs">PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>

              <Input name="name" defaultValue={editingMember?.name} placeholder="Name" required />
              <Input name="role" defaultValue={editingMember?.role} placeholder="Role" required />
              <Input name="email" defaultValue={editingMember?.email || ""} placeholder="Email" />
              <Input name="linkedin" defaultValue={editingMember?.linkedin_url || ""} placeholder="LinkedIn URL" />
              <Input name="github" defaultValue={editingMember?.github_url || ""} placeholder="GitHub URL" />
              <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
                {isUploading ? "Uploading..." : (editingMember ? (updateMutation.isPending ? "Updating..." : "Update Member") : (createMutation.isPending ? "Adding..." : "Add Member"))}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="bg-muted grid grid-cols-[auto_auto_1fr_1fr_1fr_auto] gap-4 p-4 font-medium text-sm text-muted-foreground border-b border-border">
          <div className="w-8"></div>
          <div>Photo</div>
          <div>Name</div>
          <div>Role</div>
          <div>Email</div>
          <div>Actions</div>
        </div>

        <Reorder.Group axis="y" values={orderedMembers} onReorder={handleReorder} className="divide-y divide-border">
          {orderedMembers.map((m) => (
            <Reorder.Item key={m.id} value={m} className="bg-card grid grid-cols-[auto_auto_1fr_1fr_1fr_auto] gap-4 p-4 items-center hover:bg-muted/30 transition-colors">
              <div className="w-8 cursor-grab active:cursor-grabbing flex items-center justify-center text-muted-foreground hover:text-foreground">
                <GripVertical className="w-5 h-5" />
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="font-medium">{m.name}</div>
              <div className="text-primary">{m.role}</div>
              <div className="text-muted-foreground text-sm truncate">{m.email}</div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(m)}>Edit</Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>

        {!members?.length && <div className="p-8 text-center text-muted-foreground">No team members yet</div>}
      </div>
    </div>
  );
}
