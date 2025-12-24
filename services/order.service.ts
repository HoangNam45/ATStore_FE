import { axiosClient } from "@/lib/axios/axiosClient";
import { CreateOrderRequest, Order } from "@/types/order.types";
import { getCurrentUserToken } from "@/lib/firebase";

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
    const token = await getCurrentUserToken();
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

  /**
   * Get all orders for admin with pagination and filters
   */
  async getAllOrdersAdmin(params: {
    page: number;
    limit: number;
    search?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<{
    orders: Order[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const token = await getCurrentUserToken();
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) queryParams.append("search", params.search);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const response = await axiosClient.get<
      ApiResponse<{
        orders: Order[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>
    >(`/order/admin/all-orders?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  },
};
