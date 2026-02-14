import { http } from "./http";

export const getBalance = async () => {
  const res = await http.get("/wallet/balance");
  return res.data; 
};
