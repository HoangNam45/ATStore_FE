"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  ChevronDown,
  ChevronRight,
  Edit,
  Eye,
  EyeOff,
  Filter,
  X,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { games as availableGames } from "@/data/games";
import {
  accountService,
  type GameAccountsGroup,
  type AccountCredential,
} from "@/services/account.service";
import { useQuery } from "@tanstack/react-query";
import { EditListDialog } from "@/components/owner/EditListDialog";
import { EditCategoryDialog } from "@/components/owner/EditCategoryDialog";
import { EditAccountDialog } from "@/components/owner/EditAccountDialog";
import { AddAccountDialog } from "@/components/owner/AddAccountDialog";
import { DeleteAccountDialog } from "@/components/owner/DeleteAccountDialog";

export default function AccountsPage() {
  const { data: gameAccountsGroups = [], error } = useQuery<
    GameAccountsGroup[]
  >({
    queryKey: ["ownerAccounts"],
    queryFn: () => accountService.getAllAccountsGroupedByGame(),
  });

  const [openGames, setOpenGames] = useState<Record<string, boolean>>({});
  const [openLists, setOpenLists] = useState<Record<string, boolean>>({});
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>(
    {}
  );
  const [selectedGameSlugs, setSelectedGameSlugs] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "available" | "sold"
  >("all");

  // Edit dialog states
  const [editingList, setEditingList] = useState<{
    listId: string;
    currentType: string;
  } | null>(null);
  const [editingCategory, setEditingCategory] = useState<{
    listId: string;
    categoryId: string;
    currentName: string;
    currentPrice: number;
  } | null>(null);
  const [editingAccount, setEditingAccount] = useState<{
    listId: string;
    categoryId: string;
    accountId: string;
    currentUsername: string;
    currentPassword: string;
    currentStatus: "available" | "sold";
  } | null>(null);
  const [addingAccountTo, setAddingAccountTo] = useState<{
    listId: string;
    categoryId: string;
  } | null>(null);
  const [deletingAccount, setDeletingAccount] = useState<{
    listId: string;
    categoryId: string;
    accountId: string;
  } | null>(null);

  const filteredGames =
    selectedGameSlugs.length === 0
      ? gameAccountsGroups
      : gameAccountsGroups.filter((game) =>
          selectedGameSlugs.includes(game.slug)
        );

  const toggleGameFilter = (slug: string) => {
    setSelectedGameSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const clearFilters = () => {
    setSelectedGameSlugs([]);
  };

  const toggleGame = (gameSlug: string) => {
    setOpenGames((prev) => ({ ...prev, [gameSlug]: !prev[gameSlug] }));
  };

  const toggleList = (listId: string) => {
    setOpenLists((prev) => ({ ...prev, [listId]: !prev[listId] }));
  };

  const toggleCategory = (categoryId: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const togglePassword = (accountId: string) => {
    setShowPasswords((prev) => ({ ...prev, [accountId]: !prev[accountId] }));
  };

  const filterAndSortAccounts = (accounts: AccountCredential[]) => {
    let filtered = accounts;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((account) => account.status === statusFilter);
    }

    // Sort: available first, then sold
    return filtered.sort((a, b) => {
      if (a.status === "available" && b.status === "sold") return -1;
      if (a.status === "sold" && b.status === "available") return 1;
      return 0;
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-4 md:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg md:text-3xl font-bold text-foreground truncate">
            Quản lý tài khoản
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-1 truncate">
            Quản lý tất cả tài khoản game đang bán
          </p>
        </div>
        <Link href="/owner/accounts/new" className="shrink-0">
          <Button className="bg-primary text-primary-foreground h-8 md:h-10 text-xs md:text-sm">
            <Plus className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Thêm tài khoản</span>
            <span className="sm:hidden">Thêm</span>
          </Button>
        </Link>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 gap-2">
              <Filter className="h-4 w-4" />
              <span>Lọc theo game</span>
              {selectedGameSlugs.length > 0 && (
                <span className="ml-1 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                  {selectedGameSlugs.length}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-64">
            <DropdownMenuLabel>Chọn game</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {availableGames.map((game) => (
              <DropdownMenuCheckboxItem
                key={game.slug}
                checked={selectedGameSlugs.includes(game.slug)}
                onCheckedChange={() => toggleGameFilter(game.slug)}
              >
                {game.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedGameSlugs.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 gap-1"
          >
            <X className="h-4 w-4" />
            <span>Xóa bộ lọc</span>
          </Button>
        )}
      </div>

      {/* Games List */}
      <div className="space-y-4">
        {error ? (
          <Card className="p-8 text-center">
            <p className="text-destructive mb-2">
              Có lỗi xảy ra khi tải dữ liệu
            </p>
            <p className="text-xs text-muted-foreground">
              {error instanceof Error ? error.message : "Unknown error"}
            </p>
          </Card>
        ) : filteredGames.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">Không tìm thấy game nào</p>
          </Card>
        ) : (
          filteredGames.map((game) => (
            <Card key={game.slug} className="overflow-hidden">
              <Collapsible
                open={openGames[game.slug]}
                onOpenChange={() => toggleGame(game.slug)}
              >
                <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
                  <CollapsibleTrigger className="flex items-center gap-3 flex-1 text-left">
                    {openGames[game.slug] ? (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <h3 className="text-lg font-semibold text-foreground">
                      {game.game}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      ({game.lists.length} lists)
                    </span>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <div className="px-4 pb-4 space-y-3">
                    {/* Lists */}
                    {game.lists.map((list) => (
                      <Card key={list.id} className="border-2">
                        <Collapsible
                          open={openLists[list.id]}
                          onOpenChange={() => toggleList(list.id)}
                        >
                          <div className="flex items-center justify-between p-3 hover:bg-accent/50 transition-colors">
                            <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                              {openLists[list.id] ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="font-medium text-foreground">
                                {list.type}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                ({list.categories.length} categories)
                              </span>
                            </CollapsibleTrigger>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingList({
                                  listId: list.id,
                                  currentType: list.type,
                                });
                              }}
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </div>

                          <CollapsibleContent>
                            <div className="px-3 pb-3 space-y-2">
                              {/* Categories */}
                              {list.categories.map((category) => (
                                <Card key={category.id} className="border">
                                  <Collapsible
                                    open={openCategories[category.id]}
                                    onOpenChange={() =>
                                      toggleCategory(category.id)
                                    }
                                  >
                                    <div className="flex items-center justify-between p-2.5 hover:bg-accent/50 transition-colors">
                                      <CollapsibleTrigger className="flex items-center gap-2 flex-1 text-left">
                                        {openCategories[category.id] ? (
                                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="text-sm font-medium text-foreground">
                                          {category.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                          ({category.accounts.length} accounts)
                                        </span>
                                      </CollapsibleTrigger>
                                      <div className="flex items-center gap-1">
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setAddingAccountTo({
                                              listId: list.id,
                                              categoryId: category.id,
                                            });
                                          }}
                                        >
                                          <Plus className="h-3 w-3" />
                                        </Button>
                                        <DropdownMenu>
                                          <DropdownMenuTrigger
                                            asChild
                                            onClick={(e) => e.stopPropagation()}
                                          >
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              className="h-6 w-6"
                                            >
                                              <Filter className="h-3 w-3" />
                                            </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent
                                            align="end"
                                            className="w-40"
                                          >
                                            <DropdownMenuLabel>
                                              Trạng thái
                                            </DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuCheckboxItem
                                              checked={statusFilter === "all"}
                                              onCheckedChange={() =>
                                                setStatusFilter("all")
                                              }
                                            >
                                              Tất cả
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                              checked={
                                                statusFilter === "available"
                                              }
                                              onCheckedChange={() =>
                                                setStatusFilter("available")
                                              }
                                            >
                                              Có sẵn
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                              checked={statusFilter === "sold"}
                                              onCheckedChange={() =>
                                                setStatusFilter("sold")
                                              }
                                            >
                                              Đã bán
                                            </DropdownMenuCheckboxItem>
                                          </DropdownMenuContent>
                                        </DropdownMenu>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-6 w-6"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingCategory({
                                              listId: list.id,
                                              categoryId: category.id,
                                              currentName: category.name,
                                              currentPrice: category.price,
                                            });
                                          }}
                                        >
                                          <Edit className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>

                                    <CollapsibleContent>
                                      <div className="px-2.5 pb-2.5 space-y-2">
                                        {/* Accounts */}
                                        {filterAndSortAccounts(
                                          category.accounts
                                        ).map((account) => (
                                          <Card
                                            key={account.id}
                                            className={`p-3 ${
                                              account.status === "sold"
                                                ? "opacity-50 bg-muted"
                                                : ""
                                            }`}
                                          >
                                            <div className="space-y-2">
                                              <div className="flex items-center justify-between">
                                                <span
                                                  className={`text-xs px-2 py-0.5 rounded ${
                                                    account.status ===
                                                    "available"
                                                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                                  }`}
                                                >
                                                  {account.status ===
                                                  "available"
                                                    ? "Có sẵn"
                                                    : "Đã bán"}
                                                </span>
                                                <div className="flex items-center gap-1">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    onClick={() => {
                                                      setEditingAccount({
                                                        listId: list.id,
                                                        categoryId: category.id,
                                                        accountId: account.id,
                                                        currentUsername:
                                                          account.username,
                                                        currentPassword:
                                                          account.password,
                                                        currentStatus:
                                                          account.status,
                                                      });
                                                    }}
                                                  >
                                                    <Edit className="h-3 w-3" />
                                                  </Button>
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive hover:text-destructive"
                                                    onClick={() => {
                                                      setDeletingAccount({
                                                        listId: list.id,
                                                        categoryId: category.id,
                                                        accountId: account.id,
                                                      });
                                                    }}
                                                  >
                                                    <Trash2 className="h-3 w-3" />
                                                  </Button>
                                                </div>
                                              </div>

                                              <div className="space-y-1.5 text-xs">
                                                <div className="flex items-center justify-between">
                                                  <span className="text-muted-foreground">
                                                    Username:
                                                  </span>
                                                  <span className="font-mono font-medium">
                                                    {account.username}
                                                  </span>
                                                </div>

                                                <div className="flex items-center justify-between">
                                                  <span className="text-muted-foreground">
                                                    Password:
                                                  </span>
                                                  <div className="flex items-center gap-2">
                                                    <span className="font-mono font-medium">
                                                      {showPasswords[account.id]
                                                        ? account.password
                                                        : "••••••••"}
                                                    </span>
                                                    <Button
                                                      variant="ghost"
                                                      size="icon"
                                                      className="h-5 w-5"
                                                      onClick={() =>
                                                        togglePassword(
                                                          account.id
                                                        )
                                                      }
                                                    >
                                                      {showPasswords[
                                                        account.id
                                                      ] ? (
                                                        <EyeOff className="h-3 w-3" />
                                                      ) : (
                                                        <Eye className="h-3 w-3" />
                                                      )}
                                                    </Button>
                                                  </div>
                                                </div>

                                                <div className="flex items-center justify-between pt-1 border-t">
                                                  <span className="text-muted-foreground">
                                                    Giá:
                                                  </span>
                                                  <span className="font-bold text-primary">
                                                    {formatPrice(account.price)}
                                                  </span>
                                                </div>
                                              </div>
                                            </div>
                                          </Card>
                                        ))}
                                      </div>
                                    </CollapsibleContent>
                                  </Collapsible>
                                </Card>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      </Card>
                    ))}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))
        )}
      </div>

      {/* Edit Dialogs */}
      {editingList && (
        <EditListDialog
          open={true}
          onOpenChange={(open) => !open && setEditingList(null)}
          listId={editingList.listId}
          currentType={editingList.currentType}
        />
      )}

      {editingCategory && (
        <EditCategoryDialog
          open={true}
          onOpenChange={(open) => !open && setEditingCategory(null)}
          listId={editingCategory.listId}
          categoryId={editingCategory.categoryId}
          currentName={editingCategory.currentName}
          currentPrice={editingCategory.currentPrice}
        />
      )}

      {editingAccount && (
        <EditAccountDialog
          open={true}
          onOpenChange={(open) => !open && setEditingAccount(null)}
          listId={editingAccount.listId}
          categoryId={editingAccount.categoryId}
          accountId={editingAccount.accountId}
          currentUsername={editingAccount.currentUsername}
          currentPassword={editingAccount.currentPassword}
          currentStatus={editingAccount.currentStatus}
        />
      )}

      {addingAccountTo && (
        <AddAccountDialog
          open={true}
          onOpenChange={(open) => !open && setAddingAccountTo(null)}
          listId={addingAccountTo.listId}
          categoryId={addingAccountTo.categoryId}
        />
      )}

      {deletingAccount && (
        <DeleteAccountDialog
          open={true}
          onOpenChange={(open) => !open && setDeletingAccount(null)}
          listId={deletingAccount.listId}
          categoryId={deletingAccount.categoryId}
          accountId={deletingAccount.accountId}
        />
      )}
    </div>
  );
}
