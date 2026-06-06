import { queryKeys } from "@/config/query-keys";
import { componentService } from "@/services/component.service";
import { useQuery } from "@tanstack/react-query";

export function useComponents(searchName?: string) {
  return useQuery({
    queryKey: queryKeys.component.getAll(searchName),
    queryFn: () => componentService.getAllComponents(searchName),
  });
}
export function useGetComponentRecipeItems(id: string | null) {
  return useQuery({
    queryKey: queryKeys.component.getById(id),
    queryFn: () => componentService.getComponentRecipeItems(id!),
  });
}
