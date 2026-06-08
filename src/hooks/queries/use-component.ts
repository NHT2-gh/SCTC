import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import { componentService } from "@/services/component.service";
import { ComponentRecipeItem } from "@/types/component";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export function useDeleteComponentRecipeItems() {
  return useMutation({
    mutationKey: mutationKeys.componentRecipe.delete,
    mutationFn: (data: string[]) =>
      componentService.deleteComponentRecipeItems(data),
  });
}

export function useUpsertComponentRecipeItems() {
  return useMutation({
    mutationKey: mutationKeys.componentRecipe.upsert,
    mutationFn: (data: ComponentRecipeItem[]) =>
      componentService.upsertComponentRecipeItems(data),
  });
}
