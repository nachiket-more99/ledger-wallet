import { http } from "./http";

export const getRecentTransactions = () => {
  return http.get("/wallet/transactions?limit=5").then(res => res.data.result);
};

export const getAllTransactions = (page = 1, limit = 10) => {
  return http.get(`/wallet/transactions?page=${page}&limit=${limit}`).then(res => res.data.result);
};
