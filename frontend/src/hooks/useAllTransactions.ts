import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/api/transactions.api";

export const useAllTransactions = (page: number) => {
  return useQuery({
    queryKey: ["transactions", "all", page], 
    queryFn: () => getAllTransactions(page, 10),
    placeholderData: keepPreviousData, 
    staleTime: 10_000,
  });
};
