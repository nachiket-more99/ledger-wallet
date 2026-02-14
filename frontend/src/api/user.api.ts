import { http } from "./http";

export const getMe = async () => {
  const res = await http.get("/user/me");
  return res.data;
};
