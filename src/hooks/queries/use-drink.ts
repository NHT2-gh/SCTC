import { queryKeys } from "@/config/query-keys";
import { drinkService } from "@/services/drink.service";
import { GetWithFilterParams, ResponseStandard } from "@/types/common";
import { Drink } from "@/types/menu";
import { useQuery } from "@tanstack/react-query";

export function useGetAllDrink(params?: GetWithFilterParams) {
  return useQuery({
    queryKey: queryKeys.drink.getAll(params),
    queryFn: () => drinkService.getAllDrinks(params),
  });
}
