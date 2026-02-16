import { http } from "./http";

export const register = (firstName: string, lastName: string, email: string, password: string) => {
  return http.post("/auth/register", { firstName, lastName, email, password}).then(res => res.data);
};

export const login = (email: string, password: string) => {
  return http.post("/auth/login", { email, password}).then(res => res.data);
};

export const logout = () => {
  return http.post("/auth/logout");
};