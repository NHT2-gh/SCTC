import { queryKeys } from "@/config/query-keys";
import { profileService } from "@/services/profile.service";
import { useQuery } from "@tanstack/react-query";

export function useProfile(userId: string) {
  return useQuery({
    queryKey: queryKeys.profile.getProfile(userId),
    queryFn: () => profileService.getProfile(userId),
    enabled: !!userId,

    staleTime: Infinity,
    gcTime: Infinity,

    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });
}

export function useAllProfile() {
  return useQuery({
    queryKey: queryKeys.profile.getAll(),
    queryFn: () => profileService.getAllProfile(),
  });
}
