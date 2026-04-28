"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountService } from "@/services/account.service";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  categoryId: string;
  accountId: string;
  currentCredentials?: string; // New format
  currentUsername?: string; // Old format
  currentPassword?: string; // Old format
  currentStatus: "available" | "sold";
}

export function EditAccountDialog({
  open,
  onOpenChange,
  listId,
  categoryId,
  accountId,
  currentCredentials,
  currentUsername,
  currentPassword,
  currentStatus,
}: EditAccountDialogProps) {
  // Determine format: new (credentials) or old (username + password)
  const isNewFormat = !!currentCredentials;

  const [credentials, setCredentials] = useState(currentCredentials || "");
  const [username, setUsername] = useState(currentUsername || "");
  const [password, setPassword] = useState(currentPassword || "");
  const [status, setStatus] = useState<"available" | "sold">(currentStatus);
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: () => {
      if (isNewFormat) {
        return accountService.updateAccount(
          listId,
          categoryId,
          accountId,
          credentials,
          status,
        );
      } else {
        // For old format, we need to handle username/password
        // Send as credentials with separator for now
        return accountService.updateAccount(
          listId,
          categoryId,
          accountId,
          `${username}:${password}`,
          status,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ownerAccounts"] });
      onOpenChange(false);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin tài khoản và trạng thái.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {isNewFormat ? (
              <div className="grid gap-2">
                <Label htmlFor="credentials">Thông tin tài khoản</Label>
                <textarea
                  id="credentials"
                  value={credentials}
                  onChange={(e) => setCredentials(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md text-sm"
                  rows={4}
                />
              </div>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="username">Tài khoản</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tài khoản"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    required
                  />
                </div>
              </>
            )}
            <div className="grid gap-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={status}
                onValueChange={(value) =>
                  setStatus(value as "available" | "sold")
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Có sẵn</SelectItem>
                  <SelectItem value="sold">Đã bán</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
