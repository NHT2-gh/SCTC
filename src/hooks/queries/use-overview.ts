import { queryKeys } from "@/config/query-keys";
import { overviewService } from "@/services/overview.service";
import { useQuery } from "@tanstack/react-query";

export function useGetTable() {
  return useQuery({
    queryKey: queryKeys.overview.getAvailableTables(),
    queryFn: () => overviewService.getAvailableTables(),
  });
}
