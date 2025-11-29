import { AxiosInstance } from "axios";

export const setupRequestInterceptor = (instance: AxiosInstance) => {
  instance.interceptors.request.use(
    (config) => {
      console.log("Request:", config.method?.toUpperCase(), config.url);
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );
};
