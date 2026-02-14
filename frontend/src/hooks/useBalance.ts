import { useQuery } from "@tanstack/react-query";
import { getBalance } from "@/api/wallet.api";

export const useBalance = () =>
  useQuery({
    queryKey: ["wallet-balance"],
    queryFn: getBalance,
    refetchOnWindowFocus: true,
    staleTime: 30000, 
  });
