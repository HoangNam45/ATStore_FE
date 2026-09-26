import { AxiosInstance } from "axios";

export interface ApiEnvelope<T = unknown> {
  success: true;
  data: T;
  timestamp: string;
  path: string;
}

/**
 * Nhận diện envelope do ResponseInterceptor của BE tạo ra:
 * { success, data, timestamp, path }
 *
 * Guard được giữ chặt có chủ đích:
 * - Payload hợp lệ có field tên `data` sẽ không bị bóc nhầm.
 * - BE chưa gắn interceptor (trả raw payload) đi thẳng qua, nên FE hoạt động được
 *   với cả hai biến thể backend.
 */
export const isApiEnvelope = (body: unknown): body is ApiEnvelope => {
  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return false;
  }

  const candidate = body as Record<string, unknown>;

  return (
    candidate.success === true &&
    "data" in candidate &&
    typeof candidate.timestamp === "string" &&
    typeof candidate.path === "string"
  );
};

/**
 * Bóc một cấp envelope. Hàm không phá payload đã bóc, nên gọi hai lần vẫn an toàn.
 */
export const unwrapEnvelope = <T>(body: T): T => {
  if (!isApiEnvelope(body)) {
    return body;
  }

  return body.data as T;
};

/**
 * Đăng ký vào từng axios instance để envelope được bóc ở đúng một chỗ.
 *
 * Nhánh lỗi giữ nguyên hoàn toàn: việc đọc `error.response.data.message` và xử lý
 * 401 -> logout + redirect của axiosAuthClient phụ thuộc vào response gốc của Nest.
 */
export const setupResponseInterceptor = (instance: AxiosInstance): void => {
  instance.interceptors.response.use(
    (response) => {
      response.data = unwrapEnvelope(response.data);
      return response;
    },
    (error) => Promise.reject(error)
  );
};
