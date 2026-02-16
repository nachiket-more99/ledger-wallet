import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/admin.api";

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ["admin", "users"], 
    queryFn: getUsers,
    staleTime: 10_000,
  });
};
