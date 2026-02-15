import { useQuery } from "@tanstack/react-query";
import { getRecentTransactions } from "@/api/transactions.api";

export const useRecentTransactions = () => {
  return useQuery({
    queryKey: ["transactions", "recent"],
    queryFn: getRecentTransactions,
    staleTime: 10_000, 
  });
};
