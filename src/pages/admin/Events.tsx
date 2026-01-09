import { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Upload, X, Image as ImageIcon, Calendar, MapPin } from "lucide-react";
import { eventsAPI, uploadAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function AdminEvents() {
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const { data: events, isLoading } = useQuery({
    queryKey: ["admin-events"],
    queryFn: () => eventsAPI.getAll(),
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
      let bannerImageUrl: string | undefined;
      
      // Upload image first if selected
      if (imageFile) {
        try {
          const uploadResult = await uploadAPI.uploadImage(imageFile);
          bannerImageUrl = uploadResult.url;
        } catch (error) {
          throw new Error("Failed to upload image");
        }
      }

      await eventsAPI.create({
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        event_date: formData.get("date") as string,
        venue: formData.get("venue") as string,
        banner_image: bannerImageUrl,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-events"] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
      toast.success("Event created!");
      setOpen(false);
      clearImage();
      setIsUploading(false);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create event");
      setIsUploading(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await eventsAPI.delete(id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-events"] }); queryClient.invalidateQueries({ queryKey: ["events"] }); toast.success("Event deleted!"); },
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
        <h1 className="font-display text-3xl font-bold">Events</h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" /> Add Event</Button></DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>Add New Event</DialogTitle></DialogHeader>
            <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(new FormData(e.currentTarget)); }} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Event Banner</label>
                <div 
                  className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
                    imagePreview 
                      ? "border-primary/50 bg-primary/5" 
                      : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                  }`}
                >
                  {imagePreview ? (
                    <div className="relative aspect-video">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center py-8 cursor-pointer">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <span className="text-sm font-medium text-foreground">Click to upload image</span>
                      <span className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</span>
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
              </div>

              <Input name="title" placeholder="Event Title" required />
              <div className="grid grid-cols-2 gap-4">
                <Input name="date" type="date" required />
                <Input name="venue" placeholder="Venue" />
              </div>
              <Textarea name="description" placeholder="Description" rows={3} />
              <Button type="submit" className="w-full" disabled={createMutation.isPending || isUploading}>
                {isUploading ? "Uploading..." : createMutation.isPending ? "Creating..." : "Create Event"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left p-4 w-16">Image</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">Date</th>
              <th className="text-left p-4">Venue</th>
              <th className="p-4 w-16"></th>
            </tr>
          </thead>
          <tbody>
            {events?.map((event) => (
              <tr key={event.id} className="border-t border-border">
                <td className="p-4">
                  {event.banner_image ? (
                    <img 
                      src={event.banner_image} 
                      alt={event.title} 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </td>
                <td className="p-4 font-medium">{event.title}</td>
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {event.event_date}
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {event.venue && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </div>
                  )}
                </td>
                <td className="p-4">
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(event.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!events?.length && <div className="p-8 text-center text-muted-foreground">No events yet</div>}
      </div>
    </div>
  );
}
