import { axiosClient } from "@/lib/axios/axiosClient";
import { CreateOrderRequest, Order } from "@/types/order.types";
import { getCurrentUserToken } from "@/lib/firebase";

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  timestamp?: string;
  path?: string;
}

interface UserOrdersResponse {
  success?: boolean;
  data?: Order[];
  userOrders?: Order[];
  timestamp?: string;
  path?: string;
}

interface AdminOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const unwrapData = <T>(payload: T | ApiResponse<T>): T => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    payload.data !== undefined
  ) {
    return payload.data as T;
  }

  return payload as T;
};

export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderRequest): Promise<Order> {
    const response = await axiosClient.post<ApiResponse<Order> | Order>(
      "/order/create",
      data
    );
    return unwrapData(response.data);
  },

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order> {
    const response = await axiosClient.get<ApiResponse<Order> | Order>(
      `/order/${orderId}`
    );
    return unwrapData(response.data);
  },

  /**
   * Get all orders for the current user
   */
  async getUserOrders(): Promise<Order[]> {
    const token = await getCurrentUserToken();
    const response = await axiosClient.get<
      UserOrdersResponse | ApiResponse<Order[]> | Order[]
    >(
      "/order/user/my-orders",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const payload = response.data;
    const orders = Array.isArray(payload)
      ? payload
      : payload.data ?? payload.userOrders;
    if (!orders) {
      throw new Error("API không trả về danh sách userOrders hợp lệ");
    }

    return orders;
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
  }): Promise<AdminOrdersResponse> {
    const token = await getCurrentUserToken();
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
    });

    if (params.search) queryParams.append("search", params.search);
    if (params.startDate) queryParams.append("startDate", params.startDate);
    if (params.endDate) queryParams.append("endDate", params.endDate);

    const response = await axiosClient.get<
      ApiResponse<AdminOrdersResponse> | AdminOrdersResponse
    >(`/order/admin/all-orders?${queryParams.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return unwrapData(response.data);
  },
};
