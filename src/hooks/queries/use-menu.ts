"use client";
import { mutationKeys } from "@/config/mutation-keys";
import { queryKeys } from "@/config/query-keys";
import {
  MenuLayoutItemEditValidation,
  ProductInfoValidation,
  ProductOptionValidation,
} from "@/schemas/validation/menu.validation";
import { menuService } from "@/services/menu.service";
import { GetParams } from "@/types/common";
import { Menu, MenuItemOption } from "@/types/menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetMenus(params?: GetParams<Menu>) {
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

export function useDeleteMenuItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.delete,
    mutationFn: (payload: { productIds: string[]; menuId: string }) =>
      menuService.removeMenuItem(payload.productIds, payload.menuId),
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

export function useUpdateLayoutMenu() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.updateLayout,
    mutationFn: (menuId: string) => menuService.updateMenuLayout(menuId),
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.updateOptions,
    mutationFn: (
      payload: Pick<
        ProductOptionValidation,
        "menuItemId" | "id" | "limit" | "option_id"
      >[],
    ) => menuService.upsertProductOptions(payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(variables[0].menuItemId!),
      });

      queryClient.invalidateQueries({
        queryKey: mutationKeys.menuItems.updateLayout,
      });
    },
  });
}

export function useDeleteMenuItemOption() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.menuItems.deleteOption,
    mutationFn: (payload: { menuItemId: string; optionId: string[] }) =>
      menuService.deleteMenuItemOption(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(payload.menuItemId),
      });

      queryClient.invalidateQueries({
        queryKey: mutationKeys.menuItems.updateLayout,
      });
    },
  });
}

export function useUpdateProductInfo(menuId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.product.update,
    mutationFn: (payload: Partial<ProductInfoValidation>) =>
      menuService.updateProductInfo(payload),

    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.menu.detail(menuId),
      });
    },
  });
}

export function useAllOption(params?: GetParams<MenuItemOption>) {
  return useQuery({
    queryKey: queryKeys.options(params),
    queryFn: () => menuService.getAllOptions(params),
  });
}
