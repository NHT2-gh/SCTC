"use client";
import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import {
  MenuLayoutItemEditValidation,
  ProductInfoValidation,
  ProductOptionValidation,
} from "@/schemas/validation/menu.validation";
import { menuService } from "@/services/menu.service";
import { productService } from "@/services/product.service";
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

export function useGetMenuLayouts(menuId: string, isPublic?: boolean) {
  return useQuery({
    queryKey: queryKeys.menu.layout(menuId, isPublic),
    queryFn: () => menuService.getMenuLayoutItems(menuId),
  });
}

export function useInitLayoutMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.initLayout,
    mutationFn: (menuId: string) => menuService.initMenuLayout(menuId),
    onSuccess: (_, menuId) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.layout(menuId),
      });
    },
  });
}

export function useUpdateLayoutItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.menuItems.updateLayout,
    mutationFn: (payload: MenuLayoutItemEditValidation) =>
      menuService.updateMenuLayoutItem(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.layout(payload.menuId),
      });
    },
  });
}

export function useGetFixedOptions() {
  return useQuery({
    queryKey: ["fixed-options"],
    queryFn: () => menuService.getFixedOptions(),
  });
}

export function useUpsertProductOption() {
  return useMutation({
    mutationKey: mutationKeys.menuItems.updateOptions,
    mutationFn: (
      payload: Pick<
        ProductOptionValidation,
        "menuItemId" | "id" | "limit" | "option_id"
      >[],
    ) => menuService.upsertProductOptions(payload),
  });
}

export function useUpdateProductInfo(menuId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.product.update,
    mutationFn: (payload: ProductInfoValidation) =>
      menuService.updateProductInfo(payload),

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(menuId),
      });
    },
  });
}

export function useAllOption(params?: GetWithFilterParams) {
  return useQuery({
    queryKey: queryKeys.options(params),
    queryFn: () => menuService.getAllOptions(params),
  });
}
