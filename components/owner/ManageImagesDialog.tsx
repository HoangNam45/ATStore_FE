"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";
import Image from "next/image";
import { X, Upload, ImagePlus } from "lucide-react";

interface ManageImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  listType: string;
  currentDisplayImage: string;
  currentDetailImages: string[];
}

export function ManageImagesDialog({
  open,
  onOpenChange,
  listId,
  listType,
  currentDisplayImage,
  currentDetailImages,
}: ManageImagesDialogProps) {
  const [displayImage, setDisplayImage] = useState<File | null>(null);
  const [displayImagePreview, setDisplayImagePreview] =
    useState<string>(currentDisplayImage);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const [detailImagePreviews, setDetailImagePreviews] =
    useState<string[]>(currentDetailImages);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (formData: FormData) =>
      accountService.updateListImages(listId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownerAccounts"] });
      onOpenChange(false);
    },
  });

  const handleDisplayImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDisplayImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisplayImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setDetailImages((prev) => [...prev, ...files]);

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setDetailImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveDetailImage = (index: number) => {
    const imageUrl = detailImagePreviews[index];

    // If it's an existing image (URL), mark it for deletion
    if (imageUrl.startsWith("http")) {
      setImagesToDelete((prev) => [...prev, imageUrl]);
    }

    setDetailImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setDetailImages((prev) => {
      // Calculate the actual index in the new files array
      const existingCount = currentDetailImages.length;
      const newFileIndex = index - existingCount + imagesToDelete.length;
      if (newFileIndex >= 0) {
        return prev.filter((_, i) => i !== newFileIndex);
      }
      return prev;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      if (displayImage) {
        formData.append("displayImage", displayImage);
      }

      detailImages.forEach((file) => {
        formData.append("detailImages", file);
      });

      if (imagesToDelete.length > 0) {
        formData.append("imagesToDelete", JSON.stringify(imagesToDelete));
      }

      await updateMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error updating images:", error);
      alert("Có lỗi xảy ra khi cập nhật ảnh");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý ảnh - {listType}</DialogTitle>
          <DialogDescription>
            Cập nhật ảnh hiển thị và ảnh chi tiết cho list
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Display Image */}
          <div className="space-y-3">
            <Label>Ảnh hiển thị</Label>
            <div className="flex items-start gap-4">
              <div className="relative w-32 h-32 shrink-0 rounded-lg overflow-hidden border">
                <Image
                  src={displayImagePreview}
                  alt="Display"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleDisplayImageChange}
                  className="hidden"
                  id="display-image-input"
                />
                <label htmlFor="display-image-input">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById("display-image-input")?.click();
                    }}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Thay đổi ảnh
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  Tỉ lệ khuyến nghị: 3:2 (VD: 600x400px)
                </p>
              </div>
            </div>
          </div>

          {/* Detail Images */}
          <div className="space-y-3">
            <Label>Ảnh chi tiết</Label>
            <div className="grid grid-cols-3 gap-3">
              {detailImagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative aspect-square rounded-lg overflow-hidden border group"
                >
                  <Image
                    src={preview}
                    alt={`Detail ${index + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDetailImage(index)}
                    className="absolute top-1 right-1 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}

              {/* Add more button */}
              <div className="relative aspect-square rounded-lg border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleDetailImagesChange}
                  className="hidden"
                  id="detail-images-input"
                />
                <label
                  htmlFor="detail-images-input"
                  className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer"
                >
                  <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                  <span className="text-xs text-muted-foreground">
                    Thêm ảnh
                  </span>
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Click vào dấu X để xóa ảnh. Tỉ lệ khuyến nghị: 1:1 (vuông)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
