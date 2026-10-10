import { queryKeys } from "@/config/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { GetParams } from "@/types/common";
import { menuService } from "@/services/menu.service";
import { ProductInfoValidation } from "@/schemas/validation/menu.validation";
import { mutationKeys } from "@/config/mutation-keys";
import { UpsertProductOptionValidation } from "@/schemas/validation/product-option.validation";
import { ProductRecipeItemValidationSchema } from "@/schemas/validation/recipe.validation";
import { Product, ProductRecipeVersion } from "@/types/product";

export function useGetAllProduct(params: GetParams<Product>) {
  return useQuery({
    queryKey: queryKeys.product.getAll(params),
    queryFn: () => productService.getAllProduct(params),
  });
}

export function useGetProductDetail(id: string) {
  return useQuery({
    enabled: !!id,
    queryKey: queryKeys.product.detail.getProductInfo(id),
    queryFn: () => productService.getProductDetail(id),
  });
}

export function useGetProductOptions(menuItemId: string) {
  return useQuery({
    queryKey: queryKeys.product.detail.getProductOptions(menuItemId),
    queryFn: () => menuService.getProductOptions(menuItemId),
  });
}

export function useUpsertProductOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.addOption,
    mutationFn: (payload: UpsertProductOptionValidation) =>
      menuService.upsertProductOption(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.options({
          filters: {
            type: "custom",
          },
        }),
      });
    },
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.product.add,
    mutationFn: (data: ProductInfoValidation) =>
      productService.addProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.getAll(),
      });
    },
  });
}

export function useGetProductRecipe(productId: string | null) {
  return useQuery({
    enabled: !!productId,
    queryKey: queryKeys.product.detail.getProductRecipes(productId!),
    queryFn: () => productService.getProductRecipes(productId!),
  });
}

export function useUpsertProductRecipeVersion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.product.newRecipe,
    mutationFn: (payload: Partial<ProductRecipeVersion>) =>
      productService.upsertProductRecipeVersion(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail.getProductRecipes(
          payload.product_id!,
        ),
      });
    },
  });
}

export function useGetProductRecipeDetail(recipeId: string | null) {
  return useQuery({
    enabled: !!recipeId,
    queryKey: queryKeys.product.detail.getProductRecipes(recipeId!),
    queryFn: () => productService.getProductRecipeDetail(recipeId!),
  });
}

export function useUpsertProductRecipeItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.product.add,
    mutationFn: ({
      data,
      id,
    }: {
      data: ProductRecipeItemValidationSchema[];
      id: string;
    }) => productService.upsertProductRecipeItem(data, id),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.product.detail.getProductRecipeDetail(id),
      });
    },
  });
}

export function useDeleteProductRecipeItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.product.add,
    mutationFn: (ids: string[]) => productService.deleteProductRecipeItem(ids),
  });
}

export function useCalculateProductCost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.product.calculateCost,
    mutationFn: (payload: { productId: string }) =>
      productService.calculateProductCost(payload.productId),
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: queryKeys.product.getAll() });
    // },
  });
}
