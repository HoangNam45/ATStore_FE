import axios from "axios";
import { setupResponseInterceptor } from "./interceptors/response";

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// BE bọc mọi response thành công trong envelope { success, data, timestamp, path }.
// Envelope được bóc tại đây - chỗ duy nhất - nên service luôn nhận payload thật.
setupResponseInterceptor(axiosClient);

