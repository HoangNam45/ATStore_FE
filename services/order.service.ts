import { axiosClient } from "@/lib/axios/axiosClient";
import { CreateOrderRequest, Order } from "@/types/order.types";

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
};
