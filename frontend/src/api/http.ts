import axios from "axios";
import { toast } from "sonner";

export const http = axios.create({
  baseURL: "",
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const isUnauthorized = error.response?.status === 401;
    const isAuthCheck = error.config?.url?.includes("/user/me");

    if (isUnauthorized) {
      // Force a hard redirect to clear all stuck React states/loops
      window.location.href = "/";
      return Promise.reject(error);
    }
    // Only show toast if it's NOT the background auth check
    if (!isAuthCheck) {
      toast.error(
        error.response?.data?.message || 
        (error.response?.status === 403 ? "Access Denied" : "Request failed")
      );
    }

    return Promise.reject(error);
  }
);