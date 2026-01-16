import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, X, User } from "lucide-react";
import { teamAPI, uploadAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminTeam() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: members } = useQuery({
    queryKey: ["admin-team"],
    queryFn: () => teamAPI.getAll(),
  });

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

      await teamAPI.create({
        name: formData.get("name") as string,
        role: formData.get("role") as string,
        email: formData.get("email") as string || undefined,
        linkedin_url: formData.get("linkedin") as string || undefined,
        github_url: formData.get("github") as string || undefined,
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

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      clearImage();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Team Members</h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Member</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add Team Member</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(new FormData(e.currentTarget)); }} className="space-y-4">
              {/* Profile Photo Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Profile Photo</label>
                <div className="flex items-center gap-4">
                  <div 
                    className={`relative w-24 h-24 rounded-full overflow-hidden border-2 border-dashed transition-all duration-200 ${
                      imagePreview 
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

              <Input name="name" placeholder="Name" required />
              <Input name="role" placeholder="Role" required />
              <Input name="email" placeholder="Email" />
              <Input name="linkedin" placeholder="LinkedIn URL" />
              <Input name="github" placeholder="GitHub URL" />
              <Button type="submit" className="w-full" disabled={createMutation.isPending || isUploading}>
                {isUploading ? "Uploading..." : "Add Member"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted"><tr><th className="text-left p-4">Photo</th><th className="text-left p-4">Name</th><th className="text-left p-4">Role</th><th className="text-left p-4">Email</th><th className="p-4"></th></tr></thead>
          <tbody>{members?.map((m) => (
            <tr key={m.id} className="border-t border-border">
              <td className="p-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                  {m.photo_url ? (
                    <img src={m.photo_url} alt={m.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </td>
              <td className="p-4 font-medium">{m.name}</td>
              <td className="p-4 text-primary">{m.role}</td>
              <td className="p-4 text-muted-foreground">{m.email}</td>
              <td className="p-4"><Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(m.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button></td>
            </tr>
          ))}</tbody>
        </table>
        {!members?.length && <div className="p-8 text-center text-muted-foreground">No team members yet</div>}
      </div>
    </div>
  );
}
