import { axiosAuthClient } from "@/lib/axios/axiosAuthClient";
import { auth } from "@/lib/firebase/firebaseClient";

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
      username: string;
      password: string;
    }[];
  }[];
}

export interface AccountCredential {
  id: string;
  username: string;
  password: string;
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

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export const accountService = {
  async createAccount(data: CreateAccountData) {
    // Get Firebase ID Token
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();

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

    const response = await axiosAuthClient.post("/account/create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${idToken}`,
      },
    });

    return response.data;
  },

  async getAccountsByGame(game: string) {
    const response = await axiosAuthClient.get(`/account/game/${game}`);
    return response.data;
  },

  async getAccountById(accountId: string) {
    const response = await axiosAuthClient.get(`/account/${accountId}`);
    return response.data;
  },

  async getAllAccountsGroupedByGame(): Promise<GameAccountsGroup[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    console.log("ID Token:", idToken);
    const response = await axiosAuthClient.get<ApiResponse<AccountList[]>>(
      "/account/owner/all",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    const accountLists = response.data.data;

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

  async updateListType(listId: string, type: string) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    const response = await axiosAuthClient.post(
      "/account/list/update",
      {
        listId,
        type,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  },

  async updateCategory(
    listId: string,
    categoryId: string,
    name: string,
    price: number
  ) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    const response = await axiosAuthClient.post(
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
      }
    );
    return response.data;
  },

  async updateAccount(
    listId: string,
    categoryId: string,
    accountId: string,
    username: string,
    password: string,
    status: "available" | "sold"
  ) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    const response = await axiosAuthClient.post(
      "/account/account/update",
      {
        listId,
        categoryId,
        accountId,
        username,
        password,
        status,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  },

  async getDashboardStats() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    const response = await axiosAuthClient.get<
      ApiResponse<{
        totalAccounts: number;
        soldAccounts: number;
        revenue: number;
        gameStats: Array<{
          name: string;
          total: number;
          sold: number;
          revenue: number;
        }>;
      }>
    >("/account/owner/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
    return response.data.data;
  },

  async addAccountToCategory(
    listId: string,
    categoryId: string,
    username: string,
    password: string
  ) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    const response = await axiosAuthClient.post(
      "/account/account/add",
      {
        listId,
        categoryId,
        username,
        password,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  },

  async deleteAccount(listId: string, categoryId: string, accountId: string) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }
    const idToken = await user.getIdToken();
    const response = await axiosAuthClient.post(
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
      }
    );
    return response.data;
  },
};
