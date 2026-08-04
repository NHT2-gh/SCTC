import { FilterValue } from "@/components/filter/filter-box-render/type";
import { GetWithFilterParams, Pagination } from "@/types/common";

export const queryKeys = {
  profile: {
    getAll: () => ["profiles"],
    getProfile: (userId: string) => ["profiles", userId],
  },
  ingredient: {
    getAll: (params?: GetWithFilterParams) => ["ingredients", params],
  },
  component: {
    getAll: (searchName?: string) => ["components", searchName],
    getById: (id: string | null) => ["components", id],
  },

  menu: {
    getAll: (params?: GetWithFilterParams) => ["menus", params],
    detail: (id: string) => ["menus", id],
    layout: (id: string, isPublished?: boolean) => [
      "menu-layout",
      id,
      isPublished,
    ],
  },
  product: {
    getAll: (params?: GetWithFilterParams) => ["products", params],
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
    getAll: () => ["promotions"],
    getById: (id: string) => ["promotions", id],
  },

  options: (params?: GetWithFilterParams) => ["options", params],

  order: {
    getAll: (params?: GetWithFilterParams) => ["orders", params],
    detail: (trackingCode: string) => ["orders", trackingCode],
  },

  overview: {
    getAvailableTables: () => ["overview", "available-tables"],
  },

  store: {
    getAnnouncement: () => ["store", "announcements"],
  },
};
