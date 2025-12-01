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
};
