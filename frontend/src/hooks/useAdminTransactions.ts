import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/api/admin.api";

export const useAdminTransactions = () => {
  return useQuery({
    queryKey: ["admin", "transactions"], 
    queryFn: getTransactions,
    placeholderData: keepPreviousData, 
    staleTime: 10_000,
  });
};
