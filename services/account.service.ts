import { axiosAuthClient } from "@/lib/axios/axiosAuthClient";
import { getCurrentUserToken } from "@/lib/firebase";
import { Account } from "@/types/account.types";

export interface CreateAccountData {
  game: string;
  server?: string;
  type: string;
  displayImage: File;
  detailImages: File[];
  categories: {
    name: string;
    price: number;
    accounts: {
      credentials: string;
    }[];
  }[];
}

export interface AccountCredential {
  id: string;
  credentials?: string; // New format: single credentials field
  username?: string; // Old format: separate username field
  password?: string; // Old format: separate password field
  price: number;
  status: "available" | "sold";
}

export interface AccountCategory {
  id: string;
  name: string;
  price: number;
  accounts: AccountCredential[];
}

export interface AccountList {
  id: string;
  name: string;
  game: string;
  slug: string;
  server?: string;
  type: string;
  displayImage: string;
  detailImages: string[];
  categories: AccountCategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface GameAccountsGroup {
  game: string;
  slug: string;
  lists: AccountList[];
}

/**
 * Payload BE trả cho các thao tác quản trị list/category/account.
 */
export interface ActionResult {
  success: boolean;
  message: string;
}

export interface DashboardStats {
  totalAccounts: number;
  soldAccounts: number;
  revenue: number;
  gameStats: Array<{
    name: string;
    total: number;
    sold: number;
    revenue: number;
  }>;
}

/**
 * Envelope { success, data, timestamp, path } đã được bóc ở
 * lib/axios/interceptors/response.ts, nên mọi hàm trong này trả thẳng payload của BE.
 */
export const accountService = {
  async createAccount(data: CreateAccountData): Promise<{ id: string }> {
    // Get Firebase ID Token
    const idToken = await getCurrentUserToken();

    const formData = new FormData();

    // Add basic fields
    formData.append("game", data.game);
    if (data.server) {
      formData.append("server", data.server);
    }
    formData.append("type", data.type);

    // Add display image
    formData.append("displayImage", data.displayImage);

    // Add detail images
    data.detailImages.forEach((image) => {
      formData.append(`detailImages`, image);
    });

    // Add categories as JSON string
    formData.append("categories", JSON.stringify(data.categories));

    const response = await axiosAuthClient.post<{ id: string }>(
      "/account/create",
      formData,
      {
        headers: {
          // Don't set Content-Type for multipart/form-data
          // Let browser set it with the correct boundary
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    return response.data;
  },

  async getAccountsByGame(game: string): Promise<Account[]> {
    const response = await axiosAuthClient.get<Account[]>(
      `/account/game/${game}`,
    );
    return response.data;
  },

  async getAccountById(accountId: string): Promise<Account> {
    const response = await axiosAuthClient.get<Account>(
      `/account/${accountId}`,
    );
    return response.data;
  },

  async getAllAccountsGroupedByGame(): Promise<GameAccountsGroup[]> {
    const idToken = await getCurrentUserToken();

    const response = await axiosAuthClient.get<AccountList[]>(
      "/account/owner/all",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );

    const accountLists = response.data;

    // Group by game slug
    const groupedMap = new Map<string, GameAccountsGroup>();

    accountLists.forEach((list) => {
      const key = list.slug;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          game: list.game,
          slug: list.slug,
          lists: [],
        });
      }
      groupedMap.get(key)!.lists.push(list);
    });

    return Array.from(groupedMap.values());
  },

  async updateListType(listId: string, type: string): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      "/account/list/update",
      {
        listId,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async updateCategory(
    listId: string,
    categoryId: string,
    name: string,
    price: number,
  ): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      "/account/category/update",
      {
        listId,
        categoryId,
        name,
        price,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async updateAccount(
    listId: string,
    categoryId: string,
    accountId: string,
    credentials: string,
    status: "available" | "sold",
  ): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      "/account/account/update",
      {
        listId,
        categoryId,
        accountId,
        credentials,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async getDashboardStats(): Promise<DashboardStats> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.get<DashboardStats>(
      "/account/owner/dashboard/stats",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async addAccountToCategory(
    listId: string,
    categoryId: string,
    credentials: string,
  ): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      "/account/account/add",
      {
        listId,
        categoryId,
        credentials,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async deleteAccount(
    listId: string,
    categoryId: string,
    accountId: string,
  ): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      "/account/account/delete",
      {
        listId,
        categoryId,
        accountId,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async deleteList(listId: string): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.delete<ActionResult>(
      `/account/list/${listId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async updateListImages(
    listId: string,
    formData: FormData,
  ): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      `/account/list/${listId}/images`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },

  async addCategoryToList(
    listId: string,
    name: string,
    price: number,
  ): Promise<ActionResult> {
    const idToken = await getCurrentUserToken();
    const response = await axiosAuthClient.post<ActionResult>(
      "/account/category/add",
      {
        listId,
        name,
        price,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      },
    );
    return response.data;
  },
};
