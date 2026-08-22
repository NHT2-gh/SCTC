import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import { ComponentValidationSchema } from "@/schemas/validation/component.validation";
import { componentService } from "@/services/component.service";
import { ComponentRecipeItem } from "@/types/component";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useComponents(searchName?: string) {
  return useQuery({
    queryKey: queryKeys.component.getAll(searchName),
    queryFn: () => componentService.getAllComponents(searchName),
  });
}
export function useGetComponentRecipeItems(id?: string) {
  return useQuery({
    queryKey: queryKeys.component.getById(id!),
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
    mutationFn: (payload: { recipe_items: ComponentRecipeItem[] }) =>
      componentService.upsertComponentRecipeItems(payload.recipe_items),
  });
}

export function useAddComponent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.componentRecipe.add,
    mutationFn: (data: ComponentValidationSchema) =>
      componentService.addComponent(data),

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.component.getAll(),
      });
    },
  });
}
