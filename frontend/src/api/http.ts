import axios from "axios";
import { toast } from "sonner";

export const http = axios.create({
  baseURL: "http://localhost:3333",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    toast.error(
      error.response?.data?.message ||
      (error.response?.status === 403
        ? "Invalid email or password"
        : "Request failed")
    );

    return Promise.reject(error);
  }
);