import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/admin.api";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "transactions"], 
    queryFn: getUsers,
    placeholderData: keepPreviousData, 
    staleTime: 10_000,
  });
};
