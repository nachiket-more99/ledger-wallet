import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/api/transactions.api";

export const useAllTransactions = () => {
  return useQuery({
    queryKey: ["transactions", "all"],
    queryFn: getAllTransactions,
    staleTime: 10_000,
  });
};
