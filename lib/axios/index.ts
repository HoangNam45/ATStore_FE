import { axiosClient } from "./axiosClient";
import { axiosAuthClient } from "./axiosAuthClient";
import { setupRequestInterceptor } from "./interceptors/request";

// Public client
setupRequestInterceptor(axiosClient);

// Auth client
setupRequestInterceptor(axiosAuthClient);

export { axiosClient, axiosAuthClient };
