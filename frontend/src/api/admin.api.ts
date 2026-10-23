import { http } from "./http";

// export const getUsers = async () => {
//   const res = await http.get("/admin/users");
//   return res.data; 
// };

  export const getUsers = async (
    search = '',
    page = 1,
    limit = 10,
  ) => {
    const res = await http.get('/admin/users', {
      params: { search, page, limit },
    });

    return res.data;
  };

// export const getTransactions = async () => {
//   const res = await http.get("/admin/transactions");
//   return res.data; 
// };

// export const getTransactions = (page = 1, limit = 8) => {
//   return http.get(`/admin/transactions?page=${page}&limit=${limit}`).then(res => res.data.result);
// };

export const getTransactions = async (
  search = "",
  page = 1,
  limit = 8,
  filter: "ALL" | "PAYMENT" | "TRANSFER" = "ALL",
) => {
  const res = await http.get("/admin/transactions", {
    params: { search, page, limit, filter },
  });

  return res.data;
};