import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ingredientService } from "@/services/ingredient.service";
import { GetWithFilterParams } from "@/types/common";
import { queryKeys } from "@/config/query-keys";
import { mutationKeys } from "@/config/mutation-keys";
import { IngredientValidationSchema } from "@/schemas/validation/ingredient.validation";

export function useIngredients(params?: GetWithFilterParams) {
  return useQuery({
    queryKey: queryKeys.ingredient.getAll(params),
    queryFn: () => ingredientService.getAllIngredient(params),
  });
}

export function useAddIngredient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.ingredient.add,
    mutationFn: (payload: IngredientValidationSchema) =>
      ingredientService.addIngredient(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.ingredient.getAll(),
      });
    },
  });
}
