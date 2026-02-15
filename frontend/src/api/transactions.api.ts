import { http } from "./http";

export const getRecentTransactions = () => {
  return http.get("/wallet/transactions?limit=5").then(res => res.data.transactions);
};

export const getAllTransactions = () => {
  return http.get("/wallet/transactions").then(res => res.data.transactions);
};
