import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/api/admin.api";

// export const useAdminTransactions = (page: number) => {
//   return useQuery({
//     queryKey: ["admin", "transactions", page], 
//     queryFn: () => getTransactions(page, 8),
//     placeholderData: keepPreviousData, 
//     staleTime: 10_000,
//   });
// };


export const useAdminTransactions = (
  search: string,
  page: number,
  filter: "ALL" | "PAYMENT" | "TRANSFER" = "ALL",
) => {
  return useQuery({
    queryKey: ["admin", "transactions", search, page, filter],
    queryFn: () => getTransactions(search, page, 8, filter),
    placeholderData: keepPreviousData,
    staleTime: 10_000,
  });
};