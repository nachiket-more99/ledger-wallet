import { useQuery } from "@tanstack/react-query";
import { getUsers } from "@/api/admin.api";

// export const useAdminUsers = () => {
//   return useQuery({
//     queryKey: ["admin", "users"], 
//     queryFn: getUsers,
//     staleTime: 10_000,
//   });
// };

export const useAdminUsers = (search = '', page = 1) => {
  return useQuery({
    queryKey: ['admin', 'users', search, page],
    queryFn: () => getUsers(search, page, 10),
    staleTime: 10_000,
  });
};
