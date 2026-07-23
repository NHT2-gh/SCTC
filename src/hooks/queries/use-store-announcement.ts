import { queryKeys } from "@/config/query-keys";
import { storeAnnouncementService } from "@/services/store_announcement.service";
import { useQuery } from "@tanstack/react-query";

export function useGetAnnouncement() {
  return useQuery({
    queryKey: queryKeys.store.getAnnouncement(),
    queryFn: () => storeAnnouncementService.getStoreAnnouncement(),
  });
}
