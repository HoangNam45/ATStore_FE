"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2, Upload, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { games } from "@/data/games";
import { accountService } from "@/services/account.service";
import { useRouter } from "next/navigation";
import { validateImage, MAX_DETAIL_IMAGES } from "@/schemas/account.schema";

const ACCOUNT_TYPES = ["List Acc (Reroll)"];

interface Category {
  id: string;
  name: string;
  price: number;
  accounts: { username: string; password: string }[];
}

export default function NewAccountPage() {
  const router = useRouter();
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedServer, setSelectedServer] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [displayImage, setDisplayImage] = useState<File | null>(null);
  const [detailImages, setDetailImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get selected game data
  const selectedGameData = games.find((g) => g.slug === selectedGame);
  const availableServers = selectedGameData?.servers || [];
  const hasServers = availableServers.length > 0;

  const addCategory = () => {
    setCategories([
      ...categories,
      {
        id: Date.now().toString(),
        name: "",
        price: 0,
        accounts: [{ username: "", password: "" }],
      },
    ]);
  };

  const removeCategory = (id: string) => {
    setCategories(categories.filter((c) => c.id !== id));
  };

  const updateCategory = (
    id: string,
    field: keyof Category,
    value: string | number
  ) => {
    setCategories(
      categories.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const addAccount = (categoryId: string) => {
    setCategories(
      categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              accounts: [...c.accounts, { username: "", password: "" }],
            }
          : c
      )
    );
  };

  const removeAccount = (categoryId: string, index: number) => {
    setCategories(
      categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              accounts: c.accounts.filter((_, i) => i !== index),
            }
          : c
      )
    );
  };

  const updateAccount = (
    categoryId: string,
    index: number,
    field: "username" | "password",
    value: string
  ) => {
    setCategories(
      categories.map((c) =>
        c.id === categoryId
          ? {
              ...c,
              accounts: c.accounts.map((acc, i) =>
                i === index ? { ...acc, [field]: value } : acc
              ),
            }
          : c
      )
    );
  };

  const handleDisplayImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const error = validateImage(file);
      if (error) {
        alert(error);
        e.target.value = "";
        return;
      }
      setDisplayImage(file);
    }
  };

  const handleDetailImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const totalImages = detailImages.length + newFiles.length;

      if (totalImages > MAX_DETAIL_IMAGES) {
        alert(`Chỉ được tải tối đa ${MAX_DETAIL_IMAGES} ảnh chi tiết`);
        e.target.value = "";
        return;
      }

      for (const file of newFiles) {
        const error = validateImage(file);
        if (error) {
          alert(`${file.name}: ${error}`);
          e.target.value = "";
          return;
        }
      }

      setDetailImages([...detailImages, ...newFiles]);
    }
  };

  const removeDetailImage = (index: number) => {
    setDetailImages(detailImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedGame) {
      alert("Vui lòng chọn game");
      return;
    }
    if (hasServers && !selectedServer) {
      alert("Vui lòng chọn server");
      return;
    }
    if (!selectedType) {
      alert("Vui lòng chọn loại tài khoản");
      return;
    }
    if (!displayImage) {
      alert("Vui lòng tải ảnh hiển thị");
      return;
    }
    if (categories.length === 0) {
      alert("Vui lòng thêm ít nhất một phân loại");
      return;
    }

    for (const category of categories) {
      if (!category.name.trim()) {
        alert("Vui lòng điền tên phân loại");
        return;
      }
      if (category.price <= 0) {
        alert("Giá phải lớn hơn 0");
        return;
      }
      for (const account of category.accounts) {
        if (!account.username.trim() || !account.password.trim()) {
          alert("Vui lòng điền đầy đủ tài khoản và mật khẩu");
          return;
        }
      }
    }

    setIsSubmitting(true);

    try {
      await accountService.createAccount({
        game: selectedGame,
        server: selectedServer || undefined,
        type: selectedType,
        displayImage,
        detailImages,
        categories: categories.map((cat) => ({
          name: cat.name,
          price: cat.price,
          accounts: cat.accounts,
        })),
      });

      alert("Tạo tài khoản thành công!");
      router.push("/owner/accounts");
    } catch (error) {
      console.error("Error creating account:", error);
      alert("Có lỗi xảy ra khi tạo tài khoản");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2 md:gap-4">
        <Link href="/owner/accounts">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 md:h-10 md:w-10"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
        </Link>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-3xl font-bold text-foreground truncate">
            Thêm tài khoản mới
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">
            Điền thông tin tài khoản game để bán
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
        {/* Game Selection */}
        <Card className="p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
            Thông tin cơ bản
          </h2>
          <div className="space-y-4">
            <div>
              <Label>Chọn game *</Label>
              <Select value={selectedGame} onValueChange={setSelectedGame}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn game..." />
                </SelectTrigger>
                <SelectContent>
                  {games.map((game) => (
                    <SelectItem key={game.slug} value={game.slug}>
                      {game.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedGame && hasServers && (
              <div>
                <Label>Chọn server *</Label>
                <Select
                  value={selectedServer}
                  onValueChange={setSelectedServer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn server..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableServers.map((server) => (
                      <SelectItem key={server} value={server}>
                        {server}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {((selectedGame && selectedServer) ||
              (selectedGame && !hasServers)) && (
              <div>
                <Label>Loại tài khoản *</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài khoản..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ACCOUNT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Images */}
        {selectedType && (
          <Card className="p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
              Hình ảnh
            </h2>
            <div className="space-y-4 md:space-y-6">
              {/* Display Image */}
              <div>
                <Label className="text-xs md:text-sm">Ảnh hiển thị *</Label>
                <p className="text-[10px] md:text-xs text-muted-foreground mb-2">
                  Ảnh này sẽ hiển thị trên danh sách tài khoản
                </p>
                <div className="flex items-center gap-4">
                  {displayImage ? (
                    <div className="relative h-24 w-24 md:h-32 md:w-32 rounded-lg border border-border overflow-hidden">
                      <Image
                        src={URL.createObjectURL(displayImage)}
                        alt="Display"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => setDisplayImage(null)}
                        className="absolute top-1 right-1 rounded-full bg-destructive p-1"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex h-24 w-24 md:h-32 md:w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors">
                      <Upload className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                      <span className="mt-1 md:mt-2 text-[10px] md:text-xs text-muted-foreground">
                        Tải ảnh
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleDisplayImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* Detail Images */}
              <div>
                <Label className="text-xs md:text-sm">
                  Ảnh chi tiết (Tối đa 8 ảnh)
                </Label>
                <p className="text-[10px] md:text-xs text-muted-foreground mb-2">
                  Ảnh chi tiết về tài khoản, nhân vật, vật phẩm...
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  {detailImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative h-24 md:h-32 w-full rounded-lg border border-border overflow-hidden"
                    >
                      <Image
                        src={URL.createObjectURL(image)}
                        alt={`Detail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeDetailImage(index)}
                        className="absolute top-1 right-1 rounded-full bg-destructive p-1"
                      >
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                  {detailImages.length < 8 && (
                    <label className="flex h-24 md:h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border hover:border-primary transition-colors">
                      <Upload className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
                      <span className="mt-1 md:mt-2 text-[10px] md:text-xs text-muted-foreground">
                        Tải ảnh
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={handleDetailImagesChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Categories */}
        {selectedType && (
          <Card className="p-4 md:p-6">
            <div className="flex items-center justify-between mb-3 md:mb-4 gap-2">
              <h2 className="text-base md:text-lg font-semibold truncate">
                Phân loại tài khoản
              </h2>
              <Button
                type="button"
                onClick={addCategory}
                size="sm"
                className="shrink-0"
              >
                <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Thêm phân loại</span>
                <span className="sm:hidden">Thêm</span>
              </Button>
            </div>

            <div className="space-y-4 md:space-y-6">
              {categories.map((category, catIndex) => (
                <Card key={category.id} className="p-3 md:p-4 bg-accent/20">
                  <div className="flex items-start justify-between mb-3 md:mb-4">
                    <h3 className="text-xs md:text-sm font-semibold">
                      Phân loại #{catIndex + 1}
                    </h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCategory(category.id)}
                      className="h-7 w-7 md:h-9 md:w-9 p-0"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="space-y-3 md:space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <Label className="text-xs md:text-sm">
                          Tên phân loại *
                        </Label>
                        <Input
                          value={category.name}
                          onChange={(e) =>
                            updateCategory(category.id, "name", e.target.value)
                          }
                          placeholder=""
                          className="text-xs md:text-sm"
                        />
                      </div>
                      <div>
                        <Label className="text-xs md:text-sm">
                          Giá (VNĐ) *
                        </Label>
                        <Input
                          type="number"
                          value={category.price}
                          onChange={(e) =>
                            updateCategory(
                              category.id,
                              "price",
                              parseInt(e.target.value) || 0
                            )
                          }
                          placeholder="0"
                          className="text-xs md:text-sm"
                        />
                      </div>
                    </div>

                    {/* Accounts */}
                    <div>
                      <div className="flex items-center justify-between mb-2 gap-2">
                        <Label className="text-xs md:text-sm">
                          Tài khoản & mật khẩu
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addAccount(category.id)}
                          className="h-7 md:h-9 shrink-0"
                        >
                          <Plus className="mr-1 h-3 w-3" />
                          <span className="text-xs">Thêm</span>
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {category.accounts.map((account, accIndex) => (
                          <div key={accIndex} className="flex gap-1 md:gap-2">
                            <Input
                              value={account.username}
                              onChange={(e) =>
                                updateAccount(
                                  category.id,
                                  accIndex,
                                  "username",
                                  e.target.value
                                )
                              }
                              placeholder="Tài khoản"
                              className="flex-1 text-xs md:text-sm h-8 md:h-10"
                            />
                            <Input
                              value={account.password}
                              onChange={(e) =>
                                updateAccount(
                                  category.id,
                                  accIndex,
                                  "password",
                                  e.target.value
                                )
                              }
                              placeholder="Mật khẩu"
                              className="flex-1 text-xs md:text-sm h-8 md:h-10"
                            />
                            {category.accounts.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeAccount(category.id, accIndex)
                                }
                                className="h-8 w-8 md:h-10 md:w-10 shrink-0"
                              >
                                <Trash2 className="h-3 w-3 md:h-4 md:w-4 text-destructive" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {categories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Chưa có phân loại nào</p>
                  <p className="text-xs mt-1">
                    Nhấn &ldquo;Thêm phân loại&rdquo; để bắt đầu
                  </p>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Submit */}
        {categories.length > 0 && (
          <div className="flex justify-end gap-2 md:gap-4">
            <Link href="/owner/accounts">
              <Button
                type="button"
                variant="outline"
                className="text-xs md:text-sm"
                disabled={isSubmitting}
              >
                Hủy
              </Button>
            </Link>
            <Button
              type="submit"
              className="bg-primary text-xs md:text-sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu tài khoản"}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
