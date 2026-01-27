import React, { useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2, Edit2, Plus, Upload, X, Image as ImageIcon } from "lucide-react";
import { galleryAPI, uploadAPI } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminGallery() {
  const [editingPhoto, setEditingPhoto] = useState<any | null>(null);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { data: photos } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: () => galleryAPI.getAll(),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => { await galleryAPI.delete(id); },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-gallery"] }); queryClient.invalidateQueries({ queryKey: ["gallery-photos"] }); toast.success("Photo deleted!"); },
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
      let imageUrl: string | undefined;

      if (imageFile) {
        try {
          const uploadResult = await uploadAPI.uploadImage(imageFile);
          imageUrl = uploadResult.url;
        } catch (error) {
          throw new Error("Failed to upload image");
        }
      } else {
        throw new Error("Image is required");
      }

      const payload = {
        image_url: imageUrl,
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
      };
      console.log("AdminGallery: Creating photo with payload:", payload);

      await galleryAPI.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast.success("Photo added!");
      setOpen(false);
      clearImage();
      setIsUploading(false);
    },
    onError: (error: Error) => {
      console.error("AdminGallery: Create failed", error);
      toast.error(error.message || "Failed to add photo");
      setIsUploading(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      if (!editingPhoto) return;
      const payload = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
      };
      console.log("AdminGallery: Updating photo with payload:", payload);

      await galleryAPI.update(editingPhoto.id, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      queryClient.invalidateQueries({ queryKey: ["gallery-photos"] });
      toast.success("Photo updated!");
      setOpen(false);
      setEditingPhoto(null);
      clearImage();
    },
    onError: () => toast.error("Failed to update photo"),
  });

  const handleEdit = (photo: any) => {
    setEditingPhoto(photo);
    setImagePreview(photo.image_url);
    setOpen(true);
  };

  const handleDialogChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      clearImage();
      setEditingPhoto(null);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Only update if we have an ID (meaning it's an existing photo from DB)
    // merely having editingPhoto set (due to preview state) is not enough
    if (editingPhoto?.id) {
      updateMutation.mutate(formData);
    } else {
      createMutation.mutate(formData);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="font-display text-3xl font-bold">Gallery</h1>
        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg transition-all hover:scale-105 active:scale-95">
              <Plus className="w-5 h-5 mr-2" />
              Add New Photo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{editingPhoto ? "Edit Photo Details" : "Add New Photo"}</DialogTitle>
            </DialogHeader>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Form */}
                <form id="gallery-form" onSubmit={handleSubmit} className="space-y-4">
                  {/* Image Upload Area */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Photo</label>
                    <div
                      className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${imagePreview
                        ? "border-primary/50 bg-primary/5"
                        : "border-border/50 hover:border-primary/30 hover:bg-muted/30"
                        }`}
                    >
                      {imagePreview ? (
                        <div className="relative aspect-video">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                          {!editingPhoto && (
                            <button
                              type="button"
                              onClick={clearImage}
                              className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center py-12 cursor-pointer hover:bg-muted/50 transition-colors rounded-lg group">
                          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                            <Upload className="w-8 h-8 text-primary" />
                          </div>
                          <span className="text-lg font-semibold text-foreground">Click to upload photo</span>
                          <span className="text-sm text-muted-foreground mt-2">Supports PNG, JPG (max 5MB)</span>
                          <div className="mt-4 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium">
                            Choose File
                          </div>
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

                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      defaultValue={editingPhoto?.title || ""}
                      placeholder="e.g. Hackathon 2024 Winners"
                      onChange={(e) => setEditingPhoto(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      defaultValue={editingPhoto?.category || ""}
                      placeholder="e.g. Event, Workshop"
                      onChange={(e) => setEditingPhoto(prev => ({ ...prev, category: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      defaultValue={editingPhoto?.description || ""}
                      placeholder="Describe what happened in this photo..."
                      rows={4}
                      onChange={(e) => setEditingPhoto(prev => ({ ...prev, description: e.target.value }))}
                    />
                  </div>
                </form>

                {/* Right Column: Live Preview */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Live Preview</h3>
                  <div className="relative group aspect-square rounded-2xl overflow-hidden bg-black/5 border border-border/50 shadow-sm sticky top-0">
                    {imagePreview ? (
                      <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted/30">No Image</div>
                    )}

                    {/* Overlay Preview (Mimicking Gallery.tsx) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />

                    {/* Category Badge */}
                    {(editingPhoto?.category || "Category") && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                          {editingPhoto?.category || "Category"}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white font-medium text-sm md:text-base line-clamp-1 drop-shadow-md">
                        {editingPhoto?.title || "Photo Title"}
                      </p>
                      <p className="text-white/70 text-xs line-clamp-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {editingPhoto?.description || "Description will appear here on hover"}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground text-center">
                    Values update as you type. Hover over the preview to see hover effects.
                  </div>
                </div>
              </div>
            </div>

            {/* Fixed Footer */}
            <div className="flex justify-end pt-4 border-t gap-2 mt-auto bg-background z-10">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" form="gallery-form" disabled={createMutation.isPending || updateMutation.isPending || isUploading}>
                {isUploading ? "Uploading..." : (editingPhoto?.id ? (updateMutation.isPending ? "Updating..." : "Save Changes") : (createMutation.isPending ? "Adding..." : "Add Photo"))}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos?.map((photo) => (
          <div key={photo.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
            <img src={photo.image_url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="secondary" size="icon" onClick={() => handleEdit(photo)}>
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button variant="destructive" size="icon" onClick={() => deleteMutation.mutate(photo.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            {photo.title && <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs truncate">{photo.title}</div>}
          </div>
        ))}
      </div>
      {!photos?.length && <div className="text-center py-16 text-muted-foreground">No photos in gallery</div>}
    </div>
  );
}
