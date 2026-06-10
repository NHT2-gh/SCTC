"use client";
import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import { menuService } from "@/services/menu.service";
import { GetWithFilterParams } from "@/types/common";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMenus(params?: GetWithFilterParams) {
  return useQuery({
    queryKey: queryKeys.menu.getAll(params),
    queryFn: () => menuService.getAllMenus(params),
  });
}

export function useGetMenuDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.menu.detail(id),
    queryFn: () => menuService.getMenuDetail(id),
  });
}

export function useAddMenuItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.add,
    mutationFn: (payload: { menuId: string; ids: string[] }) =>
      menuService.addMenuItems(payload.menuId, payload.ids),

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(payload.menuId),
      });
    },
  });
}
