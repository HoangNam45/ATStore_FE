import { axiosClient } from "@/lib/axios/axiosClient";
import { CreateOrderRequest, Order } from "@/types/order.types";
import { auth } from "@/lib/firebase/firebaseClient";

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  path: string;
}

export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await axiosClient.post<ApiResponse<Order>>(
      "/order/create",
      data
    );
    return response.data.data;
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const response = await axiosClient.get<ApiResponse<Order>>(
      `/order/${orderId}`
    );
    return response.data.data;
  },

  /**
   * Get all orders for the current user
   */
  async getUserOrders(): Promise<Order[]> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const token = await user.getIdToken();
    const response = await axiosClient.get<ApiResponse<Order[]>>(
      "/order/user/my-orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  },
};
