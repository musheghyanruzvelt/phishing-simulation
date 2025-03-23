import { tokenService } from "@/common/tokenService";
import { ROUTES } from "@/router/routes";
import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";

const axiosClient: AxiosInstance = axios.create({
  baseURL: "/api/",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      tokenService.logout();
      window.location.href = ROUTES.ROOT;
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
