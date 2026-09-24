import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import { storeService } from "@/services/store.service";
import { StoreStatus } from "@/types/store";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetHistoryStoreStatus() {
  return useQuery({
    queryKey: queryKeys.store.getHistoryStoreStatus(),
    queryFn: () => storeService.getStoreStatus(),
  });
}
export function useUpsertHistoryStoreStatus() {
  return useMutation({
    mutationKey: mutationKeys.historyStatus.upsert,
    mutationFn: (payload: Partial<StoreStatus>) =>
      storeService.upsertStoreStatus(payload),
  });
}
