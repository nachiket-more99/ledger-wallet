import { http } from "./http";

export const getUsers = async () => {
  const res = await http.get("/admin/users");
  return res.data; 
};

export const getTransactions = async () => {
  const res = await http.get("/admin/transactions");
  return res.data; 
};
