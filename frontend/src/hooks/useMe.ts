import { useQuery } from "@tanstack/react-query";
import { getMe } from "@/api/user.api";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    staleTime: 300000,
  });
