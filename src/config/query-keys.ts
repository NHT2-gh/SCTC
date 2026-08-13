import { FilterValue } from "@/components/filter/filter-box-render/type";
import { GetWithFilterParams, Pagination } from "@/types/common";
import { Ingredient } from "@/types/ingredient";
import { Menu, MenuItemOption } from "@/types/menu";
import { Order } from "@/types/order";
import { Product } from "@/types/product";
import { Promotion, RequestPromotionAllow } from "@/types/promotions";

export const queryKeys = {
  profile: {
    getAll: () => ["profiles"],
    getProfile: (userId: string) => ["profiles", userId],
  },
  ingredient: {
    getAll: (params?: GetWithFilterParams<Ingredient>) => [
      "ingredients",
      params,
    ],
  },
  component: {
    getAll: (searchName?: string) => ["components", searchName],
    getById: (id: string | null) => ["components", id],
  },

  menu: {
    getAll: (params?: GetWithFilterParams<Menu>) => ["menus", params],
    detail: (id: string) => ["menus", id],
    layout: (id: string, isPublished?: boolean) => [
      "menu-layout",
      id,
      isPublished,
    ],
  },
  product: {
    getAll: (params?: GetWithFilterParams<Product>) => ["products", params],
    detail: {
      getProductInfo: (id: string) => ["product-detail"],
      getProductOptions: (menuItemId: string) => [
        "product-detail",
        "opions",
        menuItemId,
      ],
      getProductRecipes: (productId: string) => ["product-recipes", productId],
      getProductRecipeDetail: (recipeId: string) => [
        "product-recipes",
        "detail",
        recipeId,
      ],
    },
  },

  promotion: {
    getAll: (params?: GetWithFilterParams<Promotion>) => ["promotions"],
    getById: (id: string) => ["promotions", id],
    allow: (resquest: RequestPromotionAllow) => [
      "promotions",
      "allow",
      resquest,
    ],
    orderDiscount: (orderId: string) => [
      "promotions",
      "order-discount",
      orderId,
    ],
  },

  options: (params?: GetWithFilterParams<MenuItemOption>) => [
    "options",
    params,
  ],

  order: {
    getAll: (params?: GetWithFilterParams<Order>) => ["orders", params],
    detail: (trackingCode: string) => ["orders", trackingCode],
  },

  overview: {
    getAvailableTables: () => ["overview", "available-tables"],
  },

  store: {
    getAnnouncement: () => ["store", "announcements"],
  },
};
