import { queryKeys } from "@/config/query-keys";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/product.service";
import { GetWithFilterParams } from "@/types/common";

export function useGetAllProduct(params?: GetWithFilterParams) {
  return useQuery({
    queryKey: queryKeys.product.getAll(params),
    queryFn: () => productService.getAllProduct(params),
  });
}
