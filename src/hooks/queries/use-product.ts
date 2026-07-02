import { queryKeys } from "@/config/query-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { GetWithFilterParams } from "@/types/common";
import { menuService } from "@/services/menu.service";
import { ProductInfoValidation } from "@/schemas/validation/menu.validation";
import { mutationKeys } from "@/config/mutation-keys";
import { AddProductOptionValidation } from "@/schemas/validation/product-option.validation";

export function useGetAllProduct(params?: GetWithFilterParams) {
  return useQuery({
    queryKey: queryKeys.product.getAll(params),
    queryFn: () => productService.getAllProduct(params),
  });
}

export function useGetProductOptions(menuItemId: string) {
  return useQuery({
    queryKey: queryKeys.product.detail.getProductOptions(menuItemId),
    queryFn: () => menuService.getProductOptions(menuItemId),
  });
}

export function useAddProductOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.addOption,
    mutationFn: (payload: AddProductOptionValidation) =>
      menuService.addProductOption(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.options() });
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
