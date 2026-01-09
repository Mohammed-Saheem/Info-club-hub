import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { galleryAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminGallery() {
  const queryClient = useQueryClient();
  const { data: photos } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => galleryAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await galleryAPI.delete(id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }); queryClient.invalidateQueries({ queryKey: ["gallery-photos"] }); toast.success("Photo deleted!"); },
  });

  return (
    <div>
      <h1 className="font-display text-3xl font-bold mb-8">Gallery</h1>
      <p className="text-muted-foreground mb-6">Upload photos via the storage bucket. Photos added there will appear here.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
            <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteMutation.mutate(photo.id)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        ))}
      </div>
      {!photos?.length && <div className="text-center py-16 text-muted-foreground">No photos in gallery</div>}
    </div>
  );
}
