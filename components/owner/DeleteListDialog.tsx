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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";
import { AlertTriangle } from "lucide-react";

interface DeleteListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  listType: string;
  totalAccounts: number;
}

export function DeleteListDialog({
  open,
  onOpenChange,
  listId,
  listType,
  totalAccounts,
}: DeleteListDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: () => accountService.deleteList(listId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownerAccounts"] });
      onOpenChange(false);
    },
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync();
    } catch (error) {
      console.error("Error deleting list:", error);
      alert("Có lỗi xảy ra khi xóa list");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Xóa List Account
          </DialogTitle>
          <DialogDescription>
            Thao tác này không thể hoàn tác!
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="font-semibold text-destructive mb-2">
              Bạn sắp xóa list: {listType}
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Tổng số account: {totalAccounts}</li>
              <li>• Tất cả ảnh liên quan sẽ bị xóa</li>
              <li>• Dữ liệu không thể khôi phục</li>
            </ul>
          </div>

          <p className="text-sm text-muted-foreground">
            Vui lòng xác nhận bạn muốn xóa list này và tất cả dữ liệu liên quan.
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Đang xóa..." : "Xác nhận xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
