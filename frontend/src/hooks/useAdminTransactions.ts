import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/api/admin.api";

export const useAdminTransactions = (page: number) => {
  return useQuery({
    queryKey: ["admin", "transactions", page], 
    queryFn: () => getTransactions(page, 8),
    placeholderData: keepPreviousData, 
    staleTime: 10_000,
  });
};
